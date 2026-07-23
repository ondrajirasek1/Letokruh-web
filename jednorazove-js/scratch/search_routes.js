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
        
        console.log('Searching for routes in React...');
        const regex = /path:"\/([^"]+)"/g;
        let match;
        while ((match = regex.exec(js)) !== null) {
            console.log(`- ${match[1]}`);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
