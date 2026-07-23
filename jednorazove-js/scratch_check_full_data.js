const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'scratch_full_aktuality.json'), 'utf8'));

console.log('Total items:', data.length);
console.log('Items with images:', data.filter(d => d.image).length);
console.log('Items without images:', data.filter(d => !d.image).length);

console.log('\nFirst 10 items:');
data.slice(0, 10).forEach((d, idx) => {
  console.log(`[${idx+1}] Title: ${d.title}`);
  console.log(`    Image: ${d.image}`);
  console.log(`    Content length: ${d.content.length}`);
});
