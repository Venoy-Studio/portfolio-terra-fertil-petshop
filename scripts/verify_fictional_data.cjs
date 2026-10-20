const fs = require('fs');
const path = require('path');

const OLD_TERMS = [
  '5595991105815',
  '99110-5815',
  '3626-3445',
  '3628-1919',
  '3625-8184',
  '99141-3253',
  'Ataíde Teive',
  'Aldemar Bantim',
  'Homem de Melo',
  'terrafertil.loja',
  'voce@email.com'
];

function scanDir(dir) {
  let issues = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      issues += scanDir(full);
    } else if (full.endsWith('.html') || full.endsWith('.js') || full.endsWith('.css')) {
      const content = fs.readFileSync(full, 'utf8');
      OLD_TERMS.forEach(term => {
        if (content.includes(term)) {
          console.error(`[LEAK FOUND] "${term}" in ${full}`);
          issues++;
        }
      });
    }
  }
  return issues;
}

console.log('--- SCANNING pages/ ---');
const pagesIssues = scanDir('pages');

console.log('--- SCANNING public/_next/static/immutable/chunks/ ---');
const chunksIssues = scanDir('public/_next/static/immutable/chunks');

console.log('--- SCANNING index.html ---');
const rootIssues = scanDir('.');

if (pagesIssues === 0 && chunksIssues === 0) {
  console.log('🎉 ALL CHECKS PASSED! Zero old contact data in pages/ and public/_next/!');
} else {
  console.log(`Found ${pagesIssues + chunksIssues} issues to fix.`);
}
