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
        
        console.log('Searching for "var Ge" definition...');
        let idx = js.indexOf('var Ge');
        if (idx !== -1) {
            console.log('Found "var Ge" at index', idx);
            console.log(js.substring(idx, idx + 3000));
        } else {
            console.log('"var Ge" not found directly, searching for "Ge = " or "function Ge"');
            let idx2 = js.indexOf('=function()');
            // Let's find Ge near where route is defined
            let routeIdx = js.indexOf('/dobrovolnictvi');
            console.log('Route /dobrovolnictvi found at index:', routeIdx);
            console.log(js.substring(routeIdx - 500, routeIdx + 500));
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
