from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# Set the starting URL
base_url = "http://127.0.0.1:1234"  # Ensure you're using http:// or https://

# Initialize a set to store visited URLs
visited_urls = set()


# Define a function to crawl a URL and check for dead links
def crawl(url):
    # Add the URL to the visited set
    visited_urls.add(url)

    try:
        # Send a GET request to the URL with a timeout
        response = requests.get(url, timeout=5)
    except requests.RequestException as e:
        print(f"Request failed: {e} - {url}")
        return

    # Check if the response was successful
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {url}")
        return

    # Parse the HTML content of the response
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all links on the page
    links = soup.find_all("a")

    # Crawl each link
    for link in links:
        href = link.get("href")
        if href is not None:
            # Join the link URL with the base URL to handle relative links
            full_url = urljoin(url, href)
            # Parse the full URL to check if it's in the same domain
            parsed_url = urlparse(full_url)
            if parsed_url.netloc == urlparse(base_url).netloc:
                # Check if the URL has already been visited
                if full_url not in visited_urls:
                    crawl(full_url)


# Start crawling from the base URL
crawl(base_url)

# Print the number of visited URLs
print(f"Visited {len(visited_urls)} URLs")
