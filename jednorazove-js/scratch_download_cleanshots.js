const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images', 'ostatni');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const cleanshots = [
  { name: 'cs_21_50_19.png', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.50.19.png' },
  { name: 'cs_21_38_44.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.38.44.webp' },
  { name: 'cs_21_35_41.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.35.41.webp' },
  { name: 'cs_21_32_12.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.32.12.webp' },
  { name: 'cs_21_27_17.webp', url: 'https://letokruh.eu/wp-content/uploads/2021/06/CleanShot-2025-06-20-at-21.27.17.webp' },
  { name: 'cs_21_15_57.webp', url: 'https://letokruh.eu/wp-content/uploads/2021/06/CleanShot-2025-06-20-at-21.15.57.webp' }
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
  for (const cs of cleanshots) {
    const dest = path.join(imgDir, cs.name);
    console.log(`Downloading ${cs.url} -> ${dest}...`);
    try {
      await download(cs.url, dest);
      console.log(`Downloaded ${cs.name} successfully.`);
    } catch (e) {
      console.error(e.message);
    }
  }
}

run();
