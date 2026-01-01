# Vercel 数据库初始化 - 方法1（API路由）详细步骤

## 步骤 1：在 Vercel 设置 CRON_SECRET

### 1.1 访问 Vercel Dashboard
1. 打开浏览器，访问：https://vercel.com/dashboard
2. 登录你的 Vercel 账号
3. 找到并点击你的项目（future-ai-creators 或 aiedu）

### 1.2 添加环境变量
1. 在项目页面，点击顶部的 **Settings** 标签
2. 在左侧菜单中，点击 **Environment Variables**
3. 点击 **Add New** 按钮

### 1.3 填写环境变量信息
- **Key（键）**: `CRON_SECRET`
- **Value（值）**: 生成一个安全的密钥（见下方）
- **Environment（环境）**: 
  - ✅ 勾选 **Production**
  - ✅ 勾选 **Preview**（可选）
  - ✅ 勾选 **Development**（可选）
- 点击 **Save** 保存

### 1.4 生成安全的密钥

**Windows PowerShell：**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Mac/Linux：**
```bash
openssl rand -base64 32
```

**Node.js（如果已安装）：**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

复制生成的密钥，例如：`n8UG1+sJt4cAwQX2bcF00lYF1QnfNNTT+/kLnj8fy6k=`

---

## 步骤 2：重新部署项目

环境变量添加后，需要重新部署项目才能生效。

### 方法 A：通过 Vercel Dashboard 重新部署
1. 在 Vercel Dashboard → 项目页面
2. 点击 **Deployments** 标签
3. 找到最新的部署记录
4. 点击右侧的 **"..."** 菜单
5. 选择 **Redeploy**
6. 等待部署完成（通常 1-3 分钟）

### 方法 B：通过 Git 推送触发部署
```bash
# 创建一个空提交来触发部署
git commit --allow-empty -m "trigger: Redeploy to apply CRON_SECRET"
git push origin main
```

---

## 步骤 3：调用初始化 API

部署完成后，使用以下任一方法调用 API：

### 方法 A：使用 PowerShell（Windows）

1. 打开 PowerShell
2. 运行以下命令（替换 `YOUR_CRON_SECRET` 为你在步骤 1 中设置的密钥）：

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://www.futurai.org/api/admin/init-db" -Method POST -Headers $headers
```

**示例（如果密钥是 `n8UG1+sJt4cAwQX2bcF00lYF1QnfNNTT+/kLnj8fy6k=`）：**
```powershell
$headers = @{
    "Authorization" = "Bearer n8UG1+sJt4cAwQX2bcF00lYF1QnfNNTT+/kLnj8fy6k="
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://www.futurai.org/api/admin/init-db" -Method POST -Headers $headers
```

### 方法 B：使用 curl（Mac/Linux/Windows Git Bash）

```bash
curl -X POST https://www.futurai.org/api/admin/init-db \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

**示例：**
```bash
curl -X POST https://www.futurai.org/api/admin/init-db \
  -H "Authorization: Bearer n8UG1+sJt4cAwQX2bcF00lYF1QnfNNTT+/kLnj8fy6k=" \
  -H "Content-Type: application/json"
```

### 方法 C：使用浏览器（仅用于测试，不推荐生产环境）

如果 `CRON_SECRET` 设置为 `dummy`（仅用于测试），可以直接在浏览器访问：
```
https://www.futurai.org/api/admin/init-db
```

⚠️ **注意**：生产环境请务必设置强密码的 `CRON_SECRET`，不要使用 `dummy`。

---

## 步骤 4：验证结果

### 4.1 检查 API 响应

成功的响应应该类似：
```json
{
  "success": true,
  "message": "All tables initialized successfully",
  "tables": [
    "user",
    "session",
    "account",
    "verification",
    "rateLimit",
    "user_credits",
    "credit_transactions",
    "credit_pack_purchase",
    "payment",
    "payment_event"
  ]
}
```

### 4.2 检查 Vercel 日志

1. 在 Vercel Dashboard → 项目页面
2. 点击 **Deployments** 标签
3. 点击最新的部署记录
4. 点击 **Functions** 标签
5. 查看日志，应该看到：
   ```
   [init-db] Starting database initialization...
   [init-db] ✅ Better Auth tables created
   [init-db] ✅ Credit and Payment tables created
   ```

### 4.3 测试功能

尝试以下操作来验证数据库已正确初始化：
1. 使用 Google OAuth 注册一个新用户
2. 访问 Dashboard 页面：`https://www.futurai.org/dashboard`
3. 检查积分余额是否正常显示

---

## 故障排除

### 问题 1：401 Unauthorized

**错误信息：**
```json
{
  "error": "Unauthorized: Invalid secret"
}
```

**解决方法：**
1. 检查 Vercel 环境变量中的 `CRON_SECRET` 是否正确设置
2. 确保在 API 请求中使用相同的 `CRON_SECRET`
3. 确保已经重新部署了项目（环境变量需要重新部署才能生效）

### 问题 2：500 Internal Server Error

**错误信息：**
```json
{
  "error": "Failed to initialize database",
  "message": "..."
}
```

**解决方法：**
1. 检查 Vercel 日志查看详细错误信息
2. 确保 `DATABASE_URL` 环境变量已正确设置
3. 确保数据库连接正常

### 问题 3：表已存在错误

**说明：**
如果表已经存在，这是正常的。`CREATE TABLE IF NOT EXISTS` 会跳过已存在的表，不会报错。

### 问题 4：外键约束错误

**解决方法：**
重新运行初始化脚本，它会正确处理依赖关系。

---

## 快速参考命令

### 生成 CRON_SECRET（PowerShell）
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 调用初始化 API（PowerShell）
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://www.futurai.org/api/admin/init-db" -Method POST -Headers $headers
```

### 调用初始化 API（curl）
```bash
curl -X POST https://www.futurai.org/api/admin/init-db \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

---

## 安全建议

1. **永远不要**将 `CRON_SECRET` 设置为 `dummy` 在生产环境
2. **使用强密码**：至少 32 个字符的随机字符串
3. **定期轮换密钥**：定期更新 `CRON_SECRET`
4. **限制访问**：只允许必要的 IP 或使用 Vercel 的 IP 限制功能
5. **不要提交密钥**：确保 `.env.local` 在 `.gitignore` 中

