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
                <a href="../index.html#o-letokruhu" class="nav_dropdown_item">Kdo jsme a co děláme</a>
                <a href="../index.html#co-se-deje" class="nav_dropdown_item">Co se děje v Letokruhu</a>
                <a href="../index.html#s-kym-pracujeme" class="nav_dropdown_item">S kým pracujeme</a>
                <a href="../index.html#pribehy-dobrovolniku" class="nav_dropdown_item">Příběhy dobrovolníků</a>
                <a href="../index.html#partners" class="nav_dropdown_item">Partneři</a>
            </div>
        </div>`;

const rootLogoDropdown = `        <div class="logo_desktop nav_dropdown">
            <a href="index.html" class="nav_logo_link" title="Letokruh - Hlavní stránka">
                <img src="images/logos/Letokruh_logo_horizontal.png" alt="Letokruh Logo" class="nav_logo_img">
            </a>
            <div class="nav_dropdown_menu">
                <a href="#o-letokruhu" class="nav_dropdown_item">Kdo jsme a co děláme</a>
                <a href="#co-se-deje" class="nav_dropdown_item">Co se děje v Letokruhu</a>
                <a href="#s-kym-pracujeme" class="nav_dropdown_item">S kým pracujeme</a>
                <a href="#pribehy-dobrovolniku" class="nav_dropdown_item">Příběhy dobrovolníků</a>
                <a href="#partners" class="nav_dropdown_item">Partneři</a>
            </div>
        </div>`;

// Regex to replace logo_desktop div
const logoDesktopRegex = /<div class="logo_desktop[^"]*">[\s\S]*?<\/div>/;

htmlFiles.forEach(filePath => {
    const isRoot = path.dirname(filePath).replace(/\\/g, '/') === rootDir.replace(/\\/g, '/');
    let content = fs.readFileSync(filePath, 'utf8');

    if (logoDesktopRegex.test(content)) {
        const replacement = isRoot ? rootLogoDropdown : subfolderLogoDropdown;
        content = content.replace(logoDesktopRegex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`Updated logo dropdown in: ${path.relative(rootDir, filePath)}`);
    } else {
        console.log(`NO MATCH FOR LOGO DESKTOP IN: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
