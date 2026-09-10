import os
import time
from dotenv import load_dotenv

load_dotenv()

CANDIDATE_MODELS = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-3.1-flash-lite",
    "gemini-3.0-flash",
    "gemini-1.5-flash",
]

def call_gemini(prompt: str) -> str:
    """
    Call Gemini API using Google GenAI SDK via Chat session (recommended by Google to avoid AFC warnings).
    Includes automatic model fallbacks and local rule engine backup.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("YOUR_"):
        print("[!] GEMINI_API_KEY not found in Backend-Full/.env")
        return None

    if not api_key.startswith("AIzaSy"):
        print("[!] Notice: GEMINI_API_KEY in Backend-Full/.env does not start with 'AIzaSy'. Please generate a free key at https://aistudio.google.com/app/apikey")

    # 1. Try official google.genai SDK using Chat.send_message (Google recommended approach)
    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    chat = client.chats.create(model=model_name)
                    response = chat.send_message(prompt)
                    if response and response.text:
                        return response.text
                except Exception as e:
                    err_msg = str(e)
                    if "503" in err_msg or "UNAVAILABLE" in err_msg:
                        print(f"[!] Model '{model_name}' high demand (attempt {attempt + 1}). Retrying...")
                        time.sleep(1.5)
                        continue
                    elif "404" in err_msg or "NOT_FOUND" in err_msg or "API_KEY_INVALID" in err_msg:
                        print(f"[!] Model '{model_name}' returned NOT_FOUND (verify key in Backend-Full/.env)")
                        break
                    else:
                        print(f"[!] Gemini error on '{model_name}': {err_msg}")
                        break
    except Exception as err:
        print(f"[!] GenAI client error: {err}")

    # 2. Fallback to legacy google.generativeai if available
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        for model_name in ["gemini-1.5-flash", "gemini-1.5-pro"]:
            try:
                model = legacy_genai.GenerativeModel(model_name)
                res = model.generate_content(prompt)
                if res and res.text:
                    return res.text
            except Exception:
                continue
    except Exception:
        pass

    print("[!] Local static rule scanner activated for analysis.")
    return None
