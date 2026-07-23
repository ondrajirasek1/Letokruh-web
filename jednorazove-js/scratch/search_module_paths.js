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
        
        // Modules in React webpack bundle are usually defined as e.g. "59: function"
        // Let's find "59:" or '59:'
        const modules = [59, 60, 61, 62];
        modules.forEach(mod => {
            console.log(`\n--- Searching for module ${mod} definition ---`);
            // We search for key like "59:" or "59:function" in the webpack modules object
            // Let's search for "59:"
            let idx = js.indexOf(`"${mod}":`);
            if (idx === -1) idx = js.indexOf(`'${mod}':`);
            if (idx === -1) idx = js.indexOf(`${mod}:`);
            
            if (idx !== -1) {
                console.log(`Found module ${mod} at index ${idx}:`);
                console.log(js.substring(idx, idx + 200));
            } else {
                console.log(`Module ${mod} not found directly`);
            }
        });
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
