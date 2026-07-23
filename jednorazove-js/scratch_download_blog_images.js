const fs = require('fs');
const path = require('path');
const https = require('https');

const root = __dirname;
const blogImagesDir = path.join(root, 'images', 'blog fotky');

if (!fs.existsSync(blogImagesDir)) {
    fs.mkdirSync(blogImagesDir, { recursive: true });
}

const posts = JSON.parse(fs.readFileSync('scratch_blog_posts.json', 'utf8'));
const urls = new Set();

posts.forEach(p => {
    if (p.acf && p.acf.fotografie_blog && p.acf.fotografie_blog.url) {
        urls.add(p.acf.fotografie_blog.url);
    }
    const matches = p.content.match(/src="(https:\/\/letokruh\.eu\/wp-content\/uploads\/[^"]+)"/g);
    if (matches) {
        matches.forEach(m => urls.add(m.replace('src="', '').replace('"', '')));
    }
});

const urlMap = {};
let count = 0;

Array.from(urls).forEach(url => {
    let filename = path.basename(url);
    // decode url if needed
    try { filename = decodeURIComponent(filename); } catch(e) {}
    
    // ensure unique filename
    let finalName = filename;
    let index = 1;
    while (Object.values(urlMap).includes(finalName)) {
        const ext = path.extname(filename);
        const base = path.basename(filename, ext);
        finalName = `${base}-${index}${ext}`;
        index++;
    }
    urlMap[url] = finalName;
});

console.log(`Found ${Object.keys(urlMap).length} images to download.`);

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function processAll() {
    for (const [url, filename] of Object.entries(urlMap)) {
        const dest = path.join(blogImagesDir, filename);
        if (!fs.existsSync(dest)) {
            console.log(`Downloading ${filename}...`);
            try {
                await downloadImage(url, dest);
            } catch (err) {
                console.error(err.message);
            }
        }
    }
    
    console.log('Downloads finished. Updating HTML files...');
    
    const htmlFilesToUpdate = [];
    
    // Blog pages
    const blogDir = path.join(root, 'blog');
    if (fs.existsSync(blogDir)) {
        fs.readdirSync(blogDir).forEach(f => {
            if (f.endsWith('.html')) htmlFilesToUpdate.push(path.join(blogDir, f));
        });
    }
    
    // stranky/blog.html
    const strankyBlog = path.join(root, 'stranky', 'blog.html');
    if (fs.existsSync(strankyBlog)) {
        htmlFilesToUpdate.push(strankyBlog);
    }
    
    htmlFilesToUpdate.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        Object.keys(urlMap).forEach(url => {
            const filename = urlMap[url];
            // Encode spaces in filename for html attribute
            const encodedName = filename.replace(/ /g, '%20');
            // The relative path from both stranky/ and blog/ to images/blog fotky/ is ../images/blog fotky/
            // Note: blog fotky has a space, encode it as %20
            const newUrl = `../images/blog%20fotky/${encodedName}`;
            
            // Global replace
            content = content.split(url).join(newUrl);
        });
        fs.writeFileSync(file, content, 'utf8');
    });
    
    console.log('All HTML files updated successfully!');
}

processAll();
