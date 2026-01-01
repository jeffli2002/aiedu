# 使用 Vercel API 初始化数据库 - 快速指南

## 方法 1：使用 PowerShell 脚本（推荐）

### 步骤 1：运行脚本

在项目根目录打开 PowerShell，运行：

```powershell
pnpm db:init-vercel
```

或者直接运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/init-db-vercel.ps1
```

### 步骤 2：输入 CRON_SECRET

脚本会提示你输入 CRON_SECRET。你可以：

1. **从 Vercel Dashboard 获取**：
   - 访问：https://vercel.com/dashboard
   - 选择你的项目
   - Settings → Environment Variables
   - 找到 `CRON_SECRET`，点击查看（可能需要输入密码）
   - 复制密钥值

2. **粘贴到脚本提示中**

### 步骤 3：查看结果

脚本会自动调用 API 并显示结果。如果成功，你会看到：

```
✅ Success!

Tables initialized:
  ✓ user
  ✓ session
  ✓ account
  ✓ verification
  ✓ rateLimit
  ✓ user_credits
  ✓ credit_transactions
  ✓ credit_pack_purchase
  ✓ payment
  ✓ payment_event

🎉 Database initialization completed successfully!
```

---

## 方法 2：直接使用 PowerShell 命令

如果你已经知道 CRON_SECRET，可以直接运行：

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_HERE"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://www.futurai.org/api/admin/init-db" -Method POST -Headers $headers
```

**替换 `YOUR_CRON_SECRET_HERE` 为你的实际 CRON_SECRET**

---

## 方法 3：使用脚本并直接传入密钥

```powershell
powershell -ExecutionPolicy Bypass -File scripts/init-db-vercel.ps1 -CronSecret "YOUR_CRON_SECRET_HERE"
```

---

## 如何获取 CRON_SECRET

### 在 Vercel Dashboard 中查看：

1. 访问：https://vercel.com/dashboard
2. 选择你的项目
3. 点击 **Settings** 标签
4. 在左侧菜单中，点击 **Environment Variables**
5. 找到 `CRON_SECRET` 行
6. 点击 **Value** 列中的 **"..."** 或 **"Show"** 按钮
7. 可能需要输入 Vercel 密码来查看
8. 复制显示的密钥值

---

## 故障排除

### 问题 1：401 Unauthorized

**原因**：CRON_SECRET 不正确或项目未重新部署

**解决**：
1. 确认 CRON_SECRET 值正确
2. 如果刚刚更新了 CRON_SECRET，需要重新部署项目
3. 在 Vercel Dashboard → Deployments → 点击 "..." → Redeploy

### 问题 2：脚本无法运行

**错误**：`ExecutionPolicy` 相关错误

**解决**：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 问题 3：API URL 不正确

**解决**：
如果你的域名不是 `www.futurai.org`，可以修改脚本中的 URL：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/init-db-vercel.ps1 -ApiUrl "https://your-domain.vercel.app/api/admin/init-db"
```

---

## 验证初始化结果

初始化成功后，你可以：

1. **测试 Google OAuth 注册**：尝试注册一个新用户
2. **访问 Dashboard**：https://www.futurai.org/dashboard
3. **检查积分余额**：确认积分系统正常工作

---

## 安全提示

- ✅ CRON_SECRET 是敏感信息，不要分享给他人
- ✅ 不要在代码中硬编码 CRON_SECRET
- ✅ 使用后清除 PowerShell 历史记录（可选）：
  ```powershell
  Clear-History
  ```

