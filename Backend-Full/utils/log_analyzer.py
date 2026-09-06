import json
from .gemini_client import call_gemini
from .sast_scanner import clean_json_response

def gemini_log_analysis(logs: str):
    prompt = f"""
You are an expert cybersecurity analyst specializing in application and system log analysis.

Analyze the following logs and identify security issues, suspicious behavior, and potential vulnerabilities.

LOGS:
{logs}

Instructions:

1. Detect and report:
   - Brute force attacks (e.g., repeated login failures)
   - SQL injection attempts
   - Command injection patterns
   - Authentication or authorization issues
   - Sensitive data exposure (tokens, passwords, API keys)
   - Exceptions and stack trace leaks
   - Server errors (5xx)
   - Suspicious or anomalous patterns

2. For each issue, provide:
   - type (short name of issue)
   - severity (LOW, MEDIUM, HIGH, CRITICAL)
   - description (what is happening)
   - affected_log (exact log line or snippet)
   - reason (why this is a security concern)

3. Avoid false positives. Only report issues that are clearly supported by the logs.

4. If multiple similar issues occur, group them logically.

5. Keep explanations concise and technical.

6. Also provide a summary:
   - total_issues
   - high_severity_count
   - brief overall risk summary

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include any extra text or explanation
- Do NOT hallucinate data not present in logs

Output format:

{{
  "issues": [
    {{
      "type": "",
      "severity": "",
      "description": "",
      "affected_log": "",
      "reason": ""
    }}
  ],
  "summary": {{
    "total_issues": 0,
    "high_severity_count": 0,
    "risk_level": "LOW | MEDIUM | HIGH | CRITICAL",
    "message": ""
  }}
}}
"""
    raw_res = call_gemini(prompt)
    if not raw_res:
        return json.dumps({
            "issues": [],
            "summary": {
                "total_issues": 0,
                "high_severity_count": 0,
                "risk_level": "LOW",
                "message": "AI log analysis failed or key missing."
            }
        })

    cleaned = clean_json_response(raw_res)
    if not cleaned:
        return json.dumps({
            "issues": [],
            "summary": {
                "total_issues": 0,
                "high_severity_count": 0,
                "risk_level": "LOW",
                "message": "AI Analysis unavailable (empty response)."
            }
        })
    return cleaned
