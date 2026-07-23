const https = require('https');

function getURL(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('Downloading React main bundle...');
        const js = await getURL('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
        
        let pos = js.indexOf('var Kt=');
        if (pos !== -1) {
            let snippet = js.substring(pos - 1000, pos);
            console.log('Snippet before var Kt=:');
            console.log(snippet);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
