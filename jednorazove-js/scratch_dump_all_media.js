const https = require('https');
const fs = require('fs');

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
    for (let page = 1; page <= 5; page++) {
      console.log(`Fetching page ${page}...`);
      const url = `https://letokruh.eu/wp-json/wp/v2/media?per_page=100&page=${page}`;
      try {
        const items = await getJSON(url);
        if (Array.isArray(items) && items.length > 0) {
          allMedia = allMedia.concat(items);
        } else {
          break;
        }
      } catch (e) {
        break;
      }
    }
    console.log(`Total media fetched: ${allMedia.length}`);
    const mapped = allMedia.map(m => ({
      id: m.id,
      slug: m.slug,
      url: m.source_url
    }));
    fs.writeFileSync('all_media_list.json', JSON.stringify(mapped, null, 2));
    console.log('Saved to all_media_list.json');
  } catch (err) {
    console.error(err.message);
  }
}

run();
