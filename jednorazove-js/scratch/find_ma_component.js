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

  const idx = js.indexOf('element:o.a.createElement(ma,null)');
  console.log('ma route at', idx);
  console.log(js.substring(idx - 200, idx + 200));

  // Find ma=function definition - search backwards from route
  const maDef = js.indexOf(',ma=function');
  const maDef2 = js.indexOf('var ma=function');
  const maDef3 = js.indexOf(';ma=function');
  console.log('ma defs:', maDef, maDef2, maDef3);

  for (const d of [maDef, maDef2, maDef3]) {
    if (d >= 0) {
      console.log('\n=== ma=function at', d, '===');
      console.log(js.substring(d, d + 3000));
      break;
    }
  }

  // Also search Ma component (capital) for vzdelavani
  const maUpper = js.indexOf('Ma=function');
  if (maUpper >= 0) console.log('\nMa at', maUpper, js.substring(maUpper, maUpper + 500));
}

run().catch(console.error);
