const fs = require('fs');

const media = JSON.parse(fs.readFileSync('all_media_list.json', 'utf8'));

const terms = ['rdc', 'dny', 'den', 'vozik', 'wheelchair', 'dobrovol', 'projekty', 'centrum'];
media.forEach(m => {
  const match = terms.some(t => m.slug.toLowerCase().includes(t) || m.url.toLowerCase().includes(t));
  if (match) {
    console.log(`Slug: ${m.slug} | URL: ${m.url}`);
  }
});

