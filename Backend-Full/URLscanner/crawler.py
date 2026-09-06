import requests
import re
import time
from bs4 import BeautifulSoup, Comment
from urllib.parse import urljoin, urlparse
from collections import deque


# -----------------------------
# Utility: Check Same Domain
# -----------------------------
def is_same_domain(base_url, target_url):
    return urlparse(base_url).netloc == urlparse(target_url).netloc


# -----------------------------
# Utility: Valid URL Check
# -----------------------------
def is_valid_url(url):
    parsed = urlparse(url)
    return parsed.scheme in ("http", "https")


# -----------------------------
# Detect Risky URL
# -----------------------------
def is_risky_url(url):

    risky_keywords = [
        "admin", "login", "auth", "config", "backup",
        "debug", "internal", "staging", "dev",
        "reset", "password", "api", "dashboard",
        "db", "private"
    ]

    risky_extensions = [
        ".php", ".asp", ".aspx", ".jsp",
        ".env", ".json", ".xml", ".sql",
        ".bak", ".zip", ".tar", ".gz"
    ]

    parsed = urlparse(url)

    # 1️⃣ Query parameters -> injection surface
    if parsed.query:
        return True

    # 2️⃣ Sensitive keywords
    for keyword in risky_keywords:
        if keyword in parsed.path.lower():
            return True

    # 3️⃣ Risky file extensions
    for ext in risky_extensions:
        if parsed.path.lower().endswith(ext):
            return True

    return False


# -----------------------------
# Extract JS API Endpoints
# -----------------------------
def extract_api_endpoints(text):
    return re.findall(r"/api/[A-Za-z0-9_/.-]+", text)


# -----------------------------
# Extract HTML Comments
# -----------------------------
def extract_comments(soup):
    return soup.find_all(string=lambda text: isinstance(text, Comment))


# -----------------------------
# Main Crawl Function
# -----------------------------
def crawl(base_url, max_depth=2, max_pages=50, delay=0.3):

    session = requests.Session()
    session.headers.update({
        "User-Agent": "DevShield-Scanner/1.0"
    })

    visited = set()
    queue = deque([(base_url, 0)])

    risky_links = set()
    discovered_apis = set()
    discovered_forms = set()

    while queue and len(visited) < max_pages:

        current_url, depth = queue.popleft()

        if current_url in visited or depth > max_depth:
            continue

        visited.add(current_url)

        try:
            response = session.get(current_url, timeout=5)

            content_type = response.headers.get("Content-Type", "")
            if "text/html" not in content_type:
                continue

            soup = BeautifulSoup(response.text, "html.parser")

            # -------------------------
            # Extract Links
            # -------------------------
            for tag in soup.find_all(["a", "script", "link", "form"]):
                href = tag.get("href") or tag.get("src") or tag.get("action")
                if not href:
                    continue

                full_url = urljoin(current_url, href)

                if is_valid_url(full_url) and is_same_domain(base_url, full_url):

                    # Add to crawl queue
                    queue.append((full_url, depth + 1))

                    # Add only risky URLs to result
                    if is_risky_url(full_url):
                        risky_links.add(full_url)

            # -------------------------
            # Extract API Endpoints
            # -------------------------
            apis = extract_api_endpoints(response.text)
            for api in apis:
                full_api = urljoin(current_url, api)
                if is_same_domain(base_url, full_api):
                    discovered_apis.add(full_api)

            # -------------------------
            # Extract Forms
            # -------------------------
            for form in soup.find_all("form"):
                action = form.get("action")
                if action:
                    full_form_url = urljoin(current_url, action)
                    discovered_forms.add(full_form_url)

            # -------------------------
            # Extract Suspicious Comments
            # -------------------------
            comments = extract_comments(soup)
            for comment in comments:
                if any(keyword in comment.lower() for keyword in ["api", "key", "token", "debug"]):
                    print(f"[!] Suspicious comment found: {comment.strip()}")

            time.sleep(delay)

        except requests.RequestException as e:
            print(f"[!] Error: {current_url} -> {e}")

    return {
        "risky_links": list(risky_links),
        "apis": list(discovered_apis),
        "forms": list(discovered_forms)
    }
