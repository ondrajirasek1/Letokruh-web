const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'images', 'pribehy');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const images = [
  { file: 'janka_f.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.40.46.webp' },
  { file: 'otto_p.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.38.44.webp' },
  { file: 'ivan_s.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.35.41.webp' },
  { file: 'nadezda_s.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.32.12.webp' },
  { file: 'marta.jpg', url: 'https://letokruh.eu/wp-content/uploads/2025/08/Marta.jpg' },
  { file: 'zdena_p.webp', url: 'https://letokruh.eu/wp-content/uploads/2022/09/VRN03257.webp' },
  { file: 'jirka_g.jpg', url: 'https://letokruh.eu/wp-content/uploads/2021/06/Kopie-souboru-zahranicni-politika-Jirka-1080x1080-1.jpg' },
  { file: 'irena.jpg', url: 'https://letokruh.eu/wp-content/uploads/2021/06/Kopie-souboru-pracovnice-ve-skolstvi-Irena-1080x1080-1.jpg' },
  { file: 'jirka_k.jpg', url: 'https://letokruh.eu/wp-content/uploads/2021/06/Kopie-souboru-matematik-Jirka-1080x1350-1.jpg' },
  { file: 'eva.jpg', url: 'https://letokruh.eu/wp-content/uploads/2021/05/Kopie-souboru-archivarka-Eva-1080x1920-1.jpg' },
  { file: 'jirina.webp', url: 'https://letokruh.eu/wp-content/uploads/2025/07/Jirina.webp' },
  { file: 'misa.webp', url: 'https://letokruh.eu/wp-content/uploads/2019/06/Misa.webp' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${url} -> ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  for (const img of images) {
    const dest = path.join(dir, img.file);
    try {
      await download(img.url, dest);
      console.log('OK', img.file, fs.statSync(dest).size);
    } catch (e) {
      console.error('FAIL', img.file, e.message);
    }
  }
})();
