from mitmproxy import http
import requests
import re
from datetime import datetime

FASTAPI_URL = "http://localhost:5000/PYdast/proxy-result"

def send_result(data):
    try:
        requests.post(FASTAPI_URL, json=data)
    except Exception as e:
        print("Error sending to FastAPI:", e)

def request(flow: http.HTTPFlow):
    data = {
        "type": "request",
        "method": flow.request.method,
        "url": flow.request.pretty_url,
        "headers": dict(flow.request.headers),
        "timestamp": str(datetime.now())
    }
    send_result(data)

def response(flow: http.HTTPFlow):
    body = flow.response.get_text()

    findings = []

    # Header check
    headers = dict(flow.response.headers)

    if "Content-Security-Policy" not in headers:
        findings.append("Missing CSP")

    # JWT detection
    jwt = re.findall(r"eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+", body)
    if jwt:
        findings.append("JWT Token Found")

    # AWS key detection
    aws = re.findall(r"AKIA[0-9A-Z]{16}", body)
    if aws:
        findings.append("AWS Key Exposure")

    result = {
        "type": "response",
        "url": flow.request.pretty_url,
        "status_code": flow.response.status_code,
        "findings": findings,
        "timestamp": str(datetime.now())
    }

    send_result(result)
