const fs = require('fs');

const media = JSON.parse(fs.readFileSync('all_media_list.json', 'utf8'));

let out = '';
media.forEach(m => {
  out += `ID: ${m.id} | Slug: ${m.slug} | URL: ${m.url}\n`;
});

fs.writeFileSync('scratch_media_list.txt', out);
console.log('Saved all 472 media to scratch_media_list.txt');
