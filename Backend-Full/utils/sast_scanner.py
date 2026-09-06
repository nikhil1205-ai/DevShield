import os
import json
import re
from .gemini_client import call_gemini

IGNORE_DIRS = {"node_modules", ".git", "__pycache__", "tmp", "venv", ".venv"}
IGNORE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".zip", ".tar", ".gz", ".exe", ".pdf", ".lock"}

def walk_files(dir_path: str):
    file_list = []
    for root, dirs, files in os.walk(dir_path):
        # Prune ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for f in files:
            if f == "README.md":
                continue
            ext = os.path.splitext(f)[1].lower()
            if ext in IGNORE_EXTS:
                continue
            file_list.append(os.path.join(root, f))
    return file_list

def read_file_safe(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception:
        return ""

def clean_json_response(text: str) -> str:
    if not text:
        return ""
    # Strip markdown code fence block if present
    cleaned = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE)
    return cleaned.strip()

def explain_with_gemini(code: str, file_path: str):
    prompt = f"""
You are a professional static application security testing (SAST) engine.

File path:
{file_path}

Source code:
{code}

TASK:
1. Identify ALL security vulnerabilities in the code.
2. Each vulnerability MUST be a LOGICAL CODE SECTION (multi-line).
3. For EACH vulnerability, provide:
   - The vulnerable code section
   - A secure rewritten version of THAT SECTION
   - A short explanation of why the original section is dangerous

RULES:
- Do NOT explain safe code.
- Do NOT repeat the same vulnerability twice.
- Limit to maximum 5 vulnerabilities.
- Focus on real issues: SQL Injection, RCE, hardcoded secrets, auth flaws, insecure CORS, weak crypto.

RESPOND in STRICT JSON ONLY.
NO markdown.
NO extra text.

JSON FORMAT:
[
  {{
    "section": "<vulnerable code section>",
    "fix": "<secure rewritten section>",
    "why": "<why this section is risky>"
  }}
]
"""
    raw_res = call_gemini(prompt)
    if not raw_res:
        return []

    cleaned = clean_json_response(raw_res)
    if not cleaned:
        return []

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, list):
            valid_items = []
            for item in parsed:
                if (isinstance(item, dict) and 
                    "section" in item and 
                    "fix" in item and 
                    "why" in item):
                    valid_items.append(item)
            return valid_items
    except Exception as e:
        print(f"[!] SAST JSON parse failed for {file_path}: {e}")
    return []

def run_static_scan(scan_folder: str):
    files = walk_files(scan_folder)
    ans = {}

    for file_path in files:
        code = read_file_safe(file_path)
        if not code or not code.strip():
            continue

        # Slicing top 300 lines to protect tokens
        limited_code = "\n".join(code.split("\n")[:300])

        ai_sections = explain_with_gemini(limited_code, file_path)
        if not ai_sections:
            continue

        ans[file_path] = [
            [sec["section"], sec["fix"], sec["why"]]
            for sec in ai_sections
        ]

    return ans
