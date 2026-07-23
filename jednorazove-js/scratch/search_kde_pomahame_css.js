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
        console.log('Downloading CSS...');
        const css = await getURL('https://letokruh.eu/wp-content/themes/letokruh/static/css/main.chunk.css?dcd0fb90448cd609a44f');
        
        console.log('\nSearching for wwh or whereWeHelp in CSS...');
        const lines = css.split('\n');
        
        // Let's find background-image in CSS
        const regex = /\.wwh_[^}]*background-image:[^;}]*/gi;
        const matches = css.match(regex) || [];
        console.log(`Found ${matches.length} matches:`);
        matches.forEach(m => console.log(m));
        
        const regex2 = /\.whereWeHelp_section[^}]*/gi;
        const matches2 = css.match(regex2) || [];
        console.log(`\nFound ${matches2.length} matches for whereWeHelp_section:`);
        matches2.forEach(m => console.log(m));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
