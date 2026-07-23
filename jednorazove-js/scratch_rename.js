const fs = require('fs');
const path = require('path');

const root = __dirname;
const clankyDir = path.join(root, 'clanky');
const blogDir = path.join(root, 'blog');
const nastrojeDir = path.join(root, 'nastroje');
const pomocneDir = path.join(root, 'pomocne js');

// Rename directories
if (fs.existsSync(clankyDir)) {
    fs.renameSync(clankyDir, blogDir);
}
if (fs.existsSync(nastrojeDir)) {
    fs.renameSync(nastrojeDir, pomocneDir);
}

// Find all HTML files in root, stranky, and blog
const htmlFiles = [];

// Root
fs.readdirSync(root).forEach(f => {
    if (f.endsWith('.html') && fs.statSync(path.join(root, f)).isFile()) {
        htmlFiles.push(path.join(root, f));
    }
});

// stranky
const strankyDir = path.join(root, 'stranky');
if (fs.existsSync(strankyDir)) {
    fs.readdirSync(strankyDir).forEach(f => {
        if (f.endsWith('.html')) htmlFiles.push(path.join(strankyDir, f));
    });
}

// blog (formerly clanky)
if (fs.existsSync(blogDir)) {
    fs.readdirSync(blogDir).forEach(f => {
        if (f.endsWith('.html')) htmlFiles.push(path.join(blogDir, f));
    });
}

// Replace 'clanky/' with 'blog/' in hrefs
htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace ../clanky/ with ../blog/ and clanky/ with blog/
    content = content.replace(/href=["'](\.\.\/)*clanky\//g, match => match.replace('clanky/', 'blog/'));
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Renamed successfully!');
