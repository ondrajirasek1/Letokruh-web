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

const subfolderContent = `            <div class="nav_buttons_stacked">
                <a href="../stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="../stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

const rootContent = `            <div class="nav_buttons_stacked">
                <a href="stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

// Regex matching the two action buttons inside navbar
const regex = /<a href="[^"]*stan-se-dobrovolnikem\.html"[^>]*>[\s\S]*?<\/a>\s*<a href="[^"]*podpor-dobro\.html"[^>]*>[\s\S]*?<\/a>/i;

htmlFiles.forEach(filePath => {
    const isRoot = path.dirname(filePath) === rootDir;
    const content = fs.readFileSync(filePath, 'utf8');

    if (regex.test(content)) {
        const replacement = isRoot ? rootContent : subfolderContent;
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            updatedCount++;
            console.log(`Updated buttons in: ${path.relative(rootDir, filePath)}`);
        }
    } else {
        console.log(`No match in: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
