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

function getModule(source, targetId) {
  const pushStart = source.indexOf('.push([[0],');
  let pos = source.indexOf('[', pushStart + 10);
  pos = source.indexOf('[', pos + 1);
  let depth = 0;
  let moduleIndex = -1;
  let inString = false;
  let stringChar = '';
  let escape = false;

  for (let i = pos; i < source.length; i++) {
    const ch = source[i];
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
        if (moduleIndex === targetId) {
          const end = findBracket(source, i);
          return source.substring(i, end + 1);
        }
      }
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0 && moduleIndex >= targetId) return null;
    }
  }
  return null;
}

function findBracket(s, start) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escape = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (ch === '\\') escape = true;
      else if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

async function run() {
  const js = await get('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
  for (const id of [72, 71, 70, 69, 68]) {
    const mod = getModule(js, id);
    if (mod) {
      const media = mod.match(/static\/media\/[^"]+/);
      console.log('Module', id, ':', media ? media[0] : mod.substring(0, 300));
    }
  }
  // Also search vzdelavani
  const v = js.indexOf('vzdelavani');
  console.log('\nvzdelavani:', js.substring(v - 80, v + 120));
}

run().catch(console.error);
