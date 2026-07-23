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
        console.log('Fetching media search...');
        let allMedia = [];
        for (let page = 1; page <= 5; page++) {
            console.log(`Page ${page}...`);
            let items = await getJSON(`https://letokruh.eu/wp-json/wp/v2/media?per_page=100&page=${page}`);
            allMedia = allMedia.concat(items);
            if (items.length < 100) break;
        }
        console.log(`Fetched ${allMedia.length} media items.`);
        
        console.log('\nSearching for organizations and spolecnik seniora assets:');
        allMedia.forEach(m => {
            const s = m.slug.toLowerCase();
            if (s.includes('spolecn') || s.includes('organiz') || s.includes('volunt') || s.includes('junior')) {
                console.log(`Slug: ${m.slug} | URL: ${m.source_url}`);
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
