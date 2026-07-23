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
        console.log('Downloading main.chunk.js...');
        const js = await getURL('https://letokruh.eu/wp-content/themes/letokruh/static/js/main.chunk.js?dcd0fb90448cd609a44f');
        
        console.log('\nSearching for image imports and references...');
        
        // Find lines with image references
        const lines = js.split('\n');
        lines.forEach((line, idx) => {
            if (line.includes('volunteer') || line.includes('junior') || line.includes('spolecnikSeniora') || line.includes('organization')) {
                if (line.length > 500) {
                    console.log(`Line ${idx + 1} (truncated):`, line.substring(0, 300) + ' ... [TRUNCATED] ... ' + line.substring(line.length - 200));
                } else {
                    console.log(`Line ${idx + 1}:`, line);
                }
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
