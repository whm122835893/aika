/**
 * Generate a human-readable API dictionary from the captured response cache.
 * Output: output/h5.shenyuan.sc.cn/api-dictionary.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const DIR = path.join(OUT, 'assets', 'api-cache');
const MAPS = ['asset-map.json', 'asset-map-auth.json', 'asset-map-deep.json'];

const urlOf = {};
for (const mf of MAPS) {
  const p = path.join(ROOT, 'scrape-work', mf);
  if (!fs.existsSync(p)) continue;
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const [, v] of (m.api || [])) urlOf[v.rel.split('/').pop()] = { url: v.url.split('/').pop(), method: v.method };
}

function shapeOf(data) {
  const list = Array.isArray(data) ? data : (data && data.list && Array.isArray(data.list) ? data.list : null);
  if (list && list.length && typeof list[0] === 'object') {
    return 'list[' + list.length + ']: ' + Object.keys(list[0]).join(', ');
  }
  if (data && typeof data === 'object') return 'obj: ' + Object.keys(data).join(', ');
  if (data === null || data === undefined) return '(空)';
  return typeof data + ': ' + JSON.stringify(data).slice(0, 60);
}

const groups = new Map();
let total = 0, ok = 0, unauthorized = 0, err = 0;

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  total++;
  let j = null;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { continue; }
  if (j.code === 401) unauthorized++;
  else if (j.code !== 0) err++;
  else ok++;
  const name = j.method || '(未命名 · code=' + j.code + ')';
  if (!groups.has(name)) groups.set(name, { n: 0, code: j.code, shape: '', sample: '', ep: '', empty: 0 });
  const g = groups.get(name);
  g.n++;
  if (!g.ep) {
    const m = urlOf[f];
    g.ep = m ? m.method + ' /' + m.url.slice(0, 8) + '…' : '(端点未映射)';
  }
  if (j.code === 0) {
    const s = shapeOf(j.data);
    if (s.length > (g.shape || '').length) { g.shape = s; g.sample = JSON.stringify(j.data).slice(0, 260); }
    if (j.data === null || j.data === undefined || (j.data && j.data.total === 0)) g.empty++;
  }
}

const lines = [];
lines.push('# API 接口字典（h5.shenyuan.sc.cn · ICard 爱卡）');
lines.push('');
lines.push('由离线抓取的响应缓存反向整理。接口端点为 md5 哈希串，**接口名取自响应体自带的 `method` 字段**（原站返回，非推测）。');
lines.push('');
lines.push('## 概览');
lines.push('');
lines.push('| 指标 | 值 |');
lines.push('|---|---|');
lines.push('| 捕获响应总数 | ' + total + ' |');
lines.push('| 成功（code=0） | ' + ok + ' |');
lines.push('| 未登录（code=401） | ' + unauthorized + ' |');
lines.push('| 其它错误（405 / -1） | ' + err + ' |');
lines.push('| 可识别接口名 | ' + [...groups.keys()].filter((k) => !k.startsWith('(')).length + ' |');
lines.push('');
lines.push('> 说明：全部请求体均为加密签名体（`trans_id` + `timestamp` + `sign`），无法从请求参数推断语义；');
lines.push('> 因此本表以**响应结构与接口名**为准。');
lines.push('');

lines.push('## 接口清单');
lines.push('');
lines.push('| 状态 | 次数 | 接口名 | 数据字段结构 |');
lines.push('|---|--:|---|---|');
[...groups.entries()]
  .sort((a, b) => (a[0].startsWith('(') ? 1 : 0) - (b[0].startsWith('(') ? 1 : 0) || b[1].n - a[1].n)
  .forEach(([name, g]) => {
    const st = g.code === 0 ? '✅' : (g.code === 401 ? '🔒' : '⚠️');
    lines.push('| ' + st + ' | ' + g.n + ' | ' + name + ' | `' + (g.shape || '(无数据)').slice(0, 150) + '` |');
  });
lines.push('');

lines.push('## 成功响应样例（code=0）');
lines.push('');
[...groups.entries()].filter(([, g]) => g.code === 0 && g.sample).forEach(([name, g]) => {
  lines.push('### ' + name);
  lines.push('');
  lines.push('- 端点：`' + g.ep + '`');
  lines.push('- 命中 ' + g.n + ' 次' + (g.empty ? '，其中 ' + g.empty + ' 次为空列表' : ''));
  lines.push('');
  lines.push('```json');
  lines.push(g.sample);
  lines.push('```');
  lines.push('');
});

// interfaces that answered OK but carry no rows — the account used for the
// crawl has no orders / holdings, so only the envelope shape is recoverable.
const emptyOnes = [...groups.entries()].filter(([, g]) => {
  if (g.code !== 0) return false;
  const s = g.shape || '';
  return /obj: list$|obj: list, total$|list\[0\]/.test(s) || /"list":\[\]/.test(g.sample);
});
if (emptyOnes.length) {
  lines.push('## ⚠️ 返回成功但列表为空的接口');
  lines.push('');
  lines.push('抓取所用账号 `175****1293` 为**零数据账号**（无订单、无持仓、无地址、余额 0），');
  lines.push('因此下列接口只拿到了**信封结构**（如 `{list:[...]}`），拿不到行内字段定义：');
  lines.push('');
  lines.push('| 接口名 | 命中 | 返回结构 |');
  lines.push('|---|--:|---|');
  emptyOnes.forEach(([name, g]) => lines.push('| ' + name + ' | ' + g.n + ' | `' + (g.sample || g.shape || '').slice(0, 90) + '` |'));
  lines.push('');
  lines.push('> 若要补齐字段定义，需要一个有真实订单/持仓的账号重新抓取。');
  lines.push('');
}

lines.push('## 未取到数据的接口');
lines.push('');
lines.push('以下接口在抓取时未返回有效数据（多为需要更深层交互、或依赖具体 ID 参数）：');
lines.push('');
[...groups.entries()].filter(([, g]) => g.code !== 0).forEach(([name, g]) => {
  lines.push('- `' + name + '` × ' + g.n + ' — ' + (g.code === 401 ? '需要登录态/未触发' : 'code=' + g.code + '（参数缺失或端点不存在）'));
});

fs.writeFileSync(path.join(OUT, 'api-dictionary.md'), lines.join('\n'), 'utf8');
console.log('api-dictionary.md written: ' + groups.size + ' 个接口 / ' + total + ' 个响应');
