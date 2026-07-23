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
        
        // Let's search for "a(70)"
        let idx = js.indexOf('a(70)');
        console.log('Index of a(70):', idx);
        if (idx !== -1) {
            console.log(js.substring(idx - 100, idx + 100));
        }
        
        // Modules in this bundle are functions passed as elements in an array or object.
        // Let's look for the webpack bootstrap / module definition or print a list of strings of imports.
        // Let's search for "static/media" strings and their associated module index if possible.
        // We can search for the media URL corresponding to module 70 by looking for it in the chunk.
        // Webpack usually assigns paths in the form: a.p + "static/media/..."
        // Let's find all instances of `a.p +` or similar in the React chunk
        let regex = /e\.exports\s*=\s*[a-zA-Z]\.p\s*\+\s*"static\/media\/[^"]+"/gi;
        let matches = js.match(regex) || [];
        console.log(`\nFound ${matches.length} e.exports = a.p + static/media matches:`);
        matches.forEach(m => console.log(m));
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
