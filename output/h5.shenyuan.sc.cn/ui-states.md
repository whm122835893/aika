# UI 状态补抓报告（Toast / 弹窗 / 确认框 / 浮层）

> 生成时间：2026-10-07 16:22:24  
> 方式：带登录态真机（iPhone 12 模拟）逐页真实点击可点击元素，捕获点击后新出现的浮层并截图。

## 汇总

| 指标 | 数量 |
|---|--:|
| 参与页面 | 93 |
| 实际点击次数 | 399 |
| 捕获 UI 状态 | 202 |
| 去重后状态种类 | 69 |
| 截图张数 | 29 |
| 有状态的页面 | 79 |
| 无状态页面 | 14 |

## 按类型分布

| 类型 | 说明 | 命中次数 | 去重 | 有截图 |
|---|---|--:|--:|--:|
| `nav` | 路由跳转 | 123 | 26 | 0 |
| `api` | 静默请求(无 UI 反馈) | 36 | 15 | 0 |
| `uni-toast` | Toast 轻提示 | 35 | 20 | 21 |
| `custom` | 自定义浮层 | 7 | 7 | 7 |
| `uni-modal` | Modal 确认框 | 1 | 1 | 1 |

## 已捕获的 UI 状态（含截图）

### 1. 暂无消息

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/Announcement/Announcement`
- 触发元素：系统消息
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_Announcement_Announcement__uni-toast__%E6%9A%82%E6%97%A0%E6%B6%88%E6%81%AF.png`

![暂无消息](ui-states/pages_Announcement_Announcement__uni-toast__%E6%9A%82%E6%97%A0%E6%B6%88%E6%81%AF.png)

### 2. 请输入手机号

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/account/safePass`
- 触发元素：确认
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_safePass__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E6%89%8B%E6%9C%BA%E5%8F%B7.png`

![请输入手机号](ui-states/pages_account_safePass__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E6%89%8B%E6%9C%BA%E5%8F%B7.png)

### 3. 请输入正确的手机号

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/account/safePass`
- 触发元素：获取验证码
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_safePass__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%B7.png`

![请输入正确的手机号](ui-states/pages_account_safePass__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%B7.png)

### 4. QQ号已复制

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/account/service`
- 触发元素：客服 QQ： 2059629312
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_service__uni-toast__QQ%E5%8F%B7%E5%B7%B2%E5%A4%8D%E5%88%B6.png`

![QQ号已复制](ui-states/pages_account_service__uni-toast__QQ%E5%8F%B7%E5%B7%B2%E5%A4%8D%E5%88%B6.png)

### 5. 邮箱已复制

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/account/service`
- 触发元素：客服邮箱： 2059629312@qq.com
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_service__uni-toast__%E9%82%AE%E7%AE%B1%E5%B7%B2%E5%A4%8D%E5%88%B6.png`

![邮箱已复制](ui-states/pages_account_service__uni-toast__%E9%82%AE%E7%AE%B1%E5%B7%B2%E5%A4%8D%E5%88%B6.png)

### 6. 提示 注销后账号数据将无法恢复，确定要注销吗？ 取消 注销

