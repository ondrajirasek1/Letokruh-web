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
        console.log('Downloading main.chunk.js...');
        const js = await getURL('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
        
        console.log('Searching for dobrovolnictvi text...');
        // Let's search for "Kde pom"
        const idx = js.indexOf('Kde pom');
        if (idx !== -1) {
            console.log('Found "Kde pomáháme" at index:', idx);
            // Print 1000 characters around it
            console.log(js.substring(idx - 1000, idx + 2000));
        } else {
            console.log('Could not find "Kde pomáháme" in main.chunk.js');
        }

        const idx2 = js.indexOf('Kdo a jak');
        if (idx2 !== -1) {
            console.log('\nFound "Kdo a jak pomáhá" at index:', idx2);
            console.log(js.substring(idx2 - 1000, idx2 + 2000));
        } else {
            console.log('Could not find "Kdo a jak pomáhá" in main.chunk.js');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
