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
        console.log('Fetching options...');
        const options = await getJSON('https://letokruh.eu/wp-json/acf/v3/options/options');
        console.log('Options ACF fields:', Object.keys(options.acf || {}));
        
        // Let's print the volunteering section options
        if (options.acf && options.acf.volunteering) {
            console.log('Volunteering options:', JSON.stringify(options.acf.volunteering, null, 2));
        } else {
            console.log('No volunteering options found.');
        }
        
        if (options.acf && options.acf.whoIsHelping) {
            console.log('WhoIsHelping options:', JSON.stringify(options.acf.whoIsHelping, null, 2));
        } else {
            console.log('No whoIsHelping options found.');
        }
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
