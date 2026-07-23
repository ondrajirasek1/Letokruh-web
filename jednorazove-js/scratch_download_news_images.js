const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images', 'aktuality');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const imagesToDownload = [
  { name: 'aktuality_1.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/05/Kopie-souboru-VRM01630-scaled.jpg' },
  { name: 'aktuality_2.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/04/Prazsky-tulak-scaled.jpg' },
  { name: 'aktuality_3.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/04/uklid-lesa.jpg' },
  { name: 'aktuality_4.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/04/dod26.jpg' },
  { name: 'aktuality_5.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/04/VRF02195-scaled.jpg' },
  { name: 'aktuality_6.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/04/Konference.jpg' },
  { name: 'aktuality_7.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/04/seniori-v-siti.jpg' },
  { name: 'aktuality_8.png', url: 'https://letokruh.eu/wp-content/uploads/2026/03/CNNPrima.png' },
  { name: 'aktuality_9.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/03/Collegium-P10.jpg' },
  { name: 'aktuality_10.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/03/seniorska-blogerka.jpg' },
  { name: 'aktuality_11.png', url: 'https://letokruh.eu/wp-content/uploads/2026/03/Banner-2026-300x250px.png' },
  { name: 'aktuality_12.jpg', url: 'https://letokruh.eu/wp-content/uploads/2026/02/Joga.jpeg' }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const img of imagesToDownload) {
    const destPath = path.join(imgDir, img.name);
    console.log(`Downloading ${img.url} -> ${destPath}...`);
    try {
      await downloadImage(img.url, destPath);
      console.log(`Downloaded ${img.name} successfully.`);
    } catch (e) {
      console.error(`Failed to download ${img.name}:`, e.message);
    }
  }
}

run();
