import os
import json
from dotenv import load_dotenv

load_dotenv()

def call_gemini(prompt: str) -> str:
    """
    Call Gemini API using official Google GenAI Python SDK.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("YOUR_"):
        print("[!] Valid GEMINI_API_KEY not found in Backend-Full/.env")
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        # Try primary model
        try:
            response = client.models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
            )
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"[!] gemini-3-flash-preview failed, trying gemini-1.5-flash: {e}")
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
            )
            if response and response.text:
                return response.text

    except Exception as err:
        print(f"[!] Gemini API error: {err}")

    return None
