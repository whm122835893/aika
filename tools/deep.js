/**
 * Deep interaction pass (authenticated).
 * Loads high-value pages, then performs a click sweep (tab switches, list
 * drill-downs) and a scroll pass to trigger lazy / paginated API calls that a
 * plain page load never issues (orders, wallet, invite, purchase flows).
 *
 * Writes: scrape-work/asset-map-deep.json, scrape-work/deep-results.json
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

// pages most likely to own the authenticated-only endpoints
const TARGETS = [
  // orders & purchase
  'pages-account-order', 'pages-account-orderList', 'pages-account-marketOrderList',
  'pages-account-physicalOrderList', 'pages-account-bidList', 'pages-account-saleList',
  'pages-market-createOrder', 'pages-market-confirmorder', 'pages-market-batchBuy',
  'pages-market-submitBegBuy', 'pages-market-details', 'pages-market-goodsDetails',
  'pages-market-Consignment', 'pages-market-sale', 'pages-market-saleResult',
  'pages-market-transactionParticulars', 'pages-success-index',
  // wallet / assets / integral
  'pages-wallet-wallet', 'pages-wallet-wallet1', 'pages-wallet-thirdWallet',
  'pages-integral-integral', 'pages-integral-Get', 'pages-integral-my',
  'pages-integral-details', 'pages-integral-records', 'pages-account-increase',
  'pages-account-Warelist', 'pages-account-blindbox', 'pages-account-collections',
  // invite
  'pages-account-invite', 'pages-invite-invite', 'pages-invite-list',
  'pages-account-InviteRankingList',
  // account
  'pages-account-account', 'pages-account-safePass', 'pages-account-realname',
  'pages-account-user', 'pages-address-address', 'pages-address-add',
  // activity / market
  'pages-activity-activity', 'pages-mix-mix', 'pages-mix-details', 'pages-mix-records',
  'pages-salvage-salvage', 'pages-salvage-details', 'pages-salvage-records',
  'pages-drawPrize-drawPrize', 'pages-drawPrize-records', 'pages-drawlots-drawlots',
  'pages-colorfulMix-colorfulMix', 'pages-colorfulMix-details', 'pages-colorfulMix-records',
  'pages-sign-sign', 'pages-market-market', 'pages-market-bidDetail', 'pages-market-cardMap',
  'pages-entrust-entrust', 'pages-todayrank-todayrank', 'pages-home-home',
  'pages-notification-notification', 'pages-Announcement-Announcement',
];

const MAX_CLICKS = parseInt(process.env.MAX_CLICKS || '10', 10);
const TOP = parseInt(process.env.TOP || '0', 10);
const SWEEP = process.env.SWEEP !== '0';
const VALID = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'routes.json'), 'utf8')));

(async () => {
  if (!fs.existsSync(STATE)) { console.error('run tools/login.js first'); process.exit(1); }
  const targets = TOP > 0 ? TARGETS.slice(0, TOP) : TARGETS;

  const apiCache = new Map();
  let newApi = 0;
  const log = [];

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'], locale: 'zh-CN', timezoneId: 'Asia/Shanghai', storageState: STATE,
  });

  async function attach(page, label) {
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
            let code = null;
            try { code = JSON.parse(body.toString('utf8')).code; } catch (e) {}
            apiCache.set(key, { rel, method: req.method(), url, post, code, page: label });
            newApi++;
            console.log('      [api ' + newApi + '] /' + url.split('/').pop().slice(0, 8) + ' code=' + code);
          }
          return route2.fulfill({ response: resp, body });
        }
        return route2.fulfill({ response: resp, body });
      } catch (e) { try { await route2.continue(); } catch (e2) {} }
    });
  }

  async function open(page, route) {
    await page.goto(BASE + '/#/' + route.replace(/-/g, '/'), { waitUntil: 'load', timeout: 45000 });
    await sleep(2600);
    try { await page.waitForLoadState('networkidle', { timeout: 5000 }); } catch (e) {}
  }

  const page = await ctx.newPage();
  await attach(page, 'deep');

  for (const route of targets) {
    if (!VALID.has(route)) { console.log('skip (unknown route) ' + route); continue; }
    console.log('\n=== ' + route);
    const before = newApi;
    try {
      await open(page, route);
      const t = await page.evaluate(() => (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 90));
      console.log('  load text: ' + t);

      // scroll to trigger pagination / lazy lists
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, 900));
        await sleep(900);
      }

      if (SWEEP) {
        const cands = await page.evaluate(() => {
          const out = [];
          const els = [...document.querySelectorAll('uni-view,uni-button,uni-text,button,uni-image')];
          for (const e of els) {
            if (!e.offsetParent) continue;
            const txt = (e.innerText || e.textContent || '').trim();
            if (txt.length < 1 || txt.length > 16) continue;
            if (e.children.length > 3) continue;
            out.push(txt.replace(/\s+/g, ' '));
          }
          return [...new Set(out)].slice(0, 60);
        });
        console.log('  candidates: ' + cands.length + ' -> ' + cands.slice(0, MAX_CLICKS).join(' | '));

        for (const label of cands.slice(0, MAX_CLICKS)) {
          const n0 = newApi;
          try {
            await open(page, route);
            const ok = await page.evaluate((lb) => {
              const els = [...document.querySelectorAll('uni-view,uni-button,uni-text,button,uni-image')];
              for (const e of els) {
                if (!e.offsetParent) continue;
                const txt = (e.innerText || e.textContent || '').trim().replace(/\s+/g, ' ');
                if (txt === lb) { e.click(); return true; }
              }
              return false;
            }, label);
            if (!ok) continue;
            await sleep(2600);
            await page.evaluate(() => window.scrollBy(0, 900));
            await sleep(800);
            if (newApi > n0) console.log('  click [' + label + '] -> +' + (newApi - n0) + ' api');
          } catch (e) {}
        }
      }
      log.push({ route, newApi: newApi - before, text: t });
    } catch (e) {
      console.log('  FAIL ' + e.message.slice(0, 100));
      log.push({ route, error: e.message.slice(0, 150) });
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ROOT, 'scrape-work', 'asset-map-deep.json'),
    JSON.stringify({ api: [...apiCache.entries()] }, null, 1), 'utf8'
  );
  fs.writeFileSync(path.join(ROOT, 'scrape-work', 'deep-results.json'), JSON.stringify(log, null, 1), 'utf8');
  console.log('\nDEEP DONE. newApi=' + newApi);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
