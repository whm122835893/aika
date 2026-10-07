# 爱卡集市（h5.shenyuan.sc.cn）离线复刻 & 逆向资产包

对 uni-app H5 数字藏品平台 **爱卡集市 / ICARD**（`https://h5.shenyuan.sc.cn`）的完整抓取、离线复刻与接口逆向成果。
离线副本可**断网运行**：API 由本地 `offline-shim.js` 回放缓存响应，静态资源全部本地化。

## 目录结构

| 目录 / 文件 | 说明 |
|---|---|
| `output/h5.shenyuan.sc.cn/` | **交付主体**：可离线运行的完整站点副本 |
| ├ `index.html` | 站点入口（SPA，注入离线 shim） |
| ├ `static/` | 源站 CSS / JS / 图片（含 90+ 页面 chunk） |
| ├ `upload/` | 运营上传的素材图 |
| ├ `assets/api-cache/` | 480 份真实 API 响应（离线回放数据源） |
| ├ `assets/offline-shim.js` | 拦截 XHR / fetch 并回放缓存的离线层 |
| ├ `pages/` | 97 个路由快照 + 9 个带参快照 + `index.html` 页面索引 |
| ├ `ui-states/` | 29 张 Toast / 弹窗 / 确认框真机截图 + 画廊 |
| └ `*.md` | 各类审计报告（见下表） |
| `tools/` | 抓取 / 审计 / 构建脚本（Node + Playwright） |
| `scrape-work/` | 中间数据：路由表、资源映射、功能枚举、点击与 UI 状态结果 |
| `archive/` | 过程产物（验证截图等），已被 `.gitignore` 排除 |
| `.workbuddy/` | 工作区配置与记忆 |

## 成果清单

| 项目 | 数量 | 说明 |
|---|---:|---|
| 路由快照 | 97 + 9 | 全部 chunk 路由 + 带参详情页 |
| 可点击功能元素 | 986 | 通过 hook `addEventListener` 精准识别 |
| 实测点击 | 399 | 记录跳转 / API / UI 反馈 |
| UI 状态 | 202 条 / 29 张截图 | Toast、确认框、底部弹层、自定义浮层 |
| API 端点 | 42 | 真实端点（不是缓存份数） |
| API 响应缓存 | 480 份 | 含登录态下的订单 / 钱包 / 邀请等私有接口 |
| 已命名接口 | 33 | 响应 `method` 字段为中文接口名 |
| 断网验证 | 97 页 | 有内容 38 / 空态 58 / JS 报错 0 / 外泄 1 |

## 报告索引

| 报告 | 内容 |
|---|---|
| `output/.../gap-audit.md` | **遗漏审计**：页面/资源/外链/API/功能覆盖缺口 + 补齐记录 |
| `output/.../ui-states.md` | UI 状态报告：179→202 条状态的文案与截图 |
| `output/.../api-endpoints.md` | 42 个端点 + 业务域分组 |
| `output/.../api-dictionary.md` | 33 个命名接口的字段结构 |
| `output/.../features-report.md` | 986 个可点击功能 + 路由参数约定 |
| `output/.../ui-style-audit.md` | UI 样式审计（CSS / 字体 / 组件） |
| `output/.../verify-report.md` | 断网验证明细 |

## 快速开始

```bash
# 1. 预览离线副本（任选一个入口）
node tools/serve.js 8899
#   http://localhost:8899/                     站点本体（可交互）
#   http://localhost:8899/pages/index.html     页面索引（97+9 快照）
#   http://localhost:8899/ui-states/index.html UI 状态截图画廊

# 2. 重新抓取（需 Playwright，模块在托管目录）
export NODE_PATH=C:/Users/12283/.workbuddy/binaries/node/workspace/node_modules
node tools/login.js <手机号> <密码>     # 登录并保存登录态
node tools/crawl.js                      # 全量路由抓取
node tools/crawl-auth.js                 # 带登录态重抓（私有接口）
node tools/crawl-params.js               # 用真实 id 补抓带参页面
node tools/deep.js                       # 点击扫荡，挖深接口
node tools/features.js                   # 枚举可点击功能（CLICK=1 附带实测）
node tools/ui-states.js                  # 捕获 Toast / 弹窗并截图（RESUME=1 可续跑）
node tools/build.js                      # 构建离线副本（合并 → 重写 → 注入 shim）
node tools/verify-all.js                 # 断网真机验证（97 页）
node tools/gap-audit.js                  # 遗漏审计（静态，秒级）
```

## 工具一览

| 脚本 | 作用 |
|---|---|
| `login.js` | 登录并保存 `storageState` |
| `crawl.js` / `crawl-auth.js` / `crawl-params.js` | 路由抓取（匿名 / 登录态 / 带参） |
| `deep.js` | 深度点击扫荡，扩大接口覆盖 |
| `features.js` | 可点击功能枚举 + 实际点击测试 |
| `ui-states.js` / `ui-states-report.js` | UI 状态捕获、截图与报告 |
| `api-endpoints.js` / `api-dictionary.js` | 端点与接口字典生成 |
| `asset-gap.js` / `gap-audit.js` | 资源缺口与遗漏审计 |
| `build.js` / `build-index.js` | 离线副本构建与页面索引 |
| `serve.js` | 本地静态服务（8899） |
| `verify.js` / `verify-all.js` | 断网验证 |

## 注意事项

- **登录态不入库**：`scrape-work/auth-state.json` 含 cookie / token，已被 `.gitignore` 排除，需自行运行 `tools/login.js` 生成。
- **账号数据为空**：抓号 379722 零资产，25 个端点只拿到空信封（订单/持仓/钱包/地址）。若要完整数据结构，需换有交易记录的账号重抓。
- **验证码页需联网**：`pages-common-aliyunCaptcha` 依赖阿里云 SDK，无法离线（全站唯一外泄页）。
- **无后台接口**：不存在 admin 域名，97 个路由内也没有后台入口，本包仅覆盖 C 端。
