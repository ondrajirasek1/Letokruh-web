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
        
        console.log('Searching for module 70 or spolecnikSeniora...');
        // Let's search for "function(e,t,a){e.exports=a.p+"
        // and find which index contains spolecnikSeniora or 70
        // Module 70 is defined in the array of modules at the beginning of the bundle.
        // Let's search for where spolecnikSeniora is in the static/media list
        const pos = js.indexOf('spolecnikSeniora');
        if (pos !== -1) {
            console.log('Found spolecnikSeniora in JS at:', pos);
            console.log(js.substring(pos - 100, pos + 100));
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
