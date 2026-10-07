# 后端 API 端点全清单（h5.shenyuan.sc.cn · ICard 爱卡）

> 端点为 **32 位 md5 哈希**，全部 `POST`，域名 `https://api.shenyuan.sc.cn`。
> 接口名取自响应体自带的 `method` 字段（原站返回，非推测）。
> 请求体均为加密签名体，无法从参数推断语义；本表以响应结构为准。

## 概览

| 指标 | 值 |
|---|---|
| 端点总数 | 42 |
| 有接口名（可识别） | 33 |
| 取到过成功数据（code=0） | 30 |
| 仅返回 401（需登录） | 4 |
| 仅返回 405（端点不可用） | 8 |
| 捕获响应总数 | 437 |
| 管理后台 | **不存在**（无 admin/manage 域名，97 个前端路由全为 C 端） |

## 端点清单（按调用次数）

| 状态 | 次数 | 方法 | 端点 | 接口名 | 响应结构 |
|---|--:|---|---|---|---|
| ✅ | 50 | POST | `/f3a0536111f2…` | 获取用户信息 | obj[1] · 0×43 401×7 |
| ✅ | 38 | POST | `/08eec40a5e71…` | 通知列表 | list[10] · 0×38 |
| ✅ | 35 | POST | `/a3861807072a…` | *(未命名)* | val[1] · 0×35 |
| ✅ | 30 | POST | `/881b6ffc21b2…` | 邀请记录(邀请的人员) | list · -1×18 0×8 401×4 |
| ✅ | 24 | POST | `/4ac3dc652534…` | 获取用户地址列表 | list · 0×21 401×3 |
| ✅ | 22 | POST | `/86a850ffde83…` | 获取用户的藏品编码 | list · 0×19 401×3 |
| ✅ | 20 | POST | `/9d107fbf20a8…` | 获取邀请信息 | obj[1] · 0×17 401×3 |
| ✅ | 20 | POST | `/ca5a5a5a7780…` | 获取活动列表 | list[2] · 0×20 |
| ✅ | 17 | POST | `/b820c1a92ad8…` | 获取字段 | obj[1] · 0×17 |
| ✅ | 17 | POST | `/55566f961c62…` | 获取藏品列表 | list[7] · 0×17 |
| ⚠️ | 14 | POST | `/55b4885be663…` | *(未命名)* | — · 405×14 |
| ✅ | 11 | POST | `/4f8beda76690…` | 藏品出售列表 | list · 0×10 401×1 |
| ✅ | 11 | POST | `/07f41a28fa94…` | 获取积分商品列表 | list · 0×11 |
| ✅ | 10 | POST | `/5aa9af94b66d…` | 获取用户积分 | obj[1] · 0×8 401×2 |
| ✅ | 9 | POST | `/2a7d57550c39…` | 邀新榜单 | obj[1] · 0×8 401×1 |
| 🔒 | 9 | POST | `/cbca51474ccf…` | *(未命名)* | — · 405×8 401×1 |
| ⚠️ | 9 | POST | `/9c8edd2b4e0e…` | 获取积分商品详情 | — · -1×9 |
| ⚠️ | 9 | POST | `/dec922854904…` | 获取藏品详情 | — · -1×9 |
| 🔒 | 9 | POST | `/082eb0631cbc…` | 藏品编号列表 | — · -1×8 401×1 |
| ✅ | 8 | POST | `/71d2e2e52b8e…` | 获取首发订单列表 | list · 0×7 401×1 |
| 🔒 | 6 | POST | `/34c3c6a55998…` | 获取活动详情 | — · 401×3 -1×3 |
| ✅ | 6 | POST | `/f3c1774efde5…` | 获取积分商城订单列表 | obj[1] · 0×5 401×1 |
| ⚠️ | 4 | POST | `/f510bf16a3fb…` | 通知详情 | — · -1×4 |
| ✅ | 4 | POST | `/3564c6a20649…` | 获取用户钱包余额(苹果过审) | obj[1] · 0×3 401×1 |
| 🔒 | 3 | POST | `/8305f82dcf7b…` | 获取抽奖详情 | — · 401×2 -1×1 |
| ✅ | 3 | POST | `/1c6d59c47fcb…` | *(未命名)* | val[1] · 401×2 0×1 |
| ✅ | 3 | POST | `/b49e06440038…` | 市场产品专辑列表 | list[4] · 0×3 |
| ✅ | 3 | POST | `/58e3fa24c310…` | 市场产品列表 | list[4] · 0×3 |
| ✅ | 3 | POST | `/7d80fdcea4cd…` | 通知分类 | list[8] · 0×3 |
| ✅ | 3 | POST | `/9ae81883add1…` | *(未命名)* | list · 401×2 0×1 |
| ✅ | 3 | POST | `/545d9c107980…` | *(未命名)* | list[4] · 0×3 |
| ✅ | 3 | POST | `/ed613818fc6d…` | 交易记录（订单记录） | list · 0×3 |
| ✅ | 3 | POST | `/e4c399d86dce…` | 获取求购订单列表 | list · 0×3 |
| ✅ | 3 | POST | `/21fdf3c1721b…` | 获取当前用户的委托单 | list · 0×3 |
| ⚠️ | 2 | POST | `/38817aca5beb…` | *(未命名)* | — · 405×2 |
| ✅ | 2 | POST | `/c695eb48b621…` | 获取APP版本 | obj[1] · 0×2 |
| ✅ | 2 | POST | `/d0992dfbfe22…` | 获取用户抽奖得奖情况信息 | obj[1] · 401×1 0×1 |
| ✅ | 2 | POST | `/9bf0549bf6ff…` | 获取抽签列表 | obj[1] · 0×2 |
| ⚠️ | 2 | POST | `/cb5aa498e9c6…` | 盲盒详情 | — · -1×2 |
| ⚠️ | 2 | POST | `/bd169c321a63…` | *(未命名)* | — · 405×2 |
| ⚠️ | 2 | POST | `/46fc55122554…` | *(未命名)* | — · 405×2 |
| ✅ | 1 | POST | `/e981e9a89a05…` | 盲盒订单列表 | list · 0×1 |

