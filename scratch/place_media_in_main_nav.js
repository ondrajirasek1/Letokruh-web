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

htmlFiles.forEach(filePath => {
    const isRoot = path.normalize(filePath) === path.normalize(path.join(rootDir, 'index.html'));
    const isMediaPage = path.normalize(filePath) === path.normalize(path.join(rootDir, 'stranky', 'media.html'));
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove Média link from O nás sub-menu if present
    content = content.replace(/\s*<a href="[^"]*media\.html" class="nav_dropdown_item"[^>]*>Média<\/a>/g, '');

    // 2. Build the main navbar block for Média
    const mediaHref = isRoot ? 'stranky/media.html' : '../stranky/media.html';
    const activeStyle = isMediaPage ? ' style="color: #cb2f1d;"' : '';

    const mediaNavBlock = `            <div class="nav_dropdown">
                <a href="${mediaHref}" class="navbarItem"${activeStyle}>Média <i class="fa-solid fa-chevron-down nav_dropdown_icon"></i></a>
                <div class="nav_dropdown_menu">
                    <a href="${mediaHref}#pro-media" class="nav_dropdown_item">Pro média</a>
                    <a href="${mediaHref}#tiskove-zpravy" class="nav_dropdown_item">Tiskové zprávy</a>
                    <a href="${mediaHref}#fotografie" class="nav_dropdown_item">Fotografie</a>
                    <a href="${mediaHref}#loga" class="nav_dropdown_item">Loga & Vizuály</a>
                    <a href="${mediaHref}#napsali-o-nas" class="nav_dropdown_item">Letokruh v médiích</a>
                    <a href="${mediaHref}#videa" class="nav_dropdown_item">Videa & Shorts</a>
                </div>
            </div>\n`;

    // 3. Remove any existing main nav Média dropdown block to avoid duplicates
    const existingMediaMainRegex = /<div class="nav_dropdown">\s*<a href="[^"]*media\.html" class="navbarItem"[\s\S]*?<\/div>\s*<\/div>/g;
    content = content.replace(existingMediaMainRegex, '');

    // 4. Insert before Kontakt block in navbar_desktop
    const kontaktBlockRegex = /(\s*<div class="nav_dropdown">\s*<a href="[^"]*kontakt\.html" class="navbarItem">Kontakt)/;

    if (kontaktBlockRegex.test(content)) {
        content = content.replace(kontaktBlockRegex, '\n' + mediaNavBlock + '$1');
        modified = true;
    }

    // 5. Fix O nás color style in media.html if needed (make O nás normal and Média red)
    if (isMediaPage) {
        content = content.replace('<a href="../stranky/onas.html" class="navbarItem" style="color: #cb2f1d;">O nás', '<a href="../stranky/onas.html" class="navbarItem">O nás');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
});

console.log(`Placed Média directly in main navbar across ${updatedCount} HTML files!`);
