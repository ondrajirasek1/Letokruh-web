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

  // ma uses pe, Te, Xe - find their definitions
  for (const name of ['pe=function', 'Te=function', 'Xe=function', 'ra=function', 'ia=function']) {
    const idx = js.indexOf('var ' + name);
    const idx2 = js.indexOf(',' + name);
    const d = idx >= 0 ? idx : idx2;
    if (d >= 0) {
      console.log('\n==========', name, 'at', d, '==========');
      console.log(js.substring(d, d + 2500));
    } else {
      console.log('NOT FOUND:', name);
    }
  }
}

run().catch(console.error);
