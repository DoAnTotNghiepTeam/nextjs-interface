from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests, json
import datetime
import mysql.connector
from dotenv import load_dotenv
import base64
import fitz  # PyMuPDF để đọc text từ PDF
import time  # Để xử lý rate limit
from PIL import Image  # Để nén ảnh
from io import BytesIO
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    """Nén ảnh tối đa để giảm payload (500x500, quality 50)"""
    try:
        with Image.open(file_path) as img:
            # Resize ảnh nhỏ hơn (500x500)
            img.thumbnail((500, 500), Image.Resampling.LANCZOS)
            # Lưu vào buffer với chất lượng thấp hơn (50)
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=50, optimize=True)
            buffer.seek(0)
            result = base64.b64encode(buffer.getvalue()).decode("utf-8")
            file_size = len(result) / 1024  # KB
            logger.info(f"Image compressed: {file_size:.1f} KB")
            return result
    except Exception as e:
        logger.error(f"Image compression failed: {e}. Using raw file...")
        # Fallback: encode nguyên file gốc nếu PIL lỗi
        try:
            with open(file_path, "rb") as f:
                result = base64.b64encode(f.read()).decode("utf-8")
                file_size = len(result) / 1024  # KB
                logger.warning(f"Using raw image: {file_size:.1f} KB")
                return result
        except Exception as e2:
            logger.error(f"Failed to encode image: {e2}")
            return None

