const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(getFiles(file));
            }
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

// 1. Read the source footer from stranky/dobrovolnictvi.html
const sourcePath = path.join(__dirname, 'stranky', 'dobrovolnictvi.html');
const sourceContent = fs.readFileSync(sourcePath, 'utf8');

const footerRegex = /<footer id="contact" class="footer_section">[\s\S]*?<\/footer>/i;
const sourceFooterMatch = sourceContent.match(footerRegex);

if (!sourceFooterMatch) {
    console.error("Could not find footer in stranky/dobrovolnictvi.html!");
    process.exit(1);
}

const exactFooter = sourceFooterMatch[0];
console.log("Source footer found successfully.");

// 2. Iterate through all other HTML files and replace their footer with exactFooter
const htmlFiles = getFiles(__dirname);

htmlFiles.forEach(filePath => {
    // Skip scratch files
    const baseName = path.basename(filePath);
    if (baseName.startsWith('scratch_')) return;
    
    // Skip the source file itself
    if (filePath === sourcePath) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, exactFooter);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated exact footer in: ${path.relative(__dirname, filePath)}`);
    } else {
        console.log(`No footer found in: ${path.relative(__dirname, filePath)}`);
    }
});
