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
        
        console.log('Bundle length:', js.length);
        
        // Let's search for "kde pomahame" or "organizace" or "spolecnikSeniora"
        const terms = [
            'kde pom',
            'prijimaci',
            'organizac',
            'spolecnik',
            'volunteer',
            'junior',
            'dobrovoln'
        ];
        
        terms.forEach(term => {
            let idx = 0;
            console.log(`\n--- Searching for "${term}" ---`);
            while (true) {
                idx = js.indexOf(term, idx);
                if (idx === -1) break;
                console.log(`Found "${term}" at index ${idx}:`);
                console.log(js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 200)));
                idx += term.length;
            }
        });
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
