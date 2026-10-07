/**
 * Website Pickpocket - uni-app / SPA crawler
 * Renders every discovered hash route in a real browser, mirrors all network
 * assets to disk, and caches API responses for offline replay.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE = 'https://h5.shenyuan.sc.cn';
const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const ASSET_ROOT = path.join(OUT); // mirror original absolute paths at output root

const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');

const HOST_DIR = {
  'h5.shenyuan.sc.cn': '',            // same-origin -> mirror at root
  'api.shenyuan.sc.cn': 'assets/api-cache',
  'cstaticdun.126.net': 'assets/ext/netease',
  'cdn.dcloud.net.cn': 'assets/ext/dcloud',
};

/** Map an absolute URL to a root-relative local path (keeps original layout). */
function localPathFor(url) {
  const u = new URL(url);
  const hostDir = HOST_DIR[u.hostname];
  if (hostDir === undefined) hostDir = 'assets/ext/' + u.hostname.replace(/[^a-z0-9.]/gi, '_');
  let p = decodeURIComponent(u.pathname);
  if (p === '/' || p === '') p = '/index.html';
  let rel = (hostDir ? hostDir + p : p);
  // sanitize
  rel = rel.replace(/\\/g, '/').replace(/\.\./g, '_');
  return rel; // root-relative, e.g. /static/js/x.js
}

function ensureDirFor(relPath) {
  const abs = path.join(ASSET_ROOT, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  return abs;
}

const assetMap = new Map();   // url -> root-relative local path
const apiCache = new Map();   // apiKey -> root-relative local path

function saveAsset(url, contentType, body) {
  let rel = assetMap.get(url);
  if (rel) return rel;
  rel = localPathFor(url);
  const abs = ensureDirFor(rel);
  try {
    fs.writeFileSync(abs, body);
    assetMap.set(url, rel);
  } catch (e) {
    console.error('  ! save failed ' + rel + ' : ' + e.message);
    return null;
  }
  return rel;
}

let ROUTES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'routes.json'), 'utf8'));
const LIMIT = parseInt(process.env.LIMIT || '0', 10);
if (LIMIT > 0) ROUTES = ROUTES.slice(0, LIMIT);
// webpack chunk name "pages-home-home" -> uni-app route "/pages/home/home"
ROUTES = ROUTES.map((r) => ({ name: r, path: '/' + r.replace(/-/g, '/') }));

(async () => {
  fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'],
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });

  const results = [];

  for (const { name: route, path: routePath } of ROUTES) {
    const pageName = route.replace(/[^A-Za-z0-9_-]/g, '_');
    const page = await ctx.newPage();
    console.log('\n>>> ' + route + '  (' + routePath + ')');

    // capture everything
    await page.route('**/*', async (route2) => {
      const req = route2.request();
      const url = req.url();
      try {
        const resp = await route2.fetch();
        const ct = (resp.headers()['content-type'] || '').split(';')[0];
        let body = Buffer.alloc(0);
        try { body = await resp.body(); } catch (e) {}

        if (url.startsWith('https://api.shenyuan.sc.cn/')) {
          const key = req.method() + ' ' + url + ' ' + md5(req.postData() || '');
          if (!apiCache.has(key)) {
            const rel = 'assets/api-cache/' + md5(url + '|' + (req.postData() || '')) + '.json';
            const abs = ensureDirFor(rel);
            fs.writeFileSync(abs, body);
            apiCache.set(key, { rel, method: req.method(), url, post: req.postData() || '' });
          }
          return route2.fulfill({ response: resp, body });
        }
        saveAsset(url, ct, body);
        return route2.fulfill({ response: resp, body });
      } catch (e) {
        try { await route2.continue(); } catch (e2) {}
      }
    });

    try {
      await page.goto(BASE + '/#' + routePath, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(2500);
      try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
      await page.waitForTimeout(800);

      const html = await page.content();
      const text = await page.evaluate(() => (document.body.innerText || '').trim());
      const outFile = path.join(OUT, 'pages', pageName + '.html');
      fs.writeFileSync(outFile, html, 'utf8');
      await page.screenshot({ path: path.join(OUT, 'pages', pageName + '.png'), fullPage: false });

      results.push({ route, pageName, bytes: html.length, textLen: text.length, title: await page.title() });
      console.log('    html=' + html.length + ' text=' + text.length);
    } catch (e) {
      console.log('    FAIL: ' + e.message.slice(0, 120));
      results.push({ route, pageName, error: e.message.slice(0, 200) });
    }
    await page.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ROOT, 'scrape-work', 'asset-map.json'),
    JSON.stringify({ assets: [...assetMap.entries()], api: [...apiCache.entries()] }, null, 1),
    'utf8'
  );
  fs.writeFileSync(path.join(ROOT, 'scrape-work', 'crawl-results.json'), JSON.stringify(results, null, 1), 'utf8');
  console.log('\nDONE. assets=' + assetMap.size + ' api=' + apiCache.size + ' pages=' + results.length);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
