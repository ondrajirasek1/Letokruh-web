const https = require('https');
const fs = require('fs');

async function fetchAllBlogs() {
    let allPosts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const posts = await new Promise((resolve, reject) => {
            https.get(`https://letokruh.eu/wp-json/wp/v2/blog?per_page=100&page=${page}`, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.code && parsed.code === 'rest_post_invalid_page_number') {
                            resolve([]);
                        } else {
                            resolve(parsed);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });

        if (posts.length > 0) {
            allPosts = allPosts.concat(posts);
            page++;
        } else {
            hasMore = false;
        }
    }
    return allPosts;
}

fetchAllBlogs().then(posts => {
    console.log(`Fetched ${posts.length} blog items`);
    const mapped = posts.map(p => ({
        id: p.id,
        title: p.title.rendered,
        date: p.date,
        content: p.content.rendered,
        acf: p.acf
    }));
    fs.writeFileSync('scratch_blog_posts.json', JSON.stringify(mapped, null, 2));
    console.log('Saved to scratch_blog_posts.json');
}).catch(console.error);
