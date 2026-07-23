const https = require('https');
const fs = require('fs');

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
  const terms = ['program', 'Program', 'programHero', 'program_hero', 'events', 'akce'];
  for (const t of terms) {
    let pos = 0;
    let n = 0;
    while ((pos = js.indexOf(t, pos)) !== -1 && n < 3) {
      const snip = js.substring(Math.max(0, pos - 100), pos + 300);
      if (/static\/media|uploads|\.webp|\.jpg|\.png/i.test(snip)) {
        console.log('\n===', t, '===');
        console.log(snip);
        n++;
      }
      pos += t.length;
    }
  }

  // Search program route component
  const idx = js.indexOf('"/program"');
  if (idx > 0) console.log('\n/program context:', js.substring(idx - 200, idx + 800));

  const pages = JSON.parse(await get('https://letokruh.eu/wp-json/wp/v2/pages?slug=program&_embed'));
  if (pages[0]) {
    const p = pages[0];
    console.log('\nWP page:', p.title?.rendered);
    if (p._embedded?.['wp:featuredmedia']?.[0]) {
      console.log('Featured:', p._embedded['wp:featuredmedia'][0].source_url);
    }
    const s = JSON.stringify(p);
    const imgs = [...new Set(s.match(/https:\/\/letokruh\.eu\/wp-content\/[^\s"']+\.(png|jpg|webp|jpeg)/gi) || [])];
    imgs.slice(0, 10).forEach((u) => console.log('img:', u));
  }

  // ACF options
  try {
    const acf = JSON.parse(await get('https://letokruh.eu/wp-json/acf/v3/pages?slug=program'));
    console.log('\nACF keys:', Object.keys(acf[0]?.acf || acf || {}));
    const s = JSON.stringify(acf);
    const imgs = [...new Set(s.match(/https:\/\/letokruh\.eu\/wp-content\/[^\s"']+\.(png|jpg|webp|jpeg)/gi) || [])];
    imgs.forEach((u) => console.log('acf img:', u));
  } catch (e) {
    console.log('acf err', e.message);
  }
}

run().catch(console.error);
