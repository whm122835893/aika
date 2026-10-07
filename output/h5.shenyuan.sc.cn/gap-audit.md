# 遗漏审计报告（离线副本完整性）

> 审计时间：2026-10-07 16:22:25  
> 方式：纯静态扫描（页面 / 资源引用 / 外链 / API 缓存 / 功能覆盖），配合断网真机验证。

## 结论速览

| 检查项 | 结果 | 状态 |
|---|---|---|
| 路由快照覆盖 | 106/97 | 缺 1 |
| 功能扫描覆盖 | 97/97 | ✅ 全覆盖 |
| UI 状态扫描覆盖 | 93/97 | 缺 4 |
| 本地资源缺失 | 13 类 | ⚠️ 需补 |
| 外链残留 | 34 个域名 | ⚠️ 见明细 |
| API 端点 | 42 | 有数据 17 / 空 25（响应缓存 480 份） |
| 未命名接口 | 9 | ⚠️ 需补抓 |
| 可点击元素 | 986 | 已实测 399 起 |

## A1 缺快照的路由

- `pages-common-neteaseCaptcha`

## A3 未做 UI 状态扫描的路由

- `pages-common-neteaseCaptcha`
- `pages-drawPrize-records`
- `pages-success-index`
- `pages-webview-webview2`

## B 本地资源缺失（引用了但文件不存在）

| 引用路径 | 命中次数 | 出现位置 |
|---|--:|---|
| `static/images/login/bg.png` | 1 | `pages\pages-colorfulMix-group.html` |
| `static/images/mix/open.png` | 1 | `pages\pages-colorfulMix-group.html` |
| `static/images/mix/item.png` | 1 | `pages\pages-colorfulMix-group.html` |
| `assets/ext/dcloud/img/shadow-blue.png` | 1 | `static\index.149e085d.css` |
| `assets/ext/dcloud/img/shadow-green.png` | 1 | `static\index.149e085d.css` |
| `assets/ext/dcloud/img/shadow-orange.png` | 1 | `static\index.149e085d.css` |
| `assets/ext/dcloud/img/shadow-red.png` | 1 | `static\index.149e085d.css` |
| `assets/ext/dcloud/img/shadow-yellow.png` | 1 | `static\index.149e085d.css` |
| `static/images/user/copy2.png` | 1 | `static\js\pages-account-order.2b3fb0dd.js` |
| `static/logo.jpg` | 1 | `static\js\pages-drawPrize-records.b2ab4586.js` |

## C 外链残留（离线时仍会请求外部域名）

