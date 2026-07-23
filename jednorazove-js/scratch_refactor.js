const fs = require('fs');
const path = require('path');

const root = __dirname;
const dirs = {
    clanky: path.join(root, 'clanky'),
    stranky: path.join(root, 'stranky'),
    nastroje: path.join(root, 'nastroje'),
    js: path.join(root, 'js'),
    imagesOstatni: path.join(root, 'images', 'ostatni')
};

// Create dirs
Object.values(dirs).forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. Move images and create map
const imageMap = {};
const imagesDir = path.join(root, 'images');
if (fs.existsSync(imagesDir)) {
    fs.readdirSync(imagesDir).forEach(file => {
        const fullPath = path.join(imagesDir, file);
        if (fs.statSync(fullPath).isFile()) {
            const newPath = path.join(dirs.imagesOstatni, file);
            fs.renameSync(fullPath, newPath);
            // Replace images/file.ext with images/ostatni/file.ext
            imageMap[`images/${file}`] = `images/ostatni/${file}`;
        }
    });
}

// 2. Identify HTML files and their new locations
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html') && fs.statSync(path.join(root, f)).isFile());
const fileMap = {}; // old name -> { newDir, isRoot }

htmlFiles.forEach(f => {
    if (f === 'index.html') {
        fileMap[f] = { dir: root, depth: 0 };
    } else if (f.startsWith('blog-')) {
        fileMap[f] = { dir: dirs.clanky, depth: 1, prefix: 'clanky/' };
    } else {
        fileMap[f] = { dir: dirs.stranky, depth: 1, prefix: 'stranky/' };
    }
});

// 3. Move JS and tools
const jsFiles = fs.readdirSync(root).filter(f => f.endsWith('.js') && fs.statSync(path.join(root, f)).isFile());
jsFiles.forEach(f => {
    if (f === 'script.js') {
        fs.renameSync(path.join(root, f), path.join(dirs.js, f));
    } else if (f !== 'scratch_refactor.js') {
        fs.renameSync(path.join(root, f), path.join(dirs.nastroje, f));
    }
});

// Helper to calculate relative path from one depth to another target
function getRelativeTarget(fromDepth, targetPrefix, targetName) {
    let res = '';
    for(let i=0; i<fromDepth; i++) res += '../';
    if (targetPrefix) res += targetPrefix;
    res += targetName;
    return res;
}

// 4. Update HTML contents and move them
htmlFiles.forEach(f => {
    let content = fs.readFileSync(path.join(root, f), 'utf8');
    const info = fileMap[f];
    
    // Replace all links to other HTML files
    Object.keys(fileMap).forEach(targetFile => {
        const tInfo = fileMap[targetFile];
        const relPath = getRelativeTarget(info.depth, tInfo.prefix, targetFile);
        
        // Regex to match exact href="targetFile" or href='targetFile'
        const regex = new RegExp(`href=["']${targetFile}(#[^"']*)?["']`, 'g');
        content = content.replace(regex, `href="${relPath}$1"`);
    });
    
    // Replace images/ links (for both src and href, e.g. logos)
    // First, map loose images
    Object.keys(imageMap).forEach(oldImg => {
        const newImg = imageMap[oldImg];
        const prefix = info.depth > 0 ? '../' : '';
        // Also we must update images/ reference even if not a loose image, to ../images/ if depth > 0
        content = content.split(oldImg).join(prefix + newImg);
    });
    
    // Replace remaining generic images/, fonts/, etc if we are in a subfolder
    if (info.depth > 0) {
        // Find href="style.css" or src="script.js" or src="images/..." and prepend ../
        content = content.replace(/href=["']style\.css["']/g, `href="../style.css"`);
        content = content.replace(/src=["']script\.js["']/g, `src="../js/script.js"`);
        content = content.replace(/src=["']images\//g, `src="../images/`);
        content = content.replace(/href=["']images\//g, `href="../images/`);
        // If there are other assets like fonts, etc we might need to adjust, but letokruh-web uses fonts from web mostly or via CSS.
    } else {
        // If root, just update script.js path
        content = content.replace(/src=["']script\.js["']/g, `src="js/script.js"`);
    }

    // Now write the file to the new location and delete the old one (if moved)
    const targetPath = path.join(info.dir, f);
    fs.writeFileSync(targetPath, content, 'utf8');
    if (info.dir !== root) {
        fs.unlinkSync(path.join(root, f));
    }
});

// 5. Delete garbage files if they exist
const garbage = ['style.css_append', 'style.css_team_clean', 'Kontakt'];
garbage.forEach(g => {
    const p = path.join(root, g);
    if (fs.existsSync(p)) fs.unlinkSync(p);
});

console.log('Refactoring complete!');
