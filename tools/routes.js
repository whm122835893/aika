const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';

const s = fs.readFileSync(path.join(ROOT, 'scrape-work', 'raw', 'sy_index.js'), 'utf8');
const set = new Set();
for (const m of s.matchAll(/'((?:pages|uni_modules)[A-Za-z0-9_~-]*)'/g)) set.add(m[1]);

// keep only real page routes: pages-<Dir>-<File>  (drop combined chunks with ~ and bare "pages")
const routes = [...set]
  .filter((r) => !r.includes('~'))
  .filter((r) => /^pages-[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(r))
  .sort();

fs.writeFileSync(path.join(ROOT, 'scrape-work', 'routes.json'), JSON.stringify(routes, null, 1), 'utf8');
console.log('routes=' + routes.length);
console.log(routes.join('\n'));
