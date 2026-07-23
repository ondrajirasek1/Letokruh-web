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
    const endpoints = [
        'https://letokruh.eu/wp-json/acf/v3/options/volunteering',
        'https://letokruh.eu/wp-json/acf/v3/options/whoIsHelping',
        'https://letokruh.eu/wp-json/acf/v3/options/homePage',
        'https://letokruh.eu/wp-json/acf/v3/options/footer'
    ];
    
    for (const ep of endpoints) {
        console.log(`\nFetching ${ep}...`);
        try {
            const data = await getJSON(ep);
            console.log('Keys:', Object.keys(data));
            console.log('Snippet:', JSON.stringify(data).substring(0, 1000));
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

run();
