# 全量离线验证报告

- 验证时间：2026-10-07 16:23:05（本地）
- 验证方式：Playwright iPhone 12 模拟，逐个加载 `pages/*.html`，**拦截全部非 localhost 请求**
- 判定：`leaks` = 仍指向外部域名的请求数；`brokenImgs` = 已加载但解码失败的图片数

## 总览

| 分类 | 数量 | 说明 |
|---|---|---|
| 有完整内容 | 38 | 离线可正常浏览业务数据 |
| 需登录（渲染为登录页） | 1 | 未登录访问的正确响应，登录表单完整可交互 |
| 空态 / 需参数 | 51 | 依赖商品 ID 等参数，或当前无数据 |
| 空白 | 6 | 无内容渲染 |
| 外链残留 | 1 | 引用了无法离线的外部验证码 SDK |
| 加载失败 | 0 | — |
| **合计** | **97** | JS 报错 0，破损图片 0 |

## 有完整内容的页面

| 页面 | 文本长度 | 图片数 | 内容摘要 |
|---|---|---|---|
| index | 4718 | 97 | 页面索引 · ICard 爱卡集市离线副本 共 97 个路由快照 · 点击卡片在新标签打开完整页面 → UI 状态截图画 |
| pages-Transformation-Transformation | 135 | 5 | 规则 目标藏品 以下目标藏品随机幻化2份 测试数据 发行2000份 流通2000份 合成材料 必要1 可用:1 测试数据 |
| pages-account-about | 242 | 7 | 关于平台 ICARD ICARD是面向文创爱好者打造的线上艺术欣赏与收藏社区。平台汇聚众多原创艺术家与特色 IP，推出风 |
| pages-account-account | 98 | 24 | 爱卡xb5PqY36 绑定手机号：175****1293 我的订单 首发 市场 求购 委托 全部 账号安全 我的钱包 我 |
| pages-account-blindbox | 80 | 10 | xx盲盒 开1个 开全部 去寄售 开盒可获得以下藏品任意1个 概率 10.00% 概率 10.00% 概率 10.00% |
| pages-account-blindboxresult | 110 | 6 | 测试数据 #1231332 name #1231332 name #1231332 name #1231332 name |
| pages-account-collections | 126 | 9 | 我的收藏册 数字资产 实物资产 藏品盲盒 输入藏品关键词 暂无数据 持有: 个 批量寄售 寄售价格 请输入价格 预计收益 |
| pages-account-invite | 92 | 10 | 邀请好友 我的邀请码 S389722 邀请好友注册，一起收藏热爱 扫码加入 分享邀请海报 复制链接 邀请记录 暂无邀请记 |
| pages-account-marketOrderList | 378 | 5 |  寄售订单 待付款 已支付 已关闭 代付款 数字版权品名称 #1000 ￥19.00 2020-01-01 10:10 |
| pages-account-orderList | 67 | 8 | 我的订单 首发订单 常规交易 求购订单 委托订单 盲盒订单 全部 待付款 已支付 订单取消 暂无数据 订单编号: ￥ 接 |
| pages-account-other | 154 | 8 | 爱卡xb5PqY36 已认证 钱包地址: 70ff296394a11dde4e6663cbd05432896623e69 |
| pages-account-otheruser | 233 | 5 | name 平台认证 测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试 |
| pages-account-realname | 87 | 6 | 实名认证 已完成实名认证 身份信息已通过核验，并加密保存 已认证 ICARD 真实姓名 **绵 证件号码 520 *** |
| pages-account-service | 1268 | 5 | 联系客服 联系客服 客服 QQ： 2059629312 客服邮箱： 2059629312@qq.com 工作时间： 周一 |
| pages-account-user | 103 | 6 | 个人信息 头像 昵称 爱卡xb5PqY36 绑定手机 17587881293 钱包地址 70ff296394...... |
| pages-address-add | 308 | 11 | 添加收货地址 收货人 收货人姓名 手机号 收货人手机号 所在地址 请选择省市区 详细地址 小区楼栋、村庄等详细信息 设为 |
| pages-colorfulMix-colorfulMix | 105 | 19 | 抽签活动 限量藏品资格抽取 积分商城 商城兑好礼 精彩合成 【慢行致远】限量合成活动 2026-10-07 10:00: |
| pages-colorfulMix-details | 95 | 5 | 合成规则 目标藏品 发行 0 流通 0 合成材料 立即合成 合成确认 预计可合成目标数量：0 若目标藏品份数不足，则实际 |
| pages-colorfulMix-icardGame | 537 | 25 | 收藏每一份热爱 ICard 搜索 【爱卡试运营晚安公告】 致ICARD爱卡全体用户 【爱卡合成公告】iCard爱卡平台奶 |
| pages-colorfulMix-index | 202 | 5 | 自动合成小助手 小助手规则 自动合成小助手 未开通 启用小助手后可以帮您自动合成藏品（限支持启用小助手的合成活动，用户需 |
| pages-home-home | 537 | 28 | 收藏每一份热爱 ICard 搜索 【爱卡试运营晚安公告】 致ICARD爱卡全体用户 【爱卡合成公告】iCard爱卡平台奶 |
| pages-index-index | 537 | 28 | 收藏每一份热爱 ICard 搜索 【爱卡试运营晚安公告】 致ICARD爱卡全体用户 【爱卡合成公告】iCard爱卡平台奶 |
| pages-integral-details | 182 | 7 | 详情 限定兑换1个 积分 藏品介绍 暂无介绍 购买须知 1.本商品中包含的数字数字版权品为虚拟数字商品，而非实物。本商品 |
| pages-integral-my | 62 | 6 | 积分商城 0 获取积分 积分明细 兑换记录 全部 已获取 已消耗 name 2024-10-28 20:35:33 10 |
| pages-invite-invite | 91 | 6 |  邀请好友 保存下方二维码或复制邀请码分享好友 欢迎加入 体验不一样的宇宙 复制链接 保存二维码 邀请记录 我已邀请  |
| pages-login-register | 65 | 12 | 请输入手机号 请输入验证码 获取验证码 请输入密码 请输入邀请码 注册 已有账号，去登录 我已阅读并同意《用户协议》，《 |
| pages-market-batchBuy | 122 | 6 | 批量购买 地板价 ¥ -- 购买单价 请输入可接受的最高单价（元） ¥ 1-99999 购买数量 最大批量购买数量 50 |
| pages-market-bidDetail | 289 | 6 | 出售 拥有数量 -- 当前最高求购价 ¥ -- 选择售出编号 可出售数量： 拥有数量：0 已选择：0 选择要出售的数字版 |
| pages-market-confirmorder | 78 | 6 | 确认订单 单价 ¥ -- 购买数量 期望购买的最大数量 应付金额 ¥ 0.00 服务须知 我已同意ICARD 《服务协议 |
| pages-market-details | 97 | 8 | 发行 0份 流通 0份 挂单列表 相关公告 寄售 求购 委托 藏品名称 | 编号 价格 编号 暂无数据 批量购买 快捷购 |
| pages-market-goodsDetails | 164 | 9 | 发行 0份 流通 0份 藏品编号 -- 创作者 -- 品牌方 -- 藏品介绍 暂无详情介绍 购买须知 暂无购买须知 寄售 |
| pages-market-market | 213 | 18 | ICard 搜索 活动市场 自由市场 我的关注 推荐 小试牛刀 推荐 初露锋芒 推荐 大显身手 推荐 一鸣惊人 全部份数 |
| pages-market-sale | 214 | 5 |  寄售 #/ 设置售价您的买入价格（元）：-- ￥ 请输入售价 收款账户 A 汇付(汇付支付) 预计收入 总售价 ￥  |
| pages-mix-details | 95 | 5 | 置换规则 目标藏品 发行 0 流通 0 置换材料 立即置换 置换确认 预计可置换目标数量：0 若目标藏品份数不足，则实际 |
| pages-notification-notification | 752 | 38 | 收藏每一份热爱 输入搜索的信息 全部 寄售公告 上新公告 活动公告 运营公告 辟谣公告 空投公告 合成公告 公司新闻 爱 |
| pages-salvage-details | 95 | 5 | 分解规则 目标藏品 发行 0 流通 0 分解材料 立即分解 分解确认 预计可分解目标数量：0 若目标藏品份数不足，则实际 |
| pages-sign-sign | 181 | 10 | 签到 已连续签到 天 2026年10月 日 一 二 三 四 五 六 1 2 3 4 5 6 7 8 9 10 11 12 |
| pages-todayrank-todayrank | 72 | 14 | 艾卡德-学习 发行50000/流通8890 ¥6 花香蝶自来 发行20000/流通20000 ¥38 运粮鼠 发行300 |

