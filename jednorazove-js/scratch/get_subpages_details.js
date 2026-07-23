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
        
        // Find Kt component declaration where Individuals_section is
        let idx = js.indexOf('individuals_section');
        if (idx !== -1) {
            console.log('Found individuals_section at index:', idx);
            // Search backwards for the function start and look at its imports/variables
            let snippet = js.substring(idx - 1000, idx + 1000);
            console.log(snippet);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
