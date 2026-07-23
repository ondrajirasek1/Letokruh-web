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
        
        // Let's find "Pe=" or "Oe=" or what a(61) etc. are
        // Usually, imports are at the start of the file or chunk or function.
        // Let's look around index 83104 (where De is defined)
        console.log('Printing around index 83104:');
        console.log(js.substring(82500, 83500));
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
