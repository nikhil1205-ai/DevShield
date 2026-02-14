import requests
import sys
from urllib.parse import urlparse

# -----------------------------
# Header Analysis Function
# -----------------------------
def analyze_headers(headers):
    issues = []
    headers = {k.lower(): v for k, v in headers.items()}

    def add_issue(header, message, severity):
        issues.append({
            "header": header,
            "message": message,
            "severity": severity
        })

    # CSP
    if "content-security-policy" not in headers:
        add_issue("Content-Security-Policy",
                  "Missing Content-Security-Policy header", "High")
    else:
        csp = headers["content-security-policy"].lower()
        if "unsafe-inline" in csp:
            add_issue("Content-Security-Policy",
                      "CSP allows 'unsafe-inline'", "Medium")
        if "*" in csp:
            add_issue("Content-Security-Policy",
                      "CSP contains wildcard (*)", "Medium")

    # HSTS
    if "strict-transport-security" not in headers:
        add_issue("Strict-Transport-Security",
                  "Missing HSTS header", "High")

    # X-Frame-Options
    if "x-frame-options" not in headers:
        add_issue("X-Frame-Options",
                  "Missing X-Frame-Options header", "Medium")

    # X-Content-Type-Options
    if headers.get("x-content-type-options", "").lower() != "nosniff":
        add_issue("X-Content-Type-Options",
                  "Missing or misconfigured nosniff", "Medium")

    # Cookies
    if "set-cookie" in headers:
        cookie = headers["set-cookie"].lower()
        if "secure" not in cookie:
            add_issue("Set-Cookie",
                      "Cookie missing Secure flag", "High")
        if "httponly" not in cookie:
            add_issue("Set-Cookie",
                      "Cookie missing HttpOnly flag", "High")

    # CORS
    if headers.get("access-control-allow-origin") == "*":
        if headers.get("access-control-allow-credentials") == "true":
            add_issue("CORS",
                      "Wildcard origin with credentials enabled", "High")

    # Server disclosure
    if "server" in headers:
        add_issue("Server",
                  f"Server header exposed: {headers['server']}", "Low")

    return issues


# -----------------------------
# CLI Scanner
# -----------------------------
def scan(url):
    try:
        response = requests.get(url, timeout=10)
    except Exception as e:
        print(f"[!] Error connecting: {e}")
        sys.exit(1)

    print(f"\nScanning: {url}")
    print("-" * 50)

    issues = analyze_headers(response.headers)

    if not issues:
        print("No major header issues found ✅")
        sys.exit(0)

    severity_count = {"High": 0, "Medium": 0, "Low": 0}

    for issue in issues:
        severity_count[issue["severity"]] += 1

        print(f"[{issue['severity']}] {issue['header']}")
        print(f"  -> {issue['message']}\n")

    print("-" * 50)
    print("Summary:")
    print(f"High   : {severity_count['High']}")
    print(f"Medium : {severity_count['Medium']}")
    print(f"Low    : {severity_count['Low']}")

    # Exit with error code if high severity found (useful for CI)
    if severity_count["High"] > 0:
        sys.exit(2)
    else:
        sys.exit(0)


# -----------------------------
# Entry Point
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python header_scanner.py <url>")
        sys.exit(1)

    url = sys.argv[1]

    # Add https if missing
    if not urlparse(url).scheme:
        url = "https://" + url

    scan(url)
