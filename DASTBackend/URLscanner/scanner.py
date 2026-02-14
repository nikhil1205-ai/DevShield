import requests
from .crawler import crawl
from .header_analyzer import analyze_headers
from .leak_detector import detect_leaks
from .fuzzer import fuzz_endpoint
import time

def run_scan(url):

    results = {
        "meta": {},
        "headerIssues": [],
        "leaks": [],
        "crawledUrls": [],
        "fuzzResults": [],
        "riskScore": 100
    }

    session = requests.Session()

    try:
        start = time.time()
        response = session.get(url, timeout=5)
        end = time.time()
    except:
        return results

    # Metadata
    results["meta"] = {
        "statusCode": response.status_code,
        "responseTime": round(end - start, 3),
        "finalUrl": response.url
    }

    # Analyze main page
    results["headerIssues"] = analyze_headers(response.headers)
    results["leaks"] = detect_leaks(response.text)

    # Crawl
    crawled = crawl(url)
    results["crawledUrls"] = crawled

    # Scan crawled pages
    for page in crawled:
        try:
            r = session.get(page, timeout=5)
            results["headerIssues"] += analyze_headers(r.headers)
            results["leaks"] += detect_leaks(r.text)
        except:
            pass

    # Fuzz
    results["fuzzResults"] = fuzz_endpoint(url)

    # Risk scoring
    results["riskScore"] -= len(results["headerIssues"]) * 5
    results["riskScore"] -= len(results["leaks"]) * 10
    results["riskScore"] -= len(results["fuzzResults"]) * 15
    results["riskScore"] = max(results["riskScore"], 0)

    return results
