const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images', 'ostatni');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const candidates = [
  { name: 'candidate_spolecnik_seiora.jpg', url: 'https://letokruh.eu/wp-content/uploads/2023/02/spolecnik-seiora.jpg' },
  { name: 'candidate_novy_spolecnik.jpg', url: 'https://letokruh.eu/wp-content/uploads/2021/08/Novy-Spolecnik-seniora.jpg' },
  { name: 'candidate_den_dobrovolnictvi.jpg', url: 'https://letokruh.eu/wp-content/uploads/2024/06/Den-dobrovolnictvi.jpg' },
  { name: 'candidate_dny_dobrovolnictvi.jpg', url: 'https://letokruh.eu/wp-content/uploads/2024/02/dny-dobrovolnictvi.jpg' }
];

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
  for (const c of candidates) {
    const dest = path.join(imgDir, c.name);
    console.log(`Downloading ${c.url} -> ${dest}...`);
    try {
      await download(c.url, dest);
      console.log(`Downloaded ${c.name} successfully.`);
    } catch (e) {
      console.error(e.message);
    }
  }
}

run();
