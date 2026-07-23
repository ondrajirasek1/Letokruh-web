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
        console.log('Fetching ACF pages...');
        const pages = await getJSON('https://letokruh.eu/wp-json/acf/v3/pages');
        console.log(`Fetched ${pages.length} ACF pages:`);
        pages.forEach(p => {
            console.log(`ID: ${p.id}`);
            if (p.acf) {
                console.log('ACF keys:', Object.keys(p.acf));
                console.log('ACF volunteering:', p.acf.volunteering ? 'yes' : 'no');
                console.log('ACF whoIsHelping:', p.acf.whoIsHelping ? 'yes' : 'no');
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
