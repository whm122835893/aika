/**
 * 把 scrape-work/click-results.json 转成《点击行为实测报告》，
 * 并追加到 features-report.md 末尾。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'scrape-work', 'click-results.json');
const REPORT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn', 'features-report.md');

if (!fs.existsSync(SRC)) {
  console.error('缺少 scrape-work/click-results.json，先用 CLICK=1 运行 tools/features.js');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));

let tested = 0, alive = 0, nav = 0, api = 0, changed = 0;
const rows = [];

for (const p of data) {
  for (const t of p.tested) {
    tested++;
    const isAlive = t.nav || t.contentChanged || (t.api && t.api.length);
    if (isAlive) alive++;
    if (t.nav) nav++;
    if (t.api && t.api.length) api++;
    if (t.contentChanged && !t.nav) changed++;
    rows.push({ page: p.route.replace('/pages/', ''), ...t, isAlive });
  }
}

const L = [];
L.push('');
L.push('## 点击行为实测');
L.push('');
L.push('> 对重点页面的可点击元素逐个真实点击（`element.click()`），');
L.push('> 记录：是否发生路由跳转 / 页面内容变化 / 触发了哪些 API 端点。');
L.push('');
L.push('| 指标 | 值 |');
L.push('|---|---|');
L.push('| 实测点击次数 | ' + tested + ' |');
L.push('| **有反应** | **' + alive + '（' + ((alive / tested) * 100).toFixed(0) + '%）** |');
L.push('| 触发路由跳转 | ' + nav + ' |');
L.push('| 触发 API 请求 | ' + api + ' |');
L.push('| 仅内容变化 | ' + changed + ' |');
L.push('| 无反应 | ' + (tested - alive) + ' |');
L.push('');

// 按页面
L.push('### 逐页实测');
L.push('');
L.push('| 页面 | 点击 | 有反应 | 详情 |');
L.push('|---|--:|--:|---|');
for (const p of data) {
  const act = p.tested.filter((t) => t.nav || t.contentChanged || (t.api && t.api.length));
  const detail = act
    .slice(0, 6)
    .map((t) => t.text.slice(0, 12) + (t.nav ? '→跳' : t.api.length ? '→API' : '→变'))
    .join(' · ');
  L.push('| `' + p.route.replace('/pages/', '') + '` | ' + p.tested.length + ' | ' + act.length + ' | ' + (detail || '—') + ' |');
}
L.push('');

// 有效功能明细
L.push('### 有反应的功能明细');
L.push('');
L.push('| 页面 | 功能 | 元素 | 行为 | 触发 API |');
L.push('|---|---|---|---|---|');
rows
  .filter((r) => r.isAlive)
  .sort((a, b) => (b.nav ? 1 : 0) - (a.nav ? 1 : 0))
  .slice(0, 60)
  .forEach((r) => {
    const beh = r.nav ? '路由跳转 → `' + r.to.replace('#/pages/', '') + '`' : r.api.length ? '请求 API' : '内容变化';
    L.push(
      '| `' + r.page + '` | **' + (r.text || '(无文本)').slice(0, 22) + '** | `' + String(r.cls).slice(0, 26) +
      '` | ' + beh + ' | ' + (r.api.length ? r.api.map((a) => '/' + a).join(' ') : '—') + ' |'
    );
  });
L.push('');

// 跳转目标 & 路由参数约定（二次开发直接可用）
const navs = {};
rows.filter((r) => r.nav && r.to).forEach((r) => {
  const k = r.to.replace('#/pages/', '');
  (navs[k] = navs[k] || []).push(r.page + '·' + (r.text || '').slice(0, 12));
});
L.push('### 跳转目标与路由参数约定');
L.push('');
L.push('> 这些是真实点击后 uni-app 路由产生的目标 URL，**参数名即后端约定**。');
L.push('');
L.push('| 跳转目标 | 次数 | 来源（页面·功能） |');
L.push('|---|--:|---|');
Object.entries(navs)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([k, src]) => {
    L.push('| `' + k + '` | ' + src.length + ' | ' + src.slice(0, 3).join('、') + ' |');
  });
L.push('');
const paramRoutes = Object.keys(navs).filter((k) => k.includes('?'));
if (paramRoutes.length) {
  L.push('**带参数的路由**：');
  L.push('');
  paramRoutes.forEach((k) => L.push('- `' + k + '`'));
  L.push('');
}

// 无反应的（可能是死链/需条件）
const dead = rows.filter((r) => !r.isAlive);
if (dead.length) {
  L.push('### 点击无反应（' + dead.length + '）');
  L.push('');
  L.push('> 可能原因：需真实数据/权限才响应、事件绑在子元素、或纯展示元素。');
  L.push('');
  const byPage = {};
  dead.forEach((r) => { (byPage[r.page] = byPage[r.page] || []).push(r.text || '(无文本)'); });
  Object.entries(byPage).forEach(([pg, list]) => {
    L.push('- `' + pg + '`：' + list.slice(0, 8).map((x) => x.slice(0, 14)).join('、'));
  });
  L.push('');
}

// 追加到报告
let md = fs.readFileSync(REPORT, 'utf8');
const marker = '## 复现方式';
const idx = md.indexOf(marker);
if (idx > 0) {
  // 去掉旧的点击实测段（若重复运行）
  const prev = md.indexOf('## 点击行为实测');
  if (prev > 0 && prev < idx) md = md.slice(0, prev) + md.slice(idx);
  const idx2 = md.indexOf(marker);
  md = md.slice(0, idx2) + L.join('\n') + '\n' + md.slice(idx2);
} else {
  md += '\n' + L.join('\n');
}
fs.writeFileSync(REPORT, md, 'utf8');
console.log('appended click report -> ' + REPORT);
console.log('点击 ' + tested + ' | 有反应 ' + alive + ' (' + ((alive / tested) * 100).toFixed(0) + '%) | 跳转 ' + nav + ' | API ' + api);
