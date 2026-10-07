/**
 * Offline verification: load the replica with ALL external requests blocked.
 * Any external request = leak = not fully offline.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'verify');
fs.mkdirSync(OUT, { recursive: true });

const URLS = [
  ['http://localhost:8899/', 'index-home'],
  ['http://localhost:8899/pages/pages-market-market.html', 'market'],
  ['http://localhost:8899/pages/pages-activity-activity.html', 'activity'],
  ['http://localhost:8899/pages/pages-index-index.html', 'index-tab'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], locale: 'zh-CN' });
  const page = await ctx.newPage();

  const leaks = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://localhost:8899')) return route.continue();
    leaks.push(url);
    return route.abort();
  });

  for (const [url, name] of URLS) {
    leaks.length = 0;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(3500);
      const text = await page.evaluate(() => (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 300));
      await page.screenshot({ path: path.join(OUT, 'verify-' + name + '.png') });
      console.log('\n=== ' + name + ' (' + url + ')');
      console.log('TEXT: ' + text);
      console.log('EXTERNAL LEAKS: ' + leaks.length + (leaks.length ? ' -> ' + [...new Set(leaks)].slice(0, 5).join(' | ') : ' (none)'));
    } catch (e) {
      console.log('\n=== ' + name + ' FAILED: ' + e.message.slice(0, 150));
    }
  }

  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
