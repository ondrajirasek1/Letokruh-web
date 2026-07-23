const https = require('https');

https.get('https://letokruh.eu/wp-json/wp/v2/udalosti?per_page=100', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const items = JSON.parse(data);
      console.log(`Fetched ${items.length} items`);
      if (items.length > 0) {
        console.log(JSON.stringify(items[0], null, 2));
      }
    } catch(e) { console.log(e); }
  });
});