> ✅ 取到成功数据　🔒 仅 401（需登录态）　⚠️ 405 / 其它

## 按业务域分组

### 订单 / 交易（7 个端点）

- `✅` `/4f8beda76690…` **藏品出售列表** → `(空数组)`
- `✅` `/71d2e2e52b8e…` **获取首发订单列表** → `(空数组)`
- `✅` `/f3c1774efde5…` **获取积分商城订单列表** → `list`
- `✅` `/ed613818fc6d…` **交易记录（订单记录）** → `(空数组)`
- `✅` `/e4c399d86dce…` **获取求购订单列表** → `(空数组)`
- `✅` `/21fdf3c1721b…` **获取当前用户的委托单** → `(空数组)`
- `✅` `/e981e9a89a05…` **盲盒订单列表** → `(空数组)`

### 活动 / 合成 / 抽奖（6 个端点）

- `✅` `/ca5a5a5a7780…` **获取活动列表** → `compose_id, title, status, start_time, end_time, total_number, cover_img, conditions, activity_type,`
- `🔒` `/34c3c6a55998…` **获取活动详情** → *(无数据)*
- `🔒` `/8305f82dcf7b…` **获取抽奖详情** → *(无数据)*
- `✅` `/d0992dfbfe22…` **获取用户抽奖得奖情况信息** → `total, per_page, current_page, last_page, data, has_more`
- `✅` `/9bf0549bf6ff…` **获取抽签列表** → `total, per_page, current_page, last_page, data, has_more`
- `🔒` `/cb5aa498e9c6…` **盲盒详情** → *(无数据)*

### 其它（4 个端点）

