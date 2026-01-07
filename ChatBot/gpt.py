from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import datetime
import mysql.connector
from dotenv import load_dotenv
import base64
import fitz  # PyMuPDF
from openai import OpenAI  # Import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)

# Khởi tạo OpenAI Client
# Đảm bảo bạn đã có OPENAI_API_KEY trong file .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cache dữ liệu công việc
job_cache = {
    'result': None,
    'columns': None,
    'last_update': None
}

# ===== Hàm phụ xử lý File =====
def encode_image(file_path):
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def extract_pdf_text(file_path):
    text_content = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text_content += page.get_text() + "\n"
    return text_content.strip()

# ===== Hàm lấy dữ liệu từ MySQL =====
def get_jobs():
    now = datetime.datetime.now()
    if job_cache['result'] and job_cache['last_update']:
        delta = now - job_cache['last_update']
        if delta.total_seconds() < 900:  # cache 15 phút
            return job_cache['result'], job_cache['columns']

    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            port=os.getenv("DB_PORT"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        cursor = conn.cursor()
        query = "SELECT id, title, description, job_type, location, salary_range, status FROM job_postings WHERE status = 'active'"
        cursor.execute(query)
        result = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        cursor.close()
        conn.close()

        job_cache.update({'result': result, 'columns': columns, 'last_update': now})
        return result, columns
    except Exception as e:
        print(f"[ERROR] DB: {e}")
        return [], None

@app.route('/ai_chatbot', methods=['POST'])
def ai_chatbot():
    # 1. Lấy dữ liệu từ Request
    if request.form:
        data = request.form
        history_raw = data.get("history", "[]")
        import json as _json
        try:
            history = _json.loads(history_raw)
        except:
            history = []
    else:
        data = request.get_json() or {}
        history = data.get("history", [])

    job_position = data.get("job_position", "vị trí phù hợp")
    uploaded_file = request.files.get("file")
    
    cv_text = None
    image_base64 = None

    if uploaded_file:
        filename = uploaded_file.filename
        save_path = os.path.join("uploads", filename)
        os.makedirs("uploads", exist_ok=True)
        uploaded_file.save(save_path)
        if filename.lower().endswith(".pdf"):
            cv_text = extract_pdf_text(save_path)
        else:
            image_base64 = encode_image(save_path)

    # 2. Logic lọc Job thủ công (Giữ nguyên của bạn để tối ưu speed/cost)
    result, columns = get_jobs()
    # ... (Phần logic lọc matched jobs của bạn giữ nguyên ở đây) ...
    # Để ngắn gọn, tôi giả định logic lọc của bạn chạy và trả về `matched` hoặc `jobs_text`
    
    jobs_text = ""
    if result:
        for row in result[:10]: # Lấy 10 jobs tiêu biểu cho AI tham khảo
            info = dict(zip(columns, row))
            jobs_text += f"- {info['title']} tại {info['location']}, Lương: {info['salary_range']}\n"

    # 3. CHUYỂN ĐỔI SANG ĐỊNH DẠNG OPENAI
    openai_messages = []
    
    # System Prompt (Vai trò của Bot)
    system_instruction = (
        "Bạn là BossAIJOB, trợ lý ảo chuyên nghiệp tư vấn việc làm.\n"
        f"Dữ liệu công việc hiện có:\n{jobs_text}\n"
        "Hướng dẫn: Trả lời lịch sự, dùng Markdown, tập trung vào hỗ trợ ứng viên và đánh giá CV."
    )
    openai_messages.append({"role": "system", "content": system_instruction})

    # Chuyển đổi History (Gemini: user/model -> OpenAI: user/assistant)
    for turn in history:
        role = "assistant" if turn.get("role") in ["model", "assistant"] else "user"
        content = turn.get("text") or turn.get("content")
        if content and "Bạn là BossAIJOB" not in str(content):
            openai_messages.append({"role": role, "content": content})

    # Xử lý tin nhắn cuối cùng (kèm CV/Hình ảnh)
    last_user_text = ""
    for turn in reversed(history):
        if turn.get("role") == "user":
            last_user_text = turn.get("text", "")
            break
    
    final_user_content = [{"type": "text", "text": last_user_text}]
    
    if cv_text:
        final_user_content.append({"type": "text", "text": f"Nội dung CV: {cv_text}"})
    
    if image_base64:
        final_user_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}
        })

    # Thay thế hoặc thêm tin nhắn cuối cùng của user vào list messages
    openai_messages.append({"role": "user", "content": final_user_content})

    # 4. GỌI OPENAI API
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", # Dùng mini cho rẻ và nhanh, hoặc "gpt-4o" nếu cần cực thông minh
            messages=openai_messages,
            temperature=0.7,
            max_tokens=1500
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"[ERROR] OpenAI: {e}")
        return jsonify({"reply": "Hệ thống đang bận, vui lòng thử lại sau."}), 500

if __name__ == '__main__':
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)