| 域名 | 命中次数 | 出现位置 |
|---|--:|---|
| `api.shenyuan.sc.cn` | 490 | `assets\offline-shim.js` |
| `ext.dcloud.net.cn` | 51 | `pages\pages-account-blindbox.html` `pages\pages-account-blindboxresult.html` `pages\pages-account-collections.html` `pages\pages-account-increase.html` |
| `github.com` | 11 | `assets\ext\g.alicdn.com\captcha-frontend\dynamicJS\3.29.0\sg.083.14c93603795a473a.js` `assets\ext\g.alicdn.com\captcha-frontend\FeiLin\1.5.1\feilin039.76b9a1b12dc64cf517941890102fe2bf0e70ac336435611491d8fde072f5cdcb.js` `assets\ext\o.alicdn.com\captcha-frontend\aliyunCaptcha\AliyunCaptcha.js` `static\js\chunk-vendors.2a78a84d.js` |
| `apis.map.qq.com` | 5 | `static\js\chunk-vendors.2a78a84d.js` |
| `img.hainanlianhe.xyz` | 4 | `assets\api-cache\030c65268b1edb1f9911e77caae7fba6.json` `assets\api-cache\8f8966a53cd96ba9028fef93fe062ec4.json` `assets\api-cache\a64614e4502e09a5eabd0ceeb36b164f.json` `assets\api-cache\d7e2b89459c82ce702af781fb6356d3b.json` |
| `apps.apple.com` | 4 | `assets\api-cache\e0e50ba98a36094d6c5155db36c2b865.json` `assets\api-cache\eaa5fe89121a478f3c985cd42f77e9a1.json` |
| `unpkg.com` | 3 | `static\js\chunk-vendors.2a78a84d.js` |
| `h5.shenyuan.sc.cn` | 2 | `assets\offline-shim.js` |
| `cstaticdun.126.net` | 2 | `assets\offline-shim.js` `static\js\pages-account-safePass~pages-login-forget~pages-login-login~pages-login-register.a117343d.js` |
| `o.alicdn.com` | 2 | `assets\offline-shim.js` `hybrid\html\aliyun-captcha.html` |
| `js.cdn.aliyun.dcloud.net.cn` | 2 | `assets\offline-shim.js` `hybrid\html\aliyun-captcha.html` |
| `file.18art.art` | 2 | `pages\pages-wallet-wallet.html` `pages\pages-wallet-wallet1.html` |
| `api.next.bspapp.com` | 2 | `static\js\chunk-vendors.2a78a84d.js` |
| `support.dun.163.com` | 1 | `assets\ext\netease\load.min.js` |
| `da.dun.163.com` | 1 | `assets\ext\netease\load.min.js` |
| `pre-device.captcha-open.aliyuncs.com` | 1 | `assets\ext\o.alicdn.com\captcha-frontend\aliyunCaptcha\AliyunCaptcha.js` |
| `cloudauth-device-pre.aliyuncs.com` | 1 | `assets\ext\o.alicdn.com\captcha-frontend\aliyunCaptcha\AliyunCaptcha.js` |
| `pre-cn-shanghai.device.saf.aliyuncs.com` | 1 | `assets\ext\o.alicdn.com\captcha-frontend\aliyunCaptcha\AliyunCaptcha.js` |
| `pre-ap-southeast-1.device.saf.aliyuncs.com` | 1 | `assets\ext\o.alicdn.com\captcha-frontend\aliyunCaptcha\AliyunCaptcha.js` |
| `cloudauth-device-pre.ap-southeast-1.aliyuncs.com` | 1 | `assets\ext\o.alicdn.com\captcha-frontend\aliyunCaptcha\AliyunCaptcha.js` |
| `cdn.dcloud.net.cn` | 1 | `assets\offline-shim.js` |
| `g.alicdn.com` | 1 | `assets\offline-shim.js` |
| `at.alicdn.com` | 1 | `assets\offline-shim.js` |
| `api.bspapp.com` | 1 | `static\js\chunk-vendors.2a78a84d.js` |
| `uniapp.dcloud.net.cn` | 1 | `static\js\chunk-vendors.2a78a84d.js` |
| `hac1.dcloud.net.cn` | 1 | `static\js\chunk-vendors.2a78a84d.js` |
| `has1.dcloud.net.cn` | 1 | `static\js\chunk-vendors.2a78a84d.js` |
| `doc.dcloud.net.cn` | 1 | `static\js\chunk-vendors.2a78a84d.js` |
| `www.google.com` | 1 | `static\js\chunk-vendors.2a78a84d.js` |
| `uri.amap.com` | 1 | `static\js\chunk-vendors.2a78a84d.js` |

## D API 端点覆盖

- 端点总数：**42**（响应缓存 480 份，其中空信封 259 份）
- 有业务数据：**17**　只拿到空信封：**25**
- 有中文接口名：**33**　未命名：**9**

### D1 未命名端点（响应里没有 method 字段，业务含义未知）

| 端点 | 请求次数 | 缓存份数 | 有数据 | 空 |
|---|--:|--:|--:|--:|
| `a3861807072a0b127fa6abc78da6bfbd` | 35 | 35 | 35 | 0 |
| `55b4885be663b47eaeed9a8b46d34de5` | 14 | 14 | 0 | 14 |
| `cbca51474ccfc272cc4c9cd643387bc1` | 9 | 9 | 0 | 9 |
| `1c6d59c47fcbfd32a789561179afcc12` | 3 | 3 | 1 | 2 |
| `9ae81883add102930378722e7be2b030` | 3 | 3 | 0 | 3 |
| `545d9c10798048bb0993cfd05a765c39` | 3 | 3 | 3 | 0 |
| `38817aca5beb8991bc8f66360ba8ef71` | 2 | 2 | 0 | 2 |
| `bd169c321a631664c052a1033922134b` | 2 | 2 | 0 | 2 |
| `46fc5512255492377e322895d8011e98` | 2 | 2 | 0 | 2 |

### D2 只拿到空信封的端点（账号零数据 / 缺参数，需换号或造数据）

