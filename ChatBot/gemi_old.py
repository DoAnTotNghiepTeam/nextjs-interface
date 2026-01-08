from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
import datetime
import mysql.connector
from dotenv import load_dotenv
import base64
import fitz  # PyMuPDF
import time
import re
import unicodedata
from collections import defaultdict
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiting
request_timestamps = defaultdict(list)
RATE_LIMIT_REQUESTS = 5  # max 5 requests
RATE_LIMIT_WINDOW = 60   # per 60 seconds

# Cache
job_cache = {'result': None, 'columns': None, 'last_update': None}

# Compiled regex patterns (reuse instead of recompile each request)
REGEX_JOB_TITLE = re.compile(r"công việc (?:nào )?tên là ([^?]+)", re.IGNORECASE)
REGEX_SALARY = re.compile(r"lương ([\d\.]+)")
REGEX_DESC = re.compile(r"mô tả ([^?]+)")

# Gemini models to try
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-pro-latest",
]

# ===== HELPER FUNCTIONS =====
def encode_image(file_path):
    """Encode image to base64"""
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def extract_pdf_text(file_path):
    """Extract text from PDF file"""
    text_content = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text_content += page.get_text() + "\n"
    return text_content.strip()

def remove_accents(text):
    """Remove Vietnamese accents for matching"""
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )

def is_job_related(text):
    """Check if message is job-related"""
    job_keywords = [
        "công việc", "việc làm", "job", "tuyển dụng", "lương", "mức lương",
        "vị trí", "ngành nghề", "kỹ năng", "địa điểm", "intern", "full-time",
        "part-time", "ứng tuyển", "hà nội", "ha noi", "tp hcm", "hồ chí minh", "đà nẵng"
    ]
    return any(kw in text.lower() for kw in job_keywords)

def check_rate_limit(client_ip):
    """Check if client exceeded rate limit"""
    now = time.time()
    timestamps = request_timestamps[client_ip]
    timestamps[:] = [ts for ts in timestamps if now - ts < RATE_LIMIT_WINDOW]
    
    if len(timestamps) >= RATE_LIMIT_REQUESTS:
        return False
    
    timestamps.append(now)
    return True

