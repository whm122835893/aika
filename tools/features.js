/**
 * 全局功能扫描器 —— 带登录态遍历全部路由，枚举「可点击功能元素」。
 *
 * Phase 1（本脚本 / FEATURES=1）：静态枚举
 *   - 遍历全部路由，渲染后提取所有可点击元素
 *   - 判定：标签(button/a/uni-button/uni-navigator) + class 关键词 + 可见性 + 文本
 *   - 输出 scrape-work/features.json
 *
 * Phase 2（CLICK=1）：对重点页面实际点击，记录路由跳转 + 触发的 API
 */
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'scrape-work', 'auth-state.json');
const ROUTES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'routes.json'), 'utf8'));
const BASE = 'https://h5.shenyuan.sc.cn';

const ONLY = process.env.ONLY || '';           // 逗号分隔的路由过滤
const LIMIT = parseInt(process.env.LIMIT || '0', 10);
const WAIT = parseInt(process.env.WAIT || '3500', 10);
const DO_CLICK = process.env.CLICK === '1';
const MAX_CLICK = parseInt(process.env.MAX_CLICK || '12', 10);

// 可点击判定关键词（class / 标签）
const CLICK_CLASS = [
  'btn', 'button', 'tab', 'tabs', 'item', 'card', 'row', 'link', 'nav', 'menu',
  'cell', 'entry', 'icon', 'close', 'more', 'submit', 'confirm', 'cancel',
  'action', 'operate', 'handle', 'click', 'tap', 'select', 'option', 'switch',
  'tag', 'chip', 'banner', 'list', 'goods', 'product', 'order', 'bar', 'footer',
  'header', 'back', 'share', 'search', 'filter', 'sort', 'check', 'radio',
];

function routeToName(r) {
  return r.replace(/[^A-Za-z0-9_-]/g, '_');
}

// 在页面加载前注入：hook addEventListener，给真正绑定了 click/tap 的元素打标记
const INIT_SCRIPT = `
(function () {
  var TYPES = /^(click|tap|touchstart|touchend|touch|mouseup|pointerup)$/i;
  var origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    try {
      if (TYPES.test(type) && this && this.nodeType === 1) {
        this.setAttribute('data-has-click', '1');
        var c = (this.getAttribute('data-click-types') || '');
        if (c.indexOf(type) === -1) this.setAttribute('data-click-types', c ? c + ',' + type : type);
      }
    } catch (e) {}
    return origAdd.call(this, type, fn, opts);
  };
  var origRemove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (type, fn, opts) {
    return origRemove.call(this, type, fn, opts);
  };
})();
`;

// 页面内提取「真正可点击」的元素（在浏览器上下文执行）
function extractScript(keywords) {
  const kw = keywords;
  function txt(el) {
    return (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
  }
  function rect(el) {
    return el.getBoundingClientRect();
  }
  function visible(el) {
    const r = rect(el);
    if (r.width < 4 || r.height < 4) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    return true;
  }

  const out = [];
  const seen = new Set();

  // 主路径：真实绑定了 click/tap 事件的元素
  const bound = document.querySelectorAll('[data-has-click]');
  for (const el of bound) {
    if (!visible(el)) continue;
    const r = rect(el);
    const t = txt(el);
    const cls = (el.className || '').toString();
    const key = 'B|' + (t.slice(0, 24)) + '|' + cls.slice(0, 26);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: cls.slice(0, 60),
      text: t.slice(0, 40),
      x: Math.round(r.left + r.width / 2),
      y: Math.round(r.top + r.height / 2),
      w: Math.round(r.width),
      h: Math.round(r.height),
      w_abs: Math.round(window.scrollY + r.top + r.height / 2),
      kind: 'event',
      types: el.getAttribute('data-click-types') || '',
    });
  }

  // 补充：按 class 关键词命中但未绑事件（可能是事件委托 / CSS 交互）
  for (const el of document.querySelectorAll('uni-view,uni-text,uni-image,uni-button,button,a,uni-navigator,div,span')) {
    if (el.hasAttribute('data-has-click')) continue;
    if (!visible(el)) continue;
    const cls = (el.className || '').toString();
    const clsLow = cls.toLowerCase();
    if (!kw.some((k) => clsLow.includes(k))) continue;
    const t = txt(el);
    if (!t || t.length > 30) continue;
    const r = rect(el);
    const key = 'C|' + t.slice(0, 24) + '|' + cls.slice(0, 26);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: cls.slice(0, 60),
      text: t.slice(0, 40),
      x: Math.round(r.left + r.width / 2),
      y: Math.round(r.top + r.height / 2),
      w: Math.round(r.width),
      h: Math.round(r.height),
      w_abs: Math.round(window.scrollY + r.top + r.height / 2),
      kind: 'class',
      types: '',
    });
  }
  return out;
}

