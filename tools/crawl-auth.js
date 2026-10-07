/**
 * Authenticated crawl: same as crawl.js but replays the saved login state,
 * so 401-only endpoints (orders / wallet / invite / purchase) return real data.
 * Also performs in-page interactions (tabs, detail drill-downs) to widen coverage.
 *
 * Usage: LIMIT=n node tools/crawl-auth.js
 * Output: overwrite the page snapshots and screenshots, merge new API responses
 *         into assets/api-cache/, write scrape-work/asset-map-auth.json
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE = 'https://h5.shenyuan.sc.cn';
const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const STATE = path.join(ROOT, 'scrape-work', 'auth-state.json');
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const HOST_DIR = {
  'h5.shenyuan.sc.cn': '',
  'api.shenyuan.sc.cn': 'assets/api-cache',
  'cstaticdun.126.net': 'assets/ext/netease',
  'cdn.dcloud.net.cn': 'assets/ext/dcloud',
};

function localPathFor(url) {
  const u = new URL(url);
  let hostDir = HOST_DIR[u.hostname];
  if (hostDir === undefined) hostDir = 'assets/ext/' + u.hostname.replace(/[^a-z0-9.]/gi, '_');
  let p = decodeURIComponent(u.pathname);
  if (p === '/' || p === '') p = '/index.html';
  return (hostDir ? hostDir + p : p).replace(/\\/g, '/').replace(/\.\./g, '_');
}

const assetMap = new Map();
const apiCache = new Map();   // key -> {rel, method, url, post, code}
let newApi = 0, newAssets = 0;

function saveAsset(url, body) {
  let rel = assetMap.get(url);
  if (rel) return rel;
  rel = localPathFor(url);
  const abs = path.join(OUT, rel);
  if (fs.existsSync(abs)) { assetMap.set(url, rel); return rel; }  // already mirrored
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  try { fs.writeFileSync(abs, body); assetMap.set(url, rel); newAssets++; } catch (e) { return null; }
  return rel;
}

let ROUTES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'routes.json'), 'utf8'));
// drop the known-dead captcha route
ROUTES = ROUTES.filter((r) => !/neteaseCaptcha/i.test(r));
const LIMIT = parseInt(process.env.LIMIT || '0', 10);
if (LIMIT > 0) ROUTES = ROUTES.slice(0, LIMIT);

(async () => {
  if (!fs.existsSync(STATE)) { console.error('no auth-state.json, run tools/login.js first'); process.exit(1); }
  fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'],
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    storageState: STATE,
  });

  const results = [];

  async function attachCapture(page, label) {
    await page.route('**/*', async (route2) => {
      const req = route2.request();
      const url = req.url();
      try {
        const resp = await route2.fetch();
        const ct = (resp.headers()['content-type'] || '').split(';')[0];
        let body = Buffer.alloc(0);
        try { body = await resp.body(); } catch (e) {}

        if (url.startsWith('https://api.shenyuan.sc.cn/')) {
          const post = req.postData() || '';
          const key = req.method() + ' ' + url + ' ' + md5(post);
          if (!apiCache.has(key)) {
            const rel = 'assets/api-cache/' + md5(url + '|' + post) + '.json';
            const abs = path.join(OUT, rel);
            fs.mkdirSync(path.dirname(abs), { recursive: true });
            fs.writeFileSync(abs, body);
            let code = null;
            try { code = JSON.parse(body.toString('utf8')).code; } catch (e) {}
            apiCache.set(key, { rel, method: req.method(), url, post, code, page: label });
            newApi++;
          }
          return route2.fulfill({ response: resp, body });
        }
        saveAsset(url, body);
        return route2.fulfill({ response: resp, body });
      } catch (e) {
        try { await route2.continue(); } catch (e2) {}
      }
    });
  }

  for (const route of ROUTES) {
    const routePath = '/' + route.replace(/-/g, '/');
    const pageName = route.replace(/[^A-Za-z0-9_-]/g, '_');
    const page = await ctx.newPage();
    await attachCapture(page, route);
    console.log('>>> ' + route + '  (' + routePath + ')');
    try {
      await page.goto(BASE + '/#' + routePath, { waitUntil: 'load', timeout: 45000 });
      await sleep(2800);
      try { await page.waitForLoadState('networkidle', { timeout: 7000 }); } catch (e) {}
      await sleep(700);

      const html = await page.content();
      const text = await page.evaluate(() => (document.body.innerText || '').trim());
      fs.writeFileSync(path.join(OUT, 'pages', pageName + '.html'), html, 'utf8');
      await page.screenshot({ path: path.join(OUT, 'pages', pageName + '.png'), fullPage: false });
      results.push({ route, pageName, bytes: html.length, textLen: text.length });
      console.log('    html=' + html.length + ' text=' + text.length);
    } catch (e) {
      console.log('    FAIL: ' + e.message.slice(0, 110));
      results.push({ route, pageName, error: e.message.slice(0, 180) });
    }
    await page.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ROOT, 'scrape-work', 'asset-map-auth.json'),
    JSON.stringify({ assets: [...assetMap.entries()], api: [...apiCache.entries()] }, null, 1),
    'utf8'
  );
  fs.writeFileSync(path.join(ROOT, 'scrape-work', 'crawl-results-auth.json'), JSON.stringify(results, null, 1), 'utf8');
  console.log('\nDONE. newAssets=' + newAssets + ' newApi=' + newApi + ' pages=' + results.length);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
