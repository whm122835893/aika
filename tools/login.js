/**
 * Authenticate against h5.shenyuan.sc.cn and persist the browser storage state.
 * Usage: node tools/login.js <phone> <password>
 * Writes: scrape-work/auth-state.json
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://h5.shenyuan.sc.cn';
const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const PHONE = process.argv[2];
const PASS = process.argv[3];

if (!PHONE || !PASS) { console.error('usage: node tools/login.js <phone> <password>'); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'],
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });

  const page = await ctx.newPage();

  // observe API traffic so we can see the login call and its auth result
  const apiCalls = [];
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (req.url().includes('api.shenyuan.sc.cn')) {
      const entry = { method: req.method(), ep: req.url().split('/').pop(), post: (req.postData() || '').slice(0, 120) };
      try {
        const resp = await route.fetch();
        let body = '';
        try { body = (await resp.text()).slice(0, 300); } catch (e) {}
        entry.status = resp.status();
        entry.resp = body;
        apiCalls.push(entry);
        return route.fulfill({ response: resp });
      } catch (e) { return route.continue(); }
    }
    return route.continue();
  });

  page.on('console', (m) => { if (m.type() === 'error') console.log('  [console.error] ' + m.text().slice(0, 140)); });

  console.log('>>> goto login page');
  await page.goto(BASE + '/#/pages/login/login', { waitUntil: 'load', timeout: 45000 });
  await sleep(4000);

  const dumpInputs = async () => page.evaluate(() => [...document.querySelectorAll('input')].map((i, n) => ({
    n, ph: i.placeholder || '', type: i.type, cls: (i.className || '').slice(0, 30), val: i.value,
  })));

  console.log('INPUTS: ' + JSON.stringify(await dumpInputs()));

  // fill phone + password
  const inputs = await page.$$('input');
  console.log('input count: ' + inputs.length);

  // identify by placeholder / type
  const roles = await page.evaluate(() => [...document.querySelectorAll('input')].map((i) => ({
    ph: i.placeholder || '', type: i.type,
  })));

  let phoneIdx = roles.findIndex((r) => /账号|手机|phone|mobile/i.test(r.ph));
  let passIdx = roles.findIndex((r) => r.type === 'password' || /密码|password/i.test(r.ph));
  if (phoneIdx < 0) phoneIdx = 0;
  if (passIdx < 0) passIdx = roles.length > 1 ? 1 : 0;

  console.log('phoneIdx=' + phoneIdx + ' passIdx=' + passIdx);

  if (inputs[phoneIdx]) { await inputs[phoneIdx].click(); await inputs[phoneIdx].fill(PHONE); }
  if (inputs[passIdx]) { await inputs[passIdx].click(); await inputs[passIdx].fill(PASS); }
  await sleep(800);

  console.log('after fill: ' + JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('input')].map((i) => i.value))));

  // agree checkbox if present (protocol agreement)
  const agreed = await page.evaluate(() => {
    const els = [...document.querySelectorAll('uni-view,uni-text,uni-checkbox,label,span')];
    const t = els.find((e) => /用户协议|隐私政策|同意/.test(e.innerText || '') && (e.innerText || '').length < 30);
    if (t) { t.click(); return (t.innerText || '').slice(0, 20); }
    const cb = document.querySelector('uni-checkbox');
    if (cb) { cb.click(); return 'uni-checkbox'; }
    return null;
  });
  console.log('agreement clicked: ' + agreed);

  // click 登录
  const clicked = await page.evaluate(() => {
    const cands = [...document.querySelectorAll('uni-view,uni-button,button,uni-text')];
    const b = cands.find((e) => (e.innerText || '').trim() === '登录');
    if (b) { b.click(); return true; }
    // fallback: any element whose text contains 登录 and is small
    const b2 = cands.find((e) => /登录/.test(e.innerText || '') && (e.innerText || '').length < 12);
    if (b2) { b2.click(); return 'fallback:' + (b2.innerText || '').trim(); }
    return false;
  });
  console.log('login button clicked: ' + clicked);

  await sleep(6000);
  await page.screenshot({ path: path.join(ROOT, 'verify', 'login-result.png') });

  const after = await page.evaluate(() => ({
    hash: location.hash,
    text: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 260),
  }));
  console.log('AFTER LOGIN: ' + JSON.stringify(after));

  const storage = await page.evaluate(() => {
    const o = { local: {}, session: {} };
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o.local[k] = (localStorage.getItem(k) || '').slice(0, 160); } } catch (e) {}
    try { for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); o.session[k] = (sessionStorage.getItem(k) || '').slice(0, 160); } } catch (e) {}
    return o;
  });
  console.log('LOCALSTORAGE: ' + JSON.stringify(storage.local, null, 1));
  console.log('SESSIONSTORAGE: ' + JSON.stringify(storage.session, null, 1));

  const cookies = await ctx.cookies();
  console.log('COOKIES: ' + JSON.stringify(cookies.map((c) => ({ name: c.name, domain: c.domain, val: (c.value || '').slice(0, 60) })), null, 1));

  console.log('\nAPI CALLS DURING LOGIN (' + apiCalls.length + '):');
  apiCalls.forEach((c) => console.log('  ' + c.method + ' /' + c.ep + ' -> ' + c.status + ' ' + (c.resp || '').replace(/\s+/g, ' ').slice(0, 200)));

  const statePath = path.join(ROOT, 'scrape-work', 'auth-state.json');
  await ctx.storageState({ path: statePath });
  console.log('\nstorageState saved -> ' + statePath);

  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
