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
        
        console.log('Searching for "var Le=" definition...');
        let idxLe = js.indexOf('var Le=');
        if (idxLe !== -1) {
            console.log('Found "var Le=" at index', idxLe);
            console.log(js.substring(idxLe, idxLe + 2000));
        } else {
            console.log('"var Le=" not found');
        }

        console.log('\nSearching for "var De=" definition...');
        let idxDe = js.indexOf('var De=');
        if (idxDe !== -1) {
            console.log('Found "var De=" at index', idxDe);
            console.log(js.substring(idxDe, idxDe + 2000));
        } else {
            console.log('"var De=" not found');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
