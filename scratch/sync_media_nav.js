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
let updatedNav = 0;
let updatedFooter = 0;

htmlFiles.forEach(filePath => {
    const isRoot = path.normalize(filePath) === path.normalize(path.join(rootDir, 'index.html'));
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const mediaNavHref = isRoot ? 'stranky/media.html' : '../stranky/media.html';
    const mediaNavItem = `<a href="${mediaNavHref}" class="nav_dropdown_item">Média</a>`;

    // 1. Check if Média is already in dropdown menu
    if (!content.includes(`href="${mediaNavHref}" class="nav_dropdown_item">Média`) && !content.includes('class="nav_dropdown_item" style="color: #cb2f1d; font-weight: bold;">Média')) {
        const targetNavString = isRoot ? '<a href="stranky/onas.html#projekty" class="nav_dropdown_item">Naše projekty</a>' : '<a href="../stranky/onas.html#projekty" class="nav_dropdown_item">Naše projekty</a>';
        if (content.includes(targetNavString)) {
            content = content.replace(targetNavString, targetNavString + '\n                    ' + mediaNavItem);
            modified = true;
            updatedNav++;
        }
    }

    // 2. Footer sync: add Média link in O nás footer column
    const footerLink = `<li><a href="${mediaNavHref}">Média a tisk</a></li>`;
    if (!content.includes(`href="${mediaNavHref}">Média a tisk</a>`)) {
        const targetFooterString = isRoot ? '<li><a href="stranky/onas.html#projekty">Naše projekty</a></li>' : '<li><a href="../stranky/onas.html#projekty">Naše projekty</a></li>';
        if (content.includes(targetFooterString)) {
            content = content.replace(targetFooterString, targetFooterString + '\n                        ' + footerLink);
            modified = true;
            updatedFooter++;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Finished updating. Nav updated: ${updatedNav}, Footer updated: ${updatedFooter}`);
