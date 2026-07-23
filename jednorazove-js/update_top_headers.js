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
  if (path.basename(filePath) === 'index.html' && filePath === path.join(root, 'index.html')) {
    return; // index.html already updated
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Determine relative path to podpor-dobro.html
  const relDir = path.relative(root, path.dirname(filePath)).replace(/\\/g, '/');
  let href = 'stranky/podpor-dobro.html';
  if (relDir === 'stranky') {
    href = 'podpor-dobro.html';
  } else if (relDir === 'projekty' || relDir === 'pribehy' || relDir === 'blog' || relDir === 'aktivity') {
    href = '../stranky/podpor-dobro.html';
  }

  const target = '<div class="top-header-right">';
  const replacement = '<div class="top-header-right">\n            <a href="' + href + '" class="btn-support-top"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>';

  if (content.includes(target) && !content.includes('class="btn-support-top"')) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log('Updated:', path.relative(root, filePath));
  }
});
console.log('Total updated files:', count);
