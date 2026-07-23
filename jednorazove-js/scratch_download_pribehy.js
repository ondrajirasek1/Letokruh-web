const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'images', 'pribehy');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const images = [
    { url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.40.46.webp', filename: 'janka_f.webp' },
    { url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.38.44.webp', filename: 'otto_p.webp' },
    { url: 'https://letokruh.eu/wp-content/uploads/2025/06/CleanShot-2025-06-20-at-21.35.41.webp', filename: 'ivan_s.webp' }
];

images.forEach(img => {
    const dest = path.join(dir, img.filename);
    const file = fs.createWriteStream(dest);
    https.get(img.url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${img.filename}`);
        });
    }).on('error', err => {
        fs.unlink(dest, () => {});
        console.error(`Error downloading ${img.filename}: ${err.message}`);
    });
});
