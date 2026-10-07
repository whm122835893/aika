# 全局功能清单（h5.shenyuan.sc.cn · ICard 爱卡）

> 由 `tools/features.js` 带登录态遍历全部路由扫描生成。
> **判定方式**：在页面加载前 hook `EventTarget.prototype.addEventListener`，
> 凡是真实绑定了 `click / tap / touchstart / touchend` 的元素才计为「可点击」。
> 不是靠 class 猜的，是真实事件绑定。

## 概览

| 指标 | 值 |
|---|---|
| 扫描页面 | 97 |
| 可点击元素总计 | 986 |
| 去重后功能数 | 733 |
| 跨页面复用功能 | 89 |
| 单页面独有功能 | 644 |
| 平均每页可点击 | 10.2 个 |
| 无功能的页面 | 4 |
| 扫描时间 | 2026-10-07 12:27:25 |

## 功能类型分布

| 类型 | 数量 | 占比 |
|---|--:|--:|
| 列表项 / 卡片 | 255 | 25.9% |
| 容器 / 滚动区（非功能） | 104 | 10.5% |
| 分类切换 Tab | 96 | 9.7% |
| 顶部返回/标题栏 | 72 | 7.3% |
| 按钮 | 71 | 7.2% |
| 其它 | 68 | 6.9% |
| 弹窗 / 对话框 | 57 | 5.8% |
| 标签 / 徽章 | 51 | 5.2% |
| 底部导航 Tab | 42 | 4.3% |
| 链接 / 协议 | 31 | 3.1% |
| 图标操作 | 30 | 3.0% |
| 搜索 | 30 | 3.0% |
| 未命名元素 | 26 | 2.6% |
| 菜单项 | 19 | 1.9% |
| 图片 / 轮播 | 11 | 1.1% |
| 筛选 / 下拉 | 10 | 1.0% |
| 视图切换 | 5 | 0.5% |
| 排序 | 4 | 0.4% |
| 表单输入 | 2 | 0.2% |
| 开关 / 复选 | 2 | 0.2% |

## 全局复用功能（出现在多个页面）

| 功能 | 元素 | 类型 | 出现页面数 |
|---|---|---|--:|
| (无文本) | `back-btn` | 顶部返回/标题栏 | 34 |
|  | `uni-page-head-btn` | 顶部返回/标题栏 | 19 |
| (无文本) | `` | 未命名元素 | 10 |
| 首页 | `tabbaritem` | 底部导航 Tab | 7 |
| 活动 | `tabbaritem` | 底部导航 Tab | 7 |
| 市场 | `tabbaritem` | 底部导航 Tab | 7 |
| 公告 | `tabbaritem` | 底部导航 Tab | 7 |
| 我的 | `tabbaritem` | 底部导航 Tab | 7 |
| 首页 活动 市场 公告 我的 | `tabbar` | 底部导航 Tab | 7 |
| (无文本) | `action bg-black round padding just` | 弹窗 / 对话框 | 6 |
| 暂无数据 | `uni-scroll-view` | 容器 / 滚动区（非功能） | 5 |
| (无文本) | `uni-scroll-view` | 容器 / 滚动区（非功能） | 5 |
| (无文本) | `uni-swiper-wrapper` | 图片 / 轮播 | 5 |
| ICard 搜索 | `search-bar` | 搜索 | 5 |
| ICard | `search-left` | 搜索 | 5 |
| 搜索 | `search-btn` | 搜索 | 5 |
| (无文本) | `header-back` | 顶部返回/标题栏 | 5 |
| 确认 | `cu-btn margin-top` | 按钮 | 4 |
| 取消 | `cu-btn margin-top` | 按钮 | 4 |
| 确定 | `text-center margin-top` | 其它 | 4 |
| 消耗份数 | `cell` | 列表项 / 卡片 | 4 |
| (无文本) | `action round padding justify-start` | 弹窗 / 对话框 | 4 |
| (无文本) | `pwd-toggle` | 视图切换 | 4 |
| (无文本) | `action bg-white round padding just` | 弹窗 / 对话框 | 3 |
| 获取验证码 | `captcha-wrap` | 容器 / 滚动区（非功能） | 3 |
| 获取验证码 | `code-btn` | 按钮 | 3 |
| (无文本) | `nav-btn` | 按钮 | 3 |
| 目标藏品 | `hero-card` | 列表项 / 卡片 | 3 |
| 目标藏品 | `hero-tag` | 标签 / 徽章 | 3 |
| 发行 0 | `hero-stat-chip` | 标签 / 徽章 | 3 |
| 流通 0 | `hero-stat-chip` | 标签 / 徽章 | 3 |
| 【爱卡合成公告】iCard爱卡平台核心藏品《艾卡德- | `uni-scroll-view` | 容器 / 滚动区（非功能） | 3 |
| (无文本) | `notice-label` | 标签 / 徽章 | 3 |
| 【爱卡合成公告】iCard爱卡平台核心藏品《艾卡德- | `notice-main` | 其它 | 3 |
| 【爱卡合成公告】iCard爱卡平台核心藏品《艾卡德- | `uni-swiper-wrapper` | 图片 / 轮播 | 3 |
| (无文本) | `notice-menu` | 菜单项 | 3 |
| 爱卡好物 数字艺术 精选礼遇 | `uni-scroll-view` | 容器 / 滚动区（非功能） | 3 |
| 爱卡好物 | `category-tab active` | 分类切换 Tab | 3 |
| 数字艺术 | `category-tab` | 分类切换 Tab | 3 |
| 精选礼遇 | `category-tab` | 分类切换 Tab | 3 |

## 功能清单（按类型）

### 列表项 / 卡片（去重后 218 个）

- **消耗份数** `cell` （4 页共用）
- **目标藏品** `hero-card` （colorfulMix/details, mix/details, salvage/details）
- **ICARD联名高端定制手机壳iPhone ¥19.9** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **坐姿宇航员看书太空人大型装饰摆件潮流单品 ¥199** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **三角洲行动手办模型盲盒六一儿童节礼物 ¥99** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **潮玩积木TOPTOY兔破未来半解剖拼装 ¥199** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **ICARD潮流时尚联名手办高端定制款 ¥199** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **一飞冲天齐天大圣孙悟空摆件装饰手办模型 ¥99** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **哆啦盲盒摆件玩具手办公仔潮玩礼物周边 ¥99** `waterfall-item` （colorfulMix/icardGame, home/home, index/index）
- **收藏每一份热爱** `slogan-row` （colorfulMix/icardGame, home/home, index/index）
- **【爱卡运营公告】关于充值活动奖励《ICARD身份卡》发放通知** `notice-swiper-item` （colorfulMix/icardGame, home/home, index/index）
- **【爱卡运营公告】部分藏品分区调整公告** `notice-swiper-item` （colorfulMix/icardGame, home/home, index/index）
- **【爱卡寄售公告】奶奶有道理系列藏品《慢行致远》寄售公告** `notice-swiper-item` （colorfulMix/icardGame, home/home, index/index）
- **【爱卡试运营晚安公告】 致ICARD爱卡全体用户** `notice-swiper-item` （colorfulMix/icardGame, home/home, index/index）
- **合成条件 消耗份数** `row header` （Transformation/Transformation, colorfulMix/details）
- **合成条件** `cell` （Transformation/Transformation, colorfulMix/details）
- **已关闭** `cu-item text-gray flex-sub` （account/bidList, account/marketOrderList）
- **name 2024-10-28 20:35:33** `content-item flex justify-between al` （account/open, integral/my）
- **name 2024-10-28 20:35:33** `item-left flex` （account/open, integral/my）
- **name 2024-10-28 20:35:33** `item-content margin-left` （account/open, integral/my）
- **(无文本)** `wallet-card` （wallet/wallet, wallet/wallet1）
- **系统消息** `content-item flex justify-between al` （Announcement/Announcement）
- **平台消息** `content-item flex justify-between al` （Announcement/Announcement）
- **系统消息** `item-left flex align-center` （Announcement/Announcement）
- **系统消息** `item-content margin-left` （Announcement/Announcement）
- **平台消息** `item-left flex align-center` （Announcement/Announcement）
- **平台消息** `item-content margin-left` （Announcement/Announcement）
- **必要1 可用:1 测试数据 0/1** `text-center padding-tb-sm radius-cha` （Transformation/Transformation）
- **可用:1 测试数据 0/1** `items` （Transformation/Transformation）
- **爱卡xb5PqY36** `account-name-row` （account/account）
- *…另有 188 个同类功能*