- `✅` `/86a850ffde83…` **获取用户的藏品编码** → `(空数组)`
- `✅` `/b820c1a92ad8…` **获取字段** → `goods_type, mall_type`
- `🔒` `/082eb0631cbc…` **藏品编号列表** → *(无数据)*
- `✅` `/c695eb48b621…` **获取APP版本** → `Android, Ios`

### 市场 / 行情（4 个端点）

- `✅` `/55566f961c62…` **获取藏品列表** → `id, title, cover_img, total_number, price, tag, status, sale_date, is_priority, priority_time, type,`
- `🔒` `/dec922854904…` **获取藏品详情** → *(无数据)*
- `✅` `/b49e06440038…` **市场产品专辑列表** → `album, id, pid`
- `✅` `/58e3fa24c310…` **市场产品列表** → `id, collection_id, price, yesterday_price, increase_rate, sale_num, today_sale_num, floor_price, tit`

### 钱包 / 积分（4 个端点）

- `✅` `/07f41a28fa94…` **获取积分商品列表** → `(空数组)`
- `✅` `/5aa9af94b66d…` **获取用户积分** → `integral`
- `🔒` `/9c8edd2b4e0e…` **获取积分商品详情** → *(无数据)*
- `✅` `/3564c6a20649…` **获取用户钱包余额(苹果过审)** → `wallet_money, tocard`

### 公告 / 内容（3 个端点）

- `✅` `/08eec40a5e71…` **通知列表** → `id, title, desc, cover_img, url, collection_id, update_time, category_name, category_id, is_follow, `
- `🔒` `/f510bf16a3fb…` **通知详情** → *(无数据)*
- `✅` `/7d80fdcea4cd…` **通知分类** → `id, name, sort, parent_id, category_type, child`

### 邀请 / 推广（3 个端点）

- `✅` `/881b6ffc21b2…` **邀请记录(邀请的人员)** → `(空数组)`
- `✅` `/9d107fbf20a8…` **获取邀请信息** → `user_id, invite_code, invite_url, success_count`
- `✅` `/2a7d57550c39…` **邀新榜单** → `list`

### 用户 / 账户（2 个端点）

- `✅` `/f3a0536111f2…` **获取用户信息** → `id, open_id, avatar, username, nickname, mobile, user_level_id, status, id_card, sex, is_realname, t`
- `✅` `/4ac3dc652534…` **获取用户地址列表** → `(空数组)`

### 未识别（9 个端点）

- `✅` `/a3861807072a…` **未命名** → `false`
- `🔒` `/55b4885be663…` **未命名** → *(无数据)*
- `🔒` `/cbca51474ccf…` **未命名** → *(无数据)*
- `✅` `/1c6d59c47fcb…` **未命名** → `0`
- `✅` `/9ae81883add1…` **未命名** → `(空数组)`
- `✅` `/545d9c107980…` **未命名** → `collection_id, num, price, title, total_number, mall_number, cover_img, is_follow`
- `🔒` `/38817aca5beb…` **未命名** → *(无数据)*
- `🔒` `/bd169c321a63…` **未命名** → *(无数据)*
- `🔒` `/46fc55122554…` **未命名** → *(无数据)*

## 成功响应样例（可直接用于 mock）

### 获取用户信息

- 端点：`POST https://api.shenyuan.sc.cn/f3a0536111f2a4f130897f36b86274d8`
- 结构：`obj` 字段：`id, open_id, avatar, username, nickname, mobile, user_level_id, status, id_card, sex, is_realname, ti_user_pub_address, transaction_status, unlock_time, create_time, update_time, delete_time, acct_id, hf_user_id, wallet_member_no, is_account_pay, biz_user_no, sumpay_id, open_account_time, invite_code, is_distributor, distributor_id, jpush_registration_id`

```json
{"id":379722,"open_id":"01a10f2b-9314-72b5-a16d-98271413668b","avatar":"","username":"**绵","nickname":"爱卡xb5PqY36","mobile":"17587881293","user_level_id":3,"status":1,"id_card":"5202*********79838","sex":null,"is_realname":1,"ti_user_pub_address":"70ff296394a1
```

