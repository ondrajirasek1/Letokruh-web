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
    console.log('Fetching media pages...');
    let allMedia = [];
    for (let page = 1; page <= 5; page++) {
      console.log(`Media page ${page}...`);
      const items = await getJSON(`https://letokruh.eu/wp-json/wp/v2/media?per_page=100&page=${page}`);
      if (Array.isArray(items) && items.length > 0) {
        allMedia = allMedia.concat(items);
      } else {
        break;
      }
    }
    console.log(`Found ${allMedia.length} media items.`);

    // Map parent to media list
    const parentMap = {};
    allMedia.forEach(m => {
      if (m.parent) {
        if (!parentMap[m.parent]) {
          parentMap[m.parent] = [];
        }
        parentMap[m.parent].push(m.source_url);
      }
    });

    console.log('\nParent mappings for some post IDs:');
    Object.keys(parentMap).slice(0, 15).forEach(parentId => {
      console.log(`Post ID ${parentId} has media:`, parentMap[parentId]);
    });

    // Let's check some post IDs from full_aktuality
    const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'scratch_full_aktuality.json'), 'utf8'));
    console.log('\nChecking first 10 posts against matched media parent:');
    
    // Fetch original raw posts to get their IDs!
    const rawPosts = await getJSON('https://letokruh.eu/wp-json/wp/v2/aktuality?per_page=10');
    rawPosts.forEach(rp => {
      console.log(`Post ID: ${rp.id}, Title: ${rp.title.rendered}`);
      if (parentMap[rp.id]) {
        console.log(`   -> Found media:`, parentMap[rp.id]);
      } else {
        console.log(`   -> No media matched via parent.`);
      }
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
