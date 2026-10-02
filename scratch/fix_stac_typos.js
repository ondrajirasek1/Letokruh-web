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
const htmlFiles = getAllHtmlFiles(root);

let count = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Stač se dobrovolníkem with Staň se dobrovolníkem
  const updated = content
    .replace(/Stač se dobrovolníkem/g, 'Staň se dobrovolníkem')
    .replace(/Stač se dobrovolnikem/g, 'Staň se dobrovolníkem');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    count++;
  }
});

console.log(`Fixed Stač typo in ${count} HTML files.`);
