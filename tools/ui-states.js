/**
 * UI 状态补抓器 —— 真实点击每个页面的可点击元素，捕获由此产生的 UI 状态：
 *   toast / modal(确认框) / popup(底部弹层/选择器) / 页面跳转 / 内容变化
 * 并对每一种新出现的浮层做真机截图，落地到 output/h5.shenyuan.sc.cn/ui-states/
 *
 * 用法：
 *   node tools/ui-states.js                 # 全量（每页最多 6 次点击）
 *   MAX=10 ONLY=pages-market-details node tools/ui-states.js
 */
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const SHOT_DIR = path.join(OUT, 'ui-states');
const STATE = path.join(ROOT, 'scrape-work', 'auth-state.json');
const BASE = 'https://h5.shenyuan.sc.cn';

const FEATURES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'features.json'), 'utf8'));

const ONLY = process.env.ONLY || '';
const MAX = parseInt(process.env.MAX || '6', 10);
const WAIT = parseInt(process.env.WAIT || '3500', 10);

function safe(s) {
  return String(s || '').replace(/[\\/:*?"<>|\r\n\t]/g, '_').replace(/\s+/g, '_').slice(0, 40) || 'x';
}

// 安全 evaluate：页面跳转导致上下文销毁时返回兜底值，不让进程崩掉
async function ev(page, fn, arg, fallback) {
  try { return await page.evaluate(fn, arg); } catch (e) { return fallback; }
}

// 浏览器内：检测当前可见的浮层（toast / modal / popup / sheet / picker ...）
function overlayScript() {
  const SELS = [
    'uni-toast', 'uni-modal', 'uni-mask', 'uni-popup', 'uni-picker',
    'uni-actionsheet', 'uni-drawer', 'uni-swipe-action',
    '.u-popup', '.u-modal', '.u-toast', '.u-action-sheet', '.u-picker',
    '.van-popup', '.van-dialog', '.van-toast', '.van-action-sheet', '.van-picker',
  ];
  function txt(el) { return (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' '); }
  function vis(el) {
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.height < 16) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    return true;
  }
  const out = [];
  const seen = new Set();
  function push(kind, el) {
    const t = txt(el).slice(0, 120);
    if (!t) return;
    const key = kind + '|' + t.slice(0, 40);
    if (seen.has(key)) return;
    seen.add(key);
    const r = el.getBoundingClientRect();
    out.push({ kind, text: t, w: Math.round(r.width), h: Math.round(r.height) });
  }
  for (const s of SELS) {
    for (const el of document.querySelectorAll(s)) if (vis(el)) push(s.replace(/^[.#]/, ''), el);
  }
  // 兜底：class 关键词（避免漏掉自定义组件）
  const KW = /popup|modal|toast|mask|dialog|actionsheet|action-sheet|sheet|picker|confirm|alert/i;
  for (const el of document.querySelectorAll('body *')) {
    const c = (el.className || '').toString();
    if (!c || !KW.test(c)) continue;
    if (el.tagName.toLowerCase().indexOf('uni-') === 0) continue;
    if (!vis(el)) continue;
    // 只取浮层容器：fixed/absolute + 覆盖面积较大，或高度占屏 20%+
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const big = r.width >= window.innerWidth * 0.6;
    if (cs.position === 'fixed' || cs.position === 'absolute' || big) {
      if (r.height >= window.innerHeight * 0.15 || big) push('custom', el);
    }
  }
  return out;
}

// 浏览器内：按 class + 文本定位元素 → 滚动到视口 → 真实点击
function clickScript(args) {
  const { cls, text } = args;
  const els = Array.from(document.querySelectorAll('*'));
  let target = null;
  for (const el of els) {
    if ((el.className || '').toString().slice(0, 60) !== cls) continue;
    const t = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    if (t === text) { target = el; break; }
  }
  if (!target) return { ok: false, reason: 'not-found' };
  target.scrollIntoView({ block: 'center', inline: 'center' });
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const r = target.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      let el = document.elementFromPoint(x, y);
      if (!el) { target.click(); return resolve({ ok: true, via: 'direct' }); }
      let cur = el;
      for (let i = 0; i < 5 && cur; i++) {
        if (typeof cur.click === 'function') { cur.click(); return resolve({ ok: true, via: 'hit:' + cur.tagName.toLowerCase() }); }
        cur = cur.parentElement;
      }
      resolve({ ok: false, reason: 'no-click' });
    }));
  });
}