# ===== Hàm lấy dữ liệu công việc từ MySQL =====
def get_jobs():
    """Get active jobs from database with caching (15 min)"""
    now = datetime.datetime.now()
    if job_cache['result'] and job_cache['last_update']:
        delta = now - job_cache['last_update']
        if delta.total_seconds() < 900:  # cache 15 minutes
            return job_cache['result'], job_cache['columns']

    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            port=int(os.getenv("DB_PORT", 3306)),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title, description, job_type, location, min_experience,
                   required_degree, salary_range, status, category, created_at, employer_id
            FROM workwise.job_postings WHERE status = 'active'
        """)
        result = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        cursor.close()
        conn.close()

        job_cache['result'] = result
        job_cache['columns'] = columns
        job_cache['last_update'] = now
        return result, columns
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return [], None


def extract_search_filters(text):
    """Extract job search filters from user message"""
    text_norm = remove_accents(text.lower().replace('-', ' ').replace('_', ' ')).replace('  ', ' ').strip()
    
    filters = {
        'title': None,
        'location': None,
        'job_type': None,
        'salary': None,
        'description': None
    }
    
    # Title
    match = REGEX_JOB_TITLE.search(text_norm)
    if match:
        filters['title'] = match.group(1).strip()
    
    # Location
    if any(k in text_norm for k in ["hà nội", "ha noi"]):
        filters['location'] = "Hà Nội"
    elif any(k in text_norm for k in ["hồ chí minh", "tp hcm", "tphcm", "hcm", "ho chi minh"]):
        filters['location'] = "hồ chí minh"
    elif any(k in text_norm for k in ["đà nẵng", "da nang"]):
        filters['location'] = "Đà Nẵng"
    
    # Job type
    for jt, variants in [("full-time", ["full time", "fulltime", "full-time"]),
                         ("part-time", ["part time", "parttime", "part-time"]),
                         ("remote", ["remote", "từ xa", "lam tu xa"]),
                         ("intern", ["intern", "thực tập", "thuc tap"])]:
        if any(v in text_norm for v in variants):
            filters['job_type'] = jt
            break
    
    # Salary
    match = REGEX_SALARY.search(text_norm)
    if match:
        filters['salary'] = match.group(1).replace('.', '')
    
    # Description keywords
    match = REGEX_DESC.search(text_norm)
    if match:
        filters['description'] = match.group(1).strip()
    
    return filters


def match_jobs(result, columns, filters):
    """Match jobs based on filters"""
    matched = []
    
    for row in result:
        info = {col: str(val) if val not in [None, 'None'] else 'Chưa cập nhật'
                for col, val in zip(columns, row)}
        
        # Check title filter
        if filters['title']:
            if filters['title'].lower() not in remove_accents(info.get('title', '')).lower():
                continue
        
        # Check location filter
        if filters['location']:
            if filters['location'].lower() not in remove_accents(info.get('location', '')).lower():
                continue
        
        # Check job type filter
        if filters['job_type']:
            jt_norm = remove_accents(str(info.get('job_type', '')).lower().replace('-', ' ').replace('_', ' ')).strip()
            jt_search = remove_accents(filters['job_type'].lower().replace('-', ' ')).strip()
            if jt_search not in jt_norm:
                continue
        
        # Check salary filter
        if filters['salary']:
            if filters['salary'] not in info.get('salary_range', '').replace('.', ''):
                continue
        
        # Check description filter
        if filters['description']:
            desc_db = remove_accents(str(info.get('description', '')).lower())
            keywords = [kw for kw in filters['description'].lower().split() if len(kw) > 2]
            if not all(kw in desc_db for kw in keywords):
                continue
        
        matched.append(info)
    
    return matched


@app.route('/ai_chatbot', methods=['POST'])
def ai_chatbot():
    # Check rate limit
    client_ip = request.remote_addr
    if not check_rate_limit(client_ip):
        return jsonify({
            "reply": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một chút trước khi thử lại."
        }), 429
    
    # Get request data (support both JSON and FormData)
    data = request.form if request.form else (request.get_json() or {})
    
    history = data.get("history", [])
    if isinstance(history, str):
        try:
            history = json.loads(history)
        except Exception:
            history = []
    
    job_position = data.get("job_position", "vị trí công việc bạn mong muốn")

    # ===== Process CV file if provided =====
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
            # Limit CV text (first 10000 chars to avoid overwhelming API)
            if len(cv_text) > 10000:
                cv_text = cv_text[:10000] + "\n... [CV cắt ngắn]"
        else:
            image_base64 = encode_image(save_path)
            file_part = {"inline_data": {"mime_type": "image/png", "data": image_base64}}

    # ===== Get jobs from MySQL and prepare context =====
    result, columns = get_jobs()
    jobs_text = ""
    
    # Get last user message to extract filters
    last_user_raw = ""
    for turn in reversed(history):
        if isinstance(turn, dict) and turn.get("role") == "user":
            last_user_raw = turn.get("text", "")
            break
    
    # Extract filters from user message
    filters = extract_search_filters(last_user_raw)
    has_filter = any(filters.values())
    job_related = is_job_related(last_user_raw)
    
    # Check if asking about application process
    quytrinh_keywords = ["quy trình", "hướng dẫn", "cách ứng tuyển", "làm sao để ứng tuyển",
                         "nộp hồ sơ", "đăng ký", "apply", "ứng tuyển"]
    is_quytrinh = any(kw in last_user_raw.lower() for kw in quytrinh_keywords)

    # If has filters and job-related → search jobs
    if has_filter and job_related and not is_quytrinh and result and columns:
        matched = match_jobs(result, columns, filters)
        logger.info(f"Found {len(matched)} matching jobs")
        
        if matched:
            max_jobs = 15
            reply = f"Đã tìm thấy {len(matched)} công việc phù hợp:\n"
            for info in matched[:max_jobs]:
                link = f"http://localhost:3000/job-details-2/{info.get('id','')}"
                reply += f"- [{info.get('title','')} ({info.get('job_type','')}), địa điểm: {info.get('location','')}, lương: {info.get('salary_range','')} VND]({link})\n"
            
            if len(matched) > max_jobs:
                reply += f"\n... và {len(matched)-max_jobs} công việc khác. Vui lòng lọc thêm để xem chi tiết."
            
            return jsonify({"reply": reply})
    
    # Prepare job context for Gemini (top 5 jobs)
    if result and columns:
        for row in result[:5]:
            info = {col: str(val) if val not in [None, 'None'] else 'Chưa cập nhật'
                    for col, val in zip(columns, row)}
            link = f"http://localhost:3000/jobs/{info.get('id','')}"
            jobs_text += f"---\n[TÊN]: {info.get('title','').upper()}\n[ĐỊA ĐIỂM]: {info.get('location','')}\n"
            jobs_text += f"[LƯƠNG]: {info.get('salary_range','')} VND\n[MÔ TẢ]: {info.get('description','')}\n[LINK]: {link}\n\n"
    else:
        jobs_text = "Hiện tại chưa có công việc nào trong hệ thống."

    # Add system prompt if first message
    if not history or "Bạn là BossAIJOB" not in str(history[0]):
        initial_prompt = f"""# Meta Prompt: BossAIJOB Chatbot