### 通知列表

- 端点：`POST https://api.shenyuan.sc.cn/08eec40a5e71684b834dcf97d4ca78ef`
- 结构：`list` 字段：`id, title, desc, cover_img, url, collection_id, update_time, category_name, category_id, is_follow, collections`

```json
{"list":[{"id":153,"title":"【爱卡合成公告】iCard爱卡平台奶奶有道理系列藏品《慢行致远》合成活动来袭！","desc":"","cover_img":"/upload/014670993c94be10445946388f2b610062dfa5b4.png","url":"","collection_id":"1181","update_time":"2026-10-06 21:44:47","category_name":"合成公告","category_id":21,"is_fo
```

### 未命名 · code=0

- 端点：`POST https://api.shenyuan.sc.cn/a3861807072a0b127fa6abc78da6bfbd`
- 结构：`val` 字段：`false`

```json
false
```

### 邀请记录(邀请的人员)

- 端点：`POST https://api.shenyuan.sc.cn/881b6ffc21b261bde7ffed940055a1be`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[],"total":0}
```

### 获取用户地址列表

- 端点：`POST https://api.shenyuan.sc.cn/4ac3dc652534f9ffd98330415a943d17`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取用户的藏品编码

- 端点：`POST https://api.shenyuan.sc.cn/86a850ffde83c58f09e1c47aa90da9ee`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[],"total":0}
```

### 获取邀请信息

- 端点：`POST https://api.shenyuan.sc.cn/9d107fbf20a8b699a8f12e51a2f63e4d`
- 结构：`obj` 字段：`user_id, invite_code, invite_url, success_count`

```json
{"user_id":379722,"invite_code":"S389722","invite_url":"/#/pages/login/register?invite_code=S389722","success_count":0}
```

### 获取活动列表

- 端点：`POST https://api.shenyuan.sc.cn/ca5a5a5a7780b873283c8936bae07b02`
- 结构：`list` 字段：`compose_id, title, status, start_time, end_time, total_number, cover_img, conditions, activity_type, compose_status`

```json
{"list":[{"compose_id":50,"title":"【运粮鼠】限量合成通道二","status":2,"start_time":"2026-10-06 19:10:00","end_time":"2026-10-06 20:10:00","total_number":100,"cover_img":"/upload/3df504960e882648dc0b96be33fadf1aeb059ec4.jpg","conditions":[{"group_code":"1","group_name":"
```

### 获取字段

- 端点：`POST https://api.shenyuan.sc.cn/b820c1a92ad8768ddb71367fe1dc5ecc`
- 结构：`obj` 字段：`goods_type, mall_type`

```json
{"goods_type":[{"id":"019fccb4-54c5-71bc-969c-cf39cc7a9946","type_id":49,"label":"爱卡好物","value":"2","code":"goods_type","sort":17,"status":1,"remark":""},{"id":"019fccb4-416b-71bb-a583-dd6785fd82e0","type_id":49,"label":"数字艺术","value":"1","code":"goods_type","
```

### 获取藏品列表

- 端点：`POST https://api.shenyuan.sc.cn/55566f961c62a4f9a049c7410e41ba6d`
- 结构：`list` 字段：`id, title, cover_img, total_number, price, tag, status, sale_date, is_priority, priority_time, type, sort`

```json
{"list":[{"id":1170,"title":"ICARD联名高端定制手机壳iPhone","cover_img":"/upload/f6746c2b2cf5254376c8958f1bc8780955ae168c.png","total_number":110,"price":19.9,"tag":[],"status":2,"sale_date":"2026-08-14 23:20:38","is_priority":null,"priority_time":null,"type":0,"sort":
```

### 藏品出售列表

- 端点：`POST https://api.shenyuan.sc.cn/4f8beda76690061ebfd67f96acdb72f2`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取积分商品列表

