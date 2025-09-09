# CampusRide Vercel部署指南

## 修复完成的内容

✅ **已修复的问题：**
1. 前端API配置 - 创建了统一的API调用模块
2. 登录组件 - 修复了硬编码的localhost URL
3. 注册组件 - 修复了API调用和错误处理
4. 邮箱验证组件 - 修复了验证和重发邮件功能
5. Vercel配置 - 配置了serverless函数路由
6. 后端适配 - 创建了独立的API路由处理器
7. 数据库结构 - 创建了完整的SQL schema

## 部署步骤

### 1. 设置Supabase数据库
1. 登录到您的Supabase项目
2. 在SQL编辑器中运行 `database-schema.sql` 文件中的所有SQL语句
3. 确认所有表都已创建成功

### 2. 在Vercel设置环境变量
在Vercel项目设置中添加以下环境变量：

```
SUPABASE_URL=你的supabase项目URL
SUPABASE_ANON_KEY=你的supabase匿名密钥
SUPABASE_SERVICE_KEY=你的supabase服务密钥
JWT_SECRET=你的JWT密钥（例如：campusride-secret-2024）
JWT_EXPIRE=24h
VERCEL=1
NODE_ENV=production
```

### 3. 推送代码到GitHub
```bash
git add .
git commit -m "修复API连接问题，支持Vercel部署"
git push origin main
```

### 4. 重新部署
在Vercel面板中触发重新部署

## 主要修改内容

### 前端修改
- `src/utils/api.js` - 创建统一API客户端，支持环境检测
- `src/utils/auth.js` - 认证工具函数
- `src/utils/constants.js` - 应用常量配置
- `src/views/LoginView.vue` - 使用API模块，移除硬编码URL
- `src/views/RegisterView.vue` - 使用API模块，改进错误处理
- `src/views/EmailVerificationView.vue` - 使用API模块

### 后端适配
- `api/v1/[...route].js` - 独立的serverless API处理器
- `vercel.json` - 配置API路由和serverless函数
- `database-schema.sql` - 完整的数据库表结构
- `package.json` - 合并后端依赖

### 数据库表结构
- `users` - 用户信息表
- `activities` - 活动表
- `rideshares` - 拼车表
- `marketplace_items` - 二手市场表
- `notifications` - 通知表
- `points_history` - 积分历史表

## 测试功能
- 健康检查：`https://socialinteraction.club/api/v1/health`
- 演示账号：`demo@cornell.edu` / `demo1234`

## 演示模式
应用包含完整的演示模式，当API服务器不可用时：
- 演示账号：`demo@cornell.edu` / `demo1234`
- 本地存储模拟用户数据
- 完整的前端功能体验

## 故障排除

### 如果仍显示"无法连接到服务器"：
1. 检查Vercel环境变量是否正确设置
2. 确认Supabase数据库连接正常
3. 运行 `database-schema.sql` 创建数据库表
4. 查看Vercel函数日志检查错误
5. 使用演示账号测试前端功能

### 检查API状态：
访问 `https://socialinteraction.club/api/v1/health` 查看API状态

### 测试登录：
1. 访问 https://socialinteraction.club/login
2. 使用演示账号：`demo@cornell.edu` / `demo1234`
3. 应该能成功登录并跳转到首页

## 下一步
1. ✅ 设置Supabase数据库表结构
2. 配置Resend邮件服务（可选）
3. 测试完整的用户注册流程
4. 根据需要调整生产环境配置

---
🚀 部署完成后，您的全栈应用应该可以在 https://socialinteraction.club 正常运行！