### 容器 / 滚动区（非功能）（去重后 83 个）

- **暂无数据** `uni-scroll-view` （5 页共用）
- **(无文本)** `uni-scroll-view` （5 页共用）
- **获取验证码** `captcha-wrap` （account/safePass, login/forget, login/register）
- **【爱卡合成公告】iCard爱卡平台核心藏品《艾卡德-学习》分** `uni-scroll-view` （colorfulMix/icardGame, home/home, index/index）
- **爱卡好物 数字艺术 精选礼遇** `uni-scroll-view` （colorfulMix/icardGame, home/home, index/index）
- **收藏每一份热爱 ICard 搜索** `home-fixed-header` （colorfulMix/icardGame, home/home, index/index）
- **收藏每一份热爱 ICard 搜索** `header-content` （colorfulMix/icardGame, home/home, index/index）
- **收藏每一份热爱** `header-top` （colorfulMix/icardGame, home/home, index/index）
- **我的钱包** `header` （wallet/wallet, wallet/wallet1）
- **暂无数据 持有: 个 开启结果 确定 提货 收货地址 请设置** `uni-scroll-view` （account/Warelist）
- **关于平台** `header` （account/about）
- **爱卡xb5PqY36 绑定手机号：175****1293** `account-header` （account/account）
- **全部求购中已成交已关闭已售出** `uni-scroll-view` （account/bidList）
- **藏品盲盒** `uni-scroll-view` （account/collections）
- **我的收藏册 数字资产 实物资产 藏品盲盒 输入藏品关键词** `assets-sticky-header` （account/collections）
- **我的收藏册** `nav-header` （account/collections）
- **(无文本)** `qr-wrap` （account/invite）
- **邀请记录 暂无邀请记录** `uni-scroll-view` （account/invite）
- **邀请好友** `header` （account/invite）
- **待付款 已支付 已关闭** `uni-scroll-view` （account/marketOrderList）
- **首发订单 常规交易 求购订单 委托订单 盲盒订单** `uni-scroll-view` （account/orderList）
- **全部 待付款 已支付 订单取消** `uni-scroll-view` （account/orderList）
- **我的订单** `header` （account/orderList）
- **全部待付款已支付订单取消** `uni-scroll-view` （account/physicalOrderList）
- **实物订单** `header margin-lr` （account/physicalOrderList）
- **隐私设置** `header` （account/privacy）
- **实名认证** `header` （account/realname）
- **售出记录** `header margin-lr` （account/saleList）
- **联系客服** `header` （account/service）
- **© 2026 海南御上有旨文化科技有限公司 版权所有** `footer` （account/service）
- *…另有 53 个同类功能*

### 分类切换 Tab（去重后 82 个）

- **爱卡好物** `category-tab active` （colorfulMix/icardGame, home/home, index/index）
- **数字艺术** `category-tab` （colorfulMix/icardGame, home/home, index/index）
- **精选礼遇** `category-tab` （colorfulMix/icardGame, home/home, index/index）
- **爱卡好物 数字艺术 精选礼遇** `category-tabs` （colorfulMix/icardGame, home/home, index/index）
- **爱卡好物** `tab-text` （colorfulMix/icardGame, home/home, index/index）
- **数字艺术** `tab-text` （colorfulMix/icardGame, home/home, index/index）
- **精选礼遇** `tab-text` （colorfulMix/icardGame, home/home, index/index）
- **首发** `trade-item` （account/account）
- **市场** `trade-item` （account/account）
- **求购** `trade-item` （account/account）
- **委托** `trade-item` （account/account）
- **全部** `trade-all` （account/account）
- **数字资产** `category-tab active` （account/collections）
- **实物资产** `category-tab` （account/collections）
- **藏品** `sub-tab-item active` （account/collections）
- **盲盒** `sub-tab-item` （account/collections）
- **数字资产 实物资产** `category-tabs` （account/collections）
- **数字资产** `tab-text` （account/collections）
- **实物资产** `tab-text` （account/collections）
- **藏品盲盒** `sub-tabs-wrap` （account/collections）
- **首发订单** `tab-item active` （account/orderList）
- **常规交易** `tab-item` （account/orderList）
- **求购订单** `tab-item` （account/orderList）
- **委托订单** `tab-item` （account/orderList）
- **盲盒订单** `tab-item` （account/orderList）
- **全部** `sub-tab-item active` （account/orderList）
- **待付款** `sub-tab-item` （account/orderList）
- **已支付** `sub-tab-item` （account/orderList）
- **订单取消** `sub-tab-item` （account/orderList）
- **首发订单 常规交易 求购订单 委托订单 盲盒订单** `tab-bar-inner` （account/orderList）
- *…另有 52 个同类功能*

### 其它（去重后 62 个）

- **确定** `text-center margin-top` （4 页共用）
- **【爱卡合成公告】iCard爱卡平台核心藏品《艾卡德-学习》分** `notice-main` （colorfulMix/icardGame, home/home, index/index）
- **合成条件 消耗份数** `table margin-top` （Transformation/Transformation, colorfulMix/details）
- **(无文本)** `pc_turns` （Transformation/Transformation）
- **(无文本)** `subgraph` （Transformation/Transformation）
- **请设置默认地址** `flex align-center justify-between` （account/Warelist）
- **爱卡xb5PqY36 绑定手机号：175****1293** `account-user` （account/account）
- **我的资产** `left` （account/blindboxresult）
- **恭喜获得 确定** `box-result` （account/collections）
- **查询** `round bg-green text-black flex align` （account/increase）
- **(无文本)** `qr-canvas` （account/invite）
- **(无文本)** `poster-qr-canvas` （account/invite）
- **截图保存** `poster-save` （account/invite）
- **暂无数据** `flex align-center justify-center lis` （account/order）
- **爱卡xb5PqY36 已认证 钱包地址: 70ff29639** `margin-left-lg` （account/other）
- **持有资产 售出资产** `top_bar` （account/other）
- **展开** `type` （account/otheruser）
- **设置操作密码 找回密码** `setting-list` （account/privacy）
- **实名认证 设置支付密码 重置登录密码 注销账号** `setting-list` （account/setting）
- **绑定手机 17587881293** `borderBottom flex margin-bottom-sm a` （account/user）
- **保存** `bottom-bar` （address/add）
- **添加收货地址** `bottom-bar` （address/address）
- **活动结束** `activity-status-bar` （colorfulMix/colorfulMix）
- **合成规则** `nav-rule` （colorfulMix/details）
- **合成规则** `compose-nav` （colorfulMix/details）
- **立即合成** `bottom_nav` （colorfulMix/details）
- **小助手规则** `pos` （colorfulMix/index）
- **暂无数据** `records-list` （colorfulMix/records）
- **(无文本)** `empty-page__back` （common/emptyPage）
- **请设置地址** `flex align-center justify-between` （integral/details）
- *…另有 32 个同类功能*

