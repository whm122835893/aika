/**
 * Scroll pass: revisit key routes and scroll to the bottom so lazy-loaded
 * images/assets get requested and mirrored. Also re-saves the final DOM.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://h5.shenyuan.sc.cn';
const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');

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

let savedCount = 0;
const apiRecords = new Map(); // key -> {rel, method, url, post}
function saveAsset(url, body) {
  const rel = localPathFor(url);
  const abs = path.join(OUT, rel);
  if (fs.existsSync(abs) && fs.statSync(abs).size === body.length) return rel;
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
  savedCount++;
  return rel;
}

const SCROLL_ROUTES = [
  'pages/home/home',
  'pages/activity/activity',
  'pages/market/market',
  'pages/Announcement/Announcement',
  'pages/index/index',
  'pages/account/account',
  'pages/search/search',
  'pages/integral/integral',
  'pages/sign/sign',
  'pages/community/community',
  'pages/drawPrize/drawPrize',
  'pages/salvage/salvage',
  'pages/mix/mix',
  'pages/colorfulMix/colorfulMix',
  'pages/wallet/wallet',
  'pages/invite/invite',
  'pages/Transformation/Transformation',
  'pages/Announcement/list',
  'pages/notification/notification',
  'pages/todayrank/todayrank',
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'],
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });

  for (const r of SCROLL_ROUTES) {
    const page = await ctx.newPage();
    await page.route('**/*', async (route2) => {
      try {
        const resp = await route2.fetch();
        let body = Buffer.alloc(0);
        try { body = await resp.body(); } catch (e) {}
        const url = route2.request().url();
        if (url.startsWith('https://api.shenyuan.sc.cn/')) {
          const post = route2.request().postData() || '';
          const rel = 'assets/api-cache/' + require('crypto').createHash('md5').update(url + '|' + post).digest('hex') + '.json';
          const abs = path.join(OUT, rel);
          if (!fs.existsSync(abs)) { fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, body); }
          apiRecords.set(route2.request().method() + ' ' + url + ' ' + require('crypto').createHash('md5').update(post).digest('hex'), { rel, method: route2.request().method(), url, post });
          return route2.fulfill({ response: resp, body });
        }
        saveAsset(url, body);
        return route2.fulfill({ response: resp, body });
      } catch (e) { try { await route2.continue(); } catch (e2) {} }
    });

    try {
      console.log('\n>>> scroll ' + r);
      await page.goto(BASE + '/#/' + r, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(2500);
      // progressive scroll to bottom
      for (let i = 0; i < 12; i++) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
          document.querySelectorAll('uni-scroll-view .uni-scroll-view').forEach((el) => { el.scrollTop = el.scrollHeight; });
        });
        await page.waitForTimeout(700);
      }
      const html = await page.content();
      const name = r.replace(/[^A-Za-z0-9_-]/g, '_');
      fs.writeFileSync(path.join(OUT, 'pages', name + '.html'), html, 'utf8');
      await page.screenshot({ path: path.join(OUT, 'pages', name + '.png'), fullPage: false });
      console.log('    ok, assets so far +' + savedCount);
    } catch (e) {
      console.log('    FAIL ' + e.message.slice(0, 120));
    }
    await page.close();
  }

  await browser.close();

  // merge API records into asset-map.json for the shim builder
  const mapPath = path.join(ROOT, 'scrape-work', 'asset-map.json');
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const known = new Set(map.api.map(([k]) => k));
  let added = 0;
  for (const [k, v] of apiRecords) if (!known.has(k)) { map.api.push([k, v]); added++; }
  fs.writeFileSync(mapPath, JSON.stringify(map, null, 1), 'utf8');

  console.log('\nSCROLL PASS DONE, new assets: ' + savedCount + ', new api endpoints: ' + added);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
