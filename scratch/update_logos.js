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
            if (file !== '.git' && file !== 'node_modules') {
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

const subfolderLogoContent = `        <div class="logo_desktop">
            <a href="../index.html" class="nav_logo_link" title="Letokruh - Hlavní stránka">
                <img src="../images/logos/Letokruh_logo_horizontal.png" alt="Letokruh Logo" class="nav_logo_img">
            </a>
        </div>`;

const rootLogoContent = `        <div class="logo_desktop">
            <a href="index.html" class="nav_logo_link" title="Letokruh - Hlavní stránka">
                <img src="images/logos/Letokruh_logo_horizontal.png" alt="Letokruh Logo" class="nav_logo_img">
            </a>
        </div>`;

htmlFiles.forEach(filePath => {
    const isRoot = path.dirname(filePath) === rootDir;
    const content = fs.readFileSync(filePath, 'utf8');

    // Regex to match <div class="logo_desktop">...</div>
    const regex = /<div class="logo_desktop">[\s\S]*?<\/div>/;
    
    if (regex.test(content)) {
        const replacement = isRoot ? rootLogoContent : subfolderLogoContent;
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            updatedCount++;
            console.log(`Updated: ${path.relative(rootDir, filePath)}`);
        }
    }
});

console.log(`Total files updated: ${updatedCount}`);
