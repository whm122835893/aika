/**
 * Full offline verification of every captured page snapshot.
 * Loads each page with ALL external requests blocked; classifies by
 * rendered content, external leaks, and JS errors.
 */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const PAGES = path.join(OUT, 'pages');
const SHOTS = path.join(ROOT, 'verify', 'all');
fs.mkdirSync(SHOTS, { recursive: true });

const files = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html')).sort();

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await ctx.newPage();

  let leaks = [];
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));

  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://localhost:8899')) return route.continue();
    leaks.push(url);
    return route.abort();
  });

  const results = [];
  for (const f of files) {
    leaks = [];
    errors.length = 0;
    let rec = { file: f };
    try {
      await page.goto('http://localhost:8899/pages/' + f, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(3000);
      const info = await page.evaluate(() => {
        const t = (document.body.innerText || '').trim().replace(/\s+/g, ' ');
        const imgs = [...document.querySelectorAll('img')];
        return {
          text: t.slice(0, 260),
          textLen: t.length,
          imgCount: imgs.length,
          brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        };
      });
      rec = { ...rec, ...info, leaks: [...new Set(leaks)], errors: [...errors] };
      await page.screenshot({ path: path.join(SHOTS, f.replace('.html', '.png')) });
    } catch (e) {
      rec = { ...rec, error: e.message.slice(0, 160), leaks: [...new Set(leaks)], errors: [...errors] };
    }
    results.push(rec);
    const status = rec.error ? 'ERR' : rec.leaks.length ? 'LEAK' : rec.textLen > 60 ? 'OK' : 'EMPTY';
    console.log(status.padEnd(5) + ' ' + f.replace('.html', '') + '  text=' + (rec.textLen || 0) + ' imgs=' + (rec.imgCount || 0) + ' broken=' + (rec.brokenImgs || 0) + ' leaks=' + rec.leaks.length);
  }

  await browser.close();
  fs.writeFileSync(path.join(ROOT, 'scrape-work', 'verify-all.json'), JSON.stringify(results, null, 1), 'utf8');

  const ok = results.filter((r) => !r.error && r.leaks.length === 0 && r.textLen > 60);
  const empty = results.filter((r) => !r.error && r.leaks.length === 0 && r.textLen <= 60);
  const leaky = results.filter((r) => r.leaks.length > 0);
  const failed = results.filter((r) => r.error);
  console.log('\n==== SUMMARY ====');
  console.log('total: ' + results.length);
  console.log('OK (content + 0 leaks): ' + ok.length);
  console.log('EMPTY (login/empty state, 0 leaks): ' + empty.length);
  console.log('LEAK: ' + leaky.length);
  console.log('ERROR: ' + failed.length);
  if (leaky.length) console.log('LEAKY: ' + leaky.map((r) => r.file + '(' + r.leaks.length + ')').join(', '));
  if (failed.length) console.log('FAILED: ' + failed.map((r) => r.file).join(', '));
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
