const https = require('https');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    let allMedia = [];
    console.log('Fetching media page 1...');
    let page1 = await getJSON('https://letokruh.eu/wp-json/wp/v2/media?per_page=100');
    allMedia = allMedia.concat(page1);
    console.log('Fetching media page 2...');
    let page2 = await getJSON('https://letokruh.eu/wp-json/wp/v2/media?per_page=100&page=2');
    allMedia = allMedia.concat(page2);
    console.log(`Fetched ${allMedia.length} media items.`);

    // Search for keywords or relevant URLs
    const keywords = ['mics', 'balon', 'spolecnik', 'organizace', 'vyloha', 'okno', 'senior', 'dobrovol'];
    allMedia.forEach(m => {
      const match = keywords.some(k => m.slug.toLowerCase().includes(k) || (m.title && m.title.rendered.toLowerCase().includes(k)));
      if (match) {
        console.log(`[MATCH] ID: ${m.id} | Slug: ${m.slug} | URL: ${m.source_url}`);
      }
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
