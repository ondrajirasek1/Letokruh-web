const https = require('https');

function getURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Fetching live dobrovolnictvi HTML...');
    const html = await getURL('https://letokruh.eu/dobrovolnictvi');
    
    // Find all css link tags
    const regex = /<link[^>]+href="([^">]+static\/css\/[^">]+)"/g;
    let match;
    const cssUrls = [];
    while ((match = regex.exec(html)) !== null) {
      cssUrls.push(match[1]);
    }
    console.log('CSS links found:', cssUrls);
    
    for (const cssUrl of cssUrls) {
      const fullUrl = cssUrl.startsWith('http') ? cssUrl : `https://letokruh.eu${cssUrl}`;
      console.log(`Fetching CSS: ${fullUrl}`);
      const css = await getURL(fullUrl);
      const urlRegex = /url\(([^)]+)\)/g;
      let urlMatch;
      console.log(`Found background images in ${fullUrl.split('/').pop()}:`);
      while ((urlMatch = urlRegex.exec(css)) !== null) {
        console.log(`  - ${urlMatch[1]}`);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

run();