| 端点 | 接口名 | 请求次数 | 空/有 |
|---|---|--:|--:|
| `881b6ffc21b261bde7ffed940055a1be` | 邀请记录(邀请的人员) | 30 | 30/0 |
| `4ac3dc652534f9ffd98330415a943d17` | 获取用户地址列表 | 24 | 24/0 |
| `86a850ffde83c58f09e1c47aa90da9ee` | 获取用户的藏品编码 | 22 | 22/0 |
| `55b4885be663b47eaeed9a8b46d34de5` | — | 14 | 14/0 |
| `4f8beda76690061ebfd67f96acdb72f2` | 藏品出售列表 | 11 | 11/0 |
| `07f41a28fa94f462abece40c547b74fe` | 获取积分商品列表 | 11 | 11/0 |
| `2a7d57550c39c44542012a40013218cd` | 邀新榜单 | 9 | 9/0 |
| `cbca51474ccfc272cc4c9cd643387bc1` | — | 9 | 9/0 |
| `9c8edd2b4e0e2aebfda4fcb877853798` | 获取积分商品详情 | 9 | 9/0 |
| `dec922854904eb47ca6b431e425c2f0e` | 获取藏品详情 | 9 | 9/0 |
| `082eb0631cbc444e1c7b0dd94f79bbc0` | 藏品编号列表 | 9 | 9/0 |
| `71d2e2e52b8ed1a0caa552609833902d` | 获取首发订单列表 | 8 | 8/0 |
| `34c3c6a5599821263edbbf7285857e7a` | 获取活动详情 | 6 | 6/0 |
| `f3c1774efde57471a60e9f54ece1c1f9` | 获取积分商城订单列表 | 6 | 6/0 |
| `f510bf16a3fbccb2de057106b6fe32bf` | 通知详情 | 4 | 4/0 |
| `8305f82dcf7bf0a5992b7ba8b6b6f334` | 获取抽奖详情 | 3 | 3/0 |
| `9ae81883add102930378722e7be2b030` | — | 3 | 3/0 |
| `ed613818fc6d884fb08b7c9ab2b68585` | 交易记录（订单记录） | 3 | 3/0 |
| `e4c399d86dce4dd2ccf314caaa717365` | 获取求购订单列表 | 3 | 3/0 |
| `21fdf3c1721bcb3336f0aeb378e2b0ca` | 获取当前用户的委托单 | 3 | 3/0 |
| `38817aca5beb8991bc8f66360ba8ef71` | — | 2 | 2/0 |
| `cb5aa498e9c67532c019af68865d14e0` | 盲盒详情 | 2 | 2/0 |
| `bd169c321a631664c052a1033922134b` | — | 2 | 2/0 |
| `46fc5512255492377e322895d8011e98` | — | 2 | 2/0 |
| `e981e9a89a0544b4e06672533af1da1c` | 盲盒订单列表 | 1 | 1/0 |

## F 断网真机验证（Playwright，拦截全部外部请求）

| 分类 | 页面数 | 说明 |
|---|--:|---|
| 有完整内容 | 13 | 离线可正常浏览业务数据 |
| 极少内容（空态/需参数/需登录） | 77 | 依赖 id 参数或账号有数据 |
| 完全空白 | 6 | 需参数才渲染 |
| 外链残留 | 1 | `pages-common-aliyunCaptcha.html` |
| 破损图片 | 0 | — |
| JS 报错 | 0 | ✅ 0 |

<details><summary>有完整内容的 13 个页面</summary>

| 页面 | 文本长度 | 图片数 |
|---|--:|--:|
| `pages-account-service` | 1268 | 5 |
| `pages-notification-notification` | 752 | 38 |
| `pages-colorfulMix-icardGame` | 537 | 25 |
| `pages-home-home` | 537 | 28 |
| `pages-index-index` | 537 | 28 |
| `pages-account-marketOrderList` | 378 | 5 |
| `pages-address-add` | 308 | 11 |
| `pages-market-bidDetail` | 289 | 6 |
| `pages-account-about` | 242 | 7 |
| `pages-account-otheruser` | 233 | 5 |
| `pages-market-sale` | 214 | 5 |
| `pages-market-market` | 213 | 18 |
| `pages-colorfulMix-index` | 202 | 5 |

</details>

### F1 完全空白的页面（需补参数才能看到内容）

- `pages-Announcement-details`
- `pages-Announcement-list`
- `pages-download-download`
- `pages-success-index`
- `pages-webview-Policy`
- `pages-webview-webview2`

## E 功能覆盖缺口（已扫但没点过的元素）

> 合计 986 个可点击元素；功能扫描阶段点了 136 个，UI 状态阶段点了 399 个（两者有重叠）。
> 下表按「还差点多少」排序，是**下一轮补测的优先清单**。

