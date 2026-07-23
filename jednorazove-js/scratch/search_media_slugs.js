const fs = require('fs');
const list = JSON.parse(fs.readFileSync('all_media_list.json', 'utf8'));
const keywords = ['organiz', 'spolecn', 'prijim', 'workshop', 'aktiviz', 'teras', 'balon', 'mics', 'mic', 'vyloha', 'okno', 'skol', 'dobrovol', 'senior', 'spolec'];
list.forEach((m) => {
  const s = (m.slug + ' ' + (m.url || '')).toLowerCase();
  if (keywords.some((k) => s.includes(k))) {
    console.log(m.slug, '|', m.url);
  }
});
