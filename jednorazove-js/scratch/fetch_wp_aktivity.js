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
        console.log('Fetching aktivity...');
        const aktivity = await getJSON('https://letokruh.eu/wp-json/wp/v2/aktivity?per_page=100');
        console.log(`Fetched ${aktivity.length} aktivity:`);
        aktivity.forEach(a => {
            console.log(`Title: ${a.title.rendered} | Slug: ${a.slug}`);
            if (a.acf) {
                console.log('ACF keys:', Object.keys(a.acf));
                if (a.acf.fotografie_dobrovolnika) {
                    console.log('Foto URL:', a.acf.fotografie_dobrovolnika.url);
                }
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