- 类型：`uni-modal`（Modal 确认框）
- 页面：`/pages/account/setting`
- 触发元素：注销账号
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_setting__uni-modal__%E6%8F%90%E7%A4%BA_%E6%B3%A8%E9%94%80%E5%90%8E%E8%B4%A6%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%B0%86%E6%97%A0%E6%B3%95%E6%81%A2%E5%A4%8D%EF%BC%8C%E7%A1%AE%E5%AE%9A%E8%A6%81%E6%B3%A8%E9%94%80%E5%90%97%EF%BC%9F_%E5%8F%96%E6%B6%88_%E6%B3%A8%E9%94%80.png`

![提示 注销后账号数据将无法恢复，确定要注销吗？ 取消 注销](ui-states/pages_account_setting__uni-modal__%E6%8F%90%E7%A4%BA_%E6%B3%A8%E9%94%80%E5%90%8E%E8%B4%A6%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%B0%86%E6%97%A0%E6%B3%95%E6%81%A2%E5%A4%8D%EF%BC%8C%E7%A1%AE%E5%AE%9A%E8%A6%81%E6%B3%A8%E9%94%80%E5%90%97%EF%BC%9F_%E5%8F%96%E6%B6%88_%E6%B3%A8%E9%94%80.png)

### 7. 提示 注销后账号数据将无法恢复，确定要注销吗？ 取消 注销

- 类型：`custom`（自定义浮层）
- 页面：`/pages/account/setting`
- 触发元素：注销账号
- 浮层尺寸：300x172
- 出现次数：1
- 截图：`ui-states/pages_account_setting__custom__%E6%8F%90%E7%A4%BA_%E6%B3%A8%E9%94%80%E5%90%8E%E8%B4%A6%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%B0%86%E6%97%A0%E6%B3%95%E6%81%A2%E5%A4%8D%EF%BC%8C%E7%A1%AE%E5%AE%9A%E8%A6%81%E6%B3%A8%E9%94%80%E5%90%97%EF%BC%9F_%E5%8F%96%E6%B6%88_%E6%B3%A8%E9%94%80.png`

![提示 注销后账号数据将无法恢复，确定要注销吗？ 取消 注销](ui-states/pages_account_setting__custom__%E6%8F%90%E7%A4%BA_%E6%B3%A8%E9%94%80%E5%90%8E%E8%B4%A6%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%B0%86%E6%97%A0%E6%B3%95%E6%81%A2%E5%A4%8D%EF%BC%8C%E7%A1%AE%E5%AE%9A%E8%A6%81%E6%B3%A8%E9%94%80%E5%90%97%EF%BC%9F_%E5%8F%96%E6%B6%88_%E6%B3%A8%E9%94%80.png)

### 8. 提示

- 类型：`custom`（自定义浮层）
- 页面：`/pages/account/setting`
- 触发元素：注销账号
- 浮层尺寸：300x43
- 出现次数：1
- 截图：`ui-states/pages_account_setting__custom__%E6%8F%90%E7%A4%BA.png`

![提示](ui-states/pages_account_setting__custom__%E6%8F%90%E7%A4%BA.png)

### 9. 注销后账号数据将无法恢复，确定要注销吗？

- 类型：`custom`（自定义浮层）
- 页面：`/pages/account/setting`
- 触发元素：注销账号
- 浮层尺寸：300x81
- 出现次数：1
- 截图：`ui-states/pages_account_setting__custom__%E6%B3%A8%E9%94%80%E5%90%8E%E8%B4%A6%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%B0%86%E6%97%A0%E6%B3%95%E6%81%A2%E5%A4%8D%EF%BC%8C%E7%A1%AE%E5%AE%9A%E8%A6%81%E6%B3%A8%E9%94%80%E5%90%97%EF%BC%9F.png`

![注销后账号数据将无法恢复，确定要注销吗？](ui-states/pages_account_setting__custom__%E6%B3%A8%E9%94%80%E5%90%8E%E8%B4%A6%E5%8F%B7%E6%95%B0%E6%8D%AE%E5%B0%86%E6%97%A0%E6%B3%95%E6%81%A2%E5%A4%8D%EF%BC%8C%E7%A1%AE%E5%AE%9A%E8%A6%81%E6%B3%A8%E9%94%80%E5%90%97%EF%BC%9F.png)

### 10. 取消 注销

- 类型：`custom`（自定义浮层）
- 页面：`/pages/account/setting`
- 触发元素：注销账号
- 浮层尺寸：300x48
- 出现次数：1
- 截图：`ui-states/pages_account_setting__custom__%E5%8F%96%E6%B6%88_%E6%B3%A8%E9%94%80.png`

![取消 注销](ui-states/pages_account_setting__custom__%E5%8F%96%E6%B6%88_%E6%B3%A8%E9%94%80.png)

### 11. 复制成功

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/account/user`
- 触发元素：—
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_user__uni-toast__%E5%A4%8D%E5%88%B6%E6%88%90%E5%8A%9F.png`

![复制成功](ui-states/pages_account_user__uni-toast__%E5%A4%8D%E5%88%B6%E6%88%90%E5%8A%9F.png)

### 12. 请填写收货人姓名

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/address/add`
- 触发元素：保存
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_address_add__uni-toast__%E8%AF%B7%E5%A1%AB%E5%86%99%E6%94%B6%E8%B4%A7%E4%BA%BA%E5%A7%93%E5%90%8D.png`

![请填写收货人姓名](ui-states/pages_address_add__uni-toast__%E8%AF%B7%E5%A1%AB%E5%86%99%E6%94%B6%E8%B4%A7%E4%BA%BA%E5%A7%93%E5%90%8D.png)

### 13. 活动未开始

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/colorfulMix/colorfulMix`
- 触发元素：—
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_colorfulMix_colorfulMix__uni-toast__%E6%B4%BB%E5%8A%A8%E6%9C%AA%E5%BC%80%E5%A7%8B.png`

![活动未开始](ui-states/pages_colorfulMix_colorfulMix__uni-toast__%E6%B4%BB%E5%8A%A8%E6%9C%AA%E5%BC%80%E5%A7%8B.png)

### 14. 合成数量不足

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/colorfulMix/details`
- 触发元素：确认
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_colorfulMix_details__uni-toast__%E5%90%88%E6%88%90%E6%95%B0%E9%87%8F%E4%B8%8D%E8%B6%B3.png`

![合成数量不足](ui-states/pages_colorfulMix_details__uni-toast__%E5%90%88%E6%88%90%E6%95%B0%E9%87%8F%E4%B8%8D%E8%B6%B3.png)

### 15. 暂无抽奖活动

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/drawPrize/drawPrize`
- 触发元素：—
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_drawPrize_drawPrize__uni-toast__%E6%9A%82%E6%97%A0%E6%8A%BD%E5%A5%96%E6%B4%BB%E5%8A%A8.png`

![暂无抽奖活动](ui-states/pages_drawPrize_drawPrize__uni-toast__%E6%9A%82%E6%97%A0%E6%8A%BD%E5%A5%96%E6%B4%BB%E5%8A%A8.png)

### 16. 正在下载

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/invite/invite`
- 触发元素：保存二维码
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_invite_invite__uni-toast__%E6%AD%A3%E5%9C%A8%E4%B8%8B%E8%BD%BD.png`

![正在下载](ui-states/pages_invite_invite__uni-toast__%E6%AD%A3%E5%9C%A8%E4%B8%8B%E8%BD%BD.png)

### 17. page不能为空

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/invite/list`
- 触发元素：去邀请
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_invite_list__uni-toast__page%E4%B8%8D%E8%83%BD%E4%B8%BA%E7%A9%BA.png`

![page不能为空](ui-states/pages_invite_list__uni-toast__page%E4%B8%8D%E8%83%BD%E4%B8%BA%E7%A9%BA.png)

### 18. 请输入账号

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/login/login`
- 触发元素：登录
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_login_login__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E8%B4%A6%E5%8F%B7.png`

![请输入账号](ui-states/pages_login_login__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E8%B4%A6%E5%8F%B7.png)

### 19. 请输入购买数量

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/market/batchBuy`
- 触发元素：立即购买
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_market_batchBuy__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E8%B4%AD%E4%B9%B0%E6%95%B0%E9%87%8F.png`

![请输入购买数量](ui-states/pages_market_batchBuy__uni-toast__%E8%AF%B7%E8%BE%93%E5%85%A5%E8%B4%AD%E4%B9%B0%E6%95%B0%E9%87%8F.png)

### 20. product_id不能为空

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/market/confirmorder`
- 触发元素：立即购买
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_market_confirmorder__uni-toast__product_id%E4%B8%8D%E8%83%BD%E4%B8%BA%E7%A9%BA.png`

![product_id不能为空](ui-states/pages_market_confirmorder__uni-toast__product_id%E4%B8%8D%E8%83%BD%E4%B8%BA%E7%A9%BA.png)

### 21. 暂未开放

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/market/physicalGoodsDetails`
- 触发元素：立即购买
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_market_physicalGoodsDetails__uni-toast__%E6%9A%82%E6%9C%AA%E5%BC%80%E6%94%BE.png`

![暂未开放](ui-states/pages_market_physicalGoodsDetails__uni-toast__%E6%9A%82%E6%9C%AA%E5%BC%80%E6%94%BE.png)

### 22. 置换数量不足

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/mix/details`
- 触发元素：确认
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_mix_details__uni-toast__%E7%BD%AE%E6%8D%A2%E6%95%B0%E9%87%8F%E4%B8%8D%E8%B6%B3.png`

![置换数量不足](ui-states/pages_mix_details__uni-toast__%E7%BD%AE%E6%8D%A2%E6%95%B0%E9%87%8F%E4%B8%8D%E8%B6%B3.png)

### 23. 分解数量不足

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/salvage/details`
- 触发元素：确认
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_salvage_details__uni-toast__%E5%88%86%E8%A7%A3%E6%95%B0%E9%87%8F%E4%B8%8D%E8%B6%B3.png`

![分解数量不足](ui-states/pages_salvage_details__uni-toast__%E5%88%86%E8%A7%A3%E6%95%B0%E9%87%8F%E4%B8%8D%E8%B6%B3.png)

### 24. 正在加载

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/wallet/wallet1`
- 触发元素：—
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_wallet_wallet1__uni-toast__%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD.png`

![正在加载](ui-states/pages_wallet_wallet1__uni-toast__%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD.png)

### 25. 复制成功

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/account/invite`
- 触发元素：—
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_account_invite__uni-toast__%E5%A4%8D%E5%88%B6%E6%88%90%E5%8A%9F.png`

![复制成功](ui-states/pages_account_invite__uni-toast__%E5%A4%8D%E5%88%B6%E6%88%90%E5%8A%9F.png)

### 26. 北京 天津 河北省 山西省 内蒙古自治区 辽宁省 吉林省 黑龙江省 上海 江苏省 浙江省 安徽省 福建省 江西省 山东省

- 类型：`custom`（自定义浮层）
- 页面：`/pages/address/address`
- 触发元素：添加收货地址
- 浮层尺寸：390x400
- 出现次数：1
- 截图：`ui-states/pages_address_address__custom__%E5%8C%97%E4%BA%AC_%E5%A4%A9%E6%B4%A5_%E6%B2%B3%E5%8C%97%E7%9C%81_%E5%B1%B1%E8%A5%BF%E7%9C%81_%E5%86%85%E8%92%99%E5%8F%A4%E8%87%AA%E6%B2%BB%E5%8C%BA_%E8%BE%BD%E5%AE%81%E7%9C%81_%E5%90%89%E6%9E%97%E7%9C%81_%E9%BB%91%E9%BE%99%E6%B1%9F%E7%9C%81_%E4%B8%8A%E6%B5%B7_%E6%B1%9F%E8%8B%8F%E7%9C%81.png`

![北京 天津 河北省 山西省 内蒙古自治区 辽宁省 吉林省 黑](ui-states/pages_address_address__custom__%E5%8C%97%E4%BA%AC_%E5%A4%A9%E6%B4%A5_%E6%B2%B3%E5%8C%97%E7%9C%81_%E5%B1%B1%E8%A5%BF%E7%9C%81_%E5%86%85%E8%92%99%E5%8F%A4%E8%87%AA%E6%B2%BB%E5%8C%BA_%E8%BE%BD%E5%AE%81%E7%9C%81_%E5%90%89%E6%9E%97%E7%9C%81_%E9%BB%91%E9%BE%99%E6%B1%9F%E7%9C%81_%E4%B8%8A%E6%B5%B7_%E6%B1%9F%E8%8B%8F%E7%9C%81.png)

### 27. 北京市

- 类型：`custom`（自定义浮层）
- 页面：`/pages/address/address`
- 触发元素：添加收货地址
- 浮层尺寸：130x400
- 出现次数：1
- 截图：`ui-states/pages_address_address__custom__%E5%8C%97%E4%BA%AC%E5%B8%82.png`

![北京市](ui-states/pages_address_address__custom__%E5%8C%97%E4%BA%AC%E5%B8%82.png)

### 28. 东城区 西城区 朝阳区 丰台区 石景山区 海淀区 门头沟区 房山区 通州区 顺义区 昌平区 大兴区 怀柔区 平谷区 密云

- 类型：`custom`（自定义浮层）
- 页面：`/pages/address/address`
- 触发元素：添加收货地址
- 浮层尺寸：130x925
- 出现次数：1
- 截图：`ui-states/pages_address_address__custom__%E4%B8%9C%E5%9F%8E%E5%8C%BA_%E8%A5%BF%E5%9F%8E%E5%8C%BA_%E6%9C%9D%E9%98%B3%E5%8C%BA_%E4%B8%B0%E5%8F%B0%E5%8C%BA_%E7%9F%B3%E6%99%AF%E5%B1%B1%E5%8C%BA_%E6%B5%B7%E6%B7%80%E5%8C%BA_%E9%97%A8%E5%A4%B4%E6%B2%9F%E5%8C%BA_%E6%88%BF%E5%B1%B1%E5%8C%BA_%E9%80%9A%E5%B7%9E%E5%8C%BA_%E9%A1%BA%E4%B9%89.png`

![东城区 西城区 朝阳区 丰台区 石景山区 海淀区 门头沟区 ](ui-states/pages_address_address__custom__%E4%B8%9C%E5%9F%8E%E5%8C%BA_%E8%A5%BF%E5%9F%8E%E5%8C%BA_%E6%9C%9D%E9%98%B3%E5%8C%BA_%E4%B8%B0%E5%8F%B0%E5%8C%BA_%E7%9F%B3%E6%99%AF%E5%B1%B1%E5%8C%BA_%E6%B5%B7%E6%B7%80%E5%8C%BA_%E9%97%A8%E5%A4%B4%E6%B2%9F%E5%8C%BA_%E6%88%BF%E5%B1%B1%E5%8C%BA_%E9%80%9A%E5%B7%9E%E5%8C%BA_%E9%A1%BA%E4%B9%89.png)

### 29. 请先选择您要出售的藏品

- 类型：`uni-toast`（Toast 轻提示）
- 页面：`/pages/market/bidDetail`
- 触发元素：确认出售
- 浮层尺寸：390x664
- 出现次数：1
- 截图：`ui-states/pages_market_bidDetail__uni-toast__%E8%AF%B7%E5%85%88%E9%80%89%E6%8B%A9%E6%82%A8%E8%A6%81%E5%87%BA%E5%94%AE%E7%9A%84%E8%97%8F%E5%93%81.png`

![请先选择您要出售的藏品](ui-states/pages_market_bidDetail__uni-toast__%E8%AF%B7%E5%85%88%E9%80%89%E6%8B%A9%E6%82%A8%E8%A6%81%E5%87%BA%E5%94%AE%E7%9A%84%E8%97%8F%E5%93%81.png)

## 未截图的状态（重复出现，已有代表图）

| 类型 | 文本 | 页面 | 次数 |
|---|---|---|--:|
| `uni-toast` | 暂无消息 | `/pages/Announcement/Announcement` | 6 |
| `uni-toast` | 活动未开始 | `/pages/drawPrize/drawPrize` | 3 |
| `uni-toast` | 复制成功 | `/pages/invite/invite` | 3 |
| `uni-toast` | 请输入手机号 | `/pages/login/register` | 3 |
| `uni-toast` | 请输入正确的手机号 | `/pages/login/register` | 3 |
| `uni-toast` | product_id不能为空 | `/pages/market/details` | 2 |

## 点击引发的路由跳转

| 页面 | 触发元素 | 跳转到 |
|---|---|---|
| `/pages/Discussion/Discussion` |  | `#/` |
| `/pages/account/InviteRankingList` | — | `#/pages/home/home` |
| `/pages/account/about` | — | `#/pages/home/home` |
| `/pages/account/about` | 用户协议 | `#/pages/webview/Policy?type=1` |
| `/pages/account/about` | 隐私政策 | `#/pages/webview/Policy?type=2` |
| `/pages/account/about` | 联系客服 | `#/pages/account/service` |
| `/pages/account/about` | 用户协议 隐私政策 联系客服 | `#/pages/webview/Policy?type=2` |
| `/pages/account/about` | 用户协议 | `#/pages/webview/Policy?type=1` |
| `/pages/account/about` | 隐私政策 | `#/pages/webview/Policy?type=2` |
| `/pages/account/about` | 联系客服 | `#/pages/account/service` |
| `/pages/account/account` | — | `#/pages/account/user` |
| `/pages/account/account` | 首发 | `#/pages/account/orderList?isTabs=1` |
| `/pages/account/account` | 市场 | `#/pages/account/orderList?isTabs=2` |
| `/pages/account/account` | 求购 | `#/pages/account/orderList?isTabs=4` |
| `/pages/account/account` | 委托 | `#/pages/account/orderList?isTabs=7` |
| `/pages/account/account` | 账号安全 | `#/pages/account/setting` |
| `/pages/account/account` | 我的钱包 | `#/pages/wallet/wallet` |
| `/pages/account/account` | 我的收藏 | `#/pages/account/collections` |
| `/pages/account/bidList` |  | `#/` |
| `/pages/account/collections` | — | `#/pages/home/home` |
| `/pages/account/community` |  | `#/` |
| `/pages/account/increase` |  | `#/` |
| `/pages/account/marketOrderList` |  | `#/` |
| `/pages/account/nickname` |  | `#/` |
| `/pages/account/order` | — | `#/pages/home/home` |
| `/pages/account/orderList` | — | `#/pages/home/home` |
| `/pages/account/physicalOrderList` | — | `#/pages/home/home` |
| `/pages/account/privacy` | — | `#/pages/home/home` |
| `/pages/account/privacy` | 设置操作密码 | `#/pages/account/safePass` |
| `/pages/account/privacy` | 找回密码 | `#/pages/login/forget` |
| `/pages/account/realname` | — | `#/pages/home/home` |
| `/pages/account/realname` | 返回 | `#/pages/home/home` |
| `/pages/account/safePass` | — | `#/pages/home/home` |
| `/pages/account/saleList` | — | `#/pages/home/home` |
| `/pages/account/service` | — | `#/pages/home/home` |
| `/pages/account/setting` | — | `#/pages/home/home` |
| `/pages/account/setting` | 实名认证 | `#/pages/account/realname` |
| `/pages/account/setting` | 设置支付密码 | `#/pages/account/safePass` |
| `/pages/account/setting` | 重置登录密码 | `#/pages/login/forget` |
| `/pages/account/user` | — | `#/pages/home/home` |
| `/pages/activity/activity` | — | `#/pages/home/home` |
| `/pages/address/add` | — | `#/pages/home/home` |
| `/pages/colorfulMix/colorfulMix` | 抽签活动 限量藏品资格抽取 | `#/pages/drawlots/drawlots` |
| `/pages/colorfulMix/colorfulMix` | 积分商城 商城兑好礼 | `#/pages/integral/integral` |
| `/pages/colorfulMix/colorfulMix` | — | `#/pages/account/invite` |
| `/pages/colorfulMix/colorfulMix` | 首页 | `#/pages/home/home` |
| `/pages/colorfulMix/community` | — | `#/pages/home/home` |
| `/pages/colorfulMix/details` | — | `#/pages/home/home` |
| `/pages/colorfulMix/group` | — | `#/pages/home/home` |
| `/pages/colorfulMix/result` |  | `#/` |
| `/pages/common/emptyPage` | — | `#/pages/home/home` |
| `/pages/community/community` | — | `#/pages/home/home` |
| `/pages/download/download` | — | `#/pages/home/home` |
| `/pages/drawPrize/drawPrize` | — | `#/pages/home/home` |
| `/pages/drawPrize/drawPrize` | 记录 | `#/pages/drawPrize/records` |
| `/pages/drawlots/drawlots` | — | `#/pages/home/home` |
| `/pages/entrust/entrust` | — | `#/pages/home/home` |
| `/pages/home/home` | ICard 搜索 | `#/pages/search/search` |
| `/pages/index/index` | ICard 搜索 | `#/pages/search/search` |
| `/pages/index/index` | 爱卡好物 | `#/pages/home/home` |

