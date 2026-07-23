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
        
        // Find module functions in the array.
        // In webpack, it's pushed like: push([[0],[func0, func1, func2, ...]]) or as an object pushed.
        // Let's find push([[
        let pushIdx = js.indexOf('push([[');
        if (pushIdx !== -1) {
            console.log('Found push([[ at', pushIdx);
            // Let's get the array/object inside push.
            // Let's write a parser that parses functions inside the array/object.
            // But an easier way: let's search for the media URL and then find the enclosing function definition or index.
            // Each module is separated by commas or defined as keys.
            // Let's find all occurrences of "static/media" and search backwards for the nearest "function(" or module boundaries.
            // Webpack module signature: `function(e,t,a){e.exports=a.p+"static/media/..."}`
            // Let's find the indices of these functions in the array!
            // Let's split the code by the webpack module signature prefix.
            // To be precise, let's find the function block.
            // Let's just do a string search.
        }
        
        // Let's find which module is 70!
        // We know Vt=a(70) is module 70, which is Qt.a.
        // Let's see if we can find where module 70 is defined in the array!
        // A module is usually defined in order of index.
        // Let's list the order of e.exports=a.p+"static/media/... in the bundle.
        // If we split by function(e,t,r) or similar, we can find the index!
        // Let's find the text around the e.exports = a.p + "static/media/... definitions.
        
        let matches = [];
        let idx = 0;
        let regex = /function\s*\(\s*[a-zA-Z]\s*,\s*[a-zA-Z]\s*,\s*[a-zA-Z]\s*\)\s*\{\s*[a-zA-Z]\.exports\s*=\s*[a-zA-Z]\.p\s*\+\s*"static\/media\/[^"]+"\s*\}/gi;
        // Let's search for all functions of this pattern and print their index and content
        let match;
        while ((match = regex.exec(js)) !== null) {
            console.log(`Match at index ${match.index}: ${match[0]}`);
        }
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
