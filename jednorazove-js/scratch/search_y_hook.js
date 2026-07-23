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
        
        // Let's find "function y()" or "=function y" or "=y(" or similar.
        // Let's find "var y=" or "function y"
        let idx = js.indexOf('function y(');
        if (idx === -1) idx = js.indexOf('var y=');
        
        if (idx !== -1) {
            console.log('Found y definition at index', idx);
            console.log(js.substring(idx - 100, idx + 500));
        } else {
            console.log('y not found directly. Let\'s find "=y()"');
            let idx2 = js.indexOf('=y()');
            if (idx2 !== -1) {
                console.log('Found "=y()" at index', idx2);
                console.log(js.substring(idx2 - 200, idx2 + 200));
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
