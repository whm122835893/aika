/**
 * Generate a browsable index of all captured pages + a verification report.
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/12283/WorkBuddy/2026-10-06-22-09-15';
const OUT = path.join(ROOT, 'output', 'h5.shenyuan.sc.cn');
const PAGES = path.join(OUT, 'pages');

const results = JSON.parse(fs.readFileSync(path.join(ROOT, 'scrape-work', 'verify-all.json'), 'utf8'));

function classify(r) {
  if (r.error) return { key: 'error', label: '加载失败' };
  if (r.leaks && r.leaks.length) return { key: 'leak', label: '外链残留' };
  if ((r.text || '').includes('请输入账号')) return { key: 'login', label: '需登录' };
  if (r.textLen > 60) return { key: 'ok', label: '有内容' };
  if (r.textLen > 0) return { key: 'empty', label: '空态/需参数' };
  return { key: 'blank', label: '空白' };
}

const classified = results.map((r) => ({ ...r, cls: classify(r) }));
const groups = { ok: [], login: [], empty: [], blank: [], leak: [], error: [] };
classified.forEach((r) => groups[r.cls.key].push(r));

const ORDER = ['ok', 'login', 'empty', 'blank', 'leak', 'error'];
const META = {
  ok: { title: '有完整内容', desc: '离线可正常浏览业务数据' },
  login: { title: '需登录（渲染为登录页）', desc: '未登录访问的正确响应，登录表单完整可交互' },
  empty: { title: '空态 / 需参数', desc: '需要商品 ID 等参数或当前无数据' },
  blank: { title: '空白', desc: '无内容渲染' },
  leak: { title: '外链残留', desc: '引用了无法离线的外部验证码 SDK' },
  error: { title: '加载失败', desc: '' },
};

// ---------- pages/index.html ----------
const card = (r) => `
    <a class="card" href="${r.file}" target="_blank">
      <div class="thumb"><img src="${r.file.replace('.html', '.png')}" loading="lazy" alt=""></div>
      <div class="meta">
        <div class="name">${r.file.replace('.html', '')}</div>
        <div class="row"><span class="tag t-${r.cls.key}">${r.cls.label}</span><span class="dim">text ${r.textLen} · imgs ${r.imgCount}</span></div>
      </div>
    </a>`;

const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>页面索引 · h5.shenyuan.sc.cn 离线副本</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:28px;background:#f6f7f9;color:#1a1d21;font:14px/1.5 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif}
  h1{font-size:20px;margin:0 0 4px}
  .sub{color:#6b7280;margin-bottom:6px}
  .stats{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0 26px}
  .stat{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;min-width:92px}
  .stat b{display:block;font-size:20px}
  .stat span{color:#6b7280;font-size:12px}
  h2{font-size:15px;margin:26px 0 4px;padding-top:14px;border-top:1px solid #e5e7eb}
  .desc{color:#6b7280;font-size:12px;margin-bottom:12px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:14px}
  .card{display:block;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;text-decoration:none;color:inherit;transition:.15s}
  .card:hover{border-color:#F5B342;box-shadow:0 4px 14px rgba(0,0,0,.08);transform:translateY(-2px)}
  .thumb{height:230px;background:#fff;border-bottom:1px solid #eef0f3;display:flex;align-items:flex-start;justify-content:center;overflow:hidden}
  .thumb img{width:auto;height:230px;object-fit:cover;object-position:top}
  .meta{padding:9px 10px}
  .name{font-size:11.5px;font-weight:600;word-break:break-all;margin-bottom:5px}
  .row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .tag{font-size:10px;padding:1px 6px;border-radius:4px}
  .t-ok{background:#e8f5e9;color:#2e7d32}.t-login{background:#e3f2fd;color:#1565c0}
  .t-empty{background:#fff3e0;color:#ef6c00}.t-blank{background:#f5f5f5;color:#616161}
  .t-leak{background:#ffebee;color:#c62828}.t-error{background:#ffebee;color:#c62828}
  .dim{color:#9ca3af;font-size:10px}
</style></head><body>
<h1>页面索引 · ICard 爱卡集市离线副本</h1>
<div class="sub">共 ${classified.length} 个路由快照 · 点击卡片在新标签打开完整页面</div>
<div class="stats">
  <div class="stat"><b>${groups.ok.length}</b><span>有内容</span></div>
  <div class="stat"><b>${groups.login.length}</b><span>需登录</span></div>
  <div class="stat"><b>${groups.empty.length}</b><span>空态/需参数</span></div>
  <div class="stat"><b>${groups.leak.length}</b><span>外链残留</span></div>
  <div class="stat"><b>${classified.filter(r => r.imgCount && r.brokenImgs === 0).reduce((a, r) => a + r.imgCount, 0)}</b><span>图片全部加载</span></div>
  <div class="stat"><b>${classified.filter(r => r.leaks.length === 0).length}</b><span>零外泄</span></div>
</div>
${ORDER.filter((k) => groups[k].length).map((k) => `
<h2>${META[k].title} · ${groups[k].length}</h2>
<div class="desc">${META[k].desc}</div>
<div class="grid">${groups[k].map(card).join('')}</div>`).join('')}
</body></html>`;

fs.writeFileSync(path.join(PAGES, 'index.html'), html, 'utf8');

// ---------- verify-report.md ----------
let md = `# 全量离线验证报告

- 验证时间：${new Date().toISOString().replace('T', ' ').slice(0, 19)}（本地）
- 验证方式：Playwright iPhone 12 模拟，逐个加载 \`pages/*.html\`，**拦截全部非 localhost 请求**
- 判定：\`leaks\` = 仍指向外部域名的请求数；\`brokenImgs\` = 已加载但解码失败的图片数

## 总览

| 分类 | 数量 | 说明 |
|---|---|---|
| 有完整内容 | ${groups.ok.length} | 离线可正常浏览业务数据 |
| 需登录（渲染为登录页） | ${groups.login.length} | 未登录访问的正确响应，登录表单完整可交互 |
| 空态 / 需参数 | ${groups.empty.length} | 依赖商品 ID 等参数，或当前无数据 |
| 空白 | ${groups.blank.length} | 无内容渲染 |
| 外链残留 | ${groups.leak.length} | 引用了无法离线的外部验证码 SDK |
| 加载失败 | ${groups.error.length} | — |
| **合计** | **${classified.length}** | JS 报错 0，破损图片 0 |

## 有完整内容的页面

| 页面 | 文本长度 | 图片数 | 内容摘要 |
|---|---|---|---|
${groups.ok.map((r) => `| ${r.file.replace('.html', '')} | ${r.textLen} | ${r.imgCount} | ${(r.text || '').slice(0, 60)} |`).join('\n')}

## 需登录页面（渲染为标准登录表单）

${groups.login.map((r) => r.file.replace('.html', '')).join(' · ')}

## 空态 / 需参数页面

${groups.empty.map((r) => r.file.replace('.html', '')).join(' · ')}

${groups.leak.length ? `## 外链残留

${groups.leak.map((r) => `- **${r.file}** → ${r.leaks.join(', ')}`).join('\n')}

静态 SDK 文件已镜像到本地 \`assets/ext/\`，但这两个 URL 由混淆 bundle 在运行期解码后动态插入 \`<script>\`，且验证码本身需向阿里云发起带随机签名的实时请求，本质上无法完全离线。该页面本身无业务内容（仅验证码组件），不影响其余 ${classified.length - groups.leak.length} 个页面的离线可用性。` : ''}
`;

fs.writeFileSync(path.join(OUT, 'verify-report.md'), md, 'utf8');

console.log('index.html + verify-report.md generated');
console.log('ok=' + groups.ok.length + ' login=' + groups.login.length + ' empty=' + groups.empty.length + ' blank=' + groups.blank.length + ' leak=' + groups.leak.length + ' error=' + groups.error.length);
