const fs = require('fs');

function sanitizeSlug(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

const posts = JSON.parse(fs.readFileSync('scratch_blog_posts.json', 'utf8'));
let blogHtml = fs.readFileSync('blog.html', 'utf8');

const headerMatch = blogHtml.match(/([\s\S]*?)<div class="breadcrumb-container">/);
const footerMatch = blogHtml.match(/(<footer id="contact" class="footer_section">[\s\S]*?<\/html>)/);
const ctaMatch = blogHtml.match(/(<!-- CTA Section -->[\s\S]*?)<footer id="contact" class="footer_section">/);

const headerPart = headerMatch[1];
const footerPart = footerMatch[1];
const ctaPart = ctaMatch ? ctaMatch[1] : '';

posts.forEach(post => {
    const slug = sanitizeSlug(post.title);
    const fileName = `blog-${slug}.html`;
    const dateStr = formatDate(post.date);
    
    let imageUrl = '';
    if (post.acf && post.acf.fotografie_blog && post.acf.fotografie_blog.url) {
        imageUrl = post.acf.fotografie_blog.url;
    }
    
    const imageHtml = imageUrl ? `<div class="blog_post_image" style="margin-bottom: 40px;"><img src="${imageUrl}" alt="${post.title}" style="width: 100%; height: auto; border-radius: 20px;"></div>` : '';
    
    const breadcrumb = `
    <div class="breadcrumb-container">
        <a href="index.html" class="breadcrumb-link-home">Úvodní strana</a>
        <span class="breadcrumb-separator">&gt;</span>
        <a href="blog.html" class="breadcrumb-link-home">Blog</a>
        <span class="breadcrumb-separator">&gt;</span>
        <span class="breadcrumb-current">${post.title}</span>
    </div>`;
    
    const contentHtml = `
    <section class="section_container" style="background-color: #fcf4ef; padding: 40px 0;">
        <div class="blog_post_wrapper" style="max-width: 1200px; margin: 0 auto; padding: 0 40px;">
            <p class="blog_post_date" style="color: #666; margin-bottom: 10px;">${dateStr}</p>
            <h1 style="margin-bottom: 40px;">${post.title}</h1>
            ${imageHtml}
            <div class="blog_post_content" style="font-size: 1.1rem; line-height: 1.6; color: #43382d;">
                ${post.content}
            </div>
        </div>
    </section>
    
    `;
    
    const fullHtml = headerPart + breadcrumb + contentHtml + ctaPart + footerPart;
    fs.writeFileSync(fileName, fullHtml, 'utf8');
});

console.log('Successfully regenerated blog pages without duplicated CTA');
