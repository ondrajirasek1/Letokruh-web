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
    console.log('Downloading live volunteers assets...');
    await download('https://letokruh.eu/wp-content/themes/letokruh/static/media/volunteer.77c94a6a.webp', 'images/ostatni/volunteer_live.webp');
    console.log('Downloaded volunteer_live.webp');
    await download('https://letokruh.eu/wp-content/themes/letokruh/static/media/junior.166849c5.webp', 'images/ostatni/junior_live.webp');
    console.log('Downloaded junior_live.webp');
    
    console.log('Checking file sizes:');
    console.log('volunteer_live.webp:', fs.statSync('images/ostatni/volunteer_live.webp').size);
    console.log('junior_live.webp:', fs.statSync('images/ostatni/junior_live.webp').size);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
