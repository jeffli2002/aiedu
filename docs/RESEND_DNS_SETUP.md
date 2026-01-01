# Resend 域名验证 DNS 记录配置指南

本文档说明如何为 `futurai.org` 域名配置 Resend 邮件服务所需的 DNS 记录。

## 📋 前置条件

1. 已注册 Resend 账号：https://resend.com
2. 已获取 Resend API Key
3. 域名 `futurai.org` 已配置在 Vercel 或其他 DNS 提供商

## 🔧 配置步骤

### 步骤 1: 在 Resend 中添加域名

1. 登录 Resend Dashboard：https://resend.com/domains
2. 点击 **"Add Domain"** 按钮
3. 输入域名：`futurai.org`
4. 点击 **"Add"**

### 步骤 2: 获取 DNS 记录

Resend 会自动生成所需的 DNS 记录，包括：

- **SPF 记录**：用于验证邮件发送授权
- **DKIM 记录**：用于邮件签名验证
- **DMARC 记录**：用于邮件策略和报告

### 步骤 3: 添加 DNS 记录

根据你的域名管理位置，选择以下方式之一：

#### 选项 A: 在 Vercel 中添加（如果域名在 Vercel 管理）

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 进入项目 **Settings** → **Domains**
3. 找到 `futurai.org`，点击 **"View DNS Records & More for futurai.org →"**
4. 在 DNS 管理页面，点击 **"Add Record"**
5. 按照 Resend 提供的记录逐一添加：

   **SPF 记录：**
   ```
   Type: TXT
   Name: @ (或留空，表示根域名)
   Value: v=spf1 include:resend.com ~all
   TTL: 3600 (或默认值)
   ```

   **DKIM 记录：**
   ```
   Type: TXT
   Name: resend._domainkey (或 Resend 提供的选择器)
   Value: (Resend 提供的完整 DKIM 公钥)
   TTL: 3600 (或默认值)
   ```

   **DMARC 记录：**
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@futurai.org
   TTL: 3600 (或默认值)
   ```

#### 选项 B: 在域名注册商处添加（如 Namecheap、GoDaddy、Cloudflare）

1. 登录你的域名注册商控制台
2. 找到 **DNS 管理** 或 **域名设置**
3. 添加 Resend 提供的 DNS 记录（格式同上）

### 步骤 4: 验证 DNS 记录

1. 等待 DNS 传播（通常 5-60 分钟，最长 48 小时）
2. 在 Resend Dashboard 中点击 **"Verify"** 按钮
3. 使用在线工具检查 DNS 记录是否生效：
   - https://www.whatsmydns.net/
   - https://mxtoolbox.com/

### 步骤 5: 配置环境变量

在 Vercel 项目设置中添加环境变量：

```bash
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@futurai.org
```

## ✅ 验证清单

- [ ] 在 Resend Dashboard 中添加了 `futurai.org` 域名
- [ ] 添加了 SPF 记录（TXT 记录，Name: @）
- [ ] 添加了 DKIM 记录（TXT 记录，Name: resend._domainkey）
- [ ] 添加了 DMARC 记录（TXT 记录，Name: _dmarc）
- [ ] DNS 记录已通过 Resend 验证
- [ ] 环境变量 `RESEND_FROM_EMAIL` 设置为 `noreply@futurai.org`
- [ ] 测试发送欢迎邮件成功

## 🐛 常见问题

### 问题 1: DNS 记录未生效

**解决方案：**
- 等待更长时间（最长 48 小时）
- 检查 DNS 记录格式是否正确
- 确认 TTL 值设置合理
- 清除本地 DNS 缓存

### 问题 2: Resend 验证失败

**解决方案：**
- 确认所有 DNS 记录都已正确添加
- 检查记录值是否完全匹配（包括空格和格式）
- 使用 DNS 检查工具验证记录是否已传播

### 问题 3: 邮件发送失败

**解决方案：**
- 确认域名已在 Resend 中验证通过
- 检查 `RESEND_FROM_EMAIL` 环境变量是否正确
- 查看 Resend Dashboard 的发送日志
- 确认 API Key 有效

## 📚 参考资源

- [Resend 域名验证文档](https://resend.com/docs/dashboard/domains/introduction)
- [SPF 记录说明](https://en.wikipedia.org/wiki/Sender_Policy_Framework)
- [DKIM 记录说明](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)
- [DMARC 记录说明](https://en.wikipedia.org/wiki/DMARC)

## 🔄 更新记录

- 2026-01-02: 初始文档创建

