const fs = require('fs');
const path = require('path');

const rootDir = path.normalize('c:/Users/ondra/Documents/WBA/letokruh-web');
const rootIndexPath = path.normalize(path.join(rootDir, 'index.html'));

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

const subfolderLogoDropdown = `        <div class="logo_desktop nav_dropdown">
            <a href="../index.html" class="nav_logo_link" title="Letokruh - Hlavní stránka">
                <img src="../images/logos/Letokruh_logo_horizontal.png" alt="Letokruh Logo" class="nav_logo_img">
            </a>
            <div class="nav_dropdown_menu">
                <a href="../stranky/onas.html" class="nav_dropdown_item">Kdo jsme a co děláme</a>
                <a href="../stranky/aktuality.html" class="nav_dropdown_item">Co se děje v Letokruhu</a>
                <a href="../stranky/prijimaci-organizace.html" class="nav_dropdown_item">S kým pracujeme</a>
                <a href="../pribehy/pribehy.html" class="nav_dropdown_item">Příběhy dobrovolníků</a>
                <a href="../stranky/firemni-partnerstvi.html" class="nav_dropdown_item">Partneři</a>
            </div>
        </div>`;

const rootLogoDropdown = `        <div class="logo_desktop nav_dropdown">
            <a href="index.html" class="nav_logo_link" title="Letokruh - Hlavní stránka">
                <img src="images/logos/Letokruh_logo_horizontal.png" alt="Letokruh Logo" class="nav_logo_img">
            </a>
            <div class="nav_dropdown_menu">
                <a href="stranky/onas.html" class="nav_dropdown_item">Kdo jsme a co děláme</a>
                <a href="stranky/aktuality.html" class="nav_dropdown_item">Co se děje v Letokruhu</a>
                <a href="stranky/prijimaci-organizace.html" class="nav_dropdown_item">S kým pracujeme</a>
                <a href="pribehy/pribehy.html" class="nav_dropdown_item">Příběhy dobrovolníků</a>
                <a href="stranky/firemni-partnerstvi.html" class="nav_dropdown_item">Partneři</a>
            </div>
        </div>`;

const subfolderButtons = `            <div class="nav_buttons_stacked">
                <a href="../stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="../stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

const rootButtons = `            <div class="nav_buttons_stacked">
                <a href="stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

// Exact regexes for pristine baseline files
const logoRegex = /<div class="logo_desktop">[\s\S]*?<\/div>/;
const buttonsRegex = /<a href="[^"]*stan-se-dobrovolnikem\.html"[^>]*>[\s\S]*?<\/a>\s*<a href="[^"]*podpor-dobro\.html"[^>]*>[\s\S]*?<\/a>/i;

htmlFiles.forEach(filePath => {
    const isRoot = path.normalize(filePath) === rootIndexPath;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    if (logoRegex.test(content)) {
        const replacement = isRoot ? rootLogoDropdown : subfolderLogoDropdown;
        content = content.replace(logoRegex, replacement);
        modified = true;
    }

    if (buttonsRegex.test(content)) {
        const replacement = isRoot ? rootButtons : subfolderButtons;
        content = content.replace(buttonsRegex, replacement);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Updated: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
