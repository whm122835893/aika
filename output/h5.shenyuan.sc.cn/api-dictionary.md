# API 接口字典（h5.shenyuan.sc.cn · ICard 爱卡）

由离线抓取的响应缓存反向整理。接口端点为 md5 哈希串，**接口名取自响应体自带的 `method` 字段**（原站返回，非推测）。

## 概览

| 指标 | 值 |
|---|---|
| 捕获响应总数 | 469 |
| 成功（code=0） | 338 |
| 未登录（code=401） | 47 |
| 其它错误（405 / -1） | 84 |
| 可识别接口名 | 33 |

> 说明：全部请求体均为加密签名体（`trans_id` + `timestamp` + `sign`），无法从请求参数推断语义；
> 因此本表以**响应结构与接口名**为准。

## 接口清单

| 状态 | 次数 | 接口名 | 数据字段结构 |
|---|--:|---|---|
| ✅ | 44 | 通知列表 | `list[10]: id, title, desc, cover_img, url, collection_id, update_time, category_name, category_id, is_follow, collections` |
| ✅ | 43 | 获取用户信息 | `obj: id, open_id, avatar, username, nickname, mobile, user_level_id, status, id_card, sex, is_realname, ti_user_pub_address, transaction_status, unloc` |
| ⚠️ | 26 | 邀请记录(邀请的人员) | `obj: list, total` |
| ✅ | 24 | 获取活动列表 | `list[2]: compose_id, title, status, start_time, end_time, total_number, cover_img, conditions, activity_type, compose_status` |
| ✅ | 21 | 获取用户地址列表 | `obj: list` |
| ✅ | 19 | 获取藏品列表 | `list[7]: id, title, cover_img, total_number, price, tag, status, sale_date, is_priority, priority_time, type, sort` |
| ✅ | 19 | 获取用户的藏品编码 | `obj: list, total` |
| ✅ | 19 | 获取字段 | `obj: goods_type, mall_type` |
| ✅ | 17 | 获取邀请信息 | `obj: user_id, invite_code, invite_url, success_count` |
| ✅ | 12 | 获取积分商品列表 | `obj: list` |
| ✅ | 10 | 藏品出售列表 | `obj: list` |
| ⚠️ | 9 | 获取藏品详情 | `(无数据)` |
| ⚠️ | 9 | 获取积分商品详情 | `(无数据)` |
| ✅ | 8 | 邀新榜单 | `obj: list` |
| ✅ | 8 | 获取用户积分 | `obj: integral` |
| ⚠️ | 8 | 藏品编号列表 | `(无数据)` |
| ✅ | 7 | 获取首发订单列表 | `obj: list` |
| ⚠️ | 6 | 通知详情 | `(无数据)` |
| ✅ | 5 | 获取积分商城订单列表 | `obj: list` |
| ✅ | 4 | 市场产品列表 | `list[4]: id, collection_id, price, yesterday_price, increase_rate, sale_num, today_sale_num, floor_price, title, cover_img, total_number, mall_number,` |
| ✅ | 4 | 通知分类 | `list[8]: id, name, sort, parent_id, category_type, child` |
| ✅ | 4 | 市场产品专辑列表 | `list[4]: album, id, pid` |
| ✅ | 3 | 交易记录（订单记录） | `obj: list` |
| ✅ | 3 | 获取用户钱包余额(苹果过审) | `obj: wallet_money, tocard` |
| ✅ | 3 | 获取当前用户的委托单 | `obj: list` |
| ✅ | 3 | 获取求购订单列表 | `obj: list` |
| ⚠️ | 3 | 获取活动详情 | `(无数据)` |
| ✅ | 2 | 获取抽签列表 | `obj: total, per_page, current_page, last_page, data, has_more` |
| ⚠️ | 2 | 盲盒详情 | `(无数据)` |
| ✅ | 2 | 获取APP版本 | `obj: Android, Ios` |
| ⚠️ | 1 | 获取抽奖详情 | `(无数据)` |
| ✅ | 1 | 获取用户抽奖得奖情况信息 | `obj: total, per_page, current_page, last_page, data, has_more` |
| ✅ | 1 | 盲盒订单列表 | `obj: list` |
| 🔒 | 47 | (未命名 · code=401) | `(无数据)` |
| ✅ | 44 | (未命名 · code=0) | `list[4]: collection_id, num, price, title, total_number, mall_number, cover_img, is_follow` |
| ⚠️ | 28 | (未命名 · code=405) | `(无数据)` |