### 按钮（去重后 54 个）

- **确认** `cu-btn margin-top` （4 页共用）
- **取消** `cu-btn margin-top` （4 页共用）
- **获取验证码** `code-btn` （account/safePass, login/forget, login/register）
- **(无文本)** `nav-btn` （colorfulMix/details, mix/details, salvage/details）
- **立即购买** `buy-btn` （market/batchBuy, market/confirmorder, market/physicalGoodsDetails）
- **确定** `cu-btn round margin-lr-xl lg flex-su` （account/Warelist, account/other）
- **返回** `cu-btn lg margin-right bg-gray light` （account/Warelist, integral/details）
- **返回** `cu-btn lg bg-gray radius margin-righ` （account/collections, account/other）
- **确认** `login-btn` （account/safePass, login/forget）
- **返回** `sheet-btn outline` （account/user, market/goodsDetails）
- **立即合成** `newbtn` （Transformation/Transformation）
- **提货** `cu-btn lg bg-gold flex-sub radius` （account/Warelist）
- **开1个** `newbtn` （account/blindbox）
- **开全部** `newbtn` （account/blindbox）
- **去寄售** `newbtn` （account/blindbox）
- **寄售** `cu-btn lg bg-consign radius flex-sub` （account/collections）
- **确定** `box-result-btn` （account/collections）
- **提交** `btn_abc flex-sub bg-red` （account/nickname）
- **全部记录** `top-btn text-center` （account/open）
- **全部记录** `fer-btn text-center` （account/open）
- **批量寄售** `cu-btn radius bg-red margin-right` （account/other）
- **寄售** `cu-btn lg bg-gradual-grey radius fle` （account/other）
- **返回** `return-btn` （account/realname）
- **确定** `sheet-btn primary` （account/user）
- **保存** `save-btn` （address/add）
- **取消** `cc_area_view_btn_cancle` （address/add）
- **确定** `cc_area_view_btn_sure` （address/add）
- **取消 地区选择 确定** `cc_area_view_btns` （address/add）
- **地区选择** `cc_area_view_btn_title` （address/add）
- **立即合成** `bottom-btn` （colorfulMix/details）
- *…另有 24 个同类功能*

### 弹窗 / 对话框（去重后 42 个）

- **(无文本)** `action bg-black round padding justif` （6 页共用）
- **(无文本)** `action round padding justify-start` （4 页共用）
- **(无文本)** `action bg-white round padding justif` （Announcement/Announcement, account/open, market/Consignment）
- **合成确认 预计可合成目标数量：0 若目标藏品份数不足，则实际** `cu-dialog bg-white text-left padding` （Transformation/Transformation, colorfulMix/details）
- **合成成功 确定** `cu-dialog bg-white text-left padding` （Transformation/Transformation, colorfulMix/details）
- **持有: 个** `cu-dialog bg-white` （account/Warelist, account/collections）
- **(无文本)** `action` （account/blindbox, account/blindboxresult）
- **批量寄售 寄售价格 请输入价格 预计收益 ￥ 0.00 服务** `cu-dialog bg-white text-left padding` （account/collections, account/other）
- **(无文本)** `action flex align-center justify-cen` （account/Warelist）
- **提货 收货地址 请设置默认地址 备注 请输入备注 返回 提货** `cu-dialog bg-white text-left padding` （account/Warelist）
- **(无文本)** `modal-close-btn` （account/collections）
- **开启盲盒 确定开启该盲盒吗？开启后不可撤销 取消 立即开启** `box-dialog` （account/collections）
- **取消** `box-dialog-btn cancel` （account/collections）
- **立即开启** `box-dialog-btn ok` （account/collections）
- **持有: 个** `modal-header` （account/collections）
- **持有: 个** `modal-header-info` （account/collections）
- **取消 立即开启** `box-dialog-btns` （account/collections）
- **我的邀请码 S389722 扫码加入，一起收藏热爱 截图保存** `cu-dialog poster-dialog` （account/invite）
- **分享邀请海报 复制链接** `action-btns` （account/invite）
- **订单编号: ￥ 接收人区块链地址** `cu-dialog bg-white` （account/orderList）
- **持有: 个 批量寄售** `cu-dialog bg-white` （account/other）
- **修改昵称 返回 确定** `cu-dialog nickname-sheet` （account/user）
- **(无文本)** `action-btn-img` （drawPrize/drawPrize）
- **(无文本)** `cu-dialog` （drawPrize/drawPrize）
- **兑换 收货地址 请设置地址 返回 兑换** `cu-dialog bg-white text-left padding` （integral/details）
- **发起求购** `cu-dialog begbuy-sheet` （market/details）
- **发起委托** `cu-dialog entrust-sheet` （market/details）
- **批量购买 限价 最高 限价 元 下单数量 批量下单** `cu-dialog bg-white padding` （market/details）
- **(无文本)** `radius flex btn-action-yellow align-` （market/details）
- **批量下单** `cu-btn flex-sub lg btn-action-yellow` （market/details）
- *…另有 12 个同类功能*

### 标签 / 徽章（去重后 41 个）

- **目标藏品** `hero-tag` （colorfulMix/details, mix/details, salvage/details）
- **发行 0** `hero-stat-chip` （colorfulMix/details, mix/details, salvage/details）
- **流通 0** `hero-stat-chip` （colorfulMix/details, mix/details, salvage/details）
- **(无文本)** `notice-label` （colorfulMix/icardGame, home/home, index/index）
- **购买数量** `card-label` （market/batchBuy, market/confirmorder）
- **服务须知** `card-label` （market/bidDetail, market/confirmorder）
- **发行** `cu-tag bg-change-yellow` （Transformation/Transformation）
- **2000份** `cu-tag bg-gray` （Transformation/Transformation）
- **流通** `cu-tag bg-change-yellow` （Transformation/Transformation）
- **账号安全** `menu-label` （account/account）
- **我的钱包** `menu-label` （account/account）
- **我的收藏** `menu-label` （account/account）
- **收藏记录** `menu-label` （account/account）
- **我的地址** `menu-label` （account/account）
- **关于平台** `menu-label` （account/account）
- **退出登录** `menu-label` （account/account）
- **恭喜获得** `box-result-tag` （account/collections）
- **已认证** `radius sm cu-tag margin-top-xs bg-ch` （account/other）
- **平台认证** `user-tag` （account/otheruser）
- **待付款** `cu-tag round padding-sm no-active` （account/physicalOrderList）
- **已支付** `cu-tag round padding-sm no-active` （account/physicalOrderList）
- **订单取消** `cu-tag round padding-sm no-active` （account/physicalOrderList）
- **已认证** `id-card-tag` （account/realname）
- **未开通** `top-tag` （colorfulMix/index）
- **必要** `item-tag` （colorfulMix/index）
- **购买单价** `card-label` （market/batchBuy）
- **预计金额** `card-label freeze-label` （market/batchBuy）
- **选择售出编号** `card-label` （market/bidDetail）
- **支付方式** `card-label` （market/bidDetail）
- **预计收入** `card-label` （market/bidDetail）
- *…另有 11 个同类功能*

