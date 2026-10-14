const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/ondra/Documents/WBA/letokruh-web';

function walk(dir) {
    let files = [];
    for (const f of fs.readdirSync(dir)) {
        if (f === 'node_modules' || f === '.git' || f === 'scratch') continue;
        const fp = path.join(dir, f);
        if (fs.statSync(fp).isDirectory()) files = files.concat(walk(fp));
        else if (f.endsWith('.html')) files.push(fp);
    }
    return files;
}

const all = walk(rootDir);
let count = 0;

all.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    const isRoot = path.dirname(file).replace(/\\/g, '/') === rootDir.replace(/\\/g, '/');
    const prefix = isRoot ? 'stranky/' : '../stranky/';

    let modified = false;

    // Check navbar dropdown:
    // Regex matching the Příběhy dobrovolníků line in nav_dropdown_menu
    const navRegex = new RegExp(`(<a href="[^"]*dobrovolnictvi\\.html#pribehy" class="nav_dropdown_item">Příběhy dobrovolníků<\\/a>)(?!\\s*<a href="[^"]*dobrovolnictvi\\.html#prijimaci-organizace")`, 'g');
    if (navRegex.test(text)) {
        text = text.replace(navRegex, `$1\r\n                    <a href="${prefix}dobrovolnictvi.html#prijimaci-organizace" class="nav_dropdown_item">Přijímací organizace</a>`);
        modified = true;
    }

    // Check footer:
    // Regex matching the Příběhy dobrovolníků line in footer
    const footerRegex = new RegExp(`(<li><a href="[^"]*dobrovolnictvi\\.html#pribehy">Příběhy dobrovolníků<\\/a><\\/li>)(?!\\s*<li><a href="[^"]*dobrovolnictvi\\.html#prijimaci-organizace")`, 'g');
    if (footerRegex.test(text)) {
        text = text.replace(footerRegex, `$1\r\n                        <li><a href="${prefix}dobrovolnictvi.html#prijimaci-organizace">Přijímací organizace</a></li>`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, text, 'utf8');
        count++;
    }
});

console.log(`Updated ${count} files with Přijímací organizace navigation and footer items.`);
