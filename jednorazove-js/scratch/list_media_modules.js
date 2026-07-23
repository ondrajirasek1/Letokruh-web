const fs = require('fs');
const path = require('path');
const js = fs.readFileSync(path.join(process.env.TEMP, 'main_live.chunk.js'), 'utf8');
const marker = 'e.exports=a.p+"static/media/';
let i = 0;
let pos = 0;
const list = [];
while ((pos = js.indexOf(marker, pos)) !== -1) {
  const start = pos + marker.length;
  const end = js.indexOf('"', start);
  list.push({ idx: i, file: js.substring(start, end) });
  i++;
  pos = end;
}
console.log('Total media exports:', list.length);
list.forEach((x) => {
  const f = x.file.toLowerCase();
  if (/org|spolec|volunt|junior|wwh|where|help|senior|dobro|activ/.test(f)) {
    console.log(x.idx, x.file);
  }
});
// Show modules around 59 if we can map by counting from chunk start
// Also dump 55-65
console.log('\nModules 55-65:');
list.slice(55, 66).forEach((x) => console.log(x.idx, x.file));
