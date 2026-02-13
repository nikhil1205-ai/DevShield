def analyze_headers(headers):

    issues = []

    if "Content-Security-Policy" not in headers:
        issues.append("Missing Content-Security-Policy")

    if "Strict-Transport-Security" not in headers:
        issues.append("Missing HSTS")

    if "X-Frame-Options" not in headers:
        issues.append("Missing X-Frame-Options")

    return issues
