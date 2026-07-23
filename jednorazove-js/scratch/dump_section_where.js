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
        
        // Let's find "sectionWhere" or "sectionWhere.text1" in webpackJsonp.
        let idx = js.indexOf('"sectionWhere"');
        if (idx !== -1) {
            console.log('Found "sectionWhere" at index', idx);
            console.log(js.substring(idx - 100, idx + 1000));
        } else {
            console.log('"sectionWhere" not found directly');
            let idx2 = js.indexOf('sectionWhere');
            if (idx2 !== -1) {
                console.log('Found sectionWhere at index', idx2);
                console.log(js.substring(idx2 - 100, idx2 + 1000));
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
