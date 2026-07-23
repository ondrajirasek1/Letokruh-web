const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url} (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Downloading live Kde pomahame assets...');
    await download('https://letokruh.eu/wp-content/themes/letokruh/static/media/organizations.73e4761e.png', 'images/ostatni/organizations_live.png');
    console.log('Downloaded organizations_live.png');
    await download('https://letokruh.eu/wp-content/themes/letokruh/static/media/spolecnikSeniora.d4519c16.png', 'images/ostatni/spolecnikSeniora_live.png');
    console.log('Downloaded spolecnikSeniora_live.png');
    
    console.log('File sizes:');
    console.log('organizations_live.png:', fs.statSync('images/ostatni/organizations_live.png').size);
    console.log('spolecnikSeniora_live.png:', fs.statSync('images/ostatni/spolecnikSeniora_live.png').size);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
