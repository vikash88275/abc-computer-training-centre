const https = require('https');

function getImages() {
  const query = "ABC Computer Training Centre Dabra Gwalior";
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };

  https.get(url, options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const urls = [];
      
      // Match googleusercontent.com or ggpht.com or jdmagicbox image URLs
      const regex1 = /https:\/\/[a-zA-Z0-9.-]+\.googleusercontent\.com\/[a-zA-Z0-9_/=-]+/g;
      const regex2 = /https:\/\/[a-zA-Z0-9.-]+\.ggpht\.com\/[a-zA-Z0-9_/=-]+/g;
      const regex3 = /https:\/\/content\.jdmagicbox\.com\/[a-zA-Z0-9_/=-]+\.jpg/g;
      const regex4 = /https:\/\/[a-zA-Z0-9.-]+\.gstatic\.com\/images\?q=tbn:[a-zA-Z0-9_/=-]+/g;
      
      let match;
      while ((match = regex1.exec(data)) !== null) {
        urls.push(match[0]);
      }
      while ((match = regex2.exec(data)) !== null) {
        urls.push(match[0]);
      }
      while ((match = regex3.exec(data)) !== null) {
        urls.push(match[0]);
      }
      while ((match = regex4.exec(data)) !== null) {
        urls.push(match[0]);
      }
      
      const uniqueUrls = [...new Set(urls)];
      console.log(JSON.stringify(uniqueUrls, null, 2));
    });
    
  }).on('error', (err) => {
    console.error('Error fetching search page:', err.message);
  });
}

getImages();

