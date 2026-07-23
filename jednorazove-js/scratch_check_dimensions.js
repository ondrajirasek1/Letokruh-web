const fs = require('fs');
const path = require('path');

function getWebpDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  // WebP Header parsing
  const width = buffer.readUInt16LE(26);
  const height = buffer.readUInt16LE(28);
  return { width, height };
}

const p = path.join('images', 'ostatni', 'seniorsky_dobrovolnik.webp');
if (fs.existsSync(p)) {
  try {
    const dim = getWebpDimensions(p);
    console.log(`seniorsky_dobrovolnik.webp: ${dim.width}x${dim.height}`);
  } catch (e) {
    console.log(e.message);
  }
}
