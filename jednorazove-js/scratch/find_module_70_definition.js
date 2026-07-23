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
        
        // Let's find index 117169 where Vt=a(70) is.
        // Let's search inside the array/object of webpack modules for the 70th item.
        // In webpack, modules are defined in a big array pushed to webpackJsonp.
        // Let's parse the array pushed to push.
        // The first argument is [[0], [...array of modules...]] or similar.
        // Let's split the modules array by function definitions.
        // Let's write a simple script to find what is defined in module 70!
        
        let start = js.indexOf('push([[');
        let endObj = js.indexOf(']],', start);
        let modulesText = js.substring(start, endObj);
        
        // Let's search for "a(70)" or "70" in webpackJsonp.
        // Let's see what is near Vt=a(70).
        // Let's check how many commas are before index 117145 (where Vt=a(70) is).
        // Actually, we can write a script to find module 70.
        // Let's find where a(70) is called or look inside the code.
        // Let's write a parser that parses functions from push.
        
        // We can search for the text inside module 70.
        // Module 70 is Vt. In webpack, we have: Vt=a(70), Qt=a.n(Vt)
        // Let's search for "70:" or let's search for the function at index 70.
        // Let's write a node script that evaluates the webpackJsonp call inside a safe environment or lists the array elements.
        
        console.log('Searching for "70:" or "70:function" or matching array...');
        // Let's find the exact text between module 69 and 71.
        // Let's search for "static/media" and look at all of them again.
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
