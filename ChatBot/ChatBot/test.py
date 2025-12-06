import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")  # nhớ sửa cho đúng tên key trong .env
MODEL = "gemini-2.0-flash"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

def chat_with_gemini(messages):
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {"parts": [{"text": msg} for msg in messages]}
        ]
    }
    response = requests.post(URL, headers=headers, json=data)
    response.raise_for_status()
    return response.json()

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print("Chatbot CLI. Gõ 'exit' để thoát.")
    while True:
        user_input = input("\nBạn: ")
        if user_input.lower() == "exit":
            break
        try:
            result = chat_with_gemini([user_input])
            reply = result['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            reply = f"[ERROR] {e}"
        print("Bot:", reply)