## 需登录页面（渲染为标准登录表单）

pages-login-login

## 空态 / 需参数页面

pages-Announcement-Announcement · pages-Discussion-Discussion · pages-account-InviteRankingList · pages-account-Warelist · pages-account-bidList · pages-account-community · pages-account-increase · pages-account-nickname · pages-account-open · pages-account-order · pages-account-physicalOrderList · pages-account-privacy · pages-account-safePass · pages-account-saleList · pages-account-setting · pages-activity-activity · pages-address-address · pages-colorfulMix-community · pages-colorfulMix-group · pages-colorfulMix-records · pages-colorfulMix-result · pages-common-emptyPage · pages-community-community · pages-drawPrize-drawPrize · pages-drawPrize-records · pages-drawlots-details · pages-drawlots-drawlots · pages-entrust-entrust · pages-integral-Get · pages-integral-integral · pages-integral-records · pages-invite-list · pages-login-forget · pages-market-Consignment · pages-market-cardMap · pages-market-createOrder · pages-market-physicalGoodsDetails · pages-market-saleResult · pages-market-submitBegBuy · pages-market-transactionParticulars · pages-mix-mix · pages-mix-records · pages-mix-result · pages-notification-details · pages-salvage-records · pages-salvage-salvage · pages-search-search · pages-wallet-thirdWallet · pages-wallet-wallet · pages-wallet-wallet1 · pages-webview-webview

## 外链残留

- **pages-common-aliyunCaptcha.html** → https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.4.js, https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js

静态 SDK 文件已镜像到本地 `assets/ext/`，但这两个 URL 由混淆 bundle 在运行期解码后动态插入 `<script>`，且验证码本身需向阿里云发起带随机签名的实时请求，本质上无法完全离线。该页面本身无业务内容（仅验证码组件），不影响其余 96 个页面的离线可用性。
