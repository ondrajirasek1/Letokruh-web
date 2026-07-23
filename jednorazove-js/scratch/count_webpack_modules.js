const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const js = await get('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
  const pushStart = js.indexOf('.push([[0],');
  const arrStart = js.indexOf('[', pushStart + 12);

  // Split modules by },function(e,t or },function(e,n,t
  const chunk = js.substring(arrStart);
  const parts = chunk.split(/},function\(e,[a-z],/);
  console.log('Total module-like parts:', parts.length);

  for (let i = 0; i < parts.length; i++) {
    const media = parts[i].match(/static\/media\/([^"]+)/);
    if (media && (i >= 65 && i <= 80)) {
      console.log('Module', i, ':', media[1]);
    }
  }

  // Module 72 specifically
  if (parts[72]) {
    console.log('\nModule 72 full (first 500):', parts[72].substring(0, 500));
    const allMedia = [...parts[72].matchAll(/static\/media\/([^"]+)/g)];
    console.log('Module 72 media:', allMedia.map((m) => m[1]));
  }
}

run().catch(console.error);
