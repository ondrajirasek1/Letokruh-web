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
        
        // Let's search for "y=" or "y =" before index 56428
        let pos = js.indexOf('=y()');
        if (pos !== -1) {
            let start = Math.max(0, pos - 10000);
            let snippet = js.substring(start, pos);
            // Search for "y=" or "y =" or "y=function"
            let idx = snippet.lastIndexOf('y=');
            if (idx !== -1) {
                console.log('Found "y=" definition in snippet at index', start + idx);
                console.log(snippet.substring(idx - 100, idx + 500));
            } else {
                console.log('Could not find "y=" in the 10KB preceding =y()');
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