| 页面 | 可点击 | 已点 | 缺口 |
|---|--:|--:|--:|
| `/pages/market/market` | 52 | 12 | 40 |
| `/pages/sign/sign` | 46 | 6 | 40 |
| `/pages/home/home` | 40 | 8 | 32 |
| `/pages/account/account` | 41 | 12 | 29 |
| `/pages/colorfulMix/icardGame` | 40 | 12 | 28 |
| `/pages/index/index` | 40 | 12 | 28 |
| `/pages/market/bidDetail` | 33 | 12 | 21 |
| `/pages/notification/notification` | 32 | 12 | 20 |
| `/pages/account/collections` | 31 | 12 | 19 |
| `/pages/market/details` | 30 | 12 | 18 |
| `/pages/Transformation/Transformation` | 21 | 8 | 13 |
| `/pages/address/add` | 25 | 12 | 13 |
| `/pages/account/other` | 18 | 6 | 12 |
| `/pages/market/goodsDetails` | 24 | 12 | 12 |
| `/pages/colorfulMix/details` | 18 | 7 | 11 |
| `/pages/market/confirmorder` | 19 | 8 | 11 |
| `/pages/mix/details` | 18 | 7 | 11 |
| `/pages/salvage/details` | 18 | 7 | 11 |
| `/pages/account/orderList` | 18 | 8 | 10 |
| `/pages/colorfulMix/colorfulMix` | 18 | 8 | 10 |
| `/pages/market/batchBuy` | 17 | 8 | 9 |
| `/pages/account/physicalOrderList` | 16 | 8 | 8 |
| `/pages/integral/details` | 16 | 8 | 8 |
| `/pages/integral/my` | 13 | 5 | 8 |
| `/pages/market/physicalGoodsDetails` | 12 | 4 | 8 |
| `/pages/account/Warelist` | 10 | 3 | 7 |
| `/pages/account/invite` | 14 | 7 | 7 |
| `/pages/drawPrize/drawPrize` | 12 | 6 | 6 |
| `/pages/drawlots/details` | 10 | 4 | 6 |
| `/pages/integral/integral` | 11 | 6 | 5 |

## G 本轮已补齐

| 项目 | 补齐动作 | 结果 |
|---|---|---|
| 静态图缺口 | 从源站补下 6 张 | `market/desc-top`、`product_bg`、`invite/Subtract@2x`、`wallet/no`、`user/dz/1`、`user/dz/2` |
| 索引页破损图 | 生成 `pages/index.png` | 破损图 1 → 0 |
| 带参路由 | 用真实 id 补抓 9 个快照 | `market/details?id=42`、`goodsDetails?id=42`、`batchBuy?id=42`、`confirmorder?id=42`、`notification/details?id=153/143`、`orderList?isTabs=1/2`、`orderList?group=consign`；API 缓存 469 → 480 |
| UI 状态扫描 | 续跑剩余 13 页 | 覆盖 84 → 93 页，202 条状态、29 张截图 |
| 断网验证 | 全量重跑 97 页 | 有内容 38 / 空态 58 / JS 报错 0 / 外泄页 1 |

## H 剩余缺口与处理建议

| # | 缺口 | 影响 | 建议 |
|---|---|---|---|
| 1 | 源站 404 死引用 4 张：`static/logo.jpg`、`mix/open.png`、`mix/item.png`、`user/copy2.png` | 无（源站本身也没有） | 二次开发时删掉这些引用 |
| 2 | `assets/ext/dcloud/img/shadow-*.png`（5 张）拿不到 | 极小（uni-app 内置阴影图） | 可忽略，或用本地同色图替代 |
| 3 | 25 个端点只拿到空信封（订单/持仓/钱包/地址全空） | 中：二次开发没有真实数据结构 | **换一个有过交易记录的账号重抓**（当前号 379722 零资产） |
| 4 | 9 个端点响应无 `method` 字段 | 中：接口语义未知 | 结合调用它的页面组件推断，见 `api-endpoints.md` |
| 5 | 986 个可点击元素中约 590 个未实测点击 | 低：核心路径已覆盖 | 提高 `MAX` 重跑 `tools/ui-states.js` |
| 6 | `pages-common-aliyunCaptcha` 必须联网 | 低：验证码 SDK 无法离线 | 二次开发时替换或移除该页 |
| 7 | 后台管理接口 | 无解 | 此前结论不变：无 admin 域名、97 路由内无后台入口 |
| 8 | 58 个空态页 | 中：离线看不到内容 | 需真实 id（市场商品 id 在源站已无数据），或手工 mock 数据注入 |

## 复现方式

```bash
node tools/gap-audit.js                       # 本审计（静态，秒级）
node tools/verify-all.js                      # 断网真机验证（97 页，约 5 分钟）
# 按 audit 输出的缺口下载：见 scrape-work/gap-missing.json
RESUME=1 MAX=8 node tools/ui-states.js        # 补扫 UI 状态（支持断点续跑）
node tools/crawl-params.js                    # 用真实 id 补抓带参路由
node tools/build.js                           # 重新合并进离线副本
```
