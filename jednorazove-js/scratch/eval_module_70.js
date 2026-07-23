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
        
        // Let's find the array of modules inside push([[0], [ ... ]])
        // We know that webpack modules are defined inside an array.
        // Let's split the modules by function boundaries.
        // A module usually starts with a function definition: `function(e,t,a){` or `function(e,t,r){`
        // Let's write a parser that counts how many modules are in the array and prints module 70!
        
        let start = js.indexOf('push([[');
        let arrayStart = js.indexOf('[', start + 7);
        let arrayEnd = js.lastIndexOf(']');
        
        // Let's find all module definitions by counting "function(" in the main array.
        // Webpack bundles have modules like:
        // [
        //   function(e,t,a) { ... }, // 0
        //   function(e,t,a) { ... }, // 1
        //   ...
        // ]
        // Let's find the indices of "function(e,t," or "function(e," or "function(" inside the main push array.
        
        // We can do this by regex matching function definitions.
        const regex = /function\s*\(\s*[a-zA-Z\s,]*\)/g;
        let match;
        let functionIndices = [];
        while ((match = regex.exec(js)) !== null) {
            functionIndices.push(match.index);
        }
        
        console.log(`Found ${functionIndices.length} functions in the bundle.`);
        
        // Let's find which function corresponds to module 70!
        // In the chunk, let's find the function containing "static/media/spolecnikSeniora"
        let spIdx = js.indexOf('spolecnikSeniora');
        while (spIdx !== -1) {
            console.log(`Found "spolecnikSeniora" at index ${spIdx}:`);
            console.log(js.substring(spIdx - 100, spIdx + 200));
            spIdx = js.indexOf('spolecnikSeniora', spIdx + 1);
        }
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
