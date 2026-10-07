const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], locale: 'zh-CN' });
  const page = await ctx.newPage();
  page.on('console', (m) => console.log('[' + m.type() + '] ' + m.text().slice(0, 300)));
  page.on('pageerror', (e) => console.log('[PAGEERROR] ' + String(e).slice(0, 400)));
  page.on('requestfailed', (r) => console.log('[REQFAIL] ' + r.url().slice(0, 120) + ' :: ' + (r.failure() || {}).errorText));
  page.on('response', (r) => { if (r.status() >= 400) console.log('[HTTP' + r.status() + '] ' + r.url().slice(0, 120)); });

  await page.goto('http://localhost:8899/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);
  const state = await page.evaluate(() => ({
    hash: location.hash,
    hasApp: !!document.getElementById('app'),
    appHTML: (document.getElementById('app') || {}).innerHTML || 'NO-APP',
    bodyLen: (document.body.innerHTML || '').length,
    bodyHead: (document.body.innerHTML || '').slice(0, 500),
  }));
  console.log('STATE:', JSON.stringify(state, null, 1));
  await browser.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
