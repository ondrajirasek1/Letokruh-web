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
        
        console.log('Searching for "var Mt=" definition...');
        let idxMt = js.indexOf('var Mt=');
        if (idxMt !== -1) {
            console.log('Found "var Mt=" at index', idxMt);
            console.log(js.substring(idxMt, idxMt + 2000));
        } else {
            console.log('"var Mt=" not found');
        }

        console.log('\nSearching for "var Kt=" definition...');
        let idxKt = js.indexOf('var Kt=');
        if (idxKt !== -1) {
            console.log('Found "var Kt=" at index', idxKt);
            console.log(js.substring(idxKt, idxKt + 2000));
        } else {
            console.log('"var Kt=" not found');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
