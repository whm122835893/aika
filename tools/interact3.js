/**
 * Interaction test round 3 — uni-app uses touch (tap) events, not mouse click.
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
  const ctx = await browser.newContext({ ...devices['iPhone 12'], locale: 'zh-CN', timezoneId: 'Asia/Shanghai', hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.route('**/*', (route) => (route.request().url().startsWith('http://localhost:8899') ? route.continue() : route.abort()));

  // helper: real touch swipe
  const swipe = async (x, yFrom, yTo) => {
    await page.evaluate(({ x, yFrom, yTo }) => {
      const el = document.elementFromPoint(x, yFrom) || document.body;
      const mk = (type, y) => {
        const t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y });
        return new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], targetTouches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true });
      };
      el.dispatchEvent(mk('touchstart', yFrom));
      const steps = 10;
      for (let i = 1; i <= steps; i++) el.dispatchEvent(mk('touchmove', yFrom + (yTo - yFrom) * (i / steps)));
      el.dispatchEvent(mk('touchend', yTo));
    }, { x, yFrom, yTo });
  };

  // ---------- A. drill-down via tap ----------
  console.log('=== A. DRILL-DOWN (tap) ===');
  await page.goto('http://localhost:8899/pages/pages-market-market.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  const target = await page.evaluate(() => {
    const cands = [...document.querySelectorAll('uni-view')].filter((e) => (e.innerText || '').trim() === '拳击小子001' && e.offsetParent);
    if (!cands.length) return null;
    const r = cands[cands.length - 1].getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  console.log('tap target: ' + JSON.stringify(target));
  const b1 = await snap(page);
  await page.touchscreen.tap(target.x, target.y);
  await page.waitForTimeout(3500);
  const a1 = await snap(page);
  console.log(b1.hash + ' -> ' + a1.hash + (a1.hash !== b1.hash ? '  [NAVIGATED ✓]' : '  [NO NAV]'));
  console.log('page=' + a1.page + ' | ' + a1.text);
  await page.screenshot({ path: path.join(SHOTS, '70-tap-detail.png') });

  // ---------- B. scroll via swipe ----------
  console.log('\n=== B. SCROLL (swipe) ===');
  await page.goto('http://localhost:8899/pages/pages-market-market.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  const before = await page.evaluate(() => ({ len: (document.body.innerText || '').length, rows: document.querySelectorAll('uni-view').length }));
  await swipe(195, 600, 200);
  await page.waitForTimeout(2500);
  const after = await page.evaluate(() => ({ len: (document.body.innerText || '').length, rows: document.querySelectorAll('uni-view').length }));
  console.log('textLen ' + before.len + ' -> ' + after.len + ' | uni-view count ' + before.rows + ' -> ' + after.rows +
    (after.len !== before.len || after.rows !== before.rows ? '  [CONTENT CHANGED ✓]' : '  [NO CHANGE]'));
  await page.screenshot({ path: path.join(SHOTS, '80-swiped.png') });

  // ---------- C. search via tap ----------
  console.log('\n=== C. SEARCH (tap) ===');
  await page.goto('http://localhost:8899/pages/pages-home-home.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  const sb = await page.evaluate(() => {
    const el = [...document.querySelectorAll('uni-view')].find((e) => (e.className || '').includes('search-bar') && e.offsetParent);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  console.log('search bar: ' + JSON.stringify(sb));
  const b3 = await snap(page);
  await page.touchscreen.tap(sb.x, sb.y);
  await page.waitForTimeout(3000);
  const a3 = await snap(page);
  console.log(b3.hash + ' -> ' + a3.hash + (a3.hash !== b3.hash ? '  [NAVIGATED ✓]' : '  [NO NAV]'));
  console.log('page=' + a3.page + ' | ' + a3.text);
  await page.screenshot({ path: path.join(SHOTS, '90-search.png') });

  // ---------- D. tab via tap (confirm) ----------
  console.log('\n=== D. TAB (tap) ===');
  await page.goto('http://localhost:8899/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(4000);
  for (const idx of [1, 2, 3, 4]) {
    const tb = await page.evaluate((i) => {
      const items = [...document.querySelectorAll('.uni-tabbar__item')];
      if (!items[i]) return null;
      const r = items[i].getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), text: items[i].innerText.trim() };
    }, idx);
    if (!tb) continue;
    await page.touchscreen.tap(tb.x, tb.y);
    await page.waitForTimeout(2500);
    const s = await snap(page);
    console.log('tap "' + tb.text + '" -> ' + s.hash + ' | ' + s.text.slice(0, 60));
  }

  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