## 成功响应样例（code=0）

### 获取活动列表

- 端点：`POST /ca5a5a5a…`
- 命中 24 次

```json
{"list":[{"compose_id":50,"title":"【运粮鼠】限量合成通道二","status":2,"start_time":"2026-10-06 19:10:00","end_time":"2026-10-06 20:10:00","total_number":100,"cover_img":"/upload/3df504960e882648dc0b96be33fadf1aeb059ec4.jpg","conditions":[{"group_code":"1","group_name":"
```

### 获取藏品列表

- 端点：`POST /55566f96…`
- 命中 19 次

```json
{"list":[{"id":1170,"title":"ICARD联名高端定制手机壳iPhone","cover_img":"/upload/f6746c2b2cf5254376c8958f1bc8780955ae168c.png","total_number":110,"price":19.9,"tag":[],"status":2,"sale_date":"2026-08-14 23:20:38","is_priority":null,"priority_time":null,"type":0,"sort":
```

### 市场产品列表

- 端点：`POST /58e3fa24…`
- 命中 4 次

```json
{"list":[{"id":42,"collection_id":1179,"price":138,"yesterday_price":"138.00","increase_rate":0,"sale_num":549,"today_sale_num":195,"floor_price":"- -","title":"拳击小子001","cover_img":"/upload/a2ff31cdf75776b14e0874c6ac449ac18d54536e.png","total_number":12000,"m
```

### 获取积分商城订单列表

- 端点：`POST /f3c1774e…`
- 命中 5 次

```json
{"list":{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false}}
```

### (未命名 · code=0)

- 端点：`POST /a3861807…`
- 命中 44 次

```json
[{"collection_id":1183,"num":4326,"price":6,"title":"艾卡德-学习","total_number":50000,"mall_number":8890,"cover_img":"/upload/861bfe33d903a1fc7808f503e302b14e77f07ce1.png","is_follow":0},{"collection_id":1181,"num":1142,"price":38,"title":"花香蝶自来","total_number":20
```

### 通知分类

- 端点：`(端点未映射)`
- 命中 4 次

```json
{"list":[{"id":22,"name":"寄售公告","sort":1,"parent_id":2,"category_type":2,"child":[]},{"id":19,"name":"上新公告","sort":1,"parent_id":2,"category_type":2,"child":[]},{"id":20,"name":"活动公告","sort":1,"parent_id":2,"category_type":2,"child":[]},{"id":23,"name":"运营公告",
```

### 获取邀请信息

- 端点：`POST /9d107fbf…`
- 命中 17 次

```json
{"user_id":379722,"invite_code":"S389722","invite_url":"/#/pages/login/register?invite_code=S389722","success_count":0}
```

### 获取用户地址列表

- 端点：`POST /4ac3dc65…`
- 命中 21 次

```json
{"list":[]}
```

### 通知列表

- 端点：`POST /08eec40a…`
- 命中 44 次

```json
{"list":[{"id":153,"title":"【爱卡合成公告】iCard爱卡平台奶奶有道理系列藏品《慢行致远》合成活动来袭！","desc":"","cover_img":"/upload/014670993c94be10445946388f2b610062dfa5b4.png","url":"","collection_id":"1181","update_time":"2026-10-06 21:44:47","category_name":"合成公告","category_id":21,"is_fo
```

### 获取用户信息

- 端点：`POST /f3a05361…`
- 命中 43 次

```json
{"id":379722,"open_id":"01a10f2b-9314-72b5-a16d-98271413668b","avatar":"","username":"**绵","nickname":"爱卡xb5PqY36","mobile":"17587881293","user_level_id":3,"status":1,"id_card":"5202*********79838","sex":null,"is_realname":1,"ti_user_pub_address":"70ff296394a1
```

### 邀新榜单

- 端点：`POST /2a7d5755…`
- 命中 8 次

```json
{"list":false}
```

### 获取首发订单列表

- 端点：`POST /71d2e2e5…`
- 命中 7 次

```json
{"list":[]}
```

### 获取用户的藏品编码

- 端点：`POST /86a850ff…`
- 命中 19 次，其中 19 次为空列表

```json
{"list":[],"total":0}
```

### 获取用户积分

- 端点：`POST /5aa9af94…`
- 命中 8 次

```json
{"integral":0}
```

### 获取抽签列表

- 端点：`POST /9bf0549b…`
- 命中 2 次，其中 2 次为空列表

```json
{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false}
```

### 市场产品专辑列表

