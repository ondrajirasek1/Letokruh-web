const https = require('https');

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            console.log(`Fetch ${url} status:`, res.statusCode);
            if (res.statusCode === 301 || res.statusCode === 302) {
                console.log(`Redirect to: ${res.headers.location}`);
                fetchPage(res.headers.location).then(resolve).catch(reject);
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    try {
        const html = await fetchPage('https://letokruh.eu/dobrovolnictvi');
        
        // Find all img tags
        const regex = /<img[^>]+src="([^">]+)"/g;
        let match;
        console.log('\nAll images found on the live page HTML:');
        while ((match = regex.exec(html)) !== null) {
            console.log(match[0]);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
