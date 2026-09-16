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
let updatedCount = 0;

const rootButtons = `<div class="nav_buttons_stacked">
                <a href="stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

const subfolderButtons = `<div class="nav_buttons_stacked">
                <a href="../stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="../stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

// Regex to find unstacked buttons or outdated nav_buttons_stacked before </div>\s*<\/nav>
// Regex matches from <a href="[^"]*stan-se-dobrovolnikem.html" or <div class="nav_buttons_stacked"> up to </div>\s*<\/nav>
const buttonsRegex = /(?:<div class="nav_buttons_stacked">[\s\S]*?<\/div>|<a href="[^"]*stan-se-dobrovolnikem\.html"[\s\S]*?<\/a>\s*<a href="[^"]*podpor-dobro\.html"[\s\S]*?<\/a>)\s*(?=\s*<\/div>\s*<\/nav>)/;

htmlFiles.forEach(filePath => {
    const isRoot = path.dirname(filePath).replace(/\\/g, '/') === rootDir.replace(/\\/g, '/');
    let content = fs.readFileSync(filePath, 'utf8');

    if (buttonsRegex.test(content)) {
        const replacement = isRoot ? rootButtons : subfolderButtons;
        const newContent = content.replace(buttonsRegex, replacement);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            updatedCount++;
            console.log(`Updated stacked buttons in: ${path.relative(rootDir, filePath)}`);
        }
    } else {
        console.log(`NO MATCH FOR BUTTONS IN: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
