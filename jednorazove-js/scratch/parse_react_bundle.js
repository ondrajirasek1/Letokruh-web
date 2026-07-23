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
        
        console.log('\nParsing code blocks...');
        // Let's find occurrences of media/organizations, media/spolecnikSeniora, media/volunteer, media/junior
        const searchTerms = ['organizations', 'spolecnikSeniora', 'volunteer', 'junior'];
        
        searchTerms.forEach(term => {
            let pos = 0;
            while ((pos = js.indexOf(term, pos)) !== -1) {
                console.log(`\nFound term "${term}" at index ${pos}:`);
                console.log(js.substring(pos - 150, pos + 150));
                pos += term.length;
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