### 图标操作（去重后 30 个）

- **规则** `padding` （Transformation/Transformation）
- **立即合成** `bottom_nav padding flex align-center` （Transformation/Transformation）
- **(无文本)** `text-xl bg-blue padding-lr-xs round` （account/InviteRankingList）
- **(无文本)** `cuIcon-edit account-edit` （account/account）
- **查询** `bottom_nav padding-xl flex align-cen` （account/increase）
- **(无文本)** `copy-icon` （account/invite）
- **分享邀请海报** `btn-share` （account/invite）
- **提交** `bottom_nav padding bg-grey flex alig` （account/nickname）
- **持有资产** `text-lg text-center padding-lr paddi` （account/other）
- **售出资产** `text-lg text-center padding-lr paddi` （account/other）
- **藏品** `padding-xs flex align-center padding` （account/other）
- **盲盒** `padding-xs flex align-center padding` （account/other）
- **(无文本)** `cuIcon-round` （account/other）
- **昵称 爱卡xb5PqY36** `flex margin-bottom-sm align-center j` （account/user）
- **(无文本)** `cuIcon-copy` （account/user）
- **头像** `borderBottom flex margin-bottom-sm a` （account/user）
- **添加收货地址** `add-btn` （address/address）
- **收货地址** `address-sticky-header` （address/address）
- **积分明细** `text-lg text-center padding-lr paddi` （integral/my）
- **兑换记录** `text-lg text-center padding-lr paddi` （integral/my）
- **全部** `text-lg text-center padding-lr paddi` （integral/my）
- **已获取** `text-lg text-center padding-lr paddi` （integral/my）
- **已消耗** `text-lg text-center padding-lr paddi` （integral/my）
- **积分明细 兑换记录** `padding-top border-bottom` （integral/my）
- **全部 已获取 已消耗** `padding-top top_bar` （integral/my）
- **暂无数据** `list-wrap padding-lr` （invite/list）
- **去邀请** `bottom_nav padding bg-white flex ali` （invite/list）
- **(无文本)** `bottom-sheet-close` （market/details）
- **上架到市场** `bottom_nav padding flex align-center` （market/sale）
- **(无文本)** `cuIcon-favor` （todayrank/todayrank）

### 链接 / 协议（去重后 25 个）

- **(无文本)** `agreement-check` （login/login, login/register, market/confirmorder）
- **《用户协议》** `agreement-link` （login/login, login/register）
- **《隐私政策》** `agreement-link` （login/login, login/register）
- **我已阅读并同意《用户协议》，《隐私政策》** `agreement-bar` （login/login, login/register）
- **，** `agreement-link` （login/login, login/register）
- **用户协议** `link-item` （account/about）
- **隐私政策** `link-item` （account/about）
- **联系客服** `link-item` （account/about）
- **用户协议 隐私政策 联系客服** `link-list` （account/about）
- **用户协议** `link-label` （account/about）
- **隐私政策** `link-label` （account/about）
- **联系客服** `link-label` （account/about）
- **复制链接** `btn-copy-link` （account/invite）
- **隐私政策** `policy-header` （account/service）
- **规则** `header-link` （drawPrize/drawPrize）
- **记录** `header-link` （drawPrize/drawPrize）
- **注册账号** `link-text` （login/login）
- **验证码登录** `link-text` （login/login）
- **忘记密码?** `link-text` （login/login）
- **注册账号 验证码登录 忘记密码?** `link-row` （login/login）
- **已有账号，去登录** `link-text` （login/register）
- **已有账号，去登录** `link-row link-row-single` （login/register）
- **《服务协议》** `agree-link` （market/bidDetail）
- **《服务协议》** `agreement-link` （market/confirmorder）
- **我已同意ICARD 《服务协议》** `agreement-row` （market/confirmorder）

### 未命名元素（去重后 17 个）

- **(无文本)** `` （10 页共用）
- **消息 系统消息 平台消息** `` （Announcement/Announcement）
- **全部求购中已成交已关闭已售出 暂无数据** `` （account/bidList）
- **xx盲盒 开1个 开全部 去寄售 开盒可获得以下藏品任意1个** `` （account/blindbox）
- **测试数据 #1231332 name #1231332 na** `` （account/blindboxresult）
- **提货订单列表 暂无数据** `` （account/order）
- **实物订单 购买 托管 寄售 全部待付款已支付订单取消 暂无数** `` （account/physicalOrderList）
- **售出记录 数藏售出 秒转售出 实物售出 已售出 暂无数据** `` （account/saleList）
- **北京 天津 河北省 山西省 内蒙古自治区 辽宁省 吉林省 黑** `` （address/add）
- **北京市** `` （address/add）
- **东城区 西城区 朝阳区 丰台区 石景山区 海淀区 门头沟区 ** `` （address/add）
- **抽签活动 限量藏品资格抽取 积分商城 商城兑好礼 精彩合成 ** `` （colorfulMix/colorfulMix）
- **您还未加入任何群聊** `` （community/community）
- **抽签 -- 1 抽签中 -- 2 开签中 -- 3 公示时间** `` （drawlots/details）
- **收藏每一份热爱 输入搜索的信息 全部 寄售公告 上新公告 活** `` （notification/notification）
- **分解活动 暂无数据** `` （salvage/salvage）
- **签到 已连续签到 天 2026年10月 日 一 二 三 四 ** `` （sign/sign）

### 顶部返回/标题栏（去重后 17 个）

- **(无文本)** `back-btn` （34 页共用）
- **** `uni-page-head-btn` （19 页共用）
- **(无文本)** `header-back` （5 页共用）
- **消息** `cu-bar flex justify-between align-ce` （Announcement/Announcement）
- **消息** `text-back text-xl flex-sub text-cent` （Announcement/Announcement）
- **规则** `cu-bar flex justify-between` （Transformation/Transformation）
- **开盒记录 全部记录** `cu-bar flex justify-between align-ce` （account/open）
- **(无文本)** `cuIcon-back` （account/order）
- **活动通道** `cu-bar flex justify-between align-ce` （colorfulMix/group）
- **自动合成小助手** `cu-bar flex justify-between align-ce` （colorfulMix/index）
- **积分商城** `cu-bar flex justify-between align-ce` （integral/my）
- **寄售记录** `cu-bar flex justify-between align-ce` （market/Consignment）
- **(无文本)** `header-back is-hero` （market/details）
- **置换活动** `cu-bar flex justify-between align-ce` （mix/mix）
- **分解活动** `cu-bar flex justify-between align-ce` （salvage/salvage）
- **(无文本)** `nav-back` （wallet/thirdWallet）
- **汇付钱包** `nav-bar` （wallet/thirdWallet）

### 菜单项（去重后 17 个）

