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
        
        let pos = js.indexOf(',a=u,l=Object');
        if (pos !== -1) {
            // Let's find "u=" preceding this
            let snippet = js.substring(pos - 15000, pos);
            let idx = snippet.lastIndexOf('u=');
            if (idx !== -1) {
                console.log('Found u= definition at index', pos - 15000 + idx);
                console.log(snippet.substring(idx - 100, idx + 2000));
            } else {
                console.log('Could not find u= in the preceding 15KB');
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
