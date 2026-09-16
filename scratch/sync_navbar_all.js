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

const topHeaderCenterRegex = /<div class="top-header-center">[\s\S]*?<\/div>\s*/g;
const logoDesktopRegex = /<div class="logo_desktop[^"]*">[\s\S]*?<\/div>/;
const buttonsRegex = /<a href="[^"]*stan-se-dobrovolnikem\.html"[^>]*>[\s\S]*?<\/a>\s*<a href="[^"]*podpor-dobro\.html"[^>]*>[\s\S]*?<\/a>/i;

htmlFiles.forEach(filePath => {
    const isRoot = path.normalize(filePath) === path.normalize(path.join(rootDir, 'index.html'));
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove top-header-center if present
    if (topHeaderCenterRegex.test(content)) {
        content = content.replace(topHeaderCenterRegex, '');
        modified = true;
    }

    // 2. Replace logo_desktop with logo dropdown
    if (logoDesktopRegex.test(content)) {
        const logoReplacement = isRoot ? rootLogoDropdown : subfolderLogoDropdown;
        const newContent = content.replace(logoDesktopRegex, logoReplacement);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }

    // 3. Replace CTA buttons with stacked buttons
    if (buttonsRegex.test(content)) {
        const buttonsReplacement = isRoot ? rootButtons : subfolderButtons;
        const newContent = content.replace(buttonsRegex, buttonsReplacement);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Synced navbar in: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
