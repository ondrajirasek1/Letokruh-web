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
        
        // Let's find "var g=" or "g=Object(n.createContext)"
        // Let's search for "createContext"
        let idx = js.indexOf('createContext');
        while (idx !== -1) {
            console.log(`\nFound createContext at index ${idx}:`);
            console.log(js.substring(Math.max(0, idx - 200), Math.min(js.length, idx + 400)));
            idx = js.indexOf('createContext', idx + 1);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
