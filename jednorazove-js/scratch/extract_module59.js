const fs = require('fs');
const js = fs.readFileSync(require('path').join(process.env.TEMP, 'main_live.chunk.js'), 'utf8');

// CRA chunk: .push([[0],[ /* modules */ ]])
const pushStart = js.indexOf('.push([[0],');
if (pushStart < 0) {
  console.error('push not found');
  process.exit(1);
}

// Find start of module array after push([[0],
let i = js.indexOf('[', pushStart + 10);
// skip first [0] group - find second array
i = js.indexOf('[', i + 1);
const arrStart = i;

// Parse comma-separated function(e,t,a){...} entries at depth 1
function extractModule(source, moduleId) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escape = false;
  let moduleIndex = -1;
  let moduleStart = -1;

  for (let pos = arrStart; pos < source.length; pos++) {
    const ch = source[pos];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (ch === '\\') escape = true;
      else if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }

    if (ch === '[') {
      if (depth === 0) {
        moduleIndex++;
        if (moduleIndex === moduleId) moduleStart = pos;
      }
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) {
        if (moduleIndex === moduleId) {
          return source.substring(moduleStart, pos + 1);
        }
        if (moduleIndex > moduleId) return null;
      }
    }
  }
  return null;
}

for (const id of [59, 60, 61, 62]) {
  const mod = extractModule(js, id);
  if (!mod) {
    console.log(`Module ${id}: not found`);
    continue;
  }
  const media = mod.match(/static\/media\/[^"]+/);
  console.log(`Module ${id}:`, media ? media[0] : mod.substring(0, 120));
}
