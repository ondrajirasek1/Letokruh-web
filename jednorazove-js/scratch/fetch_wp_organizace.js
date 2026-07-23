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
        console.log('Fetching organizace...');
        const orgs = await getJSON('https://letokruh.eu/wp-json/wp/v2/organizace?per_page=100');
        console.log(`Fetched ${orgs.length} organizace:`);
        orgs.forEach(o => {
            console.log(`Title: ${o.title.rendered}`);
            if (o.acf) {
                console.log('ACF keys:', Object.keys(o.acf));
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
