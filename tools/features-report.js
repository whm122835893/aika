/**
 * 把 scrape-work/features.json 转成可读的《全局功能清单》报告。
 * 输出 output/h5.shenyuan.sc.cn/features-report.md
 *
 * 功能分类基于元素 class + 文本特征，用于把「可点击元素」归纳成「功能」。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'scrape-work', 'features.json');
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn', 'features-report.md');

if (!fs.existsSync(SRC)) {
  console.error('缺少 scrape-work/features.json，先运行 tools/features.js');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const pages = data.pages;

// --- 功能分类规则（按顺序匹配，先命中先归类） -------------------------------
const RULES = [
  ['底部导航 Tab', /tabbar/i],
  ['顶部返回/标题栏', /nav-bar|navbar|title-bar|uni-page-head|\bback\b|cu-bar/i],
  ['弹窗 / 对话框', /dialog|modal|popup|mask|toast|actionsheet|cu-dialog|action\b/i],
  ['搜索', /search/i],
  ['分类切换 Tab', /category-tab|sub-tag|tab-item|\btab\b|tabs|trade-item|trade-all/i],
  ['筛选 / 下拉', /dropdown|filter|screen|picker/i],
  ['排序', /sort/i],
  ['视图切换', /view-mode|mode-toggle|toggle/i],
  ['链接 / 协议', /link|agreement|policy|protocol/i],
  ['标签 / 徽章', /\btag\b|chip|label|badge|capsule/i],
  ['菜单项', /menu-item|\bmenu\b|entry/i],
  ['列表项 / 卡片', /waterfall-item|market-table-row|goods|product|card|item|row|cell|list-item|collection/i],
  ['表单输入', /input|textarea|uni-input|uni-textarea/i],
  ['开关 / 复选', /switch|checkbox|radio|\bcheck\b/i],
  ['图标操作', /icon|close|more|share|\bedit\b|del|add|like|favor|star|refresh|scan/i],
  ['按钮', /btn|button|submit|confirm|cancel/i],
  ['图片 / 轮播', /swiper|banner|image|img|preview/i],
  ['容器 / 滚动区（非功能）', /scroll-view|uni-scroll|container|wrap|content|hero|page-body|uni-page|uni-app|uni-body|header|footer|slot|sensor/i],
  ['未命名元素', /^\s*$/],
  ['其它', /./],
];

function classify(e) {
  const c = (e.cls || '').toLowerCase();
  for (const [name, re] of RULES) if (re.test(c)) return name;
  return '其它';
}

// --- 统计 -------------------------------------------------------------------
let total = 0;
const byCat = {};
const globalSeen = new Map(); // 去重：同 class+text 视为同一功能
const pageRows = [];

for (const p of pages) {
  total += p.n;
  const cats = {};
  for (const e of p.els) {
    const cat = classify(e);
    cats[cat] = (cats[cat] || 0) + 1;
    // 全局去重键：class 去掉动态后缀 + 文本
    const clsKey = (e.cls || '').replace(/\b(active|is-last|selected|current)\b/g, '').trim().slice(0, 40);
    const key = clsKey + '‖' + (e.text || '').slice(0, 20);
    if (!globalSeen.has(key)) {
      globalSeen.set(key, { ...e, cat, pages: new Set([p.route]) });
    } else {
      globalSeen.get(key).pages.add(p.route);
    }
  }
  pageRows.push({ route: p.route, n: p.n, api: p.api, err: p.err, cats });
  for (const k in cats) byCat[k] = (byCat[k] || 0) + cats[k];
}

const globalFuncs = [...globalSeen.values()];
const sharedFuncs = globalFuncs.filter((f) => f.pages.size > 1);
const uniqueFuncs = globalFuncs.filter((f) => f.pages.size === 1);

// --- 输出 Markdown ----------------------------------------------------------
const L = [];
L.push('# 全局功能清单（h5.shenyuan.sc.cn · ICard 爱卡）');
L.push('');
L.push('> 由 `tools/features.js` 带登录态遍历全部路由扫描生成。');
L.push('> **判定方式**：在页面加载前 hook `EventTarget.prototype.addEventListener`，');
L.push('> 凡是真实绑定了 `click / tap / touchstart / touchend` 的元素才计为「可点击」。');
L.push('> 不是靠 class 猜的，是真实事件绑定。');
L.push('');

L.push('## 概览');
L.push('');
L.push('| 指标 | 值 |');
L.push('|---|---|');
L.push('| 扫描页面 | ' + pages.length + ' |');
L.push('| 可点击元素总计 | ' + total + ' |');
L.push('| 去重后功能数 | ' + globalFuncs.length + ' |');
L.push('| 跨页面复用功能 | ' + sharedFuncs.length + ' |');
L.push('| 单页面独有功能 | ' + uniqueFuncs.length + ' |');
L.push('| 平均每页可点击 | ' + (total / pages.length).toFixed(1) + ' 个 |');
L.push('| 无功能的页面 | ' + pages.filter((p) => p.n === 0).length + ' |');
L.push('| 扫描时间 | ' + (data.generatedAt || '').slice(0, 19).replace('T', ' ') + ' |');
L.push('');

// 功能类型分布
L.push('## 功能类型分布');
L.push('');
L.push('| 类型 | 数量 | 占比 |');
L.push('|---|--:|--:|');
Object.entries(byCat)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => {
    L.push('| ' + k + ' | ' + v + ' | ' + ((v / total) * 100).toFixed(1) + '% |');
  });
L.push('');

// 全局复用功能
L.push('## 全局复用功能（出现在多个页面）');
L.push('');
L.push('| 功能 | 元素 | 类型 | 出现页面数 |');
L.push('|---|---|---|--:|');
sharedFuncs
  .sort((a, b) => b.pages.size - a.pages.size)
  .slice(0, 40)
  .forEach((f) => {
    L.push(
      '| ' + (f.text || '(无文本)').slice(0, 26) +
      ' | `' + String(f.cls).slice(0, 34) + '` | ' + f.cat + ' | ' + f.pages.size + ' |'
    );
  });
L.push('');

// 按类型聚合的功能清单（核心）
L.push('## 功能清单（按类型）');
L.push('');
const grouped = {};
globalFuncs.forEach((f) => { (grouped[f.cat] = grouped[f.cat] || []).push(f); });
Object.entries(grouped)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([cat, list]) => {
    L.push('### ' + cat + '（去重后 ' + list.length + ' 个）');
    L.push('');
    list
      .sort((a, b) => b.pages.size - a.pages.size)
      .slice(0, 30)
      .forEach((f) => {
        const where = f.pages.size > 3
          ? '（' + f.pages.size + ' 页共用）'
          : '（' + [...f.pages].map((r) => r.replace('/pages/', '')).join(', ') + '）';
        L.push('- **' + (f.text || '(无文本)').slice(0, 30) + '** `' + String(f.cls).slice(0, 36) + '` ' + where);
      });
    if (list.length > 30) L.push('- *…另有 ' + (list.length - 30) + ' 个同类功能*');
    L.push('');
  });

// 逐页明细
L.push('## 逐页明细');
L.push('');
L.push('| 页面 | 可点击 | API 调用 | 功能构成 |');
L.push('|---|--:|--:|---|');
pageRows
  .sort((a, b) => b.n - a.n)
  .forEach((p) => {
    const comp = Object.entries(p.cats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k, v]) => k + '×' + v)
      .join(' · ');
    L.push(
      '| `' + p.route.replace('/pages/', '') + '` | ' + p.n + ' | ' + p.api + ' | ' + (comp || '—') +
      (p.err ? ' ⚠️' : '') + ' |'
    );
  });
L.push('');

// 无功能页面
const empty = pages.filter((p) => p.n === 0);
if (empty.length) {
  L.push('## 无可点击元素的页面（' + empty.length + '）');
  L.push('');
  L.push('> 多为需参数 / 空态 / 未渲染内容的页面。');
  L.push('');
  empty.forEach((p) => L.push('- `' + p.route.replace('/pages/', '') + '`' + (p.err ? ' — ' + p.err : '')));
  L.push('');
}

L.push('## 复现方式');
L.push('');
L.push('```bash');
L.push('# 重新登录并保存登录态');
L.push('node tools/login.js <手机号> <密码>');
L.push('');
L.push('# 全量扫描可点击功能');
L.push('node tools/features.js');
L.push('');
L.push('# 附带实际点击测试（记录跳转 / API），较慢');
L.push('CLICK=1 MAX_CLICK=12 node tools/features.js');
L.push('');
L.push('# 只扫指定页面');
L.push('ONLY=pages-index-index,pages-market-market node tools/features.js');
L.push('```');
L.push('');

fs.writeFileSync(OUT, L.join('\n'), 'utf8');
console.log('written: ' + OUT);
console.log('页面 ' + pages.length + ' | 可点击 ' + total + ' | 去重功能 ' + globalFuncs.length +
  ' | 复用 ' + sharedFuncs.length + ' | 独有 ' + uniqueFuncs.length);