- 端点：`POST https://api.shenyuan.sc.cn/07f41a28fa94f462abece40c547b74fe`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取用户积分

- 端点：`POST https://api.shenyuan.sc.cn/5aa9af94b66dd3561c9abc9c0329dd53`
- 结构：`obj` 字段：`integral`

```json
{"integral":0}
```

### 邀新榜单

- 端点：`POST https://api.shenyuan.sc.cn/2a7d57550c39c44542012a40013218cd`
- 结构：`obj` 字段：`list`

```json
{"list":false}
```

### 获取首发订单列表

- 端点：`POST https://api.shenyuan.sc.cn/71d2e2e52b8ed1a0caa552609833902d`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取积分商城订单列表

- 端点：`POST https://api.shenyuan.sc.cn/f3c1774efde57471a60e9f54ece1c1f9`
- 结构：`obj` 字段：`list`

```json
{"list":{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false}}
```

### 获取用户钱包余额(苹果过审)

- 端点：`POST https://api.shenyuan.sc.cn/3564c6a20649bed8da111e14ec0454bc`
- 结构：`obj` 字段：`wallet_money, tocard`

```json
{"wallet_money":"0.00","tocard":0}
```

### 未命名 · code=0

- 端点：`POST https://api.shenyuan.sc.cn/1c6d59c47fcbfd32a789561179afcc12`
- 结构：`val` 字段：`0`

```json
0
```

### 市场产品专辑列表

- 端点：`POST https://api.shenyuan.sc.cn/b49e064400387c33eca13853a6c1a568`
- 结构：`list` 字段：`album, id, pid`

```json
{"list":[{"album":"小试牛刀","id":18,"pid":0},{"album":"初露锋芒","id":23,"pid":0},{"album":"大显身手","id":24,"pid":0},{"album":"一鸣惊人","id":25,"pid":0}]}
```

### 市场产品列表

- 端点：`POST https://api.shenyuan.sc.cn/58e3fa24c3107a4e8c83cea4092a3a62`
- 结构：`list` 字段：`id, collection_id, price, yesterday_price, increase_rate, sale_num, today_sale_num, floor_price, title, cover_img, total_number, mall_number, limit_price, contract_address, album_id, transaction_status, sale_number, is_follow`

```json
{"list":[{"id":42,"collection_id":1179,"price":138,"yesterday_price":"138.00","increase_rate":0,"sale_num":549,"today_sale_num":195,"floor_price":"- -","title":"拳击小子001","cover_img":"/upload/a2ff31cdf75776b14e0874c6ac449ac18d54536e.png","total_number":12000,"m
```

### 通知分类

- 端点：`POST https://api.shenyuan.sc.cn/7d80fdcea4cd16f3e1147b1f2cb0091f`
- 结构：`list` 字段：`id, name, sort, parent_id, category_type, child`

```json
{"list":[{"id":22,"name":"寄售公告","sort":1,"parent_id":2,"category_type":2,"child":[]},{"id":19,"name":"上新公告","sort":1,"parent_id":2,"category_type":2,"child":[]},{"id":20,"name":"活动公告","sort":1,"parent_id":2,"category_type":2,"child":[]},{"id":23,"name":"运营公告",
```

### 未命名 · code=0

- 端点：`POST https://api.shenyuan.sc.cn/9ae81883add102930378722e7be2b030`
- 结构：`list` 字段：`(空数组)`

```json
[]
```

### 未命名 · code=0

- 端点：`POST https://api.shenyuan.sc.cn/545d9c10798048bb0993cfd05a765c39`
- 结构：`list` 字段：`collection_id, num, price, title, total_number, mall_number, cover_img, is_follow`

```json
[{"collection_id":1183,"num":4325,"price":6,"title":"艾卡德-学习","total_number":50000,"mall_number":8890,"cover_img":"/upload/861bfe33d903a1fc7808f503e302b14e77f07ce1.png","is_follow":0},{"collection_id":1181,"num":1132,"price":38,"title":"花香蝶自来","total_number":20
```