- 端点：`POST /b49e0644…`
- 命中 4 次

```json
{"list":[{"album":"小试牛刀","id":18,"pid":0},{"album":"初露锋芒","id":23,"pid":0},{"album":"大显身手","id":24,"pid":0},{"album":"一鸣惊人","id":25,"pid":0}]}
```

### 获取字段

- 端点：`POST /b820c1a9…`
- 命中 19 次

```json
{"goods_type":[{"id":"019fccb4-54c5-71bc-969c-cf39cc7a9946","type_id":49,"label":"爱卡好物","value":"2","code":"goods_type","sort":17,"status":1,"remark":""},{"id":"019fccb4-416b-71bb-a583-dd6785fd82e0","type_id":49,"label":"数字艺术","value":"1","code":"goods_type","
```

### 藏品出售列表

- 端点：`POST /4f8beda7…`
- 命中 10 次

```json
{"list":[]}
```

### 获取积分商品列表

- 端点：`POST /07f41a28…`
- 命中 12 次

```json
{"list":[]}
```

### 交易记录（订单记录）

- 端点：`POST /ed613818…`
- 命中 3 次

```json
{"list":[]}
```

### 获取用户钱包余额(苹果过审)

- 端点：`POST /3564c6a2…`
- 命中 3 次

```json
{"wallet_money":"0.00","tocard":0}
```

### 获取用户抽奖得奖情况信息

- 端点：`POST /d0992dfb…`
- 命中 1 次，其中 1 次为空列表

```json
{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false}
```

### 获取当前用户的委托单

- 端点：`POST /21fdf3c1…`
- 命中 3 次

```json
{"list":[]}
```

### 获取求购订单列表

- 端点：`POST /e4c399d8…`
- 命中 3 次

```json
{"list":[]}
```

### 盲盒订单列表

- 端点：`POST /e981e9a8…`
- 命中 1 次

```json
{"list":[]}
```

### 获取APP版本

- 端点：`POST /c695eb48…`
- 命中 2 次

```json
{"Android":{"id":3,"title":"最新更新","description":"<p>最新更新</p>","version":"1.0.2","sort":12,"url":" /app/1.2.3.apk","full_url":" /app/1.2.3.apk","is_ios":null,"is_android":null,"platform":"Android","update_type":"forcibly","status":1,"is_canary_release":1,"creat
```

## ⚠️ 返回成功但列表为空的接口

抓取所用账号 `175****1293` 为**零数据账号**（无订单、无持仓、无地址、余额 0），
因此下列接口只拿到了**信封结构**（如 `{list:[...]}`），拿不到行内字段定义：

| 接口名 | 命中 | 返回结构 |
|---|--:|---|
| 获取积分商城订单列表 | 5 | `{"list":{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false` |
| 获取用户地址列表 | 21 | `{"list":[]}` |
| 邀新榜单 | 8 | `{"list":false}` |
| 获取首发订单列表 | 7 | `{"list":[]}` |
| 获取用户的藏品编码 | 19 | `{"list":[],"total":0}` |
| 藏品出售列表 | 10 | `{"list":[]}` |
| 获取积分商品列表 | 12 | `{"list":[]}` |
| 交易记录（订单记录） | 3 | `{"list":[]}` |
| 获取当前用户的委托单 | 3 | `{"list":[]}` |
| 获取求购订单列表 | 3 | `{"list":[]}` |
| 盲盒订单列表 | 1 | `{"list":[]}` |

> 若要补齐字段定义，需要一个有真实订单/持仓的账号重新抓取。

## 未取到数据的接口

以下接口在抓取时未返回有效数据（多为需要更深层交互、或依赖具体 ID 参数）：

- `(未命名 · code=405)` × 28 — code=405（参数缺失或端点不存在）
- `邀请记录(邀请的人员)` × 26 — code=-1（参数缺失或端点不存在）
- `(未命名 · code=401)` × 47 — 需要登录态/未触发
- `通知详情` × 6 — code=-1（参数缺失或端点不存在）
- `藏品编号列表` × 8 — code=-1（参数缺失或端点不存在）
- `获取藏品详情` × 9 — code=-1（参数缺失或端点不存在）
- `获取积分商品详情` × 9 — code=-1（参数缺失或端点不存在）
- `获取抽奖详情` × 1 — code=-1（参数缺失或端点不存在）
- `获取活动详情` × 3 — code=-1（参数缺失或端点不存在）
- `盲盒详情` × 2 — code=-1（参数缺失或端点不存在）