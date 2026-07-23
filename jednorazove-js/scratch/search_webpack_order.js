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
        
        // Modules are comma-separated inside the array in webpackJsonp.
        // We know that "a(70)" is imported around index 117145: Vt=a(70), Qt=a.n(Vt)
        // Let's find module 70 inside the webpack bundle functions.
        // Usually, module 70 function looks like:
        // function(e,t,a){e.exports=a.p+"static/media/..."}
        // Let's write a regex that matches exactly module 70.
        // In the webpack bundle, it's defined inside an array:
        // webpackJsonp([0], [ ... modules ... ])
        // Let's find the 70th function in the array!
        // We can find all function(e,t,a){e.exports=a.p+...} in order!
        // Let's see:
        let regex = /e\.exports\s*=\s*[a-zA-Z]\.p\s*\+\s*"static\/media\/[^"]+"/gi;
        let matches = [];
        let match;
        while ((match = regex.exec(js)) !== null) {
            matches.push({ index: match.index, text: match[0] });
        }
        
        console.log(`Found ${matches.length} e.exports matches in order:`);
        matches.forEach((m, idx) => {
            console.log(`[${idx}] Index: ${m.index} | Text: ${m.text}`);
        });
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