- **(无文本)** `notice-menu` （colorfulMix/icardGame, home/home, index/index）
- **账号安全** `menu-item` （account/account）
- **我的钱包** `menu-item` （account/account）
- **我的收藏** `menu-item` （account/account）
- **收藏记录** `menu-item` （account/account）
- **我的地址** `menu-item is-last` （account/account）
- **关于平台** `menu-item` （account/account）
- **退出登录** `menu-item is-last` （account/account）
- **账号安全 我的钱包 我的收藏 收藏记录 我的地址** `account-card menu-card` （account/account）
- **账号安全** `menu-left` （account/account）
- **我的钱包** `menu-left` （account/account）
- **我的收藏** `menu-left` （account/account）
- **收藏记录** `menu-left` （account/account）
- **我的地址** `menu-left` （account/account）
- **关于平台 退出登录** `account-card menu-card` （account/account）
- **关于平台** `menu-left` （account/account）
- **退出登录** `menu-left` （account/account）

### 搜索（去重后 15 个）

- **ICard 搜索** `search-bar` （5 页共用）
- **ICard** `search-left` （5 页共用）
- **搜索** `search-btn` （5 页共用）
- **ICard** `search-placeholder` （colorfulMix/icardGame, home/home, index/index）
- **ICard** `uni-input-placeholder search-placeho` （integral/integral, market/market）
- **输入藏品关键词** `search-bar` （account/collections）
- **输入藏品关键词** `search-input-wrap` （account/collections）
- **输入藏品关键词** `uni-input-placeholder search-placeho` （account/collections）
- **(无文本)** `cuIcon-search text-bold` （account/other）
- **输入搜索的信息** `search-row` （notification/notification）
- **输入搜索的信息** `search-box` （notification/notification）
- **搜索商品** `search-page` （search/search）
- **搜索商品** `search-header` （search/search）
- **搜索商品** `search-input-wrap` （search/search）
- **搜索商品** `uni-input-placeholder search-placeho` （search/search）

### 筛选 / 下拉（去重后 10 个）

- **北京 天津 河北省 山西省 内蒙古自治区 辽宁省 吉林省 黑** `uni-picker-view-group` （address/add）
- **北京市** `uni-picker-view-group` （address/add）
- **东城区 西城区 朝阳区 丰台区 石景山区 海淀区 门头沟区 ** `uni-picker-view-group` （address/add）
- **全部份数** `da-dropdown-menu-item` （market/market）
- **全部价格** `da-dropdown-menu-item` （market/market）
- **全部份数 全部价格** `filter-row` （market/market）
- **全部份数 全部价格** `filter-row-main` （market/market）
- **全部份数 全部价格** `da-dropdown-menu` （market/market）
- **全部份数** `da-dropdown-menu-item--text` （market/market）
- **全部价格** `da-dropdown-menu-item--text` （market/market）

### 底部导航 Tab（去重后 6 个）

- **首页** `tabbaritem` （7 页共用）
- **活动** `tabbaritem` （7 页共用）
- **市场** `tabbaritem` （7 页共用）
- **公告** `tabbaritem` （7 页共用）
- **我的** `tabbaritem` （7 页共用）
- **首页 活动 市场 公告 我的** `tabbar` （7 页共用）

### 图片 / 轮播（去重后 5 个）

- **(无文本)** `uni-swiper-wrapper` （5 页共用）
- **【爱卡合成公告】iCard爱卡平台核心藏品《艾卡德-学习》分** `uni-swiper-wrapper` （colorfulMix/icardGame, home/home, index/index）
- **(无文本)** `compose-banner-wrap` （colorfulMix/colorfulMix）
- **(无文本)** `qr-image` （colorfulMix/community）
- **(无文本)** `uni-swiper-dot uni-swiper-dot-active` （market/physicalGoodsDetails）

### 排序（去重后 4 个）

- **价格** `list-header-sort list-col-price acti` （market/details）
- **编号** `list-header-sort list-col-no` （market/details）
- **地板价** `col-floor sort-col active` （market/market）
- **成交量** `col-volume sort-col` （market/market）

### 视图切换（去重后 2 个）

- **(无文本)** `pwd-toggle` （4 页共用）
- **(无文本)** `view-mode-toggle` （market/market）

### 开关 / 复选（去重后 2 个）

- **(无文本)** `default-switch` （address/add）
- **(无文本)** `cuIcon-roundcheckfill agree-check` （market/bidDetail）

### 表单输入（去重后 1 个）

- **(无文本)** `uni-textarea-textarea` （account/Warelist, address/add）

## 逐页明细

