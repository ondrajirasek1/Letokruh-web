const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/ondra/Documents/WBA/letokruh-web';

function getAllHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'scratch') {
                results = results.concat(getAllHtmlFiles(fullPath));
            }
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = getAllHtmlFiles(rootDir);
let fixedCount = 0;

const doubleDivRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<div class="navbar_desktop">/g;
const doubleDivRegex2 = /<\/div>\s*<\/div>\s*<div class="navbar_desktop">/g;

// In navbar_wrapper:
// <div class="logo_desktop nav_dropdown"> (1)
//     <a ...></a>
//     <div class="nav_dropdown_menu"> (2)
//         ...
//     </div> (closes 2)
// </div> (closes 1)
// <div class="navbar_desktop">

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace 3 consecutive closing divs before navbar_desktop if present
    if (/<\/div>\s*<\/div>\s*<\/div>\s*<div class="navbar_desktop">/.test(content)) {
        content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<div class="navbar_desktop">/g, '</div>\n        </div>\n        <div class="navbar_desktop">');
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
    }
});

console.log(`Cleaned extra closing divs in ${fixedCount} files.`);
