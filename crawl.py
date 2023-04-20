import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin

# Set the starting URL
base_url = "127.0.0.1:1234"

# Initialize a set to store visited URLs
visited_urls = set()

# Define a function to crawl a URL and check for dead links
def crawl(url):
    # Add the URL to the visited set
    visited_urls.add(url)

    # Send a GET request to the URL
    response = requests.get(url)

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