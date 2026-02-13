import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def crawl(url):

    found_urls = []

    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        for link in soup.find_all("a", href=True):
            full_url = urljoin(url, link["href"])
            found_urls.append(full_url)

        return list(set(found_urls))[:10]

    except:
        return []
