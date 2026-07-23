const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        getAllHtmlFiles(fullPath, arrayOfFiles);
      }
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const root = path.resolve(__dirname, '..');
const files = getAllHtmlFiles(root);

let count = 0;
files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace href="style.css..." or href="../style.css..." with ?v=29
  const updated = content
    .replace(/href="(\.\.\/)?style\.css(\?v=\d+)?"/g, (match, prefix) => {
      const p = prefix || '';
      return `href="${p}style.css?v=32"`;
    });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    count++;
  }
});
console.log('Updated CSS version query param in files:', count);
