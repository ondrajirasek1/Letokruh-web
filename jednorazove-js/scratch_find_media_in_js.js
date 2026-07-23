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
  const urls = [
    'https://letokruh.eu/wp-content/themes/letokruh/static/js/bundle.js?dcd0fb90448cd609a44f',
    'https://letokruh.eu/wp-content/themes/letokruh/static/js/2.chunk.js?dcd0fb90448cd609a44f',
    'https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f'
  ];

  for (const url of urls) {
    console.log(`Checking ${url.split('/').pop().split('?')[0]}...`);
    try {
      const content = await getURL(url);
      
      // Let's search for image names
      const regex = /["'`][^"'`]*\.(png|jpg|jpeg|webp)[^"'`]*["'`]/gi;
      const matches = content.match(regex) || [];
      console.log(`Found ${matches.length} matches.`);
      
      const unique = [...new Set(matches)].map(m => m.replace(/["'`]/g, ''));
      console.log('Unique matches:');
      unique.forEach(u => {
        if (u.includes('spolecnik') || u.includes('organ') || u.includes('wwh') || u.includes('static/media')) {
          console.log(`  - ${u}`);
        }
      });
    } catch (e) {
      console.error(e.message);
    }
  }
}

run();
