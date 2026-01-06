from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests, json
import datetime
import mysql.connector
from dotenv import load_dotenv
import base64
import fitz  # PyMuPDF để đọc text từ PDF

load_dotenv()

app = Flask(__name__)
CORS(app)

# Cache dữ liệu công việc
job_cache = {
    'result': None,
    'columns': None,
    'last_update': None
}

# ===== Hàm phụ cho CV =====
def encode_image(file_path):
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def extract_pdf_text(file_path):
    text_content = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text_content += page.get_text() + "\n"
    return text_content.strip()

# ===== Hàm lấy dữ liệu công việc từ MySQL =====
def get_jobs():
    now = datetime.datetime.now()
    if job_cache['result'] and job_cache['last_update']:
        delta = now - job_cache['last_update']
        if delta.total_seconds() < 900:  # cache 15 phút
            return job_cache['result'], job_cache['columns']

    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    database = os.getenv("DB_NAME")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    query = """
    SELECT 
        id,
        title,
        description,
        job_type,
        location,
        min_experience,
        required_degree,
        salary_range,
        status,
        category,
        created_at,
        employer_id
    FROM workwise.job_postings
    WHERE status = 'active';
    """

    try:
        conn = mysql.connector.connect(
            host=host, user=user, port=port,
            password=password, database=database
        )
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        cursor.close()
        conn.close()

        job_cache['result'] = result
        job_cache['columns'] = columns
        job_cache['last_update'] = now

        return result, columns
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        return [], None


