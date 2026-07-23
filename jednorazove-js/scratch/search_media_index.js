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
        
        console.log('Searching for media URLs in bundle...');
        const searchTerms = ['spolecnikSeniora.d4519c16.png', 'organizations.73e4761e.png', 'junior.166849c5.webp', 'volunteer.77c94a6a.webp'];
        
        searchTerms.forEach(term => {
            let pos = 0;
            while ((pos = js.indexOf(term, pos)) !== -1) {
                console.log(`\nFound "${term}" at index ${pos}:`);
                console.log(js.substring(pos - 100, pos + 100));
                pos += term.length;
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
