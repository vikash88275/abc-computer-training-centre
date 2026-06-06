import urllib.request
import re
import sys
import json

def get_images():
    query = "ABC Computer Training Centre Dabra Gwalior"
    url = f"https://www.google.com/search?q={urllib.parse.quote(query)}&tbm=isch"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            # Find all googleusercontent.com URLs or standard image URLs in the search page
            images = re.findall(r'https://[a-zA-Z0-9.-]+\.googleusercontent\.com/[a-zA-Z0-9_/=-]+', html)
            images += re.findall(r'https://[a-zA-Z0-9.-]+\.ggpht\.com/[a-zA-Z0-9_/=-]+', html)
            images += re.findall(r'https://content\.jdmagicbox\.com/[a-zA-Z0-9_/=-]+\.jpg', html)
            
            # Remove duplicates while preserving order
            seen = set()
            unique_images = []
            for img in images:
                if img not in seen:
                    seen.add(img)
                    unique_images.append(img)
                    
            print(json.dumps(unique_images, indent=2))
            
    except Exception as e:
        print(f"Error fetching images: {e}", file=sys.stderr)

if __name__ == "__main__":
    get_images()