| 页面 | 可点击 | API 调用 | 功能构成 |
|---|--:|--:|---|
| `market/market` | 52 | 2 | 分类切换 Tab×19 · 其它×8 · 筛选 / 下拉×7 · 底部导航 Tab×6 |
| `sign/sign` | 46 | 1 | 列表项 / 卡片×42 · 未命名元素×1 · 顶部返回/标题栏×1 · 按钮×1 |
| `account/account` | 41 | 1 | 菜单项×16 · 标签 / 徽章×7 · 底部导航 Tab×6 · 分类切换 Tab×5 |
| `colorfulMix/icardGame` | 40 | 5 | 列表项 / 卡片×12 · 分类切换 Tab×7 · 底部导航 Tab×6 · 容器 / 滚动区（非功能）×5 |
| `home/home` | 40 | 5 | 列表项 / 卡片×12 · 分类切换 Tab×7 · 底部导航 Tab×6 · 容器 / 滚动区（非功能）×5 |
| `index/index` | 40 | 5 | 列表项 / 卡片×12 · 分类切换 Tab×7 · 底部导航 Tab×6 · 容器 / 滚动区（非功能）×5 |
| `market/bidDetail` | 33 | 0 | 列表项 / 卡片×15 · 标签 / 徽章×5 · 其它×4 · 容器 / 滚动区（非功能）×4 |
| `notification/notification` | 32 | 2 | 分类切换 Tab×9 · 列表项 / 卡片×7 · 底部导航 Tab×6 · 标签 / 徽章×3 |
| `account/collections` | 31 | 1 | 弹窗 / 对话框×9 · 分类切换 Tab×8 · 容器 / 滚动区（非功能）×5 · 按钮×3 |
| `market/details` | 30 | 2 | 分类切换 Tab×7 · 弹窗 / 对话框×5 · 标签 / 徽章×5 · 容器 / 滚动区（非功能）×4 |
| `address/add` | 25 | 0 | 列表项 / 卡片×9 · 按钮×5 · 未命名元素×3 · 筛选 / 下拉×3 |
| `market/goodsDetails` | 24 | 0 | 列表项 / 卡片×12 · 弹窗 / 对话框×6 · 按钮×3 · 顶部返回/标题栏×1 |
| `Transformation/Transformation` | 21 | 0 | 列表项 / 卡片×5 · 其它×4 · 弹窗 / 对话框×3 · 按钮×3 |
| `market/confirmorder` | 19 | 1 | 列表项 / 卡片×9 · 链接 / 协议×3 · 标签 / 徽章×3 · 顶部返回/标题栏×1 |
| `account/orderList` | 18 | 1 | 分类切换 Tab×12 · 容器 / 滚动区（非功能）×4 · 顶部返回/标题栏×1 · 弹窗 / 对话框×1 |
| `account/other` | 18 | 2 | 图标操作×5 · 按钮×4 · 弹窗 / 对话框×3 · 其它×2 |
| `colorfulMix/colorfulMix` | 18 | 2 | 列表项 / 卡片×7 · 底部导航 Tab×6 · 未命名元素×2 · 图片 / 轮播×2 |
| `colorfulMix/details` | 18 | 1 | 其它×5 · 按钮×4 · 列表项 / 卡片×4 · 标签 / 徽章×3 |
| `mix/details` | 18 | 1 | 其它×5 · 按钮×4 · 列表项 / 卡片×4 · 标签 / 徽章×3 |
| `salvage/details` | 18 | 1 | 其它×5 · 按钮×4 · 列表项 / 卡片×4 · 标签 / 徽章×3 |
| `market/batchBuy` | 17 | 1 | 列表项 / 卡片×10 · 标签 / 徽章×3 · 顶部返回/标题栏×1 · 按钮×1 |
| `account/physicalOrderList` | 16 | 0 | 分类切换 Tab×5 · 列表项 / 卡片×4 · 标签 / 徽章×3 · 容器 / 滚动区（非功能）×2 |
| `integral/details` | 16 | 2 | 列表项 / 卡片×7 · 按钮×3 · 其它×2 · 容器 / 滚动区（非功能）×2 |
| `account/invite` | 14 | 2 | 容器 / 滚动区（非功能）×3 · 其它×3 · 图标操作×2 · 弹窗 / 对话框×2 |
| `integral/my` | 13 | 0 | 图标操作×7 · 列表项 / 卡片×3 · 弹窗 / 对话框×1 · 顶部返回/标题栏×1 |
| `drawPrize/drawPrize` | 12 | 2 | 容器 / 滚动区（非功能）×4 · 链接 / 协议×2 · 弹窗 / 对话框×2 · 顶部返回/标题栏×1 |
| `login/register` | 12 | 0 | 链接 / 协议×7 · 按钮×2 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `market/physicalGoodsDetails` | 12 | 0 | 容器 / 滚动区（非功能）×3 · 列表项 / 卡片×3 · 图片 / 轮播×2 · 其它×2 |
| `integral/integral` | 11 | 2 | 搜索×4 · 容器 / 滚动区（非功能）×3 · 列表项 / 卡片×2 · 顶部返回/标题栏×1 |
| `login/login` | 11 | 0 | 链接 / 协议×9 · 视图切换×1 · 按钮×1 |
| `Announcement/Announcement` | 10 | 0 | 列表项 / 卡片×6 · 顶部返回/标题栏×2 · 未命名元素×1 · 弹窗 / 对话框×1 |
| `account/Warelist` | 10 | 3 | 弹窗 / 对话框×3 · 按钮×3 · 容器 / 滚动区（非功能）×2 · 其它×1 |
| `account/user` | 10 | 1 | 图标操作×3 · 按钮×2 · 容器 / 滚动区（非功能）×2 · 顶部返回/标题栏×1 |
| `drawlots/details` | 10 | 0 | 容器 / 滚动区（非功能）×4 · 列表项 / 卡片×4 · 未命名元素×1 · 顶部返回/标题栏×1 |
| `invite/list` | 10 | 1 | 列表项 / 卡片×2 · 容器 / 滚动区（非功能）×2 · 图标操作×2 · 顶部返回/标题栏×1 |
| `account/about` | 9 | 1 | 链接 / 协议×7 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `account/realname` | 9 | 0 | 列表项 / 卡片×5 · 顶部返回/标题栏×1 · 按钮×1 · 容器 / 滚动区（非功能）×1 |
| `account/bidList` | 8 | 1 | 列表项 / 卡片×5 · 顶部返回/标题栏×1 · 未命名元素×1 · 容器 / 滚动区（非功能）×1 |
| `account/saleList` | 8 | 1 | 分类切换 Tab×5 · 未命名元素×1 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `account/service` | 8 | 0 | 列表项 / 卡片×3 · 容器 / 滚动区（非功能）×3 · 顶部返回/标题栏×1 · 链接 / 协议×1 |
| `integral/Get` | 8 | 1 | 列表项 / 卡片×6 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `account/open` | 7 | 0 | 列表项 / 卡片×3 · 按钮×2 · 弹窗 / 对话框×1 · 顶部返回/标题栏×1 |
| `account/setting` | 7 | 0 | 列表项 / 卡片×4 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 · 其它×1 |
| `account/blindbox` | 6 | 0 | 按钮×3 · 未命名元素×1 · 弹窗 / 对话框×1 · 列表项 / 卡片×1 |
| `account/blindboxresult` | 6 | 0 | 列表项 / 卡片×3 · 未命名元素×1 · 弹窗 / 对话框×1 · 其它×1 |
| `activity/activity` | 6 | 1 | 分类切换 Tab×3 · 容器 / 滚动区（非功能）×2 · 顶部返回/标题栏×1 |
| `address/address` | 6 | 1 | 容器 / 滚动区（非功能）×2 · 图标操作×2 · 顶部返回/标题栏×1 · 其它×1 |
| `colorfulMix/community` | 6 | 1 | 列表项 / 卡片×3 · 顶部返回/标题栏×1 · 图片 / 轮播×1 · 容器 / 滚动区（非功能）×1 |
| `account/marketOrderList` | 5 | 0 | 列表项 / 卡片×3 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `account/otheruser` | 5 | 0 | 列表项 / 卡片×2 · 弹窗 / 对话框×1 · 其它×1 · 标签 / 徽章×1 |
| `account/privacy` | 5 | 0 | 列表项 / 卡片×2 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 · 其它×1 |
| `account/safePass` | 5 | 0 | 按钮×2 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 · 视图切换×1 |
| `colorfulMix/index` | 5 | 0 | 标签 / 徽章×2 · 弹窗 / 对话框×1 · 其它×1 · 顶部返回/标题栏×1 |
| `drawlots/drawlots` | 5 | 1 | 容器 / 滚动区（非功能）×4 · 顶部返回/标题栏×1 |
| `invite/invite` | 5 | 2 | 按钮×3 · 顶部返回/标题栏×1 · 未命名元素×1 |
| `login/forget` | 5 | 0 | 按钮×2 · 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 · 视图切换×1 |
| `market/sale` | 5 | 0 | 顶部返回/标题栏×1 · 标签 / 徽章×1 · 未命名元素×1 · 图标操作×1 |
| `market/transactionParticulars` | 5 | 0 | 列表项 / 卡片×4 · 顶部返回/标题栏×1 |
| `search/search` | 5 | 0 | 搜索×4 · 顶部返回/标题栏×1 |
| `todayrank/todayrank` | 5 | 1 | 列表项 / 卡片×3 · 弹窗 / 对话框×1 · 图标操作×1 |
| `account/order` | 4 | 0 | 未命名元素×1 · 顶部返回/标题栏×1 · 列表项 / 卡片×1 · 其它×1 |
| `market/createOrder` | 4 | 0 | 容器 / 滚动区（非功能）×2 · 顶部返回/标题栏×1 · 其它×1 |
| `account/increase` | 3 | 0 | 顶部返回/标题栏×1 · 其它×1 · 图标操作×1 |
| `account/nickname` | 3 | 0 | 顶部返回/标题栏×1 · 图标操作×1 · 按钮×1 |
| `colorfulMix/records` | 3 | 1 | 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 · 其它×1 |
| `salvage/salvage` | 3 | 1 | 未命名元素×1 · 弹窗 / 对话框×1 · 顶部返回/标题栏×1 |
| `wallet/thirdWallet` | 3 | 0 | 顶部返回/标题栏×2 · 其它×1 |
| `wallet/wallet` | 3 | 1 | 顶部返回/标题栏×1 · 列表项 / 卡片×1 · 容器 / 滚动区（非功能）×1 |
| `wallet/wallet1` | 3 | 3 | 顶部返回/标题栏×1 · 列表项 / 卡片×1 · 容器 / 滚动区（非功能）×1 |
| `account/InviteRankingList` | 2 | 1 | 图标操作×1 · 容器 / 滚动区（非功能）×1 |
| `colorfulMix/group` | 2 | 0 | 弹窗 / 对话框×1 · 顶部返回/标题栏×1 |
| `colorfulMix/result` | 2 | 0 | 顶部返回/标题栏×1 · 按钮×1 |
| `common/emptyPage` | 2 | 0 | 其它×1 · 容器 / 滚动区（非功能）×1 |
| `community/community` | 2 | 0 | 未命名元素×1 · 弹窗 / 对话框×1 |
| `download/download` | 2 | 1 | 顶部返回/标题栏×1 · 按钮×1 |
| `entrust/entrust` | 2 | 0 | 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `integral/records` | 2 | 1 | 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `market/Consignment` | 2 | 0 | 弹窗 / 对话框×1 · 顶部返回/标题栏×1 |
| `market/saleResult` | 2 | 0 | 顶部返回/标题栏×1 · 按钮×1 |
| `market/submitBegBuy` | 2 | 0 | 顶部返回/标题栏×1 · 容器 / 滚动区（非功能）×1 |
| `mix/mix` | 2 | 1 | 弹窗 / 对话框×1 · 顶部返回/标题栏×1 |
| `mix/result` | 2 | 0 | 顶部返回/标题栏×1 · 按钮×1 |
| `Announcement/details` | 1 | 1 | 未命名元素×1 |
| `Announcement/list` | 1 | 0 | 未命名元素×1 |
| `Discussion/Discussion` | 1 | 0 | 顶部返回/标题栏×1 |
| `account/community` | 1 | 0 | 顶部返回/标题栏×1 |
| `common/aliyunCaptcha` | 1 | 0 | 顶部返回/标题栏×1 |
| `market/cardMap` | 1 | 1 | 顶部返回/标题栏×1 |
| `mix/records` | 1 | 1 | 顶部返回/标题栏×1 |
| `notification/details` | 1 | 1 | 顶部返回/标题栏×1 |
| `salvage/records` | 1 | 1 | 顶部返回/标题栏×1 |
| `webview/Policy` | 1 | 1 | 弹窗 / 对话框×1 |
| `webview/webview` | 1 | 0 | 顶部返回/标题栏×1 |
| `common/neteaseCaptcha` | 0 | 0 | — ⚠️ |
| `drawPrize/records` | 0 | 1 | — ⚠️ |
| `success/index` | 0 | 5 | — |
| `webview/webview2` | 0 | 0 | — |

