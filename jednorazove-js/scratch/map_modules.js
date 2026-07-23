const fs = require('fs');
const path = require('path');
const js = fs.readFileSync(path.join(process.env.TEMP, 'main.chunk.js'), 'utf8');

// De component: Pe=a(59) for orgs, Oe=a(60) for spolecnik
// Find all static/media exports with index
const re = /function\(e,t,a\)\{e\.exports=a\.p\+"static\/media\/([^"]+)"\}/g;
const media = [];
let m;
while ((m = re.exec(js)) !== null) {
  media.push({ pos: m.index, file: m[1] });
}

// Webpack module array - find module id by searching a(N) assignments near exports
// Simpler: find Se=a(59) context
const deIdx = js.indexOf('De=function');
const before = js.substring(deIdx - 300, deIdx);
console.log('Imports before De (where we help):');
console.log(before);

// Find module 59 and 60 definitions - search backwards from organizations export
for (const id of [59, 60, 61, 62]) {
  const pat = `,${id},function(e,t,a){`;
  let idx = js.indexOf(pat);
  if (idx === -1) {
    // alternate webpack format
    idx = js.indexOf(`[${id},function(e,t,a){`);
  }
  if (idx !== -1) {
    const chunk = js.substring(idx, idx + 400);
    const mediaMatch = chunk.match(/static\/media\/([^"]+)/);
    console.log(`\nModule ${id}:`, mediaMatch ? mediaMatch[1] : chunk.substring(0, 200));
  } else {
    console.log(`\nModule ${id}: not found with standard pattern`);
  }
}

// List all media files containing org, spolec, volunteer, junior, wwh
console.log('\n--- Relevant media files ---');
media.forEach((x, i) => {
  const f = x.file.toLowerCase();
  if (/org|spolec|volunt|junior|wwh|where|help|senior|dobro/.test(f)) {
    console.log(i, x.file);
  }
});
