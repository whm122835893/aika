# UI 样式完整性审计

针对 `h5.shenyuan.sc.cn`（ICard 爱卡）离线复刻的样式资产盘点。
结论：**样式定义层 100% 拿到；UI 状态层有缺口（约 60% 页面未渲染出有数据的样子）。**

## 一、样式文件层 ✅ 100%

| 项目 | 数量 | 状态 |
|---|---:|---|
| CSS 文件 | 2 | 全部镜像（`static/index.149e085d.css` 98KB + 阿里云验证码 `main.css` 11KB） |
| 站点业务 class 定义 | 97（其中 91 个为库自带死样式） | 全部在 CSS 中 |
| uni-app 框架 class | 227 | 全部在 CSS 中 |
| Web 字体 | 4 套 `uni` / `unibtn` / `unimapbtn` / `weui` | **base64 内嵌于 CSS**，天然自包含 |
| 字体二进制文件 | 1 个 ttf + 3 个阿里图标字体 | 已镜像 |
| 引用资源总数 | 138 | **135 个本地已有** |
| 缺失资源 | 3 | 均为 CSS 注释内的死代码，且**源站本身返回 404** |

> 全站样式只有一个 CSS 文件，未做代码分割，因此不存在「漏抓某个 CSS chunk」的可能。

## 二、组件级 scoped 样式 ✅ 100%

本项目有一个反直觉的结构特征，值得记住：

**CSS 文件里没有任何 `[data-v-xxxx]` 选择器，但页面 DOM 里有 116 个 `data-v` 哈希。**

原因是 uni-app H5 把 Vue 单文件组件的 scoped 样式**编译成了行内样式**，直接打进 JS bundle 的渲染函数与最终 DOM：

```
页面快照中的行内样式：5474 处 / 375,008 字符
JS bundle 中定义的 scoped 组件哈希：37 个
页面快照中实际渲染出来的哈希：37 个
→ 组件样式覆盖率 100%
```

所以：**每个组件的视觉定义都被渲染进了 `pages/*.html` 快照，我们全拿到了。**

## 三、UI 状态层 ⚠️ 有缺口

样式定义齐了，但很多 **UI 状态**没有被渲染出来（97 页离线复验结果）：

| 分类 | 页数 | 说明 |
|---|---:|---|
| 有完整内容 | 38 | OK |
| 空态 / 需参数 | 51 | 大多是账号零数据，渲染成空列表或占位 |
| 空白 | 6 | 无内容 |
| 外链残留 | 1 | 验证码页 |
| 加载失败 | 0 | — |

**未渲染出来的 UI 状态主要是：**

- 有数据时的列表/卡片真实排布（订单卡、持仓卡、地址卡）
- uni-app 交互层：`uni-toast`、`uni-modal`、`uni-actionsheet`、`image-view`（图片预览）、`uni-loading`
- 弹窗类：支付确认、分享海报、二维码弹层、身份证认证弹窗
- 各类列表的「有数据 vs 空态」两套视觉

根因有两个：**账号是零数据账号**（同 `api-dictionary.md` 所述），以及**交互态需要真实触发**。

## 四、离线完整性复验

新增资源并重建后，抽查 6 个页面（断网条件，拦截所有外域请求）：

| 页面 | 外泄 | 本地 404 | 破损图片 |
|---|---:|---:|---:|
| pages-index-index | 0 | 0 | 0 / 28 |
| pages-account-account | 0 | 0 | 0 / 24 |
| pages-account-user | 0 | 0 | 0 / 6 |
| pages-notification-notification | 0 | 0 | 0 / 38 |
| pages-market-market | 0 | 0 | 0 / 18 |
| pages-colorfulMix-group | 0 | 0 | 0 / 6 |

## 五、若需补齐 UI 状态

写一个 `tools/ui-states.js`，用 JS 注入直接调用 uni-app API 触发 overlay 并截图：

```js
uni.showToast({ title: '操作成功', icon: 'success' });
uni.showModal({ title: '提示', content: '确认支付？' });
uni.showActionSheet({ itemList: ['微信支付', '支付宝'] });
uni.previewImage({ urls: [...] });
```

交互态样式即可补齐。需要的话说一声。
