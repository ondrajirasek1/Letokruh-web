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

  // Webpack runtime: find __webpack_require__ module map
  // Parse: modules are in format ,function(e,t,n){...} between push array
  const start = js.indexOf('.push([[0],[') + '.push([[0],['.length;
  let depth = 0;
  let moduleIndex = -1;
  let inString = false;
  let stringChar = '';
  let escape = false;
  let moduleStart = -1;
  const moduleExports = {};

  for (let i = start; i < js.length; i++) {
    const ch = js[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (ch === '\\') escape = true;
      else if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }

    if (ch === '[') {
      if (depth === 0) {
        moduleIndex++;
        moduleStart = i;
      }
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) {
        const body = js.substring(moduleStart, i + 1);
        const media = body.match(/static\/media\/([^"]+)/);
        if (media) moduleExports[moduleIndex] = media[1];
        if (moduleIndex >= 80) break;
      }
    }
  }

  console.log('Module 66:', moduleExports[66]);
  console.log('Module 72:', moduleExports[72]);
  console.log('\nAll media modules 60-75:');
  for (let m = 60; m <= 75; m++) {
    if (moduleExports[m]) console.log(m, moduleExports[m]);
  }
}

run().catch(console.error);
