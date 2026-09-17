const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const rootFooterGrid = `<div class="footer_nav_grid">
                <!-- Col 1: Úvodní strana -->
                <div class="footer_nav_col">
                    <h4><a href="index.html">Úvodní strana</a></h4>
                    <ul>
                        <li><a href="index.html#o-letokruhu">Kdo jsme a co děláme</a></li>
                        <li><a href="index.html#co-se-deje">Co se děje v Letokruhu</a></li>
                        <li><a href="index.html#s-kym-pracujeme">S kým pracujeme</a></li>
                        <li><a href="index.html#pribehy-dobrovolniku">Příběhy dobrovolníků</a></li>
                        <li><a href="index.html#partners">Partneři</a></li>
                    </ul>
                </div>
                <!-- Col 2: O nás -->
                <div class="footer_nav_col">
                    <h4><a href="stranky/onas.html">O nás</a></h4>
                    <ul>
                        <li><a href="stranky/onas.html#nase-mise">Naše mise</a></li>
                        <li><a href="stranky/onas.html#pobocky">Pobočky</a></li>
                        <li><a href="stranky/onas.html#nas-tym">Náš tým</a></li>
                        <li><a href="stranky/onas.html#co-se-deje">Co se děje v Letokruhu</a></li>
                        <li><a href="stranky/onas.html#projekty">Naše projekty</a></li>
                    </ul>
                </div>
                <!-- Col 3: Dobrovolnictví -->
                <div class="footer_nav_col">
                    <h4><a href="stranky/dobrovolnictvi.html">Dobrovolnictví</a></h4>
                    <ul>
                        <li><a href="stranky/dobrovolnictvi.html#stan-se-dobrovolnikem">Staň se dobrovolníkem</a></li>
                        <li><a href="stranky/dobrovolnictvi.html#aktualne-hledame">Aktuálně hledáme</a></li>
                        <li><a href="stranky/dobrovolnictvi.html#aktivity">Nejčastější aktivity</a></li>
                        <li><a href="stranky/dobrovolnictvi.html#pribehy">Příběhy dobrovolníků</a></li>
                    </ul>
                </div>
                <!-- Col 4: Program -->
                <div class="footer_nav_col">
                    <h4><a href="stranky/program.html">Program</a></h4>
                    <ul>
                        <li><a href="stranky/program-spolecnik-seniora.html">Společník seniora</a></li>
                        <li><a href="stranky/program.html#aktualni-akce">Aktuální akce</a></li>
                        <li><a href="stranky/program.html#archiv-akci">Archiv akcí</a></li>
                    </ul>
                </div>
                <!-- Col 5: Dobroklub -->
                <div class="footer_nav_col">
                    <h4><a href="stranky/dobroklub.html">Dobroklub</a></h4>
                    <ul>
                        <li><a href="stranky/dobroklub.html#clenstvi">Jak se stát členem</a></li>
                        <li><a href="stranky/blog.html">Blog komunity</a></li>
                    </ul>
                </div>
                <!-- Col 6: Firemní partnerství -->
                <div class="footer_nav_col">
                    <h4><a href="stranky/firemni-partnerstvi.html">Firemní partnerství</a></h4>
                    <ul>
                        <li><a href="stranky/firemni-partnerstvi.html#moznosti-spoluprace">Možnosti spolupráce</a></li>
                        <li><a href="stranky/firemni-partnerstvi.html#kdo-vam-pomuze">Kdo vám pomůže pomáhat</a></li>
                    </ul>
                </div>
                <!-- Col 7: Kontakt -->
                <div class="footer_nav_col">
                    <h4><a href="stranky/kontakt.html">Kontakt</a></h4>
                    <ul class="footer_contact_list">
                        <li><a href="stranky/kontakt.html#pobocky">Pobočky</a></li>
                        <li><a href="tel:+420603483487" class="highlight_contact">+420 603 483 487</a></li>
                        <li><a href="mailto:info@letokruh.eu" class="highlight_contact">info@letokruh.eu</a></li>
                        <li class="contact_address">
                            Letokruh, z.ú.<br>
                            Michelská 21/61<br>
                            141 00 Praha 4
                        </li>
                    </ul>
                </div>
            </div>`;

