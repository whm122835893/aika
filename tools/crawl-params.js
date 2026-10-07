/**
 * 带参路由补抓：用真实业务 id 打开详情页 / 带 tab 参数的列表页，
 * 让原本「空态」的页面在离线副本里有真实内容。
 *
 * 输出：
 *   output/h5.shenyuan.sc.cn/pages/pages-<route>-<tag>.html|.png
 *   scrape-work/asset-map-params.json（供 build.js 合并进离线 shim）
 *   scrape-work/crawl-results-params.json
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
const apiCache = new Map();
let newApi = 0, newAssets = 0;
function saveAsset(url, body) {
  let rel = assetMap.get(url);
  if (rel) return rel;
  rel = localPathFor(url);
  const abs = path.join(OUT, rel);
  if (fs.existsSync(abs)) { assetMap.set(url, rel); return rel; }
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  try { fs.writeFileSync(abs, body); assetMap.set(url, rel); newAssets++; } catch (e) { return null; }
  return rel;
}

// route（chunk 名，连字符=路径分隔） + query + 文件后缀 tag
const TARGETS = (process.env.TARGETS ? JSON.parse(process.env.TARGETS) : [
  { route: 'pages-market-details', query: '?id=42', tag: 'id42' },
  { route: 'pages-market-goodsDetails', query: '?id=42', tag: 'id42' },
  { route: 'pages-market-batchBuy', query: '?id=42', tag: 'id42' },
  { route: 'pages-market-confirmorder', query: '?id=42', tag: 'id42' },
  { route: 'pages-notification-details', query: '?id=153', tag: 'id153' },
  { route: 'pages-notification-details', query: '?id=143', tag: 'id143' },
  { route: 'pages-account-orderList', query: '?isTabs=1', tag: 'tabs1' },
  { route: 'pages-account-orderList', query: '?isTabs=2', tag: 'tabs2' },
  { route: 'pages-account-orderList', query: '?group=consign', tag: 'consign' },
  { route: 'pages-colorfulMix-details', query: '?id=18', tag: 'id18' },
]);

(async () => {
  if (!fs.existsSync(STATE)) { console.error('no auth-state.json'); process.exit(1); }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'], locale: 'zh-CN', timezoneId: 'Asia/Shanghai', storageState: STATE,
  });

  const results = [];
  async function attachCapture(page, label) {
    await page.route('**/*', async (route2) => {
      const req = route2.request();
      const url = req.url();
      try {
        const resp = await route2.fetch();
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
            apiCache.set(key, { rel, method: req.method(), url, post, page: label });
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

  for (const t of TARGETS) {
    const routePath = '/' + t.route.replace(/-/g, '/');
    const pageName = t.route.replace(/[^A-Za-z0-9_-]/g, '_') + '-' + t.tag;
    const page = await ctx.newPage();
    await attachCapture(page, pageName);
    console.log('>>> ' + routePath + t.query);
    try {
      await page.goto(BASE + '/#' + routePath + t.query, { waitUntil: 'load', timeout: 45000 });
      await sleep(3000);
      try { await page.waitForLoadState('networkidle', { timeout: 7000 }); } catch (e) {}
      await sleep(800);
      const html = await page.content();
      const text = await page.evaluate(() => (document.body.innerText || '').trim());
      fs.writeFileSync(path.join(OUT, 'pages', pageName + '.html'), html, 'utf8');
      await page.screenshot({ path: path.join(OUT, 'pages', pageName + '.png'), fullPage: false });
      results.push({ route: routePath + t.query, pageName, bytes: html.length, textLen: text.length });
      console.log('    html=' + html.length + ' text=' + text.length + (text.length > 200 ? '  ✅有内容' : '  (空态)'));
    } catch (e) {
      console.log('    FAIL: ' + e.message.slice(0, 110));
      results.push({ route: routePath + t.query, pageName, error: e.message.slice(0, 160) });
    }
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(
    path.join(ROOT, 'scrape-work', 'asset-map-params.json'),
    JSON.stringify({ assets: [...assetMap.entries()], api: [...apiCache.entries()] }, null, 1),
    'utf8'
  );
  fs.writeFileSync(path.join(ROOT, 'scrape-work', 'crawl-results-params.json'), JSON.stringify(results, null, 1), 'utf8');
  console.log('\nDONE. newAssets=' + newAssets + ' newApi=' + newApi + ' pages=' + results.length);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
