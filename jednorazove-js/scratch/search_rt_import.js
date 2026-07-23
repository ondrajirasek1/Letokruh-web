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
        
        console.log('Searching for Rt import in JS...');
        const pos = js.indexOf('var Mt=function');
        if (pos !== -1) {
            console.log(js.substring(pos - 500, pos));
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
