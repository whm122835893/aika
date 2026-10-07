const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://h5.shenyuan.sc.cn';
const OUT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15/scrape-work';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 12'],
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });
  const page = await ctx.newPage();

  const responses = [];
  page.on('response', async (r) => {
    try {
      responses.push({
        url: r.url(),
        status: r.status(),
        type: (r.headers()['content-type'] || '').split(';')[0],
      });
    } catch (e) {}
  });

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200));
  });

  await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
  // wait for SPA to settle
  await page.waitForTimeout(4000);
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  } catch (e) {}

  const info = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll('a')].map((a) => ({
      href: a.getAttribute('href'),
      text: (a.innerText || '').trim().slice(0, 40),
    }));
    return {
      title: document.title,
      url: location.href,
      appHTMLLength: (document.getElementById('app') || {}).innerHTML?.length || 0,
      text: (document.body.innerText || '').slice(0, 2000),
      anchors,
      bodyHTML: (document.body.innerHTML || '').slice(0, 3000),
    };
  });

  await page.screenshot({ path: path.join(OUT, 'shot-home.png'), fullPage: true });
  fs.writeFileSync(path.join(OUT, 'home.rendered.html'), await page.content(), 'utf8');

  console.log('=== TITLE:', info.title);
  console.log('=== URL:', info.url);
  console.log('=== APP HTML LEN:', info.appHTMLLength);
  console.log('=== TEXT:\n' + info.text);
  console.log('=== ANCHORS:', JSON.stringify(info.anchors, null, 1));
  console.log('=== BODY HTML:\n' + info.bodyHTML);
  console.log('=== ERRORS:', JSON.stringify(errors.slice(0, 10), null, 1));
  console.log('=== RESPONSES (' + responses.length + '):');
  responses.forEach((r) => console.log('  ' + r.status + ' [' + r.type + '] ' + r.url.slice(0, 140)));

  await browser.close();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
