/**
 * 生成《后端 API 端点全清单》—— 二次开发直接可用的接口资产。
 * 输出 output/h5.shenyuan.sc.cn/api-endpoints.md
 *
 * 数据源：
 *  - scrape-work/asset-map*.json  (端点哈希 / method / post body)
 *  - output/.../assets/api-cache/*.json (响应体，含原站自带的 method 中文接口名)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const CACHE = path.join(OUT, 'assets', 'api-cache');

// --- 1. 汇总所有请求记录 ---------------------------------------------------
const reqs = [];
for (const n of ['asset-map.json', 'asset-map-auth.json', 'asset-map-deep.json']) {
  const p = path.join(ROOT, 'scrape-work', n);
  if (!fs.existsSync(p)) continue;
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  (m.api || []).forEach(([k, v]) =>
    reqs.push({ url: v.url, method: (v.method || 'POST').toUpperCase(), post: v.post || '', rel: v.rel })
  );
}

// --- 2. 按端点聚合 ---------------------------------------------------------
const ep = new Map();
for (const r of reqs) {
  const hash = r.url.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '');
  if (!/^[0-9a-f]{32}$/.test(hash)) continue;
  if (!ep.has(hash)) ep.set(hash, { n: 0, methods: new Set(), files: new Set(), postSample: '' });
  const e = ep.get(hash);
  e.n++;
  e.methods.add(r.method);
  e.files.add(r.rel.split('/').pop());
  if (!e.postSample && r.post) e.postSample = r.post;
}

// --- 3. 读取响应，提取接口名 / code / 字段结构 ------------------------------
function shape(j) {
  const d = j.data;
  const list = Array.isArray(d) ? d : d && d.list;
  if (Array.isArray(list)) {
    if (list.length && typeof list[0] === 'object') {
      return { kind: 'list', len: list.length, fields: Object.keys(list[0]).join(', ') };
    }
    if (list && typeof list === 'object' && list.data !== undefined) {
      return {
        kind: 'paged',
        len: Array.isArray(list.data) ? list.data.length : 0,
        fields: 'total, per_page, current_page, last_page, data, has_more',
      };
    }
    return { kind: 'list', len: 0, fields: '(空数组)' };
  }
  if (d && typeof d === 'object') return { kind: 'obj', len: 1, fields: Object.keys(d).join(', ') };
  if (d === null || d === undefined) return { kind: 'null', len: 0, fields: '(无数据)' };
  return { kind: 'val', len: 1, fields: JSON.stringify(d).slice(0, 40) };
}

const rows = [];
for (const [hash, e] of ep) {
  const names = new Map();
  const codes = new Map();
  let sh = null;
  let sample = '';
  for (const f of e.files) {
    const fp = path.join(CACHE, f);
    if (!fs.existsSync(fp)) continue;
    let j;
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (err) { continue; }
    const nm = j.method || '';
    if (nm) names.set(nm, (names.get(nm) || 0) + 1);
    codes.set(j.code, (codes.get(j.code) || 0) + 1);
    if (j.code === 0) {
      const s2 = shape(j);
      // 优先保留字段最丰富的成功响应（避免空态响应 data:false 掩盖真实结构）
      const score = s2.kind === 'list' || s2.kind === 'paged' ? 100 + s2.len : String(s2.fields).split(',').length;
      const cur = sh ? (sh.kind === 'list' || sh.kind === 'paged' ? 100 + sh.len : String(sh.fields).split(',').length) : -1;
      if (score > cur) { sh = s2; sample = JSON.stringify(j.data).slice(0, 260); }
    }
  }
  const topName = [...names.entries()].sort((a, b) => b[1] - a[1])[0];
  rows.push({
    hash,
    n: e.n,
    method: [...e.methods].join('/'),
    name: topName ? topName[0] : '',
    codes: [...codes.entries()].sort((a, b) => b[1] - a[1]),
    shape: sh,
    sample,
    post: e.postSample,
  });
}
rows.sort((a, b) => b.n - a.n);

// --- 4. 分类 ---------------------------------------------------------------
const CAT = [
  ['用户 / 账户', /获取用户信息|实名|地址|用户等级|昵称|安全|设置/],
  ['订单 / 交易', /订单|交易记录|委托单|求购|出售|购买|首发/],
  ['市场 / 行情', /市场|行情|专辑|藏品列表|藏品详情/],
  ['邀请 / 推广', /邀请|邀新/],
  ['活动 / 合成 / 抽奖', /活动|合成|抽签|抽奖|盲盒|置换|分解/],
  ['钱包 / 积分', /钱包|积分|余额/],
  ['公告 / 内容', /通知|公告|分类/],
  ['其它', /.*/],
];
function catOf(name) {
  for (const [c, re] of CAT) if (name && re.test(name)) return c;
  return '未识别';
}

// --- 5. 输出 Markdown ------------------------------------------------------
const L = [];
L.push('# 后端 API 端点全清单（h5.shenyuan.sc.cn · ICard 爱卡）');
L.push('');
L.push('> 端点为 **32 位 md5 哈希**，全部 `POST`，域名 `https://api.shenyuan.sc.cn`。');
L.push('> 接口名取自响应体自带的 `method` 字段（原站返回，非推测）。');
L.push('> 请求体均为加密签名体，无法从参数推断语义；本表以响应结构为准。');
L.push('');

const ok = rows.filter((r) => r.codes.some(([c]) => c === 0));
const only401 = rows.filter((r) => !r.codes.some(([c]) => c === 0) && r.codes.some(([c]) => c === 401));
const only405 = rows.filter((r) => !r.codes.some(([c]) => c === 0) && !r.codes.some(([c]) => c === 401));
const named = rows.filter((r) => r.name);

