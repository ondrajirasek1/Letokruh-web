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

let updatedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match navbar dropdown containing firemni-partnerstvi.html#moznosti-spoluprace without #vyrocni-zpravy
  const regex = /(<a href="([^"]*firemni-partnerstvi\.html)#moznosti-spoluprace" class="nav_dropdown_item">Možnosti spolupráce<\/a>)\s*(?!<a href="[^"]*#vyrocni-zpravy")/g;

  if (regex.test(content)) {
    const newContent = content.replace(
      /(<a href="([^"]*firemni-partnerstvi\.html)#moznosti-spoluprace" class="nav_dropdown_item">Možnosti spolupráce<\/a>)/g,
      `$1\n                    <a href="$2#vyrocni-zpravy" class="nav_dropdown_item">Výroční zprávy a hospodaření</a>`
    );
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updatedCount++;
    }
  }
});

console.log(`Updated navbar dropdown in ${updatedCount} HTML files.`);
