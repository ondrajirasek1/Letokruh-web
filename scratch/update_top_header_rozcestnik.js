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

const subfolderRozcestnik = `        <div class="top-header-center">
            <nav class="top-header-rozcestnik">
                <a href="../stranky/onas.html" class="top-rozcestnik-item">Kdo jsme a co děláme</a>
                <a href="../stranky/aktuality.html" class="top-rozcestnik-item">Co se děje v Letokruhu</a>
                <a href="../stranky/prijimaci-organizace.html" class="top-rozcestnik-item">S kým pracujeme</a>
                <a href="../pribehy/pribehy.html" class="top-rozcestnik-item">Příběhy dobrovolníků</a>
                <a href="../stranky/firemni-partnerstvi.html" class="top-rozcestnik-item">Partneři</a>
            </nav>
        </div>\n        <div class="top-header-right">`;

const rootRozcestnik = `        <div class="top-header-center">
            <nav class="top-header-rozcestnik">
                <a href="stranky/onas.html" class="top-rozcestnik-item">Kdo jsme a co děláme</a>
                <a href="stranky/aktuality.html" class="top-rozcestnik-item">Co se děje v Letokruhu</a>
                <a href="stranky/prijimaci-organizace.html" class="top-rozcestnik-item">S kým pracujeme</a>
                <a href="pribehy/pribehy.html" class="top-rozcestnik-item">Příběhy dobrovolníků</a>
                <a href="stranky/firemni-partnerstvi.html" class="top-rozcestnik-item">Partneři</a>
            </nav>
        </div>\n        <div class="top-header-right">`;

// Match <div class="top-header-right"> inside top-header if top-header-center is not already there
const targetPattern = /<div class="top-header-right">/;
const checkPattern = /class="top-header-rozcestnik"/;

htmlFiles.forEach(filePath => {
    const isRoot = path.dirname(filePath) === rootDir;
    const content = fs.readFileSync(filePath, 'utf8');

    if (!checkPattern.test(content) && targetPattern.test(content)) {
        const replacement = isRoot ? rootRozcestnik : subfolderRozcestnik;
        const newContent = content.replace(targetPattern, replacement);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            updatedCount++;
            console.log(`Updated rozcestnik in: ${path.relative(rootDir, filePath)}`);
        }
    } else {
        console.log(`Already updated or no match: ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
