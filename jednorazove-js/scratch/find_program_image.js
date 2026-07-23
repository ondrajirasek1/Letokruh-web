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

  const all = [];
  const re = /static\/media\/([a-zA-Z0-9_.-]+\.(webp|png|jpg))/g;
  let x;
  while ((x = re.exec(js))) all.push(x[1]);
  console.log('ALL MEDIA:\n' + [...new Set(all)].join('\n'));

  // Find Program component - search for route + img near Program title
  const idx = js.indexOf('program_section",id:"program"');
  if (idx < 0) {
    const idx2 = js.indexOf('program_section');
    console.log('\nprogram_section at', idx2);
    console.log(js.substring(idx2 - 500, idx2 + 1500));
  }

  // Search for hero on program - look for "Program" h1 near img
  const patterns = ['program_hero', 'ProgramHero', 'eventsHero', 'programImg', 'programPhoto', 'akce_img'];
  for (const p of patterns) {
    const i = js.indexOf(p);
    if (i >= 0) console.log('\nFound', p, js.substring(i - 100, i + 300));
  }

  // Find component with path /program - look in routes
  let pos = 0;
  while ((pos = js.indexOf('"/program"', pos)) !== -1) {
    console.log('\n/program route context:', js.substring(pos - 300, pos + 500));
    pos += 10;
  }

  // WP program page
  const pages = JSON.parse(await get('https://letokruh.eu/wp-json/wp/v2/pages?slug=program&_embed'));
  const p = pages[0];
  if (p) {
    console.log('\nWP page id:', p.id);
    if (p._embedded?.['wp:featuredmedia']?.[0]) {
      console.log('Featured:', p._embedded['wp:featuredmedia'][0].source_url);
    }
    const content = p.content?.rendered || '';
    const imgs = [...content.matchAll(/src="([^"]+\.(webp|jpg|png|jpeg)[^"]*)"/gi)].map((m) => m[1]);
    console.log('Content images:', imgs.slice(0, 5));
  }

  // Try program custom post or options
  for (const ep of [
    'https://letokruh.eu/wp-json/wp/v2/pages?slug=program',
    'https://letokruh.eu/wp-json/acf/v3/pages?slug=program',
  ]) {
    try {
      const data = JSON.parse(await get(ep));
      const item = Array.isArray(data) ? data[0] : data;
      const s = JSON.stringify(item);
      const imgs = [...new Set(s.match(/https:\/\/letokruh\.eu\/wp-content\/[^\s"']+\.(png|jpg|webp|jpeg)/gi) || [])];
      if (imgs.length) {
        console.log('\n', ep, 'images:');
        imgs.forEach((u) => console.log(u));
      }
    } catch (e) {}
  }
}

run().catch(console.error);
