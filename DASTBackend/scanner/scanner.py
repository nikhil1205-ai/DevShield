import requests
from .crawler import crawl
from .header_analyzer import analyze_headers
from .leak_detector import detect_leaks
from .fuzzer import fuzz_endpoint

def run_scan(url):

    results = {
        "headerIssues": [],
        "leaks": [],
        "crawledUrls": [],
        "fuzzResults": []
    }

    try:
        response = requests.get(url, timeout=5)
    except:
        return results

    results["headerIssues"] = analyze_headers(response.headers)
    results["leaks"] = detect_leaks(response.text)
    results["crawledUrls"] = crawl(url)
    results["fuzzResults"] = fuzz_endpoint(url)

    return results
