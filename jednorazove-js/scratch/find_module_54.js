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
        
        // Modules in the webpack bundle array/object are usually formatted like:
        // "54": function(e,t,a) { e.exports = ... }
        // Let's search for "54:" or "54:function" or look inside the code where 54 is defined.
        // Let's write a regex to find module 54 definition.
        // It could be key 54 in webpack module object, e.g. `54:function` or `54:(` or `54:`
        let idx = js.indexOf('"54":');
        if (idx === -1) idx = js.indexOf("'54':");
        if (idx === -1) idx = js.indexOf('54:');
        
        if (idx !== -1) {
            console.log('Found module 54 at index', idx);
            console.log(js.substring(idx, idx + 5000));
        } else {
            console.log('Module 54 not found directly by key.');
            // Let's search for some strings that are definitely in the content, like "dobroklub" or "Společník seniora"
            let strIdx = js.indexOf('program Spole\u010dn\xedk seniora');
            if (strIdx !== -1) {
                console.log('Found string at index', strIdx);
                console.log(js.substring(strIdx - 200, strIdx + 1000));
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
