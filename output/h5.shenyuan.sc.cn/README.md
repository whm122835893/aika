# h5.shenyuan.sc.cn — 离线静态副本（Website Pickpocket）

由「网站扒手」抓取生成的 **uni-app (Vue) H5** 站点完整离线副本。
原站：https://h5.shenyuan.sc.cn （ICARD 爱卡集市 · 数字藏品平台）

## 本地预览

必须通过 HTTP 服务访问（应用使用根路径 `/static/...` 引用资源，直接双击 HTML 打开会白屏）：

```bash
# 方式一：仓库自带服务器
node tools/serve.js 8899
# 打开 http://localhost:8899

# 方式二：Python
cd output/h5.shenyuan.sc.cn
python -m http.server 8899
```

手机模拟预览：浏览器 DevTools → 切换设备工具栏 → iPhone 12 (390×844)。

**页面索引**（96 个路由快照的缩略图目录，可直接点开）：http://localhost:8899/pages/index.html

## 交互性

是**可交互的静态副本**：应用完整启动，底部 5 个 Tab 切换、表单输入、按钮点击、路由跳转、
登录守卫全部工作；但数据均为抓取时刻快照，搜索 / 登录 / 下单 / 支付等需实时后端的操不可用，
带参数的藏品详情会渲染完整 UI 但数据为空。详见 `interact-report.md`。

## 目录结构

```
h5.shenyuan.sc.cn/
├── index.html              应用入口（含离线 API 回放注入）
├── pages/                  96 个路由的渲染快照（.html + .png 截图）
├── static/                 原站 JS / CSS / 图片（保持原始路径）
├── assets/
│   ├── offline-shim.js     XHR / fetch 拦截器，回放缓存的 API 响应
│   └── api-cache/          抓取期间捕获的 API JSON 响应（已本地化图片域名）
├── upload/                 业务图片（banner / 商品图 / 藏品图）
└── README.md
```

## 工作原理

1. **浏览器渲染抓取**：Playwright + iPhone 12 模拟，逐个访问全部 97 个 uni-app 路由（`#/pages/...`），96 个成功（`pages/common/neteaseCaptcha` 因外部验证码服务拒绝无头浏览器而超时）。
2. **资源镜像**：通过请求拦截抓取全部 JS / CSS / 图片 / 字体，按原始路径落盘，webpack 懒加载 chunk 直接命中本地文件。
3. **API 回放**：原站 API（`api.shenyuan.sc.cn`，端点为混淆哈希、请求体加密）的响应缓存为 `assets/api-cache/*.json`，`offline-shim.js` 拦截 XHR / fetch：优先精确匹配（method + url + body），未命中时按 URL 回退到最近缓存。
4. **路径重写**：API 缓存、页面快照与 CSS 中的绝对域名（h5 原站 / dcloud / 网易易盾）已全部改写为本地路径，配合 `src`/`setAttribute` 钩子拦截运行时动态创建的资源。
5. **页面快照**：每个路由的最终 DOM 保存到 `pages/`，即使 JS 不执行也能看到完整视觉。
6. **离线验证**：对全部 96 个页面逐个拦截外域请求测试，结果见 `verify-report.md`：

| 分类 | 数量 | 说明 |
|---|---|---|
| 有完整内容 | 25 | 离线可正常浏览业务数据 |
| 需登录（渲染为登录页） | 25 | 未登录访问的正确响应，表单完整可交互 |
| 空态 / 需参数 | 39 | 需商品 ID 等参数或当前无数据 |
| 空白 | 6 | 无内容渲染 |
| 外链残留 | 1 | 验证码组件页（第三方 SDK 运行期动态注入） |
| 加载失败 | 0 | JS 报错 0、破损图片 0 |

95/96 页面外泄请求为 0。

## 局限

- 数据为抓取时刻的快照，不会更新。
- 涉及登录态 / 实名 / 支付的页面（`pages-account-*`、`pages-wallet-*`）多数只渲染出登录引导或空态。
- 验证码（网易易盾 / 阿里云）等外部服务仅镜像了静态脚本，交互不可用。
- 仅用于学习与还原研究，请勿用于商业用途；版权归原作者所有。
