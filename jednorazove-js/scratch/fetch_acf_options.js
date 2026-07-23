const https = require('https');

function getJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('Fetching options...');
        const options = await getJSON('https://letokruh.eu/wp-json/acf/v3/options/options');
        console.log('Options keys:', Object.keys(options));
        
        // Let's search inside the options for any image URLs
        const str = JSON.stringify(options);
        
        // Let's look for "spolecnik" or "organiz" or other image matches
        const regex = /https:\/\/letokruh\.eu\/wp-content\/uploads\/[^\s"']+\.(png|webp|jpg|jpeg)/gi;
        const matches = str.match(regex) || [];
        console.log(`\nFound ${matches.length} image URLs in options:`);
        const unique = [...new Set(matches)];
        unique.forEach(m => console.log(m));
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
