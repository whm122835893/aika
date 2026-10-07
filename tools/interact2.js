/**
 * Precise interaction test round 2:
 *  - list drill-down (click an actual collectible card)
 *  - inner scroll (mouse wheel + swipe gestures)
 *  - search input
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const SHOTS = path.join(ROOT, 'verify', 'interact');
fs.mkdirSync(SHOTS, { recursive: true });

const snap = async (p) => p.evaluate(() => ({
  hash: location.hash,
  text: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 110),
}));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await ctx.newPage();
  await page.route('**/*', (route) => (route.request().url().startsWith('http://localhost:8899') ? route.continue() : route.abort()));

  // ---------- A. drill-down on market list ----------
  console.log('=== A. DRILL-DOWN ===');
  await page.goto('http://localhost:8899/pages/pages-market-market.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);

  const target = await page.evaluate(() => {
    // smallest visible element whose text is exactly a collectible name
    const cands = [...document.querySelectorAll('uni-view,uni-text')].filter((e) => {
      const t = (e.innerText || '').trim();
      return t === '拳击小子001' && e.offsetParent !== null && e.getBoundingClientRect().top > 0;
    });
    if (!cands.length) return null;
    const el = cands[cands.length - 1];
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, tag: el.tagName };
  });
  console.log('target element: ' + JSON.stringify(target));

  if (target) {
    const before = await snap(page);
    await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(3500);
    const after = await snap(page);
    console.log('before: ' + before.hash);
    console.log('after : ' + after.hash + (after.hash !== before.hash ? '  [NAVIGATED]' : '  [NO NAV]'));
    console.log('content: ' + after.text);
    await page.screenshot({ path: path.join(SHOTS, '40-detail.png') });
  }

  // ---------- B. inner scroll ----------
  console.log('\n=== B. SCROLL ===');
  await page.goto('http://localhost:8899/pages/pages-market-market.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  const box = await page.evaluate(() => {
    const el = [...document.querySelectorAll('.uni-scroll-view')].find((e) => e.scrollHeight > e.clientHeight + 10);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, sh: el.scrollHeight, ch: el.clientHeight };
  });
  console.log('scroll container: ' + JSON.stringify(box));
  if (box) {
    const before = await page.evaluate(() => (document.body.innerText || '').length);
    await page.mouse.move(box.x, box.y);
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(500); }
    await page.waitForTimeout(1500);
    const after = await page.evaluate(() => (document.body.innerText || '').length);
    const scrolled = await page.evaluate(() => {
      const el = [...document.querySelectorAll('.uni-scroll-view')].find((e) => e.scrollTop > 0);
      return el ? el.scrollTop : 0;
    });
    console.log('textLen ' + before + ' -> ' + after + ' | inner scrollTop=' + scrolled);
    await page.screenshot({ path: path.join(SHOTS, '50-scrolled.png') });
  }

  // ---------- C. search ----------
  console.log('\n=== C. SEARCH ===');
  await page.goto('http://localhost:8899/pages/pages-home-home.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  const sbox = await page.evaluate(() => {
    const el = [...document.querySelectorAll('uni-view')].find((e) => (e.className || '').includes('search-bar') && e.offsetParent);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  console.log('search bar: ' + JSON.stringify(sbox));
  if (sbox) {
    const before = await snap(page);
    await page.mouse.click(sbox.x, sbox.y);
    await page.waitForTimeout(3000);
    const after = await snap(page);
    console.log('click -> ' + before.hash + ' => ' + after.hash + (after.hash !== before.hash ? '  [NAVIGATED]' : '  [NO NAV]'));
    console.log('content: ' + after.text);
    await page.screenshot({ path: path.join(SHOTS, '60-searchpage.png') });

    // try typing
    const input = await page.evaluate(() => {
      const el = document.querySelector('uni-input input, input');
      if (!el) return null;
      el.focus();
      return true;
    });
    if (input) {
      await page.keyboard.type('运粮鼠');
      await page.waitForTimeout(2500);
      const typed = await page.evaluate(() => (document.querySelector('uni-input input, input') || {}).value);
      console.log('typed value: ' + typed);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
      console.log('after search: ' + JSON.stringify(await snap(page)));
      await page.screenshot({ path: path.join(SHOTS, '61-searchresult.png') });
    } else {
      console.log('no input field found');
    }
  }

  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