const subFooterGrid = `<div class="footer_nav_grid">
                <!-- Col 1: Úvodní strana -->
                <div class="footer_nav_col">
                    <h4><a href="../index.html">Úvodní strana</a></h4>
                    <ul>
                        <li><a href="../index.html#o-letokruhu">Kdo jsme a co děláme</a></li>
                        <li><a href="../index.html#co-se-deje">Co se děje v Letokruhu</a></li>
                        <li><a href="../index.html#s-kym-pracujeme">S kým pracujeme</a></li>
                        <li><a href="../index.html#pribehy-dobrovolniku">Příběhy dobrovolníků</a></li>
                        <li><a href="../index.html#partners">Partneři</a></li>
                    </ul>
                </div>
                <!-- Col 2: O nás -->
                <div class="footer_nav_col">
                    <h4><a href="../stranky/onas.html">O nás</a></h4>
                    <ul>
                        <li><a href="../stranky/onas.html#nase-mise">Naše mise</a></li>
                        <li><a href="../stranky/onas.html#pobocky">Pobočky</a></li>
                        <li><a href="../stranky/onas.html#nas-tym">Náš tým</a></li>
                        <li><a href="../stranky/onas.html#co-se-deje">Co se děje v Letokruhu</a></li>
                        <li><a href="../stranky/onas.html#projekty">Naše projekty</a></li>
                    </ul>
                </div>
                <!-- Col 3: Dobrovolnictví -->
                <div class="footer_nav_col">
                    <h4><a href="../stranky/dobrovolnictvi.html">Dobrovolnictví</a></h4>
                    <ul>
                        <li><a href="../stranky/dobrovolnictvi.html#stan-se-dobrovolnikem">Staň se dobrovolníkem</a></li>
                        <li><a href="../stranky/dobrovolnictvi.html#aktualne-hledame">Aktuálně hledáme</a></li>
                        <li><a href="../stranky/dobrovolnictvi.html#aktivity">Nejčastější aktivity</a></li>
                        <li><a href="../stranky/dobrovolnictvi.html#pribehy">Příběhy dobrovolníků</a></li>
                    </ul>
                </div>
                <!-- Col 4: Program -->
                <div class="footer_nav_col">
                    <h4><a href="../stranky/program.html">Program</a></h4>
                    <ul>
                        <li><a href="../stranky/program-spolecnik-seniora.html">Společník seniora</a></li>
                        <li><a href="../stranky/program.html#aktualni-akce">Aktuální akce</a></li>
                        <li><a href="../stranky/program.html#archiv-akci">Archiv akcí</a></li>
                    </ul>
                </div>
                <!-- Col 5: Dobroklub -->
                <div class="footer_nav_col">
                    <h4><a href="../stranky/dobroklub.html">Dobroklub</a></h4>
                    <ul>
                        <li><a href="../stranky/dobroklub.html#clenstvi">Jak se stát členem</a></li>
                        <li><a href="../stranky/blog.html">Blog komunity</a></li>
                    </ul>
                </div>
                <!-- Col 6: Firemní partnerství -->
                <div class="footer_nav_col">
                    <h4><a href="../stranky/firemni-partnerstvi.html">Firemní partnerství</a></h4>
                    <ul>
                        <li><a href="../stranky/firemni-partnerstvi.html#moznosti-spoluprace">Možnosti spolupráce</a></li>
                        <li><a href="../stranky/firemni-partnerstvi.html#kdo-vam-pomuze">Kdo vám pomůže pomáhat</a></li>
                    </ul>
                </div>
                <!-- Col 7: Kontakt -->
                <div class="footer_nav_col">
                    <h4><a href="../stranky/kontakt.html">Kontakt</a></h4>
                    <ul class="footer_contact_list">
                        <li><a href="../stranky/kontakt.html#pobocky">Pobočky</a></li>
                        <li><a href="tel:+420603483487" class="highlight_contact">+420 603 483 487</a></li>
                        <li><a href="mailto:info@letokruh.eu" class="highlight_contact">info@letokruh.eu</a></li>
                        <li class="contact_address">
                            Letokruh, z.ú.<br>
                            Michelská 21/61<br>
                            141 00 Praha 4
                        </li>
                    </ul>
                </div>
            </div>`;

function getAllHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('scratch')) {
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

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const isRoot = path.dirname(file) === rootDir;
    const newGrid = isRoot ? rootFooterGrid : subFooterGrid;

    if (content.includes('<div class="footer_nav_grid">')) {
        const startIdx = content.indexOf('<div class="footer_nav_grid">');
        const feedbackIdx = content.indexOf('<!-- Feedback Section -->', startIdx);
        const feedbackDivIdx = content.indexOf('<div class="footer_feedback">', startIdx);
        
        let endIdx = -1;
        let suffix = '';
        if (feedbackIdx !== -1) {
            endIdx = feedbackIdx;
            suffix = '<!-- Feedback Section -->';
        } else if (feedbackDivIdx !== -1) {
            endIdx = feedbackDivIdx;
            suffix = '<div class="footer_feedback">';
        }

        if (startIdx !== -1 && endIdx !== -1) {
            content = content.slice(0, startIdx) + newGrid + '\n            ' + suffix + content.slice(endIdx + suffix.length);
            fs.writeFileSync(file, content, 'utf8');
            updatedCount++;
        }
    }
});

console.log(`Successfully synced exact top-navbar dropdown links to footer grid across ${updatedCount} HTML files.`);
