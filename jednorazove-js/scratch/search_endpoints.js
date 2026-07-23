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
        
        console.log('Searching for endpoints...');
        const regex = /https:\/\/letokruh\.eu\/wp-json\/[^\s"']+/gi;
        const matches = js.match(regex) || [];
        console.log(`Found ${matches.length} endpoints:`);
        const unique = [...new Set(matches)];
        unique.forEach(m => console.log(m));
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
