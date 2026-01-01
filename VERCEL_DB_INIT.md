# Vercel 数据库初始化指南

在 Vercel 上初始化数据库有两种方法：

## 方法 1：使用 API 路由（推荐）⭐

这是最简单的方法，不需要本地环境。

### 步骤 1：设置 CRON_SECRET

1. 在 Vercel Dashboard 中：
   - 进入你的项目
   - 点击 **Settings** → **Environment Variables**
   - 添加环境变量：
     ```
     CRON_SECRET=your-secret-key-here
     ```
   - 生成一个安全的密钥：
     - **Windows PowerShell**：
       ```powershell
       [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
       ```
     - **Mac/Linux**：
       ```bash
       openssl rand -base64 32
       ```
     - **Node.js**（如果已安装）：
       ```bash
       node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
       ```
   - 确保选择正确的环境（Production, Preview, Development）
   - 点击 **Save**

2. **重新部署**项目（让新的环境变量生效）

### 步骤 2：调用初始化 API

部署完成后，使用以下任一方法调用 API：

#### 使用 curl（命令行）：
```bash
curl -X POST https://www.futurai.org/api/admin/init-db \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

#### 使用 PowerShell（Windows）：
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://www.futurai.org/api/admin/init-db" -Method POST -Headers $headers
```

#### 使用浏览器（临时方法）：
如果 `CRON_SECRET` 设置为 `dummy`（仅用于测试），可以直接访问：
```
https://www.futurai.org/api/admin/init-db
```

**⚠️ 注意**：生产环境请务必设置一个强密码的 `CRON_SECRET`，不要使用 `dummy`。

### 成功响应示例：
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
    "credit_transactions"
  ]
}
```

---

## 方法 2：使用 Vercel CLI（需要本地环境）

如果你有 Vercel CLI 和本地开发环境，可以使用此方法。

### 步骤 1：安装 Vercel CLI（如果还没有）
```bash
npm i -g vercel
```

### 步骤 2：登录 Vercel
```bash
vercel login
```

### 步骤 3：拉取环境变量
```bash
# 在项目根目录运行
vercel env pull .env.local
```

这会创建一个 `.env.local` 文件，包含所有 Vercel 环境变量（包括生产数据库的 `DATABASE_URL`）。

### 步骤 4：运行初始化脚本
```bash
pnpm db:create-all-tables
```

脚本会使用 `.env.local` 中的 `DATABASE_URL` 连接到生产数据库并创建所有表。

### 步骤 5：清理（可选）
初始化完成后，可以删除 `.env.local` 文件（如果不想在本地保留生产环境变量）：
```bash
# Windows
del .env.local

# Mac/Linux
rm .env.local
```

---

## 验证初始化结果

初始化完成后，可以通过以下方式验证：

### 1. 检查 Vercel 日志
在 Vercel Dashboard → **Deployments** → 选择最新部署 → **Functions** → 查看日志，应该看到：
```
[init-db] Starting database initialization...
[init-db] ✅ Better Auth tables created
[init-db] ✅ Credit tables created
```

### 2. 测试 Google OAuth
尝试使用 Google OAuth 注册一个新用户，如果成功，说明数据库已正确初始化。

### 3. 检查数据库（如果可以直接访问）
连接到 Neon 数据库，运行：
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

应该看到以下表：
- `account`
- `credit_transactions`
- `rateLimit`
- `session`
- `user`
- `user_credits`
- `verification`

---

## 故障排除

### 问题 1：401 Unauthorized
**原因**：`CRON_SECRET` 不匹配或未设置

**解决**：
1. 检查 Vercel 环境变量中的 `CRON_SECRET` 是否正确设置
2. 确保在 API 请求中使用相同的 `CRON_SECRET`
3. 如果使用 `dummy`，确保 `CRON_SECRET=dummy` 在 Vercel 中已设置

### 问题 2：500 Internal Server Error - DATABASE_URL not configured
**原因**：`DATABASE_URL` 环境变量未设置

**解决**：
1. 在 Vercel Dashboard → **Settings** → **Environment Variables** 中添加 `DATABASE_URL`
2. 重新部署项目

### 问题 3：表已存在错误
**原因**：表已经创建过了

**解决**：这是正常的，`CREATE TABLE IF NOT EXISTS` 会跳过已存在的表。可以忽略此错误。

### 问题 4：外键约束错误
**原因**：表创建顺序问题

**解决**：重新运行初始化脚本，它会正确处理依赖关系。

---

## 安全建议

1. **永远不要**将 `CRON_SECRET` 设置为 `dummy` 在生产环境
2. **使用强密码**：至少 32 个字符的随机字符串
3. **定期轮换密钥**：定期更新 `CRON_SECRET`
4. **限制访问**：只允许必要的 IP 或使用 Vercel 的 IP 限制功能

---

## 快速命令参考

```powershell
# 生成 CRON_SECRET (Windows PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# 生成 CRON_SECRET (Mac/Linux)
# openssl rand -base64 32

# 使用 curl 调用 API（替换 YOUR_CRON_SECRET）
curl -X POST https://www.futurai.org/api/admin/init-db \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# 使用 Vercel CLI 拉取环境变量
vercel env pull .env.local

# 运行初始化脚本
pnpm db:create-all-tables
```

