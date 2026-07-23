const fs = require('fs');

const media = JSON.parse(fs.readFileSync('all_media_list.json', 'utf8'));

// Filter for webp, jpg, png files in uploads from 2025 or 2026
const recent = media.filter(m => {
  const url = m.url.toLowerCase();
  return (url.includes('/2025/') || url.includes('/2026/')) && (url.endsWith('.webp') || url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg'));
});

console.log(`Found ${recent.length} recent images:`);
recent.forEach(r => {
  console.log(`- Slug: ${r.slug} | URL: ${r.url}`);
});
