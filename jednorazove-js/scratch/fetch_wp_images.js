const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        get(res.headers.location).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const js = await get('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
  
  // Map module id -> find function body containing static/media
  const mod59 = findModuleExport(js, 59);
  const mod60 = findModuleExport(js, 60);
  const mod61 = findModuleExport(js, 61);
  const mod62 = findModuleExport(js, 62);
  console.log('Module 59 (Pe - orgs?):', mod59);
  console.log('Module 60 (Oe - spolecnik?):', mod60);
  console.log('Module 61 (Re - senior vol?):', mod61);
  console.log('Module 62 (Me - junior?):', mod62);
}

function findModuleExport(source, targetId) {
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
          const end = findMatchingBracket(source, i);
          const body = source.substring(i, end + 1);
          const m = body.match(/static\/media\/([^"]+)/);
          return m ? m[1] : body.slice(0, 200);
        }
      }
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0 && moduleIndex >= targetId) break;
    }
  }
  return 'NOT FOUND';
}

function findMatchingBracket(s, start) {
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

run().catch(console.error);
