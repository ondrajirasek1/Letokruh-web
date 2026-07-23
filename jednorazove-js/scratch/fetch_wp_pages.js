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
        console.log('Fetching pages from WordPress API...');
        const pages = await getJSON('https://letokruh.eu/wp-json/wp/v2/pages?per_page=100');
        console.log(`Fetched ${pages.length} pages:`);
        pages.forEach(p => {
            console.log(`ID: ${p.id} | Slug: ${p.slug} | Title: ${p.title.rendered}`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
