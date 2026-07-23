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
        const js = await getURL('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
        
        console.log('Searching for Mt and Kt definitions...');
        
        const posMt = js.indexOf('var Mt=');
        if (posMt !== -1) {
            console.log('\nFound Mt at:', posMt);
            console.log(js.substring(posMt - 300, posMt + 1500));
        } else {
            console.log('Could not find var Mt=');
        }
        
        const posKt = js.indexOf('var Kt=');
        if (posKt !== -1) {
            console.log('\nFound Kt at:', posKt);
            console.log(js.substring(posKt - 300, posKt + 1500));
        } else {
            console.log('Could not find var Kt=');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
