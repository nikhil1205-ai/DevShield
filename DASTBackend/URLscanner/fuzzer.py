import requests
import urllib.parse
import time
import re


# -----------------------------
# Payloads
# -----------------------------
XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    "\"><script>alert(1)</script>",
    "<img src=x onerror=alert(1)>"
]

SQL_PAYLOADS = [
    "' OR 1=1 --",
    "' OR 'a'='a",
    "'; WAITFOR DELAY '0:0:3'--"
]

SQL_ERROR_PATTERNS = [
    "sql syntax",
    "mysql",
    "syntax error",
    "unclosed quotation",
    "odbc",
    "pdo",
    "database error"
]


# -----------------------------
# Utility: Check SQL Error
# -----------------------------
def detect_sql_error(response_text):
    for pattern in SQL_ERROR_PATTERNS:
        if pattern.lower() in response_text.lower():
            return True
    return False


# -----------------------------
# Main Fuzzer
# -----------------------------
def fuzz_endpoint(url, param="input", timeout=5):

    session = requests.Session()
    results = []

    all_payloads = XSS_PAYLOADS + SQL_PAYLOADS

    for payload in all_payloads:

        encoded_payload = urllib.parse.quote(payload)
        test_url = f"{url}?{param}={encoded_payload}"

        try:
            start_time = time.time()
            response = session.get(test_url, timeout=timeout)
            elapsed_time = time.time() - start_time

            # -------------------------
            # Reflection Check (XSS)
            # -------------------------
            if payload.lower() in response.text.lower():
                results.append({
                    "type": "Reflected XSS (Possible)",
                    "payload": payload,
                    "severity": "High",
                    "url": test_url
                })

            # -------------------------
            # SQL Error-Based Detection
            # -------------------------
            if detect_sql_error(response.text):
                results.append({
                    "type": "SQL Injection (Error-Based)",
                    "payload": payload,
                    "severity": "High",
                    "url": test_url
                })

            # -------------------------
            # Time-Based SQL Detection
            # -------------------------
            if "WAITFOR" in payload and elapsed_time > 3:
                results.append({
                    "type": "SQL Injection (Time-Based)",
                    "payload": payload,
                    "severity": "Critical",
                    "url": test_url
                })

        except requests.RequestException as e:
            results.append({
                "type": "Request Error",
                "payload": payload,
                "severity": "Low",
                "error": str(e)
            })

    return results

