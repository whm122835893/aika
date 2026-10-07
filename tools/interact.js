/**
 * Interaction test: does the offline replica actually respond to clicks?
 * Tests tabbar switching, list navigation, search, scroll and pull-refresh.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const SHOTS = path.join(ROOT, 'verify', 'interact');
fs.mkdirSync(SHOTS, { recursive: true });

const snap = async (p) => p.evaluate(() => ({
  hash: location.hash,
  text: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 120),
  page: (document.querySelector('uni-page') || {}).getAttribute?.('data-page') || '-',
}));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await ctx.newPage();

  const apiCalls = [];
  const apiFail = [];
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith('http://localhost:8899')) return route.continue();
    apiFail.push(url);
    return route.abort();
  });
  page.on('response', (r) => {
    if (r.url().includes('api-cache')) apiCalls.push(r.url().split('/').pop());
  });

  await page.goto('http://localhost:8899/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(4000);
  console.log('BOOT:', JSON.stringify(await snap(page)));
  await page.screenshot({ path: path.join(SHOTS, '00-boot.png') });

  // ---- 1. tabbar switching ----
  const tabs = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.uni-tabbar__item')];
    return items.map((el, i) => ({ i, text: (el.innerText || '').trim(), visible: el.offsetParent !== null }));
  });
  console.log('\n=== TABBAR ===');
  console.log(JSON.stringify(tabs));

  for (let i = 0; i < tabs.length; i++) {
    const before = await snap(page);
    const clicked = await page.evaluate((idx) => {
      const items = [...document.querySelectorAll('.uni-tabbar__item')];
      if (!items[idx]) return false;
      items[idx].click();
      return true;
    }, i);
    if (!clicked) { console.log('tab ' + i + ': not found'); continue; }
    await page.waitForTimeout(2500);
    const after = await snap(page);
    const changed = after.hash !== before.hash;
    console.log('tab[' + i + '] "' + tabs[i].text + '" -> ' + (changed ? 'OK' : 'NO-CHANGE') +
      ' | hash=' + after.hash + ' page=' + after.page + ' | ' + after.text.slice(0, 70));
    await page.screenshot({ path: path.join(SHOTS, 'tab-' + i + '.png') });
  }

  // ---- 2. navigate: open market list item ----
  console.log('\n=== DRILL-DOWN (market item) ===');
  await page.goto('http://localhost:8899/pages/pages-market-market.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  const beforeNav = await snap(page);
  const hasItem = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('uni-view')].filter((e) => /发行|流通/.test(e.innerText || '') && e.offsetParent);
    if (!rows.length) return null;
    rows[0].click();
    return (rows[0].innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  });
  console.log('clicked row: ' + hasItem);
  await page.waitForTimeout(3000);
  const afterNav = await snap(page);
  console.log('hash ' + beforeNav.hash + ' -> ' + afterNav.hash + (afterNav.hash !== beforeNav.hash ? '  [NAVIGATED]' : '  [NO NAV]'));
  console.log('content: ' + afterNav.text.slice(0, 100));
  await page.screenshot({ path: path.join(SHOTS, '10-drilldown.png') });

  // ---- 3. search ----
  console.log('\n=== SEARCH ===');
  const searchClickable = await page.evaluate(() => {
    const el = [...document.querySelectorAll('uni-view,uni-text,uni-input')].find((e) => (e.innerText || '').trim() === '搜索' || (e.className || '').includes('search'));
    if (!el) return false;
    el.click();
    return true;
  });
  await page.waitForTimeout(2500);
  console.log('search clicked=' + searchClickable + ' -> ' + JSON.stringify(await snap(page)));
  await page.screenshot({ path: path.join(SHOTS, '20-search.png') });

  // ---- 4. scroll ----
  console.log('\n=== SCROLL ===');
  await page.goto('http://localhost:8899/pages/pages-market-market.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  const scrolled = await page.evaluate(async () => {
    const before = document.body.scrollHeight;
    window.scrollTo(0, 600);
    document.querySelectorAll('.uni-scroll-view').forEach((el) => { el.scrollTop = 600; });
    await new Promise((r) => setTimeout(r, 1500));
    const tops = [...document.querySelectorAll('.uni-scroll-view')].map((el) => el.scrollTop);
    return { before, maxTop: Math.max(0, ...tops) };
  });
  console.log('scrollTop reached: ' + JSON.stringify(scrolled));
  await page.screenshot({ path: path.join(SHOTS, '30-scrolled.png') });

  console.log('\n=== API REPLAY ===');
  console.log('api-cache responses served: ' + apiCalls.length);
  console.log('external (blocked) requests: ' + apiFail.length);

  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