(async () => {
  if (!fs.existsSync(STATE)) {
    console.error('缺少登录态，先运行 tools/login.js <手机号> <密码>');
    process.exit(1);
  }
  // routes.json 存的是 chunk 名（pages-home-home），连字符 = 路径分隔符
  let routes = ROUTES.map((r) => ({ name: r, path: '/' + r.replace(/-/g, '/') }));
  if (ONLY) {
    const set = ONLY.split(',').map((s) => s.trim().replace(/-/g, '/'));
    routes = routes.filter((r) => set.some((s) => r.path.includes(s) || r.name.includes(s)));
  }
  if (LIMIT > 0) routes = routes.slice(0, LIMIT);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 12'], storageState: STATE });

  const all = [];
  const clickResults = [];

  for (const { name, path: route } of routes) {
    const page = await ctx.newPage();
    const apiHits = [];
    page.on('request', (r) => {
      const u = r.url();
      if (u.includes('api.shenyuan.sc.cn')) apiHits.push(u.split('/').pop().slice(0, 10));
    });

    let els = [];
    let err = '';
    try {
      await page.addInitScript(INIT_SCRIPT);
      await page.goto(BASE + '/#' + route, { waitUntil: 'load', timeout: 40000 });
      await page.waitForTimeout(WAIT);
      if (process.env.DEBUG) {
        const dbg = await page.evaluate(() => ({
          marked: document.querySelectorAll('[data-has-click]').length,
          bodyLen: (document.body.innerText || '').trim().length,
          hash: location.hash,
        }));
        console.log('    [dbg] ' + JSON.stringify(dbg));
      }
      els = await page.evaluate(extractScript, CLICK_CLASS);
    } catch (e) {
      err = String(e.message).slice(0, 80);
    }

    all.push({ route: route, file: name + '.html', n: els.length, err, els, api: apiHits.length });

    console.log(
      (els.length ? 'OK ' : '-- ') + name.padEnd(34) +
      ' 可点击=' + String(els.length).padStart(3) +
      ' API=' + String(apiHits.length).padStart(2) +
      (err ? '  ERR:' + err : '')
    );

    // --- Phase 2：实际点击测试 ---
    if (DO_CLICK && els.length) {
      const tested = [];
      // 优先测：按钮 / tab / 有明确动作语义的
      const priority = els.filter((e) =>
        e.kind === 'tag' || /btn|button|tab|submit|confirm|more|close|share|search|sort|filter|check|switch|card|item|row|goods|product|order|banner|link|nav|entry|icon/.test(e.cls.toLowerCase())
      );
      const list = (priority.length ? priority : els).slice(0, MAX_CLICK);
      for (const e of list) {
        const before = await page.evaluate(() => location.hash);
        const beforeTxt = await page.evaluate(() => (document.body.innerText || '').trim().slice(0, 60));
        apiHits.length = 0;
        let clicked = false;
        try {
          clicked = await page.evaluate(
            ([x, y]) => {
              const el = document.elementFromPoint(x, y);
              if (!el) return false;
              let cur = el;
              for (let i = 0; i < 4 && cur; i++) {
                if (cur.click) { cur.click(); return true; }
                cur = cur.parentElement;
              }
              return false;
            },
            [e.x, e.y]
          );
        } catch (err2) {}
        await page.waitForTimeout(1800);
        const after = await page.evaluate(() => location.hash);
        const afterTxt = await page.evaluate(() => (document.body.innerText || '').trim().slice(0, 60));
        const nav = after !== before;
        const contentChanged = afterTxt !== beforeTxt;
        tested.push({
          text: e.text.slice(0, 24),
          cls: e.cls.slice(0, 34),
          clicked,
          nav,
          to: nav ? after : '',
          contentChanged,
          api: [...new Set(apiHits)],
        });
        // 若发生跳转，回到原页面继续测下一个
        if (nav) {
          try {
            await page.goto(BASE + '/#' + route, { waitUntil: 'load', timeout: 30000 });
            await page.waitForTimeout(2000);
          } catch (e2) {}
        }
      }
      clickResults.push({ route: route, file: name + '.html', tested });
      const active = tested.filter((t) => t.nav || t.contentChanged || t.api.length);
      console.log('    ↳ 点击 ' + tested.length + ' 个，有反应 ' + active.length + ' 个: ' +
        active.map((t) => t.text + (t.nav ? '→跳转' : t.api.length ? '→API' : '→变化')).join(' | '));
    }

    await page.close();
  }

  // ONLY 模式（局部扫描）写单独文件，避免覆盖全量枚举结果
  const featFile = ONLY ? 'features-only.json' : 'features.json';
  fs.writeFileSync(
    path.join(ROOT, 'scrape-work', featFile),
    JSON.stringify({ generatedAt: new Date().toISOString(), withAuth: true, pages: all }, null, 1),
    'utf8'
  );
  if (DO_CLICK) {
    fs.writeFileSync(
      path.join(ROOT, 'scrape-work', 'click-results.json'),
      JSON.stringify(clickResults, null, 1),
      'utf8'
    );
  }

  const total = all.reduce((a, b) => a + b.n, 0);
  console.log('\n===== 汇总 =====');
  console.log('页面 ' + all.length + ' | 可点击元素总计 ' + total + ' | 平均 ' + (total / all.length).toFixed(1) + ' 个/页');
  console.log('枚举结果 -> scrape-work/' + featFile);
  if (DO_CLICK) console.log('点击结果 -> scrape-work/click-results.json');

  await browser.close();
})();
