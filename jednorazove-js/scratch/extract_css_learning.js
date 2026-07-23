const fs = require('fs');
const css = fs.readFileSync(require('path').join(process.env.TEMP, 'main.chunk.css'), 'utf8');
const terms = ['learning_photo', 'dobroklubHero', 'learning_vector'];
for (const t of terms) {
  const i = css.indexOf(t);
  if (i >= 0) {
    console.log('\n' + t + ':');
    console.log(css.substring(Math.max(0, i - 50), i + 400));
  }
}
