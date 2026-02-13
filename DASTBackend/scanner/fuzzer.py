import requests

payloads = [
    "<script>alert(1)</script>",
    "' OR 1=1 --"
]

def fuzz_endpoint(url):

    results = []

    for payload in payloads:
        try:
            test_url = f"{url}?input={payload}"
            response = requests.get(test_url, timeout=5)

            if payload in response.text:
                results.append({
                    "type": "Possible XSS",
                    "payload": payload
                })

        except:
            continue

    return results
