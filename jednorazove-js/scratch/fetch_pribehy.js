const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function tryEndpoints() {
  const endpoints = [
    'https://letokruh.eu/wp-json/wp/v2/pribehy?per_page=100',
    'https://letokruh.eu/wp-json/wp/v2/pribeh?per_page=100',
    'https://letokruh.eu/wp-json/wp/v2/stories?per_page=100',
    'https://letokruh.eu/wp-json/wp/v2/posts?categories=1&per_page=100',
  ];
  for (const url of endpoints) {
    const { status, data } = await get(url);
    console.log('\n===', url, status, '===');
    try {
      const j = JSON.parse(data);
      if (Array.isArray(j)) {
        j.slice(0, 15).forEach((p) => {
          const s = JSON.stringify(p);
          const imgs = [...new Set(s.match(/https:\/\/letokruh\.eu\/wp-content\/[^\s"']+\.(png|jpg|webp|jpeg)/gi) || [])];
          console.log(p.slug || p.id, '|', (p.title?.rendered || p.title || '').replace(/<[^>]+>/g, ''), '|', imgs.join(', '));
        });
      } else {
        console.log(data.slice(0, 300));
      }
    } catch {
      console.log(data.slice(0, 300));
    }
  }
}

async function searchBundle() {
  const js = fs.readFileSync(require('path').join(process.env.TEMP, 'main_live.chunk.js'), 'utf8');
  const terms = ['CleanShot', 'janka', 'otto', 'ivan', 'nade', 'marta', 'zdena', 'jirka', 'irena', 'eva', 'jirina', 'misa', 'pribeh'];
  for (const t of terms) {
    let pos = 0;
    let n = 0;
    while ((pos = js.toLowerCase().indexOf(t.toLowerCase(), pos)) !== -1 && n < 2) {
      const snip = js.substring(Math.max(0, pos - 80), pos + 200);
      if (/static\/media|uploads|webp|jpg|png/i.test(snip)) {
        console.log('\nBUNDLE', t, ':', snip);
        n++;
      }
      pos += t.length;
    }
  }
}

tryEndpoints().then(() => searchBundle()).catch(console.error);
