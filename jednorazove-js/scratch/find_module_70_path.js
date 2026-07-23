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
        
        // Let's search for "70" module in the bundle
        let idx = js.indexOf('"70":');
        if (idx === -1) idx = js.indexOf("'70':");
        if (idx === -1) idx = js.indexOf('70:');
        
        if (idx !== -1) {
            console.log('Found module 70 at index', idx);
            console.log(js.substring(idx, idx + 300));
        } else {
            console.log('Module 70 not found directly. Let\'s search around index of Qt.a usages.');
            // Let's search for Qt.a
            let qIdx = js.indexOf('Qt.a');
            while (qIdx !== -1) {
                console.log('Found Qt.a usage at index:', qIdx);
                console.log(js.substring(qIdx - 100, qIdx + 200));
                qIdx = js.indexOf('Qt.a', qIdx + 1);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