def extract_pdf_text(file_path):
    """Chỉ lấy 2 trang đầu của PDF để giảm kích thước"""
    text_content = ""
    try:
        with fitz.open(file_path) as pdf:
            # Giới hạn chỉ 2 trang (giảm payload)
            for page_num in range(min(2, len(pdf))):
                page = pdf[page_num]
                text_content += page.get_text() + "\n"
        logger.info(f"PDF extracted: {len(text_content)} chars from {min(2, len(pdf))} pages")
    except Exception as e:
        logger.error(f"Failed to extract PDF: {e}")
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
    files_to_cleanup = []
    
    if uploaded_file:
        filename = uploaded_file.filename
        save_path = os.path.join("uploads", filename)
        os.makedirs("uploads", exist_ok=True)
        uploaded_file.save(save_path)
        files_to_cleanup.append(save_path)  # Track for cleanup
        
        logger.info(f"Processing file: {filename}")

        if filename.lower().endswith(".pdf"):
            cv_text = extract_pdf_text(save_path)
        else:
            image_base64 = encode_image(save_path)
            if image_base64:
                file_part = {
                    "inline_data": {
                        "mime_type": "image/jpeg",  # Force JPEG
                        "data": image_base64
                    }
                }
            else:
                logger.warning("Failed to encode image")

    # ===== CHECK QÚYTRINH TRƯỚC (trước khi lấy DB) =====
    last_user_raw = ""
    for turn in reversed(history):
        if isinstance(turn, dict) and turn.get("role") == "user":
            last_user_raw = turn.get("text", "")
            break

    last_user_text = last_user_raw.lower()
    
    # Nếu user hỏi về quy trình ứng tuyển → trả lời nhanh (không gọi Gemini, không lấy DB)
    quytrinh_keywords = ["quy trình", "hướng dẫn", "cách ứng tuyển", "làm sao để ứng tuyển",
                         "nộp hồ sơ", "đăng ký", "apply", "ứng tuyển"]
    is_quytrinh = any(kw in last_user_text for kw in quytrinh_keywords)
    
    # Nếu user hỏi câu chung chung → trả lời nhanh
    # Phân loại: greeting (chỉ chào) vs capability (hỏi khả năng)
    greeting_keywords = ["hello", "hi", "xin chào", "chào"]
    capability_keywords = ["bạn có thể giúp gì", "có thể giúp gì", "bạn có thể làm gì", "làm gì cho tôi",
                          "bạn có thể hỗ trợ", "hỗ trợ gì", "bạn giúp gì", "giúp gì tôi", "bạn là ai", 
                          "bạn tên gì", "bạn là người", "ai là bạn"]
    
    is_greeting = any(kw in last_user_text for kw in greeting_keywords)
    is_capability_question = any(kw in last_user_text for kw in capability_keywords)
    is_general_question = is_greeting or is_capability_question
    
    if is_general_question:
        time.sleep(2.0)  # Delay 1.5 giây để tạo hiệu ứng tự nhiên
        
        if is_greeting and not is_capability_question:
            # Chỉ trả lời giới thiệu ngắn gọn
            reply = "Chào bạn! 👋 Tôi là **BossAIJOB**, trợ lý tư vấn việc làm chuyên nghiệp của bạn.Bạn có thể đặt câu hỏi về việc làm, tìm kiếm công việc, hoặc yêu cầu hỗ trợ tôi sẽ giúp bạn."
        else:
            # Trả lời đầy đủ với danh sách khả năng
            reply = "Tôi có thể giúp bạn:\n\n" + \
                    "✅ Tìm công việc phù hợp (full-time, part-time, remote, intern...)\n\n" + \
                    "✅ Tìm công việc ở các địa điểm bạn yêu cầu (Đà Nẵng, Hà Nội, TP.HCM...)\n\n" + \
                    "✅ Đánh giá CV giúp bạn và đưa lời khuyên cải thiện\n\n" + \
                    "✅ Hướng dẫn quy trình ứng tuyển\n\n" + \
                    "✅ Đưa bạn đến trang ứng tuyển và tìm việc một cách nhanh chóng\n\n" + \
                    "Bạn cần gì? Hãy hỏi tôi! 😊"
        
        print("[SUCCESS] Trả lời câu hỏi chung chung")
        return jsonify({"reply": reply})
    
    if is_quytrinh:
        # Delay 1.5 giây để tạo hiệu ứng tự nhiên (chatbot đang suy nghĩ)
        time.sleep(1.5)
        
        # Format response dạng text + thêm link riêng biệt
        reply = "**5 BƯỚC ỨNG TUYỂN TẠI BossAIJOB:**\n\n" + \
                "1. ✅ Tìm công việc - Tìm kiếm công việc phù hợp trên website BossAIJOB bằng cách Search Job hoặc vào mục Find Job để tìm.\n\n" + \
                "2. ✅ Xem chi tiết - Xem yêu cầu công việc, mô tả chi tiết\n\n" + \
                "3. ✅ Truy cập vào mục CV để tạo CV cho quá trình apply hoặc có thể upload Cv sẵn có - [🔗 http://localhost:3000/page-resume ](http://localhost:3000/page-resume)\n\n" + \
                "4. ✅ Bấm Apply - Bấm nút 'Apply' trong chi tiết công việc sau khi đã tìm hiểu kĩ công việc\n\n" + \
                "5. ✅ Chờ phản hồi - Chờ nhà tuyển dụng thông báo hoặc liên hệ bạn\n\n" + \
                "5. ✅ Kiểm tra mail và thông báo - Kiểm tra mail và thông báo từ nhà tuyển dụng\n\n" + \
                "   📞 Liên hệ: **076-523-3951** nếu cần hỗ trợ gấp!"
        print("[SUCCESS] Trả lời quy trình ứng tuyển (1.5s)")
        return jsonify({"reply": reply})

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
        # Thay thế các precomposed characters trước (ví dụ: đ → d, ơ → o, ư → u)
        replacements = {
            'đ': 'd', 'Đ': 'D',
            'ơ': 'o', 'Ơ': 'O',
            'ư': 'u', 'Ư': 'U',
        }
        for old, new in replacements.items():
            input_str = input_str.replace(old, new)
        # Sau đó normalize và xóa combining marks
        return ''.join(
            c for c in unicodedata.normalize('NFD', input_str)
            if unicodedata.category(c) != 'Mn'
        )

    import re

    # ✅ Chỉ lấy filter từ message mới nhất của user
    text_norm = remove_accents(last_user_raw.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
    print(f"[DEBUG] text_norm: '{text_norm}'")
    print(f"[DEBUG] last_user_raw: '{last_user_raw}'")

    match = re.search(r"công việc (?:nào )?tên là ([^?]+)", text_norm, re.IGNORECASE)
    if match:
        search_title = match.group(1).strip()

    # location (text_norm đã remove_accents nên chỉ cần kiểm tra phiên bản không dấu)
    if "ha noi" in text_norm:
        search_location = "Hà Nội"
        print(f"[DEBUG] Found location: Hà Nội")
    if any(k in text_norm for k in ["ho chi minh", "tp hcm", "tphcm", "hcm"]):
        search_location = "hồ chí minh"
        print(f"[DEBUG] Found location: hồ chí minh")
    if "da nang" in text_norm:
        search_location = "Đà Nẵng"
        print(f"[DEBUG] Found location: Đà Nẵng")

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
    is_quytrinh = any(kw in last_user_text for kw in quytrinh_keywords)

    if has_filter and job_related and not is_quytrinh and result and columns:
        print("[DEBUG] Filters - job_type:", search_jobtype, "location:", search_location)
        print(f"[DEBUG] has_filter={has_filter}, job_related={job_related}, is_quytrinh={is_quytrinh}")
        
        for row in result:
            info = {col: str(val) if val not in [None, 'None'] else 'Chưa cập nhật' for col, val in zip(columns, row)}
            should_match = True

            # Check job_type filter
            if search_jobtype:
                jobtype_db = remove_accents(str(info.get('job_type', '')).lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                search_jobtype_norm = remove_accents(search_jobtype.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
                if search_jobtype_norm not in jobtype_db:
                    should_match = False

            # Check location filter
            if search_location and should_match:
                location_db = remove_accents(info.get('location', '').lower())
                location_search = remove_accents(search_location.lower())
                # Split location by "hoặc", "or", "/" to handle multiple locations
                locations = [loc.strip() for loc in location_db.replace(" hoặc ", ",").replace(" or ", ",").split(",")]
                if not any(location_search in loc for loc in locations):
                    should_match = False

            # Check title filter
            if search_title and should_match:
                title_db = remove_accents(info.get('title', '').lower())
                title_search = remove_accents(search_title.lower())
                if title_search not in title_db:
                    should_match = False

            # Check salary filter
            if search_salary and should_match:
                if search_salary not in info.get('salary_range', '').replace('.', ''):
                    should_match = False

            # Check description filter
            if search_desc and should_match:
                desc_db = remove_accents(str(info.get('description', '')).lower())
                keywords = [kw for kw in search_desc.lower().split() if len(kw) > 2]
                if not all(kw in desc_db for kw in keywords):
                    should_match = False

            if should_match:
                matched.append(info)

        print(f"[DEBUG] Total matched jobs: {len(matched)}")
        if matched:
            max_jobs = 15
            reply = f"🎯 **Đã tìm thấy {len(matched)} công việc phù hợp:**\n\n"
            for idx, info in enumerate(matched[:max_jobs], 1):
                link = f"http://localhost:3000/job-details-2/{info.get('id','')}"
                reply += f"**{idx}. [{info.get('title','')}]({link})**\n"
                reply += f"   • Loại: {info.get('job_type','')}\n"
                reply += f"   • Địa điểm: {info.get('location','')}\n"
                reply += f"   • Lương: {info.get('salary_range','')} VND\n\n"
                reply += "───────────────────────────\n\n"
            if len(matched) > max_jobs:
                reply += f"\n... và {len(matched)-max_jobs} công việc khác. Vui lòng lọc thêm để xem chi tiết."
            print("[DEBUG] reply:", reply)
            return jsonify({"reply": reply})
        else:
            print("[DEBUG] Không tìm thấy job phù hợp!")
            has_filter = False

    # Nếu không có filter hoặc không liên quan → gọi Gemini
    # CHỈ thêm danh sách jobs nếu là lần đầu tiên (history rỗng hoặc chưa có system prompt)
    if (not history or "Bạn là BossAIJOB" not in str(history[0])) and result and columns:
        for row in result[:10]:  # Lấy 10 jobs để AI có đủ context
            info = {col: str(val) if val not in [None, 'None'] else 'Chưa cập nhật' for col, val in zip(columns, row)}
            link = f"http://localhost:3000/job-details-2/{info.get('id','')}"
            jobs_text += f"[{info.get('title','')}] - {info.get('location','')} - {info.get('salary_range','')} VND - Loại: {info.get('job_type','')} - Link: {link}\n"
    else:
        jobs_text = ""  # Không thêm jobs nếu không phải lần đầu

    if not history or "Bạn là BossAIJOB" not in str(history[0]):
        initial_prompt = (
    "Bạn là BossAIJOB, trợ lý tư vấn việc làm chuyên nghiệp của bạn .\n"
    "Nhiệm vụ: Tìm việc phù hợp từ database, đánh giá CV, hướng dẫn ứng tuyển.\n\n"
    
    "LUẬT BẮT BUỘC:\n"
    "- Khi user tìm kiếm công việc: LẤY DỮ LIỆU TỪ DANH SÁCH BÊN DƯỚI, không tự sáng tác.\n"
    "- Nếu tìm thấy: liệt kê chi tiết (tên, địa điểm, lương, link).\n"
    "- Nếu không tìm thấy: trả lời 'Xin lỗi, chưa có công việc nào phù hợp. Liên hệ 076-523-3951'.\n"
    "- Luôn trả lời tiếng Việt, thân thiện.\n\n"
    
    "HƯỚNG DẪN ĐÁNH GIÁ CV:\n"
    "Khi user tải CV lên (ảnh hoặc file PDF) và hỏi về sự phù hợp với một vị trí, hãy:\n"
    "VÍ DỤ: 'xem giúp ta CV này cho vị trí Backend Developer', 'đánh giá CV cho vị trí Data Analyst', 'CV phù hợp với QA/Tester không?'\n\n"
    "1. XÁC ĐỊNH VỊ TRỊ - Nêu rõ vị trí ứng tuyển (Backend, Frontend, QA, Data, DevOps, v.v.)\n"
    "2. TỔNG QUAN - Đánh giá cấu trúc, trình bày CV (cảm nhận chung)\n"
    "3. ĐÁNH GIÁ 5 TIÊU CHÍ (mỗi tiêu chí cho điểm 1-10 có giải thích):\n"
    "   • Trình bày & Định dạng (Layout, độ chuyên nghiệp)\n"
    "   • Kỹ năng liên quan (Công nghệ, tool phù hợp vị trí)\n"
    "   • Kinh nghiệm & Dự án (Số năm, độ phức tạp, liên quan)\n"
    "   • Học vấn & Chứng chỉ (Bằng cấp, chứng chỉ, khoá học)\n"
    "   • Kỹ năng mềm & Khác (Giao tiếp, Tiếng Anh, Lãnh đạo)\n"
    "4. ĐIỂM MẠNH - Liệt kê 3-5 điểm tích cực\n"
    "5. CẦN CẢI THIỆN - Liệt kê 3-5 điểm yếu cần bổ sung\n"
    "6. KHUYẾN NGHỊ CỤ THỂ - Đưa ra 3-5 hành động cụ thể để tối ưu CV\n"
    "7. KẾT LUẬN - Mức độ phù hợp (Rất cao/Cao/Trung bình/Thấp) + lời khuyên\n\n"
    
    "HƯỚNG DẪN ỨNG TUYỂN (5 BƯỚC):\n"
    "1. Tìm công việc phù hợp trên website BossAIJOB\n"
    "2. Xem chi tiết yêu cầu công việc\n"
    "3. Chuẩn bị CV/Resume phù hợp (hoặc tạo CV: http://localhost:3000/page-resume)\n"
    "4. Bấm nút 'Apply' hoặc 'Ứng tuyển' trong chi tiết công việc\n"
    "5. Chờ phản hồi từ nhà tuyển dụng\n\n"
    
    "DANH SÁCH CÔNG VIỆC CÓ SẴN TỪ DATABASE:\n"
    f"{jobs_text}\n\n"
    
    "Thông tin thêm: Link tạo CV: http://localhost:3000/page-resume"
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
        "gemini-pro-latest",          # Backup
    ]

    parts = [{"text": turn.get("text", "")} for turn in history]

    # ===== CHỈ thêm system instruction lần đầu hoặc khi có CV =====
    should_add_system = (not history or "Bạn là BossAIJOB" not in str(history[0])) and not cv_text and not file_part
    
    if should_add_system:
        system_instruction = (
            "BẠN LÀ BossAIJOB, một trợ lý tư vấn việc làm chuyên nghiệp. "
            "Luôn tự giới thiệu là BossAIJOB, không phải mô hình ngôn ngữ của Google. "
            "Bạn giúp user tìm việc từ database, đánh giá CV, hướng dẫn ứng tuyển."
        )
        parts = [{"text": system_instruction}] + parts

    # Giới hạn lịch sử: chỉ gửi 6 message gần nhất (không quá ít, không quá nhiều)
    max_history = 6
    if len(parts) > max_history + 1:  # +1 vì có system instruction
        parts = [parts[0]] + parts[-(max_history):] if should_add_system else parts[-max_history:]
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
            resp = requests.post(URL, headers=headers, data=json.dumps(payload), timeout=25)
            
            # Kiểm tra lỗi 429 (Rate Limit) - thử model tiếp theo
            if resp.status_code == 429:
                print(f"[WARNING] Rate limit exceeded for {MODEL}, waiting 15s...")
                last_error = "Rate limit exceeded"
                time.sleep(15)  # Chờ 15 giây để quota reset
                continue
            
            # Kiểm tra lỗi 503 (Service Unavailable - hết quota) - thử model tiếp theo
            if resp.status_code == 503:
                print(f"[WARNING] Service unavailable for {MODEL} (quota exceeded?), trying next model...")
                last_error = "Service unavailable - quota may be exceeded"
                time.sleep(2)
                continue
            
            # Kiểm tra lỗi 404 (Model not found) - thử model tiếp theo
            if resp.status_code == 404:
                print(f"[WARNING] Model {MODEL} not found, trying next model...")
                last_error = f"Model {MODEL} not available"
                continue
            
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

    # ===== Cleanup uploaded files =====
    for filepath in files_to_cleanup:
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
                logger.info(f"Cleaned up: {filepath}")
        except Exception as e:
            logger.warning(f"Failed to cleanup {filepath}: {e}")

    return jsonify({"reply": reply})


if __name__ == '__main__':
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)