### 交易记录（订单记录）

- 端点：`POST https://api.shenyuan.sc.cn/ed613818fc6d884fb08b7c9ab2b68585`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取求购订单列表

- 端点：`POST https://api.shenyuan.sc.cn/e4c399d86dce4dd2ccf314caaa717365`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取当前用户的委托单

- 端点：`POST https://api.shenyuan.sc.cn/21fdf3c1721bcb3336f0aeb378e2b0ca`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

### 获取APP版本

- 端点：`POST https://api.shenyuan.sc.cn/c695eb48b6213b83ca5e5080758bd8af`
- 结构：`obj` 字段：`Android, Ios`

```json
{"Android":{"id":3,"title":"最新更新","description":"<p>最新更新</p>","version":"1.0.2","sort":12,"url":" /app/1.2.3.apk","full_url":" /app/1.2.3.apk","is_ios":null,"is_android":null,"platform":"Android","update_type":"forcibly","status":1,"is_canary_release":1,"creat
```

### 获取用户抽奖得奖情况信息

- 端点：`POST https://api.shenyuan.sc.cn/d0992dfbfe22e1bc326bbf58c5d2cc35`
- 结构：`obj` 字段：`total, per_page, current_page, last_page, data, has_more`

```json
{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false}
```

### 获取抽签列表

- 端点：`POST https://api.shenyuan.sc.cn/9bf0549bf6ffba03ea68656ca2166a29`
- 结构：`obj` 字段：`total, per_page, current_page, last_page, data, has_more`

```json
{"total":0,"per_page":10,"current_page":1,"last_page":0,"data":[],"has_more":false}
```

### 盲盒订单列表

- 端点：`POST https://api.shenyuan.sc.cn/e981e9a89a0544b4e06672533af1da1c`
- 结构：`list` 字段：`(空数组)`

```json
{"list":[]}
```

## 未识别端点（响应体无 method 字段）

- `/a3861807072a0b127fa6abc78da6bfbd` — 0×35 · 样例 `false`
- `/55b4885be663b47eaeed9a8b46d34de5` — 405×14
- `/cbca51474ccfc272cc4c9cd643387bc1` — 405×8 401×1
- `/1c6d59c47fcbfd32a789561179afcc12` — 401×2 0×1 · 样例 `0`
- `/9ae81883add102930378722e7be2b030` — 401×2 0×1 · 样例 `[]`
- `/545d9c10798048bb0993cfd05a765c39` — 0×3 · 样例 `[{"collection_id":1183,"num":4325,"price":6,"title":"艾卡德-学习","total_number":50000,"mall_number":8890,"cover_img":"/uploa`
- `/38817aca5beb8991bc8f66360ba8ef71` — 405×2
- `/bd169c321a631664c052a1033922134b` — 405×2
- `/46fc5512255492377e322895d8011e98` — 405×2

## 二次开发用法

1. **Mock server**：把 `assets/api-cache/*.json` 按 `method` 字段建索引，直接起 Express 返回。
2. **字段定义**：上表「响应结构」列即为真实字段，可直接生成 TypeScript interface。
3. **分页约定**：存在两种信封 —— `{"list":[...]}` 与 `{"list":{total,per_page,current_page,last_page,data,has_more}}`，需兼容。
4. **鉴权**：Bearer token 存 localStorage，缺失即返回 `{"code":401,"msg":"用户信息不存在，请重新登录!"}`。
5. **签名**：请求体为加密签名体（`trans_id` + `timestamp` + `sign`），若要自建网关需逆向其加解密。

## 缺口说明

- **无管理后台 API**：该平台未暴露可访问的管理后台（admin / manage / backend 域名均不解析，前端 97 路由无任何后台入口）。
- **端点哈希无法穷举**：JS 经混淆，端点哈希不在明文中，清单只能通过网络触发获得。
- **零数据账号**：该账号订单 / 持仓 / 地址均为空，部分列表类接口只能拿到信封拿不到行内字段。
