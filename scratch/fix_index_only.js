const fs = require('fs');

const indexFile = 'c:/Users/ondra/Documents/WBA/letokruh-web/index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// 1. Add section IDs
content = content.replace('<section class="about_section">', '<section id="o-letokruhu" class="about_section">');
content = content.replace('<section class="news_section">', '<section id="co-se-deje" class="news_section">');
content = content.replace('<section class="volunteers_section">', '<section id="s-kym-pracujeme" class="volunteers_section">');
content = content.replace('<section class="stories_section">', '<section id="pribehy-dobrovolniku" class="stories_section">');

// 2. Replace logo_desktop
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

content = content.replace(/<div class="logo_desktop[^"]*">[\s\S]*?<\/div>/, rootLogoDropdown);

// 3. Wrap action buttons in nav_buttons_stacked with regex
const buttonsRegex = /<a href="stranky\/stan-se-dobrovolnikem\.html"[\s\S]*?<\/a>\s*<a href="stranky\/podpor-dobro\.html"[\s\S]*?<\/a>/;

const newButtons = `<div class="nav_buttons_stacked">
                <a href="stranky/stan-se-dobrovolnikem.html" class="button_nav_cta btn-sjednoceny">Staň se dobrovolníkem</a>
                <a href="stranky/podpor-dobro.html" class="button_nav_support"><i class="fa-solid fa-heart"></i> Podpoř Letokruh</a>
            </div>`;

content = content.replace(buttonsRegex, newButtons);

fs.writeFileSync(indexFile, content, 'utf8');
console.log('Successfully updated index.html cleanly!');