@app.route('/ai_chatbot', methods=['POST'])
def ai_chatbot():
    # Cho phép cả JSON và FormData
    if request.form:
        data = request.form
    else:
        data = request.get_json() or {}

    import json as _json
    history = data.get("history", [])
    # Nếu nhận từ FormData, history có thể là chuỗi JSON
    if isinstance(history, str):
        try:
            history = _json.loads(history)
        except Exception:
            history = []
    job_position = data.get("job_position", "vị trí công việc bạn mong muốn")

    # ===== Xử lý file CV nếu có =====
    uploaded_file = request.files.get("file")
    file_part = None
    cv_text = None
    if uploaded_file:
        filename = uploaded_file.filename
        save_path = os.path.join("uploads", filename)
        os.makedirs("uploads", exist_ok=True)
        uploaded_file.save(save_path)

        if filename.lower().endswith(".pdf"):
            cv_text = extract_pdf_text(save_path)
        else:
            image_base64 = encode_image(save_path)
            file_part = {
                "inline_data": {
                    "mime_type": "image/png",  # hoặc image/jpeg
                    "data": image_base64
                }
            }

    # ===== Lấy dữ liệu job từ MySQL =====
    result, columns = get_jobs()
    jobs_text = ""
    search_title = None
    search_location = None
    search_jobtype = None
    search_salary = None
    search_desc = None

    import unicodedata
    def remove_accents(input_str):
        return ''.join(
            c for c in unicodedata.normalize('NFD', input_str)
            if unicodedata.category(c) != 'Mn'
        )

    import re

    # ✅ Chỉ lấy filter từ message mới nhất của user
    last_user_raw = ""
    for turn in reversed(history):
        if isinstance(turn, dict) and turn.get("role") == "user":
            last_user_raw = turn.get("text", "")
            break

    text_norm = remove_accents(last_user_raw.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()

    match = re.search(r"công việc (?:nào )?tên là ([^?]+)", text_norm, re.IGNORECASE)
    if match:
        search_title = match.group(1).strip()

    # location
    if "hà nội" in text_norm or "ha noi" in text_norm:
        search_location = "Hà Nội"
    if any(k in text_norm for k in ["hồ chí minh", "tp hcm", "tphcm", "hcm", "ho chi minh"]):
        search_location = "hồ chí minh"
    if "đà nẵng" in text_norm or "da nang" in text_norm:
        search_location = "Đà Nẵng"

    # job_type
    jobtype_keywords = [
        ("full-time", ["full time", "fulltime", "full-time"]),
        ("part-time", ["part time", "parttime", "part-time"]),
        ("remote", ["remote", "từ xa", "lam tu xa"]),
        ("intern", ["intern", "thực tập", "thuc tap"])
    ]
    for jt, variants in jobtype_keywords:
        if any(variant in text_norm for variant in variants):
            search_jobtype = jt

    salary_match = re.search(r"lương ([\d\.]+)", text_norm)
    if salary_match:
        search_salary = salary_match.group(1).replace('.', '')

    desc_match = re.search(r"mô tả ([^?]+)", text_norm)
    if desc_match:
        search_desc = desc_match.group(1).strip()

    matched = []

    # Xác định câu hỏi có liên quan đến việc làm hay không
    def is_job_related(text):
        job_keywords = [
            "công việc", "việc làm", "job", "tuyển dụng", "lương", "mức lương", "vị trí",
            "ngành nghề", "kỹ năng", "địa điểm", "intern", "full-time", "part-time",
            "ứng tuyển", "hà nội", "ha noi", "tp hcm", "hồ chí minh", "đà nẵng"
        ]
        return any(kw in text for kw in job_keywords)

    last_user_text = last_user_raw.lower()
    has_filter = search_title or search_location or search_jobtype or search_salary or search_desc
    job_related = is_job_related(last_user_text)

    # Nếu có filter và liên quan đến việc làm → trả job
    quytrinh_keywords = ["quy trình", "hướng dẫn", "cách ứng tuyển", "làm sao để ứng tuyển",
                         "nộp hồ sơ", "đăng ký", "apply", "ứng tuyển"]
    is_quytrinh = any(kw in last_user_text for kw in quytrinh_keywords)

    if has_filter and job_related and not is_quytrinh and result and columns:
        print("[DEBUG] search_jobtype:", search_jobtype)
        for row in result:
            info = {col: str(val) if val not in [None, 'None'] else 'Chưa cập nhật' for col, val in zip(columns, row)}

            # Chỉ lọc đúng job_type và location nếu có cả 2 filter
            if search_jobtype and search_location:
                jobtype_db = remove_accents(str(info.get('job_type', '')).lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                location_db = remove_accents(info.get('location', '').lower())
                search_jobtype_norm = remove_accents(search_jobtype.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                location_search = remove_accents(search_location.lower())
                if search_jobtype_norm in jobtype_db and location_search in location_db:
                    matched.append(info)
                continue

            # Nếu chỉ có job_type (không có title/location/salary/desc), chỉ lọc theo job_type
            if search_jobtype and not (search_title or search_location or search_salary or search_desc):
                jobtype_db = remove_accents(str(info.get('job_type', '')).lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                search_jobtype_norm = remove_accents(search_jobtype.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                if search_jobtype_norm in jobtype_db:
                    matched.append(info)
                continue

            # Nếu có nhiều filter thì lọc theo tất cả
            if search_title:
                title_db = remove_accents(info.get('title', '').lower())
                title_search = remove_accents(search_title.lower())
                if title_search not in title_db:
                    continue
            if search_location:
                location_db = remove_accents(info.get('location', '').lower())
                location_search = remove_accents(search_location.lower())
                if location_search not in location_db:
                    continue
            if search_jobtype:
                jobtype_db = remove_accents(str(info.get('job_type', '')).lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                search_jobtype_norm = remove_accents(search_jobtype.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                if search_jobtype_norm not in jobtype_db:
                    continue
            if search_salary and search_salary not in info.get('salary_range', '').replace('.', ''):
                continue
            if search_desc:
                desc_db = remove_accents(str(info.get('description', '')).lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                search_desc_norm = remove_accents(search_desc.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                keywords = [kw for kw in search_desc_norm.split() if len(kw) > 2]
                if not all(kw in desc_db for kw in keywords):
                    continue
            matched.append(info)

        print(f"[DEBUG] matched jobs: {len(matched)}")
        if matched:
            max_jobs = 15  # Giới hạn số lượng job trả về
            reply = f"Đã tìm thấy {len(matched)} công việc phù hợp:\n"
            for info in matched[:max_jobs]:
                link = f"http://localhost:3000/job-details-2/{info.get('id','')}"
                reply += f"- [{info.get('title','')} ({info.get('job_type','')}), địa điểm: {info.get('location','')}, lương: {info.get('salary_range','')} VND]({link})\n"
            if len(matched) > max_jobs:
                reply += f"\n... và {len(matched)-max_jobs} công việc khác. Vui lòng lọc thêm để xem chi tiết."
            print("[DEBUG] reply:", reply)
            return jsonify({"reply": reply})
        else:
            print("[DEBUG] Không tìm thấy job phù hợp!")
            has_filter = False

    # Nếu không có filter hoặc không liên quan → gọi Gemini
    if result and columns:
        for row in result[:5]:
            info = {col: str(val) if val not in [None, 'None'] else 'Chưa cập nhật' for col, val in zip(columns, row)}
            link = f"http://localhost:3000/jobs/{info.get('id','')}"
            jobs_text += f"---\n[TÊN]: {info.get('title','').upper()}\n[ĐỊA ĐIỂM]: {info.get('location','')}\n[LƯƠNG]: {info.get('salary_range','')} VND\n[MÔ TẢ]: {info.get('description','')}\n[LINK]: {link}\n\n"
    else:
        jobs_text = "Hiện tại chưa có công việc nào trong hệ thống."

    if not history or "Bạn là BossAIJOB" not in str(history[0]):
        initial_prompt = (
    "# Meta Prompt: BossAIJOB Chatbot\n\n"
    "## 1. System (Vai trò)\n"
    "Bạn là BossAIJOB, một trợ lý ảo chuyên nghiệp cho website BossAIJOB. "
    "Bạn đóng vai trò là chuyên gia tư vấn việc làm, hỗ trợ ứng viên tìm kiếm công việc phù hợp, "
    "hướng dẫn quy trình ứng tuyển và đánh giá CV.\n\n"

    "## 2. Context (Ngữ cảnh)\n"
    "BossAIJOB là nền tảng tuyển dụng trực tuyến tại Việt Nam. "
    "Người dùng của chatbot là ứng viên muốn:\n"
    "- Tìm công việc theo ngành nghề, mức lương, kỹ năng hoặc địa điểm.\n"
    "- Hiểu rõ yêu cầu tuyển dụng (mô tả công việc, kỹ năng, lương, quy trình).\n"
    "- Nhận hướng dẫn ứng tuyển trên website BossAIJOB.\n"
    "- Tạo và quản lý CV để ứng tuyển trực tuyến.\n"
    "- Nhờ chatbot xem và đánh giá CV có phù hợp với một vị trí mong muốn hay không.\n\n"

    "Dưới đây là danh sách các công việc hiện có trong hệ thống (trích từ bảng job_postings):\n"
    f"{jobs_text}\n\n"

    "## 3. Instructions (Hướng dẫn)\n"
    "- Khi người dùng hỏi về tên công việc, hãy so sánh chính xác hoặc gần đúng với trường '[TÊN]' trong danh sách bên trên.\n"
    "- Nếu tìm thấy, trả lời chi tiết về công việc đó (vị trí, lương, mô tả, link...).\n"
    "- Nếu không tìm thấy, trả lời lịch sự là không có công việc phù hợp.\n"
    "- Luôn trả lời bằng tiếng Việt, văn phong lịch sự, thân thiện, dễ hiểu.\n"
    "- Trả lời ngắn gọn nhưng đầy đủ thông tin.\n"
    "- Khi có thể, chèn link chi tiết công việc bằng Markdown.\n"
    "- Nếu không có thông tin, trả lời:\n"
    "  \"Xin lỗi, hiện tại tôi chưa có thông tin về công việc phù hợp. "
    "Vui lòng truy cập website hoặc liên hệ hotline 076-523-3951 gặp BossHuy để biết thêm chi tiết.\"\n"
    "- khi người dùng hỏi về cách ứng tuyển thì hãy nhắc đến 5 bước trong quy trình ứng tuyển.\n"
    "- Không trả lời các câu hỏi không liên quan đến việc làm hoặc dịch vụ BossAIJOB.\n\n"

    "### Hướng dẫn tạo CV:\n"
    "- Khi người dùng hỏi về cách tạo CV hoặc quản lý CV, hãy trả lời theo các bước sau:\n"
    "  1. Vào mục **Candidate** → chọn **Create CV** → chọn nút **Tạo CV** .\n"
    "  2. Điền đầy đủ thông tin yêu cầu (họ tên, kỹ năng, kinh nghiệm, học vấn...).\n"
    "  3. Sau khi hoàn tất, bấm nút **Tạo** để lưu CV.\n"
    "- Kèm theo link tạo CV: [Tạo CV ngay](http://localhost:3000/page-resume).\n\n"

    "### Đánh giá CV:\n"
    "- Khi người dùng tải lên hoặc nhập nội dung CV và hỏi về sự phù hợp với một vị trí (ví dụ: Backend Developer, Data Analyst, Mobile Developer...), "
    "hãy làm theo các bước sau:\n"
    "  1. Xác định rõ vị trí {job_position} mà ứng viên muốn ứng tuyển.\n"
    "  2. Đọc và phân tích CV, sau đó đánh giá theo các tiêu chí (thang điểm 1–10):\n"
    "     - Kỹ năng kỹ thuật liên quan đến {job_position}.\n"
    "     - Kiến thức bổ trợ.\n"
    "     - Kinh nghiệm thực tế/dự án.\n"
    "     - Học vấn & chứng chỉ liên quan.\n"
    "     - Kỹ năng mềm (làm việc nhóm, giao tiếp...).\n"
    "     - Mức độ phù hợp với {job_position}.\n"
    "  3. Liệt kê điểm mạnh và điểm yếu của CV.\n"
    "  4. Đưa ra gợi ý cụ thể để cải thiện CV.\n"
    "  5. Kết luận tổng quan: CV này có phù hợp để nộp vào vị trí {job_position} hay không.\n"
    "- Nếu người dùng không nêu rõ vị trí, hãy hỏi lại để đánh giá chính xác.\n"
)
        history = [{'role': 'user', 'text': initial_prompt}] + history

    API_KEY = os.getenv("GEMINI_API_KEY")
    if not API_KEY:
        return jsonify({"reply": "Lỗi cấu hình: Thiếu GEMINI_API_KEY trong .env."}), 500

    models_to_try = [
        "gemini-2.5-flash",        
        "gemini-flash-latest",      
        "gemini-2.0-flash-lite",  
        "gemini-2.0-flash",      
        "gemini-pro-latest",     
    ]

    parts = [{"text": turn.get("text", "")} for turn in history]

    # ===== Thêm CV vào prompt nếu có =====
    if cv_text:
        parts.append({"text": "Nội dung CV ứng viên:\n" + cv_text})
    if file_part:
        parts.append(file_part)

    payload = {"contents": [{"parts": parts}]}
    headers = {"Content-Type": "application/json"}

    reply = None
    last_error = None

    # Try each model in sequence until one succeeds
    for MODEL in models_to_try:
        try:
            URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
            resp = requests.post(URL, headers=headers, data=json.dumps(payload), timeout=10)
            resp.raise_for_status()
            result = resp.json()
            reply = result["candidates"][0]["content"]["parts"][0]["text"]
            print(f"[SUCCESS] Using model: {MODEL}")
            break  # Success, exit the loop
        except requests.exceptions.RequestException as e:
            app.logger.warning(f"Model {MODEL} failed: {e}")
            last_error = e
            continue  # Try next model

    if reply is None:
        app.logger.error(f"All models failed. Last error: {last_error}")
        reply = "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau."

    return jsonify({"reply": reply})


if __name__ == '__main__':
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
