const fs = require('fs');
const s = fs.readFileSync('C:/Users/12283/WorkBuddy/2026-10-06-22-09-15/scrape-work/raw/sy_index.js', 'utf8');

const uniq = (a) => [...new Set(a)];
const paths = uniq([...s.matchAll(/path:"([^"]{1,80})"/g)].map(m => m[1]));
const names = uniq([...s.matchAll(/name:"([a-zA-Z0-9_-]{2,40})"/g)].map(m => m[1]));

console.log('ROUTE_PATHS=' + JSON.stringify(paths));
console.log('NAMES=' + JSON.stringify(names.slice(0, 80)));

// webpack chunk map: {0:"xxxx",1:"yyy"}  -> static/js/name.hash.js
const chunks = [...s.matchAll(/\{(\d+):"([0-9a-f]{8})"/g)].map(m => m[1] + ':' + m[2]);
console.log('CHUNKMAP_HINT=' + JSON.stringify(uniq(chunks).slice(0, 80)));

// direct references to static/js/*.js
const js = uniq([...s.matchAll(/static\/js\/([A-Za-z0-9._-]+\.js)/g)].map(m => m[1]));
console.log('JS_REFS=' + JSON.stringify(js));
