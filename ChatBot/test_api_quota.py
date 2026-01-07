import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("❌ Lỗi: Không tìm thấy GEMINI_API_KEY trong .env")
    exit(1)

print(f"🔑 API Key: {API_KEY[:20]}...{API_KEY[-10:]}")

# Test 1: Kiểm tra xem API key còn hoạt động không
print("\n📝 Test 1: Gửi request tối thiểu...")

models_to_test = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
]

for MODEL in models_to_test:
    try:
        URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
        
        # Request tối thiểu
        payload = {
            "contents": [{
                "parts": [{"text": "test"}]
            }]
        }
        
        resp = requests.post(URL, json=payload, timeout=10)
        
        print(f"\n🤖 Model: {MODEL}")
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code == 200:
            print(f"   ✅ OK - API key hoạt động bình thường")
            break
        elif resp.status_code == 429:
            print(f"   ⚠️  RATE LIMIT - Quá nhiều request (thử lại sau)")
        elif resp.status_code == 503:
            print(f"   ❌ SERVICE UNAVAILABLE - Hết quota hoặc server down")
        elif resp.status_code == 404:
            print(f"   ❌ MODEL NOT FOUND - Model không tồn tại")
        elif resp.status_code == 401:
            print(f"   ❌ UNAUTHORIZED - API key sai hoặc hết hạn")
        else:
            print(f"   ⚠️  Lỗi khác: {resp.status_code}")
            print(f"   Response: {resp.text[:200]}")
            
    except Exception as e:
        print(f"\n🤖 Model: {MODEL}")
        print(f"   ❌ Exception: {str(e)}")

print("\n" + "="*50)
print("📊 KẾT LUẬN:")
print("- Nếu status 200 → API key OK, quota còn")
print("- Nếu status 503 → Hết quota, cần API key mới")
print("- Nếu status 401 → API key sai hoặc hết hạn")
print("- Nếu status 429 → Rate limit, chờ và thử lại")
