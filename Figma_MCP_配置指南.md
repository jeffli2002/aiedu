# Figma MCP 配置指南

本指南将帮助您配置 Figma MCP（Model Context Protocol）服务器，以便在 Cursor 中使用 Figma 设计到代码的转换功能。

## 前置要求

- 已安装 Node.js（用于运行 MCP 服务器）
- 拥有 Figma 账户
- 使用 Cursor 编辑器

---

## 步骤 1：获取 Figma 个人访问令牌（Access Token）

1. **登录 Figma**
   - 访问 [Figma](https://www.figma.com/) 并登录您的账户

2. **进入设置页面**
   - 点击左上角的头像
   - 选择 **"Settings"**（设置）

3. **生成访问令牌**
   - 在设置页面中，找到 **"Personal access tokens"**（个人访问令牌）部分
   - 点击 **"Generate new token"**（生成新令牌）
   - 输入令牌名称（例如：`Cursor MCP`）
   - 确保选择以下权限：
     - ✅ **File content: read**（文件内容：读取）
     - ✅ **Dev resources: read**（开发资源：读取）
   - 点击 **"Generate token"**（生成令牌）

4. **保存令牌**
   - ⚠️ **重要**：令牌只会显示一次，请立即复制并妥善保存
   - 建议将令牌保存在安全的地方（如密码管理器）

---

## 步骤 2：配置 Cursor MCP 设置

### 方法 1：通过 Cursor 设置界面

1. **打开 MCP 设置**
   - 在 Cursor 中，按下快捷键：
     - **Windows/Linux**: `Ctrl + Shift + P`
     - **macOS**: `Cmd + Shift + P`
   - 输入 `MCP` 或 `Open MCP setting`
   - 选择 **"Open MCP setting"** 或 **"MCP: Open Settings"**

2. **编辑配置文件**
   - 配置文件通常位于：
     - **Windows**: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
     - **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
     - **Linux**: `~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

3. **添加 Figma MCP 服务器配置**
   - 在配置文件中添加以下内容（将 `YOUR_FIGMA_API_KEY` 替换为您在步骤 1 中获取的令牌）：

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    }
  }
}
```

### 方法 2：手动编辑配置文件

如果找不到设置选项，您可以手动创建或编辑配置文件：

1. **定位配置文件位置**（见上方路径）
2. **创建或编辑 `cline_mcp_settings.json` 文件**
3. **添加上述 JSON 配置内容**
4. **保存文件**

---

## 步骤 3：验证配置

1. **重启 Cursor**
   - 完全关闭并重新打开 Cursor 编辑器

2. **检查 MCP 连接**
   - 在 Cursor 中，您应该能够看到 MCP 服务器已连接
   - 如果出现错误，请检查：
     - Node.js 是否正确安装
     - Figma API 令牌是否正确
     - 配置文件 JSON 格式是否正确

---

## 步骤 4：使用 Figma MCP

### 获取 Figma 设计链接

1. **在 Figma 中打开设计文件**
2. **选择要转换的元素**
   - 可以是画板（Frame）、组件（Component）或图层（Layer）
3. **复制链接**
   - 右键点击选中的元素
   - 选择 **"Copy/Paste as"** > **"Copy link to selection"**
   - 或使用快捷键 `Ctrl/Cmd + L`

### 在 Cursor 中使用

1. **粘贴 Figma 链接**
   - 在 Cursor 的聊天界面中粘贴复制的 Figma 链接

2. **输入指令**
   - 例如：
     - "请根据这个 Figma 设计链接生成网页代码"
     - "Convert this Figma design to React components"
     - "根据这个设计生成 HTML/CSS 代码"

3. **AI 将自动调用 MCP 服务器**
   - Cursor 会通过 MCP 服务器获取 Figma 设计数据
   - 然后根据设计生成相应的代码

---

## 故障排除

### 问题 1：MCP 服务器无法连接

**解决方案：**
- 检查 Node.js 是否正确安装：运行 `node --version`
- 确保网络连接正常
- 检查配置文件路径和格式是否正确

### 问题 2：无法获取 Figma 设计数据

**解决方案：**
- 验证 Figma API 令牌是否有效
- 检查令牌权限是否包含 "File content: read"
- 确保 Figma 文件是公开的，或者您的账户有访问权限

### 问题 3：配置文件找不到

**解决方案：**
- 手动创建配置文件目录
- 确保文件名为 `cline_mcp_settings.json`
- 检查文件权限是否正确

### 问题 4：npx 命令执行失败

**解决方案：**
- 确保已安装 Node.js 和 npm
- 尝试手动安装：`npm install -g figma-developer-mcp`
- 检查防火墙或代理设置

---

## 高级配置

### 使用本地安装的 MCP 服务器

如果您想使用本地安装的版本，可以修改配置：

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "node",
      "args": [
        "/path/to/figma-developer-mcp/index.js",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    }
  }
}
```

### 配置多个 MCP 服务器

您可以在同一个配置文件中添加多个 MCP 服务器：

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    },
    "其他MCP服务器": {
      "command": "...",
      "args": [...]
    }
  }
}
```

---

## 安全建议

1. **保护您的 API 令牌**
   - 不要将令牌提交到版本控制系统（Git）
   - 使用环境变量或安全的配置管理工具
   - 定期轮换令牌

2. **限制令牌权限**
   - 只授予必要的权限（读取权限通常足够）
   - 如果不再使用，及时撤销令牌

3. **配置文件安全**
   - 将配置文件添加到 `.gitignore`
   - 不要分享包含令牌的配置文件

---

## 参考资源

- [Figma API 文档](https://www.figma.com/developers/api)
- [Model Context Protocol 文档](https://modelcontextprotocol.io/)
- [Cursor 文档](https://cursor.sh/docs)

---

## 更新日志

- **2024-12**: 初始版本配置指南

---

如有问题，请参考上述故障排除部分或查阅相关文档。