## 无可点击元素的页面（4）

> 多为需参数 / 空态 / 未渲染内容的页面。

- `common/neteaseCaptcha` — page.goto: Timeout 40000ms exceeded.
Call log:
[2m  - navigating to "https://h5
- `drawPrize/records` — page.goto: Timeout 40000ms exceeded.
Call log:
[2m  - navigating to "https://h5
- `success/index`
- `webview/webview2`


## 点击行为实测

> 对重点页面的可点击元素逐个真实点击（`element.click()`），
> 记录：是否发生路由跳转 / 页面内容变化 / 触发了哪些 API 端点。

| 指标 | 值 |
|---|---|
| 实测点击次数 | 136 |
| **有反应** | **61（45%）** |
| 触发路由跳转 | 46 |
| 触发 API 请求 | 55 |
| 仅内容变化 | 6 |
| 无反应 | 75 |

### 逐页实测

| 页面 | 点击 | 有反应 | 详情 |
|---|--:|--:|---|
| `Transformation/Transformation` | 8 | 0 | — |
| `account/account` | 12 | 11 | →跳 · 首发→跳 · 市场→跳 · 求购→跳 · 委托→跳 · 账号安全→跳 |
| `account/collections` | 12 | 3 | →跳 · 数字资产→API · 实物资产→变 |
| `address/add` | 12 | 1 | →跳 |
| `address/address` | 2 | 2 | →跳 · 添加收货地址→跳 |
| `colorfulMix/icardGame` | 12 | 12 | ICard 搜索→跳 · 爱卡好物→跳 · 数字艺术→跳 · 精选礼遇→跳 · ICARD联名高端定制手→跳 · 坐姿宇航员看书太空人大型→跳 |
| `index/index` | 12 | 12 | ICard 搜索→跳 · 爱卡好物→跳 · 数字艺术→跳 · 精选礼遇→跳 · ICARD联名高端定制手→跳 · 坐姿宇航员看书太空人大型→跳 |
| `market/bidDetail` | 12 | 1 | →跳 |
| `market/details` | 12 | 6 | 挂单列表→API · 相关公告→API · 寄售→跳 · 价格→API · 编号→API · 批量购买→跳 |
| `market/goodsDetails` | 12 | 0 | — |
| `market/market` | 12 | 5 | 搜索→API · 自由市场→API · 我的关注→API · 首页→跳 · 活动→跳 |
| `notification/notification` | 12 | 7 | →API · →跳 · 全部→API · 寄售公告→API · 上新公告→API · 活动公告→API |
| `sign/sign` | 6 | 1 | →跳 |

### 有反应的功能明细

| 页面 | 功能 | 元素 | 行为 | 触发 API |
|---|---|---|---|---|
| `account/account` | **(无文本)** | `cuIcon-edit account-edit` | 路由跳转 → `account/user` | /f3a0536111 |
| `account/account` | **首发** | `trade-item` | 路由跳转 → `account/orderList?isTabs=1` | /71d2e2e52b |
| `account/account` | **市场** | `trade-item` | 路由跳转 → `account/orderList?isTabs=2` | /ed613818fc |
| `account/account` | **求购** | `trade-item` | 路由跳转 → `account/orderList?isTabs=4` | /e4c399d86d |
| `account/account` | **委托** | `trade-item` | 路由跳转 → `account/orderList?isTabs=7` | /21fdf3c172 |
| `account/account` | **账号安全** | `menu-item` | 路由跳转 → `account/setting` | — |
| `account/account` | **我的钱包** | `menu-item` | 路由跳转 → `wallet/wallet` | /f3a0536111 |
| `account/account` | **我的收藏** | `menu-item` | 路由跳转 → `account/collections` | /86a850ffde |
| `account/account` | **收藏记录** | `menu-item` | 路由跳转 → `account/orderList?group=consign` | /4f8beda766 |
| `account/account` | **我的地址** | `menu-item is-last` | 路由跳转 → `address/address` | /4ac3dc6525 |
| `account/account` | **关于平台** | `menu-item` | 路由跳转 → `account/about` | /a386180707 |
| `account/collections` | **(无文本)** | `back-btn` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `address/add` | **(无文本)** | `back-btn` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `address/address` | **(无文本)** | `back-btn` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `address/address` | **添加收货地址** | `add-btn` | 路由跳转 → `address/add` | — |
| `colorfulMix/icardGame` | **ICard 搜索** | `search-bar` | 路由跳转 → `search/search` | — |
| `colorfulMix/icardGame` | **爱卡好物** | `category-tab active` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **数字艺术** | `category-tab` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **精选礼遇** | `category-tab` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **ICARD联名高端定制手机壳iPhone ¥** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **坐姿宇航员看书太空人大型装饰摆件潮流单品 ¥** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **三角洲行动手办模型盲盒六一儿童节礼物 ¥99** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **潮玩积木TOPTOY兔破未来半解剖拼装 ¥1** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **ICARD潮流时尚联名手办高端定制款 ¥19** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **一飞冲天齐天大圣孙悟空摆件装饰手办模型 ¥9** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **哆啦盲盒摆件玩具手办公仔潮玩礼物周边 ¥99** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `colorfulMix/icardGame` | **首页** | `tabbaritem` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **ICard 搜索** | `search-bar` | 路由跳转 → `search/search` | — |
| `index/index` | **爱卡好物** | `category-tab active` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **数字艺术** | `category-tab` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **精选礼遇** | `category-tab` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **ICARD联名高端定制手机壳iPhone ¥** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **坐姿宇航员看书太空人大型装饰摆件潮流单品 ¥** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **三角洲行动手办模型盲盒六一儿童节礼物 ¥99** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **潮玩积木TOPTOY兔破未来半解剖拼装 ¥1** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **ICARD潮流时尚联名手办高端定制款 ¥19** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **一飞冲天齐天大圣孙悟空摆件装饰手办模型 ¥9** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **哆啦盲盒摆件玩具手办公仔潮玩礼物周边 ¥99** | `waterfall-item` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `index/index` | **首页** | `tabbaritem` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `market/bidDetail` | **(无文本)** | `back-btn` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `market/details` | **寄售** | `sub-tab-item active` | 路由跳转 → `notification/details?id=162` | /f510bf16a3 |
| `market/details` | **批量购买** | `bottom-btn outline flex-su` | 路由跳转 → `market/batchBuy?id=undefined` | /a386180707 /dec9228549 |
| `market/market` | **首页** | `tabbaritem` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `market/market` | **活动** | `tabbaritem` | 路由跳转 → `colorfulMix/colorfulMix` | /ca5a5a5a77 /a386180707 |
| `notification/notification` | **(无文本)** | `assist-btn` | 路由跳转 → `account/service` | — |
| `sign/sign` | **(无文本)** | `back-btn` | 路由跳转 → `home/home` | /08eec40a5e /a386180707 /b820c1a92a /55566f961c |
| `account/collections` | **数字资产** | `category-tab active` | 请求 API | /86a850ffde |
| `account/collections` | **实物资产** | `category-tab` | 内容变化 | — |
| `market/details` | **挂单列表** | `main-tab active` | 请求 API | /082eb0631c |
| `market/details` | **相关公告** | `main-tab` | 请求 API | /08eec40a5e |
| `market/details` | **价格** | `list-header-sort list-col-` | 请求 API | /082eb0631c |
| `market/details` | **编号** | `list-header-sort list-col-` | 请求 API | /082eb0631c |
| `market/market` | **搜索** | `search-btn` | 请求 API | /58e3fa24c3 |
| `market/market` | **自由市场** | `category-tab` | 请求 API | /58e3fa24c3 |
| `market/market` | **我的关注** | `category-tab` | 请求 API | /58e3fa24c3 |
| `notification/notification` | **(无文本)** | `action-btn` | 请求 API | /08eec40a5e |
| `notification/notification` | **全部** | `text-lg text-center items ` | 请求 API | /08eec40a5e |
| `notification/notification` | **寄售公告** | `text-lg text-center items ` | 请求 API | /08eec40a5e |
| `notification/notification` | **上新公告** | `text-lg text-center items ` | 请求 API | /08eec40a5e |
| `notification/notification` | **活动公告** | `text-lg text-center items ` | 请求 API | /08eec40a5e |

### 跳转目标与路由参数约定

> 这些是真实点击后 uni-app 路由产生的目标 URL，**参数名即后端约定**。

| 跳转目标 | 次数 | 来源（页面·功能） |
|---|--:|---|
| `home/home` | 28 | account/collections·、address/add·、address/address· |
| `search/search` | 2 | colorfulMix/icardGame·ICard 搜索、index/index·ICard 搜索 |
| `account/user` | 1 | account/account· |
| `account/orderList?isTabs=1` | 1 | account/account·首发 |
| `account/orderList?isTabs=2` | 1 | account/account·市场 |
| `account/orderList?isTabs=4` | 1 | account/account·求购 |
| `account/orderList?isTabs=7` | 1 | account/account·委托 |
| `account/setting` | 1 | account/account·账号安全 |
| `wallet/wallet` | 1 | account/account·我的钱包 |
| `account/collections` | 1 | account/account·我的收藏 |
| `account/orderList?group=consign` | 1 | account/account·收藏记录 |
| `address/address` | 1 | account/account·我的地址 |
| `account/about` | 1 | account/account·关于平台 |
| `address/add` | 1 | address/address·添加收货地址 |
| `notification/details?id=162` | 1 | market/details·寄售 |
| `market/batchBuy?id=undefined` | 1 | market/details·批量购买 |
| `colorfulMix/colorfulMix` | 1 | market/market·活动 |
| `account/service` | 1 | notification/notification· |

**带参数的路由**：

- `account/orderList?isTabs=1`
- `account/orderList?isTabs=2`
- `account/orderList?isTabs=4`
- `account/orderList?isTabs=7`
- `account/orderList?group=consign`
- `notification/details?id=162`
- `market/batchBuy?id=undefined`

### 点击无反应（75）

> 可能原因：需真实数据/权限才响应、事件绑在子元素、或纯展示元素。

- `Transformation/Transformation`：立即合成、确认、取消、必要1 可用:1 测试数据 、可用:1 测试数据 0/1、立即合成、合成条件 消耗份数、合成条件 消耗份数
- `account/account`：退出登录
- `account/collections`：藏品、盲盒、(无文本)、返回、寄售、取消、立即开启、确定
- `address/add`：所在地址 请选择省市区、(无文本)、保存、取消、确定、收货人 收货人姓名 手机号 、收货人 收货人姓名、手机号 收货人手机号
- `market/bidDetail`：(无文本)、《服务协议》、确认出售、完成、拥有数量 -- 当前最高求购、拥有数量 -- 当前最高求购、拥有数量 -- 当前最高求购、拥有数量 --
- `market/details`：快捷购买、(无文本)、(无文本)、批量下单、挂单列表 相关公告、寄售 求购 委托
- `market/goodsDetails`：返回、寄售、返回、确认转赠、(无文本)、立即购买、藏品编号 --、创作者 --
- `market/market`：活动市场、全部份数、全部价格、地板价、成交量、橙焰机甲002 发行 888、艾卡德-学习 发行 1317
- `notification/notification`：辟谣公告、空投公告、合成公告、公司新闻、爱卡ICARD官方公告 20
- `sign/sign`：今日签到、日 一 二 三 四 五 六、每日签到 每日签到获取随机奖、签到重置 每日00:00 重、奖励随机 奖励内容随机发放惊

## 复现方式

```bash
# 重新登录并保存登录态
node tools/login.js <手机号> <密码>

# 全量扫描可点击功能
node tools/features.js

# 附带实际点击测试（记录跳转 / API），较慢
CLICK=1 MAX_CLICK=12 node tools/features.js

# 只扫指定页面
ONLY=pages-index-index,pages-market-market node tools/features.js
```