## 点击后无任何 UI 反馈的页面

> 多为纯展示页，或需真实数据 / 权限才会弹提示。

- `/pages/Announcement/list`（点了 1 个元素）
- `/pages/account/Warelist`（点了 3 个元素）
- `/pages/account/blindbox`（点了 4 个元素）
- `/pages/account/blindboxresult`（点了 3 个元素）
- `/pages/account/open`（点了 5 个元素）
- `/pages/account/other`（点了 6 个元素）
- `/pages/account/otheruser`（点了 2 个元素）
- `/pages/colorfulMix/index`（点了 1 个元素）
- `/pages/drawlots/details`（点了 4 个元素）
- `/pages/integral/details`（点了 8 个元素）
- `/pages/integral/my`（点了 5 个元素）
- `/pages/market/createOrder`（点了 2 个元素）
- `/pages/market/goodsDetails`（点了 8 个元素）
- `/pages/Announcement/details`（点了 1 个元素）

## 复现方式

```bash
NODE_PATH=C:/Users/12283/.workbuddy/binaries/node/workspace/node_modules \
  node tools/login.js 17587881293 whm981004     # 刷新登录态

NODE_PATH=C:/Users/12283/.workbuddy/binaries/node/workspace/node_modules \
  MAX=8 node tools/ui-states.js                 # 全量补抓 + 截图

node tools/ui-states-report.js                  # 生成本报告 + 截图画廊
```
