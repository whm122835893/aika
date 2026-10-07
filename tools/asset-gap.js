/**
 * Asset gap audit: collect every URL referenced by CSS / JS / page snapshots /
 * cached API payloads, then report which ones have no local mirror.
 */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');

const ASSET_EXT = /\.(png|jpe?g|gif|webp|svg|ico|bmp|woff2?|ttf|otf|eot|mp4|mp3|json)(\?|#|$)/i;
const HOSTS = ['h5.shenyuan.sc.cn', 'cdn.dcloud.net.cn', 'cstaticdun.126.net', 'o.alicdn.com', 'g.alicdn.com',
  'js.cdn.aliyun.dcloud.net.cn', 'alicdn.com'];

const refs = new Map(); // url -> Set(source)
function note(url, src) {
  if (!url) return;
  if (url.startsWith('data:')) return;
  let u = url.replace(/^["'(]+/, '').replace(/["')\\]+$/, '');
  if (!/^https?:\/\//.test(u) && !u.startsWith('//') && !u.startsWith('/')) return;
  if (u.startsWith('//')) u = 'https:' + u;
  if (!HOSTS.some((h) => u.includes(h))) return;
  if (!ASSET_EXT.test(u)) return;
  if (!refs.has(u)) refs.set(u, new Set());
  refs.get(u).add(src);
}

const TEXT_EXT = new Set(['.css', '.js', '.html', '.json']);
function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, fn);
    else fn(abs);
  }
}

console.log('扫描引用...');
walk(OUT, (abs) => {
  const ext = path.extname(abs).toLowerCase();
  if (!TEXT_EXT.has(ext)) return;
  // skip the api-cache: handled separately below (kept, it is where dynamic URLs live)
  let txt;
  try { txt = fs.readFileSync(abs, 'utf8'); } catch (e) { return; }
  const rel = path.relative(OUT, abs).replace(/\\/g, '/');
  for (const m of txt.matchAll(/https?:\/\/[^"'\s)\\<>]+/g)) note(m[0], rel);
  for (const m of txt.matchAll(/url\(([^)]+)\)/g)) note(m[1].replace(/["']/g, ''), rel);
  for (const m of txt.matchAll(/"(\/static\/[^"]+)"/g)) note('https://h5.shenyuan.sc.cn' + m[1], rel);
  for (const m of txt.matchAll(/"(\/upload\/[^"]+)"/g)) note('https://h5.shenyuan.sc.cn' + m[1], rel);
});

function localCandidate(u) {
  try {
    const url = new URL(u);
    let hostDir = '';
    if (url.hostname === 'h5.shenyuan.sc.cn') hostDir = '';
    else hostDir = 'assets/ext/' + url.hostname;
    let p = decodeURIComponent(url.pathname);
    if (p === '/' ) p = '/index.html';
    return path.join(OUT, hostDir, p);
  } catch (e) { return null; }
}

const missing = [];
const present = [];
for (const [u, srcs] of refs) {
  const abs = localCandidate(u);
  if (abs && fs.existsSync(abs)) present.push(u);
  else missing.push({ u, srcs: [...srcs].slice(0, 2) });
}

console.log('引用总数（去重后）: ' + refs.size);
console.log('本地已有: ' + present.length);
console.log('本地缺失: ' + missing.length);
if (missing.length) {
  console.log('\n=== 缺失明细（按来源）===');
  const byHost = {};
  missing.forEach((m) => {
    let h = '';
    try { h = new URL(m.u).hostname; } catch (e) { h = '?'; }
    (byHost[h] = byHost[h] || []).push(m);
  });
  for (const h in byHost) {
    console.log('\n[' + h + '] 缺失 ' + byHost[h].length + ' 个');
    byHost[h].slice(0, 25).forEach((m) => console.log('  ' + decodeURIComponent(m.u).slice(0, 120) + '   <- ' + m.srcs.join(', ')));
  }
}
fs.writeFileSync(path.join(ROOT, 'scrape-work', 'asset-gaps.json'),
  JSON.stringify({ total: refs.size, present: present.length, missing }, null, 1), 'utf8');
console.log('\n明细写入 scrape-work/asset-gaps.json');