L.push('## 概览');
L.push('');
L.push('| 指标 | 值 |');
L.push('|---|---|');
L.push('| 端点总数 | ' + rows.length + ' |');
L.push('| 有接口名（可识别） | ' + named.length + ' |');
L.push('| 取到过成功数据（code=0） | ' + ok.length + ' |');
L.push('| 仅返回 401（需登录） | ' + only401.length + ' |');
L.push('| 仅返回 405（端点不可用） | ' + only405.length + ' |');
L.push('| 捕获响应总数 | ' + reqs.length + ' |');
L.push('| 管理后台 | **不存在**（无 admin/manage 域名，97 个前端路由全为 C 端） |');
L.push('');

// 主表
L.push('## 端点清单（按调用次数）');
L.push('');
L.push('| 状态 | 次数 | 方法 | 端点 | 接口名 | 响应结构 |');
L.push('|---|--:|---|---|---|---|');
for (const r of rows) {
  const st = r.codes.some(([c]) => c === 0) ? '✅' : r.codes.some(([c]) => c === 401) ? '🔒' : '⚠️';
  const shTxt = r.shape ? r.shape.kind + (r.shape.len ? '[' + r.shape.len + ']' : '') : '—';
  const codeTxt = r.codes.map(([c, n]) => c + '×' + n).join(' ');
  L.push(
    '| ' + st + ' | ' + r.n + ' | ' + r.method + ' | `/' + r.hash.slice(0, 12) + '…` | ' +
    (r.name || '*(未命名)*') + ' | ' + shTxt + ' · ' + codeTxt + ' |'
  );
}
L.push('');
L.push('> ✅ 取到成功数据　🔒 仅 401（需登录态）　⚠️ 405 / 其它');
L.push('');

// 按业务分类
L.push('## 按业务域分组');
L.push('');
const grouped = {};
rows.forEach((r) => { const c = catOf(r.name); (grouped[c] = grouped[c] || []).push(r); });
Object.keys(grouped)
  .sort((a, b) => {
    if (a === '未识别') return 1;
    if (b === '未识别') return -1;
    return grouped[b].length - grouped[a].length;
  })
  .forEach((c) => {
  L.push('### ' + c + '（' + grouped[c].length + ' 个端点）');
  L.push('');
  grouped[c].forEach((r) => {
    const okk = r.codes.some(([x]) => x === 0);
    L.push('- `' + (okk ? '✅' : '🔒') + '` `/' + r.hash.slice(0, 12) + '…` **' + (r.name || '未命名') + '**' +
      (r.shape && r.shape.fields !== '(无数据)' ? ' → `' + r.shape.fields.slice(0, 100) + '`' : ' → *(无数据)*'));
  });
  L.push('');
});

// 成功响应样例
L.push('## 成功响应样例（可直接用于 mock）');
L.push('');
for (const r of rows.filter((x) => x.sample)) {
  L.push('### ' + (r.name || '未命名 · code=0'));
  L.push('');
  L.push('- 端点：`POST https://api.shenyuan.sc.cn/' + r.hash + '`');
  L.push('- 结构：`' + r.shape.kind + '` 字段：`' + r.shape.fields + '`');
  L.push('');
  L.push('```json');
  L.push(r.sample);
  L.push('```');
  L.push('');
}

// 未识别
const unk = rows.filter((r) => !r.name);
if (unk.length) {
  L.push('## 未识别端点（响应体无 method 字段）');
  L.push('');
  unk.forEach((r) => {
    L.push('- `/' + r.hash + '` — ' + r.codes.map(([c, n]) => c + '×' + n).join(' ') +
      (r.sample ? ' · 样例 `' + r.sample.slice(0, 120) + '`' : ''));
  });
  L.push('');
}

L.push('## 二次开发用法');
L.push('');
L.push('1. **Mock server**：把 `assets/api-cache/*.json` 按 `method` 字段建索引，直接起 Express 返回。');
L.push('2. **字段定义**：上表「响应结构」列即为真实字段，可直接生成 TypeScript interface。');
L.push('3. **分页约定**：存在两种信封 —— `{"list":[...]}` 与 `{"list":{total,per_page,current_page,last_page,data,has_more}}`，需兼容。');
L.push('4. **鉴权**：Bearer token 存 localStorage，缺失即返回 `{"code":401,"msg":"用户信息不存在，请重新登录!"}`。');
L.push('5. **签名**：请求体为加密签名体（`trans_id` + `timestamp` + `sign`），若要自建网关需逆向其加解密。');
L.push('');
L.push('## 缺口说明');
L.push('');
L.push('- **无管理后台 API**：该平台未暴露可访问的管理后台（admin / manage / backend 域名均不解析，前端 97 路由无任何后台入口）。');
L.push('- **端点哈希无法穷举**：JS 经混淆，端点哈希不在明文中，清单只能通过网络触发获得。');
L.push('- **零数据账号**：该账号订单 / 持仓 / 地址均为空，部分列表类接口只能拿到信封拿不到行内字段。');
L.push('');

const outPath = path.join(OUT, 'api-endpoints.md');
fs.writeFileSync(outPath, L.join('\n'), 'utf8');
console.log('written: ' + outPath);
console.log('端点 ' + rows.length + ' | 有接口名 ' + named.length + ' | 成功 ' + ok.length +
  ' | 仅401 ' + only401.length + ' | 仅405 ' + only405.length);
