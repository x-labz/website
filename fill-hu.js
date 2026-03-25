const fs = require('fs');

const appJs = fs.readFileSync('assets/js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

// Extract HU translations from app.js
const huBlock = appJs.match(/hu:\s*\{\s*translation:\s*\{([\s\S]*?)\}\s*\}/);
if (!huBlock) { console.error('HU translation block not found'); process.exit(1); }

const translations = {};
for (const m of huBlock[1].matchAll(/"([^"]+)":\s*"([^"]*)"/g)) {
  translations[m[1]] = m[2];
}

// Extract id -> key mappings from updateElement calls
const mappings = [];
for (const m of appJs.matchAll(/updateElement\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g)) {
  mappings.push({ id: m[1], key: m[2] });
}

// Fill HTML elements with HU text
let result = html;
let count = 0;

for (const { id, key } of mappings) {
  const text = translations[key];
  if (!text) continue;

  // Match element with this id and replace its text content
  // Handles: <tag id="xxx">...</tag> and <tag id="xxx"></tag>
  const regex = new RegExp(`(<[^>]+id="${id}"[^>]*>)(.*?)(</\\w+>)`);
  const match = result.match(regex);
  if (match) {
    result = result.replace(regex, `$1${text}$3`);
    count++;
    console.log(`  ${id} <- "${text}"`);
  }
}

fs.writeFileSync('index.html', result, 'utf8');
console.log(`\nDone: ${count} elements filled.`);
