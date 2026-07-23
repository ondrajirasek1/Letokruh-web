const https = require('https');

function getHTML(url) {
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
    console.log('Fetching live dobrovolnictvi page HTML in real-time...');
    const html = await getHTML('https://letokruh.eu/dobrovolnictvi');
    
    // Find all script tags containing static/js
    const regex = /<script[^>]+src="([^">]+static\/js\/[^">]+)"/g;
    let match;
    console.log('Script tags found:');
    while ((match = regex.exec(html)) !== null) {
      console.log(`- ${match[1]}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

run();
