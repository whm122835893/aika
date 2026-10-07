/**
 * 遗漏审计 —— 纯静态分析（不启动浏览器），找出离线副本还缺什么：
 *   A 页面覆盖：路由 vs 快照 vs 已扫描
 *   B 资源缺失：HTML/JS/CSS/JSON 里引用的本地路径在本地不存在
 *   C 外链残留：文件里仍指向外部域名的 URL
 *   D API 覆盖：端点命中数 / 空信封 / 未命名接口
 *   E 功能覆盖：可点击元素 已点 vs 未点
 * 输出 output/h5.shenyuan.sc.cn/gap-audit.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const CACHE = path.join(OUT, 'assets', 'api-cache');
const PAGES = path.join(OUT, 'pages');

const routes = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'routes.json'), 'utf8'));
const features = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'features.json'), 'utf8'));
const clicks = fs.existsSync(path.join(ROOT, 'scrape-work', 'click-results.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'click-results.json'), 'utf8')) : [];
const uis = fs.existsSync(path.join(ROOT, 'scrape-work', 'ui-states.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'ui-states.json'), 'utf8')) : { pages: [] };

// ---------- A 页面覆盖 ----------
const snapshots = new Set(fs.readdirSync(PAGES).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, '')));
const featRoutes = new Set(features.pages.map((p) => p.file.replace(/\.html$/, '')));
const uiRoutes = new Set(uis.pages.map((p) => p.file.replace(/\.html$/, '')));
const missingSnap = routes.filter((r) => !snapshots.has(r));
const missingFeat = routes.filter((r) => !featRoutes.has(r));
const missingUI = routes.filter((r) => !uiRoutes.has(r));

// ---------- B 资源缺失 ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const textExt = /\.(html|js|css|json)$/i;
const files = walk(OUT).filter((f) => textExt.test(f));

// 收集本地引用："/static/...", "/upload/...", "/assets/...", "static/..."（快照内联）
const REF = /(?:["'(=]|url\()\s*["']?(\/(?:static|upload|assets|hybrid)\/[^"'\s),;]+|(?<!\/)(?:static|upload)\/[^"'\s),;]+\.(?:png|jpg|jpeg|gif|webp|svg|ttf|woff2?|otf|js|css|json))/gi;
const missingRes = new Map();
for (const f of files) {
  let s;
  try { s = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  let m;
  while ((m = REF.exec(s))) {
    let ref = m[1].split('?')[0].split('#')[0];
    if (ref.startsWith('/')) ref = ref.slice(1);
    const abs = path.join(OUT, ref);
    if (!fs.existsSync(abs)) {
      const cur = missingRes.get(ref) || { n: 0, from: new Set() };
      cur.n++;
      if (cur.from.size < 4) cur.from.add(path.relative(OUT, f));
      missingRes.set(ref, cur);
    }
  }
}

// ---------- C 外链残留 ----------
const EXEMPT = [/w3\.org/, /schemas\.microsoft/, /unicode\.org/, /example\.com/];
const extUrls = new Map();
for (const f of files) {
  let s;
  try { s = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  const re = /https?:\/\/[a-z0-9.\-]+\.[a-z]{2,}/gi;
  let m;
  while ((m = re.exec(s))) {
    const u = m[0].toLowerCase();
    if (EXEMPT.some((x) => x.test(u))) continue;
    const host = u.replace(/^https?:\/\//, '');
    const cur = extUrls.get(host) || { n: 0, from: new Set() };
    cur.n++;
    if (cur.from.size < 4) cur.from.add(path.relative(OUT, f));
    extUrls.set(host, cur);
  }
}

// ---------- D API 覆盖 ----------
// 端点口径：以 asset-map 里的请求 URL 为准（缓存文件名是 md5(url+body)，不等于端点）
const epMap = new Map();   // endpoint -> {n, rels:Set, methods:Set, withData, empty}
for (const name of ['asset-map.json', 'asset-map-auth.json', 'asset-map-deep.json']) {
  const f = path.join(ROOT, 'scrape-work', name);
  if (!fs.existsSync(f)) continue;
  const m = JSON.parse(fs.readFileSync(f, 'utf8'));
  const arr = Array.isArray(m.api) ? m.api : Object.entries(m.api || {});
  for (const [, v] of arr) {
    if (!v || !v.url) continue;
    const ep = v.url.split('/').pop().slice(0, 32);
    const e = epMap.get(ep) || { endpoint: ep, n: 0, rels: new Set(), methods: new Set(), withData: 0, empty: 0 };
    e.n++;
    if (v.rel) e.rels.add(v.rel);
    epMap.set(ep, e);
  }
}
// 端点对应的缓存内容 → 接口名 + 是否有数据
for (const e of epMap.values()) {
  let hasData = false, emptyOnly = true;
  for (const rel of e.rels) {
    const p = path.join(OUT, rel);
    if (!fs.existsSync(p)) continue;
    let d;
    try { d = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { continue; }
    if (d.method) e.methods.add(d.method);
    const data = d.data;
    let empty;
    if (data === null || data === undefined) empty = true;
    else if (Array.isArray(data)) empty = data.length === 0;
    else if (typeof data === 'object') {
      const l = data.list;
      empty = l === undefined ? Object.keys(data).length === 0
        : (Array.isArray(l) ? l.length === 0 : (l.data || []).length === 0);
    } else empty = String(data).length === 0;
    if (empty) e.empty++; else { e.withData++; hasData = true; emptyOnly = false; }
  }
  e.hasData = hasData;
  e.emptyOnly = emptyOnly;
}
const apiList = [...epMap.values()];
const apiEmpty = apiList.filter((a) => !a.hasData);
const apiNamed = apiList.filter((a) => a.methods.size);
const apiUnnamed = apiList.filter((a) => !a.methods.size);

const apis = [];
for (const f of fs.readdirSync(CACHE)) {
  if (!f.endsWith('.json')) continue;
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf8')); } catch (e) { continue; }
  const data = d.data;
  let empty = false;
  let size = 0;
  if (data === null || data === undefined) empty = true;
  else if (Array.isArray(data)) { size = data.length; empty = data.length === 0; }
  else if (typeof data === 'object') {
    const j = JSON.stringify(data);
    size = j.length;
    const list = data.list;
    if (list !== undefined) {
      const arr = Array.isArray(list) ? list : (list.data || []);
      empty = arr.length === 0;
      size = arr.length;
    } else if (Object.keys(data).length === 0) empty = true;
  } else { size = String(data).length; }
  apis.push({ endpoint: f.replace(/\.json$/, ''), method: d.method || '', code: d.code, empty, size });
}
// 缓存文件层面的统计（469 份响应）
const byEp = {};
apis.forEach((a) => {
  const e = byEp[a.endpoint] || { endpoint: a.endpoint, n: 0, method: a.method, empty: 0, withData: 0, maxSize: 0 };
  e.n++;
  if (a.method && !e.method) e.method = a.method;
  if (a.empty) e.empty++; else e.withData++;
  e.maxSize = Math.max(e.maxSize, a.size);
  byEp[a.endpoint] = e;
});
const cacheEmptyN = apis.filter((a) => a.empty).length;

// ---------- E 功能覆盖 ----------
const clickRoutes = new Map(clicks.map((c) => [c.route, (c.tested || []).length]));
const uiClick = new Map(uis.pages.map((p) => [p.route, p.tested]));
let totalEls = 0, totalTestedClick = 0, totalTestedUI = 0;
const untested = [];
features.pages.forEach((p) => {
  totalEls += p.n;
  const c = clickRoutes.get(p.route) || 0;
  const u = uiClick.get(p.route) || 0;
  totalTestedClick += c;
  totalTestedUI += u;
  const covered = new Set();
  // ui-states 只点了前 MAX 个（按优先级），这里保守按 min(u, n) 估计覆盖
  const rest = Math.max(0, p.n - Math.max(c, u));
  if (rest > 0) untested.push({ route: p.route, n: p.n, tested: Math.max(c, u), rest });
});
untested.sort((a, b) => b.rest - a.rest);

// ---------- 报告 ----------
function esc(s) { return String(s).replace(/\|/g, '\\|'); }
let md = '';
md += '# 遗漏审计报告（离线副本完整性）\n\n';
md += '> 审计时间：' + new Date().toISOString().replace('T', ' ').slice(0, 19) + '  \n';
md += '> 方式：纯静态扫描（页面 / 资源引用 / 外链 / API 缓存 / 功能覆盖），配合断网真机验证。\n\n';

md += '## 结论速览\n\n';
md += '| 检查项 | 结果 | 状态 |\n|---|---|---|\n';
md += '| 路由快照覆盖 | ' + snapshots.size + '/' + routes.length + ' | ' + (missingSnap.length ? '缺 ' + missingSnap.length : '✅ 全覆盖') + ' |\n';
md += '| 功能扫描覆盖 | ' + featRoutes.size + '/' + routes.length + ' | ' + (missingFeat.length ? '缺 ' + missingFeat.length : '✅ 全覆盖') + ' |\n';
md += '| UI 状态扫描覆盖 | ' + uiRoutes.size + '/' + routes.length + ' | ' + (missingUI.length ? '缺 ' + missingUI.length : '✅ 全覆盖') + ' |\n';
md += '| 本地资源缺失 | ' + missingRes.size + ' 类 | ' + (missingRes.size ? '⚠️ 需补' : '✅ 无缺失') + ' |\n';
md += '| 外链残留 | ' + extUrls.size + ' 个域名 | ' + (extUrls.size ? '⚠️ 见明细' : '✅ 无') + ' |\n';
md += '| API 端点 | ' + apiList.length + ' | 有数据 ' + (apiList.length - apiEmpty.length) + ' / 空 ' + apiEmpty.length + '（响应缓存 ' + apis.length + ' 份） |\n';
md += '| 未命名接口 | ' + apiUnnamed.length + ' | ' + (apiUnnamed.length ? '⚠️ 需补抓' : '✅') + ' |\n';
md += '| 可点击元素 | ' + totalEls + ' | 已实测 ' + (totalTestedClick + totalTestedUI > totalEls ? totalEls : Math.max(totalTestedClick, totalTestedUI)) + ' 起 |\n\n';

if (missingSnap.length) {
  md += '## A1 缺快照的路由\n\n' + missingSnap.map((r) => '- `' + r + '`').join('\n') + '\n\n';
}
if (missingFeat.length) {
  md += '## A2 未做功能扫描的路由\n\n' + missingFeat.map((r) => '- `' + r + '`').join('\n') + '\n\n';
}
if (missingUI.length) {
  md += '## A3 未做 UI 状态扫描的路由\n\n' + missingUI.map((r) => '- `' + r + '`').join('\n') + '\n\n';
}

// 过滤正则误报（拼进 HTML 标签里的）
const missingResReal = new Map([...missingRes.entries()].filter(([r]) => !/[<>]/.test(r)));
fs.writeFileSync(
  path.join(ROOT, 'scrape-work', 'gap-missing.json'),
  JSON.stringify([...missingResReal.entries()].map(([ref, v]) => ({ ref, n: v.n, from: [...v.from] })), null, 1),
  'utf8'
);

md += '## B 本地资源缺失（引用了但文件不存在）\n\n';
if (missingResReal.size) {
  md += '| 引用路径 | 命中次数 | 出现位置 |\n|---|--:|---|\n';
  [...missingResReal.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 40).forEach(([ref, v]) => {
    md += '| `' + esc(ref) + '` | ' + v.n + ' | ' + [...v.from].map((f) => '`' + f + '`').join(' ') + ' |\n';
  });
} else md += '✅ 无\n';
md += '\n';

md += '## C 外链残留（离线时仍会请求外部域名）\n\n';
if (extUrls.size) {
  md += '| 域名 | 命中次数 | 出现位置 |\n|---|--:|---|\n';
  [...extUrls.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 30).forEach(([h, v]) => {
    md += '| `' + h + '` | ' + v.n + ' | ' + [...v.from].map((f) => '`' + f + '`').join(' ') + ' |\n';
  });
} else md += '✅ 无\n';
md += '\n';

md += '## D API 端点覆盖\n\n';
md += '- 端点总数：**' + apiList.length + '**（响应缓存 ' + apis.length + ' 份，其中空信封 ' + cacheEmptyN + ' 份）\n';
md += '- 有业务数据：**' + (apiList.length - apiEmpty.length) + '**　只拿到空信封：**' + apiEmpty.length + '**\n';
md += '- 有中文接口名：**' + apiNamed.length + '**　未命名：**' + apiUnnamed.length + '**\n\n';

if (apiUnnamed.length) {
  md += '### D1 未命名端点（响应里没有 method 字段，业务含义未知）\n\n';
  md += '| 端点 | 请求次数 | 缓存份数 | 有数据 | 空 |\n|---|--:|--:|--:|--:|\n';
  apiUnnamed.sort((a, b) => b.n - a.n).forEach((a) => {
    md += '| `' + a.endpoint + '` | ' + a.n + ' | ' + a.rels.size + ' | ' + a.withData + ' | ' + a.empty + ' |\n';
  });
  md += '\n';
}
if (apiEmpty.length) {
  md += '### D2 只拿到空信封的端点（账号零数据 / 缺参数，需换号或造数据）\n\n';
  md += '| 端点 | 接口名 | 请求次数 | 空/有 |\n|---|---|--:|--:|\n';
  apiEmpty.sort((a, b) => b.n - a.n).forEach((a) => {
    md += '| `' + a.endpoint + '` | ' + (a.methods.size ? esc([...a.methods].join('/')) : '—') + ' | ' + a.n + ' | ' + a.empty + '/' + a.withData + ' |\n';
  });
  md += '\n';
}

// ---------- F 断网真机验证 ----------
const vf = path.join(ROOT, 'scrape-work', 'verify-all.json');
if (fs.existsSync(vf)) {
  const raw = JSON.parse(fs.readFileSync(vf, 'utf8'));
  const arr = (Array.isArray(raw) ? raw : Object.values(raw)[0]).filter((p) => p.file !== 'index.html');
  const withContent = arr.filter((p) => p.textLen > 200);
  const empty = arr.filter((p) => p.textLen <= 200 && p.textLen > 0);
  const blank = arr.filter((p) => !p.textLen);
  const leaky = arr.filter((p) => (p.leaks || []).length);
  const broken = arr.filter((p) => (p.brokenImgs || 0) > 0);
  const errs = arr.filter((p) => (p.errors || []).length);

  md += '## F 断网真机验证（Playwright，拦截全部外部请求）\n\n';
  md += '| 分类 | 页面数 | 说明 |\n|---|--:|---|\n';
  md += '| 有完整内容 | ' + withContent.length + ' | 离线可正常浏览业务数据 |\n';
  md += '| 极少内容（空态/需参数/需登录） | ' + empty.length + ' | 依赖 id 参数或账号有数据 |\n';
  md += '| 完全空白 | ' + blank.length + ' | 需参数才渲染 |\n';
  md += '| 外链残留 | ' + leaky.length + ' | ' + (leaky.length ? leaky.map((p) => '`' + p.file + '`').join(' ') : '—') + ' |\n';
  md += '| 破损图片 | ' + broken.length + ' | ' + (broken.length ? broken.map((p) => '`' + p.file + '`(' + p.brokenImgs + ')').join(' ') : '—') + ' |\n';
  md += '| JS 报错 | ' + errs.length + ' | ' + (errs.length ? '⚠️' : '✅ 0') + ' |\n\n';

  if (withContent.length) {
    md += '<details><summary>有完整内容的 ' + withContent.length + " 个页面</summary>\n\n";
    md += '| 页面 | 文本长度 | 图片数 |\n|---|--:|--:|\n';
    withContent.sort((a, b) => b.textLen - a.textLen).forEach((p) => {
      md += '| `' + p.file.replace(/\.html$/, '') + '` | ' + p.textLen + ' | ' + p.imgCount + ' |\n';
    });
    md += '\n</details>\n\n';
  }
  if (blank.length) {
    md += '### F1 完全空白的页面（需补参数才能看到内容）\n\n';
    md += blank.map((p) => '- `' + p.file.replace(/\.html$/, '') + '`').join('\n') + '\n\n';
  }
}

md += '## E 功能覆盖缺口（已扫但没点过的元素）\n\n';
md += '> 合计 ' + totalEls + ' 个可点击元素；功能扫描阶段点了 ' + totalTestedClick +
  ' 个，UI 状态阶段点了 ' + totalTestedUI + ' 个（两者有重叠）。\n';
md += '> 下表按「还差点多少」排序，是**下一轮补测的优先清单**。\n\n';
md += '| 页面 | 可点击 | 已点 | 缺口 |\n|---|--:|--:|--:|\n';
untested.slice(0, 30).forEach((u) => {
  md += '| `' + u.route + '` | ' + u.n + ' | ' + u.tested + ' | ' + u.rest + ' |\n';
});
md += '\n';

fs.writeFileSync(path.join(OUT, 'gap-audit.md'), md, 'utf8');

console.log('=== 遗漏审计 ===');
console.log('快照 ' + snapshots.size + '/' + routes.length + ' | 功能 ' + featRoutes.size + ' | UI ' + uiRoutes.size);
console.log('资源缺失 ' + missingResReal.size + ' 类 | 外链域名 ' + extUrls.size + ' 个');
console.log('API 端点 ' + apiList.length + '（空 ' + apiEmpty.length + '，未命名 ' + apiUnnamed.length + '）');
console.log('可点击元素 ' + totalEls + '，功能测试 ' + totalTestedClick + '，UI 测试 ' + totalTestedUI);
console.log('报告 -> output/h5.shenyuan.sc.cn/gap-audit.md');
