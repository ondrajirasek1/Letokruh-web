const https = require('https');
const fs = require('fs');
const path = require('path');

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
    console.log('Fetching all pages of embedded aktuality...');
    let allItems = [];
    for (let page = 1; page <= 3; page++) {
      const url = `https://letokruh.eu/wp-json/wp/v2/aktuality?per_page=100&page=${page}&_embed`;
      console.log(`Fetching page ${page}...`);
      const items = await getJSON(url);
      if (Array.isArray(items) && items.length > 0) {
        allItems = allItems.concat(items);
      } else {
        break;
      }
    }
    console.log(`Found ${allItems.length} total aktuality CPT posts.`);

    const result = [];
    allItems.forEach(item => {
      let imageUrl = '';
      // Try to extract from embedded featured media
      if (item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]) {
        imageUrl = item._embedded['wp:featuredmedia'][0].source_url || '';
      }
      
      const formattedDate = new Date(item.date).toLocaleDateString('cs-CZ');

      result.push({
        id: item.id,
        title: item.title.rendered,
        date: formattedDate,
        image: imageUrl,
        content: item.content ? item.content.rendered : '',
        slug: item.slug
      });
    });

    const outputPath = path.join(__dirname, 'scratch_full_aktuality.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Successfully saved ${result.length} items to ${outputPath}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