## 1. System (Vai trò)
Bạn là BossAIJOB, một trợ lý ảo chuyên nghiệp cho website BossAIJOB. 
Bạn đóng vai trò là chuyên gia tư vấn việc làm, hỗ trợ ứng viên tìm kiếm công việc phù hợp, 
hướng dẫn quy trình ứng tuyển và đánh giá CV.

## 2. Context (Ngữ cảnh)
BossAIJOB là nền tảng tuyển dụng trực tuyến tại Việt Nam.

Dưới đây là danh sách các công việc hiện có trong hệ thống:
{jobs_text}

## 3. Instructions (Hướng dẫn)
- Luôn trả lời bằng tiếng Việt, văn phong lịch sự, thân thiện, dễ hiểu.
- Trả lời ngắn gọn nhưng đầy đủ thông tin.
- Khi có thể, chèn link chi tiết công việc bằng Markdown.
- Đánh giá CV: phân tích theo 6 tiêu chí (điểm 1–10), liệt kê điểm mạnh/yếu, gợi ý cải thiện.
- Không trả lời các câu hỏi không liên quan đến việc làm hoặc BossAIJOB."""
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
    
    # Determine timeout based on whether CV is included
    # CV processing takes longer, so we need more time
    has_cv = cv_text or file_part
    timeout = 60 if has_cv else 30

    # Try each model in sequence until one succeeds
    for MODEL in models_to_try:
        try:
            URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
            print(f"[DEBUG] Trying model: {MODEL} with timeout: {timeout}s")
            resp = requests.post(URL, headers=headers, data=json.dumps(payload), timeout=timeout)
            resp.raise_for_status()
            result = resp.json()
            reply = result["candidates"][0]["content"]["parts"][0]["text"]
            print(f"[SUCCESS] Using model: {MODEL}")
            break  # Success, exit the loop
        except requests.exceptions.Timeout as e:
            app.logger.warning(f"Model {MODEL} timed out: {e}")
            last_error = e
            continue
        except requests.exceptions.HTTPError as e:
            if resp.status_code == 429:
                # Rate limited - wait longer before next attempt
                print(f"[RATE_LIMIT] Model {MODEL} hit rate limit. Waiting 5 seconds...")
                import time
                time.sleep(5)
                app.logger.warning(f"Model {MODEL} rate limited (429)")
                last_error = e
                continue
            else:
                app.logger.warning(f"Model {MODEL} HTTP error: {e}")
                last_error = e
                continue
        except requests.exceptions.RequestException as e:
            app.logger.warning(f"Model {MODEL} failed: {e}")
            last_error = e
            continue

    if reply is None:
        app.logger.error(f"All models failed. Last error: {last_error}")
        # Check if it's a rate limit issue
        if "429" in str(last_error):
            reply = "Xin lỗi, hệ thống đang quá tải. Vui lòng thử lại trong vài giây."
        elif "Timeout" in str(type(last_error)):
            reply = "Xin lỗi, yêu cầu mất quá lâu để xử lý. Vui lòng thử lại sau."
        else:
            reply = "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau."

    return jsonify({"reply": reply})


if __name__ == '__main__':
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)