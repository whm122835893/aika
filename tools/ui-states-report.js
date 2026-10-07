/**
 * 把 scrape-work/ui-states.json 渲染成：
 *   output/h5.shenyuan.sc.cn/ui-states.md        （Markdown 报告）
 *   output/h5.shenyuan.sc.cn/ui-states/index.html（截图画廊，可直接浏览器查看）
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const SHOT_DIR = path.join(OUT, 'ui-states');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'ui-states.json'), 'utf8'));

const KIND_LABEL = {
  'uni-toast': 'Toast 轻提示',
  'uni-modal': 'Modal 确认框',
  'uni-popup': 'Popup 弹层',
  'uni-mask': 'Mask 遮罩',
  'uni-picker': 'Picker 选择器',
  'uni-actionsheet': 'ActionSheet 动作面板',
  'u-popup': 'Popup 弹层(uView)',
  'u-modal': 'Modal 确认框(uView)',
  'u-toast': 'Toast(uView)',
  'van-popup': 'Popup(Vant)',
  'van-dialog': 'Dialog(Vant)',
  'custom': '自定义浮层',
  'nav': '路由跳转',
  'api': '静默请求(无 UI 反馈)',
};

const all = [];
DATA.pages.forEach((p) => p.states.forEach((s) => all.push(Object.assign({ route: p.route }, s))));

const byKind = {};
all.forEach((s) => { (byKind[s.kind] = byKind[s.kind] || []).push(s); });

const shots = fs.existsSync(SHOT_DIR) ? fs.readdirSync(SHOT_DIR).filter((f) => f.endsWith('.png')) : [];
const shotSet = new Set(all.filter((s) => s.shot).map((s) => s.shot));
const withShot = all.filter((s) => s.shot);
const pagesWithState = DATA.pages.filter((p) => p.states.length);
const pagesEmpty = DATA.pages.filter((p) => !p.states.length);

// ---------- Markdown ----------
let md = '';
md += '# UI 状态补抓报告（Toast / 弹窗 / 确认框 / 浮层）\n\n';
md += '> 生成时间：' + new Date().toISOString().replace('T', ' ').slice(0, 19) + '  \n';
md += '> 方式：带登录态真机（iPhone 12 模拟）逐页真实点击可点击元素，捕获点击后新出现的浮层并截图。\n\n';

md += '## 汇总\n\n';
md += '| 指标 | 数量 |\n|---|--:|\n';
md += '| 参与页面 | ' + DATA.pages.length + ' |\n';
md += '| 实际点击次数 | ' + DATA.pages.reduce((a, b) => a + b.tested, 0) + ' |\n';
md += '| 捕获 UI 状态 | ' + all.length + ' |\n';
md += '| 去重后状态种类 | ' + Object.keys(byKind).reduce((a, k) => a + new Set(byKind[k].map((s) => s.text.slice(0, 40))).size, 0) + ' |\n';
md += '| 截图张数 | ' + shots.length + ' |\n';
md += '| 有状态的页面 | ' + pagesWithState.length + ' |\n';
md += '| 无状态页面 | ' + pagesEmpty.length + ' |\n\n';

md += '## 按类型分布\n\n';
md += '| 类型 | 说明 | 命中次数 | 去重 | 有截图 |\n|---|---|--:|--:|--:|\n';
Object.keys(byKind).sort((a, b) => byKind[b].length - byKind[a].length).forEach((k) => {
  const g = byKind[k];
  md += '| `' + k + '` | ' + (KIND_LABEL[k] || '—') + ' | ' + g.length + ' | ' +
    new Set(g.map((s) => s.text.slice(0, 40))).size + ' | ' + g.filter((s) => s.shot).length + ' |\n';
});
md += '\n';

md += '## 已捕获的 UI 状态（含截图）\n\n';
withShot.forEach((s, i) => {
  md += '### ' + (i + 1) + '. ' + s.text.replace(/\s+/g, ' ').slice(0, 60) + '\n\n';
  md += '- 类型：`' + s.kind + '`（' + (KIND_LABEL[s.kind] || '—') + '）\n';
  md += '- 页面：`' + s.route + '`\n';
  md += '- 触发元素：' + (s.trigger || '—') + '\n';
  md += '- 浮层尺寸：' + s.size + '\n';
  md += '- 出现次数：' + s.n + '\n';
  md += '- 截图：`ui-states/' + encodeURI(s.shot) + '`\n\n';
  md += '![' + s.text.slice(0, 30) + '](ui-states/' + encodeURI(s.shot) + ')\n\n';
});

const noShot = all.filter((s) => !s.shot && s.kind !== 'nav' && s.kind !== 'api');
if (noShot.length) {
  md += '## 未截图的状态（重复出现，已有代表图）\n\n';
  const uniq = {};
  noShot.forEach((s) => { uniq[s.kind + '|' + s.text.slice(0, 40)] = s; });
  md += '| 类型 | 文本 | 页面 | 次数 |\n|---|---|---|--:|\n';
  Object.values(uniq).forEach((s) => {
    md += '| `' + s.kind + '` | ' + s.text.replace(/\|/g, '\\|').slice(0, 50) + ' | `' + s.route + '` | ' + s.n + ' |\n';
  });
  md += '\n';
}

const navs = all.filter((s) => s.kind === 'nav');
if (navs.length) {
  md += '## 点击引发的路由跳转\n\n';
  md += '| 页面 | 触发元素 | 跳转到 |\n|---|---|---|\n';
  navs.slice(0, 60).forEach((s) => {
    md += '| `' + s.route + '` | ' + (s.trigger || '—') + ' | `' + s.text + '` |\n';
  });
  md += '\n';
}

if (pagesEmpty.length) {
  md += '## 点击后无任何 UI 反馈的页面\n\n';
  md += '> 多为纯展示页，或需真实数据 / 权限才会弹提示。\n\n';
  md += pagesEmpty.map((p) => '- `' + p.route + '`（点了 ' + p.tested + ' 个元素）').join('\n') + '\n\n';
}

md += '## 复现方式\n\n';
md += '```bash\n';
md += 'NODE_PATH=C:/Users/12283/.workbuddy/binaries/node/workspace/node_modules \\\n';
md += '  node tools/login.js 17587881293 whm981004     # 刷新登录态\n\n';
md += 'NODE_PATH=C:/Users/12283/.workbuddy/binaries/node/workspace/node_modules \\\n';
md += '  MAX=8 node tools/ui-states.js                 # 全量补抓 + 截图\n\n';
md += 'node tools/ui-states-report.js                  # 生成本报告 + 截图画廊\n';
md += '```\n';

fs.writeFileSync(path.join(OUT, 'ui-states.md'), md, 'utf8');

// ---------- 截图画廊 HTML ----------
const cards = withShot.map((s) => {
  return '  <figure class="card">\n' +
    '    <div class="ph"><img loading="lazy" src="' + encodeURI(s.shot) + '" alt=""></div>\n' +
    '    <figcaption>\n' +
    '      <span class="k">' + (KIND_LABEL[s.kind] || s.kind) + '</span>\n' +
    '      <b>' + s.text.replace(/</g, '&lt;').slice(0, 60) + '</b>\n' +
    '      <span class="m">' + s.route + ' · 触发：' + (s.trigger || '—') + ' · ' + s.size + ' · 出现 ' + s.n + ' 次</span>\n' +
    '    </figcaption>\n' +
    '  </figure>';
}).join('\n');

const html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>UI 状态截图画廊 · 爱卡集市</title><style>' +
  'body{margin:0;background:#141416;color:#eee;font:14px/1.6 -apple-system,"PingFang SC",sans-serif}' +
  'header{padding:20px 24px;border-bottom:1px solid #2a2a2e;position:sticky;top:0;background:#141416ee;backdrop-filter:blur(8px);z-index:9}' +
  'h1{margin:0 0 6px;font-size:18px}.sub{color:#9a9aa2;font-size:13px}' +
  '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;padding:20px 24px 60px}' +
  '.card{margin:0;background:#1c1c20;border:1px solid #2a2a2e;border-radius:12px;overflow:hidden}' +
  '.ph{background:#0e0e10;display:flex;align-items:center;justify-content:center;min-height:260px}' +
  '.ph img{width:100%;display:block}' +
  'figcaption{padding:10px 12px 14px}' +
  '.k{display:inline-block;font-size:11px;padding:2px 8px;border-radius:99px;background:#f5b34222;color:#f5b342;margin-bottom:6px}' +
  'figcaption b{display:block;font-size:13px;font-weight:600;margin:2px 0 4px;word-break:break-all}' +
  '.m{color:#8a8a92;font-size:11px;word-break:break-all}' +
  '</style></head><body><header><h1>UI 状态截图画廊</h1>' +
  '<div class="sub">共 ' + shots.length + ' 张 · 覆盖 ' + pagesWithState.length + ' 个页面 · ' +
  Object.keys(byKind).length + ' 类状态 —— 点击元素后真实捕获的 toast / 弹窗 / 确认框</div></header>' +
  '<div class="grid">\n' + (cards || '<p style="padding:24px">暂无截图</p>') + '\n</div></body></html>';

fs.writeFileSync(path.join(SHOT_DIR, 'index.html'), html, 'utf8');

console.log('报告 -> output/h5.shenyuan.sc.cn/ui-states.md');
console.log('画廊 -> output/h5.shenyuan.sc.cn/ui-states/index.html');
console.log('状态 ' + all.length + ' 条 | 截图 ' + shots.length + ' 张 | 有状态页 ' + pagesWithState.length + '/' + DATA.pages.length);