(async () => {
  if (!fs.existsSync(STATE)) {
    console.error('缺少登录态，先运行 tools/login.js <手机号> <密码>');
    process.exit(1);
  }
  fs.mkdirSync(SHOT_DIR, { recursive: true });

  let pages = FEATURES.pages.filter((p) => p.els && p.els.length);
  if (ONLY) {
    const set = ONLY.split(',').map((s) => s.trim());
    pages = pages.filter((p) => set.some((s) => p.route.includes(s) || p.file.includes(s)));
  }

  const results = [];
  const shotIndex = {};   // 同一类状态只留一张代表图 + 计数
  let shots = 0;

  const outFile = path.join(ROOT, 'scrape-work', 'ui-states.json');
  // 断点续跑：已有结果里的路由直接跳过
  if (process.env.RESUME === '1' && fs.existsSync(outFile)) {
    const prev = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    const done = new Set(prev.pages.map((p) => p.route));
    results.push(...prev.pages);
    pages = pages.filter((p) => !done.has(p.route));
    console.log('续跑：已完成 ' + done.size + ' 页，剩余 ' + pages.length + ' 页');
  }
  function flush() {
    fs.writeFileSync(
      outFile,
      JSON.stringify({ generatedAt: new Date().toISOString(), pages: results }, null, 1),
      'utf8'
    );
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], storageState: STATE });

  for (const p of pages) {
    const route = p.route;
    const page = await ctx.newPage();
    const apiHits = [];
    page.on('request', (r) => {
      const u = r.url();
      if (u.includes('api.shenyuan.sc.cn')) apiHits.push(u.split('/').pop().slice(0, 10));
    });

    let baseOverlays = [];
    try {
      await page.goto(BASE + '/#' + route, { waitUntil: 'load', timeout: 40000 });
      await page.waitForTimeout(WAIT);
      baseOverlays = await page.evaluate(overlayScript);
    } catch (e) {
      console.log('!! ' + route + ' 打开失败: ' + String(e.message).slice(0, 60));
      await page.close();
      continue;
    }

    const baseKeys = new Set(baseOverlays.map((o) => o.kind + '|' + o.text.slice(0, 40)));
    const found = [];

    // 优先点按钮类，其次其它
    const prio = p.els.filter((e) => /btn|button|tab|submit|confirm|more|close|share|search|sort|filter|switch|card|item|row|goods|order|banner|link|entry|icon/i.test(e.cls));
    const list = (prio.length ? prio : p.els).slice(0, MAX);

    for (const e of list) {
      apiHits.length = 0;
      const beforeHash = await ev(page, () => location.hash, null, '');
      let res = { ok: false };
      try { res = await page.evaluate(clickScript, { cls: e.cls, text: e.text }); } catch (_) {}
      await page.waitForTimeout(700);
      const ov = await ev(page, overlayScript, null, []);
      const fresh = (ov || []).filter((o) => !baseKeys.has(o.kind + '|' + o.text.slice(0, 40)));
      await page.waitForTimeout(900);
      const afterHash = await ev(page, () => location.hash, null, '');

      if (fresh.length) {
        for (const o of fresh) {
          const sig = o.kind + '|' + o.text.slice(0, 40);
          shotIndex[sig] = (shotIndex[sig] || 0) + 1;
          const n = shotIndex[sig];
          let file = '';
          if (n === 1) {
            file = safe(route.replace(/^\//, '')) + '__' + safe(o.kind) + '__' + safe(o.text) + '.png';
            try { await page.screenshot({ path: path.join(SHOT_DIR, file) }); shots++; } catch (_) { file = ''; }
          }
          found.push({
            trigger: e.text.slice(0, 24), kind: o.kind, text: o.text.slice(0, 90),
            size: o.w + 'x' + o.h, shot: file, n, route,
          });
        }
      } else if (afterHash !== beforeHash) {
        found.push({ trigger: e.text.slice(0, 24), kind: 'nav', text: afterHash, shot: '', route });
      } else if (apiHits.length) {
        found.push({ trigger: e.text.slice(0, 24), kind: 'api', text: [...new Set(apiHits)].join(','), shot: '', route });
      }

      // 复位：跳转了就回原页；有浮层就按 ESC/返回关闭
      if (afterHash !== beforeHash) {
        try { await page.goto(BASE + '/#' + route, { waitUntil: 'load', timeout: 30000 }); await page.waitForTimeout(2000); } catch (_) {}
      } else if (fresh.length) {
        try { await page.keyboard.press('Escape'); } catch (_) {}
        await page.waitForTimeout(400);
        const still = await ev(page, overlayScript, null, []);
        if ((still || []).some((o) => !baseKeys.has(o.kind + '|' + o.text.slice(0, 40)))) {
          try {
            await page.goto(BASE + '/#' + route, { waitUntil: 'load', timeout: 30000 });
            await page.waitForTimeout(2000);
          } catch (_) {}
        }
      }
    }

    results.push({ route, file: p.file, tested: list.length, states: found });
    flush();   // 增量落盘，避免中途崩溃丢数据
    const kinds = {};
    found.forEach((f) => { kinds[f.kind] = (kinds[f.kind] || 0) + 1; });
    console.log(
      (found.length ? 'OK ' : '-- ') + route.padEnd(38) +
      ' 点' + String(list.length).padStart(2) +
      ' 状态' + String(found.length).padStart(2) +
      (Object.keys(kinds).length ? '  ' + JSON.stringify(kinds) : '')
    );

    await page.close();
  }

  fs.writeFileSync(
    path.join(ROOT, 'scrape-work', 'ui-states.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), pages: results }, null, 1),
    'utf8'
  );

  const tot = results.reduce((a, b) => a + b.states.length, 0);
  console.log('\n===== 汇总 =====');
  console.log('页面 ' + results.length + ' | 捕获 UI 状态 ' + tot + ' 条 | 截图 ' + shots + ' 张');
  console.log('数据 -> scrape-work/ui-states.json   截图 -> output/h5.shenyuan.sc.cn/ui-states/');

  await browser.close();
})();
