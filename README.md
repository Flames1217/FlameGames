# FlameGames — 部署指南

## 技术栈
- **前端/后端**: Next.js 14（Vercel 部署）
- **数据库**: Neon PostgreSQL（免费版）
- **认证**: 环境变量密码

---

## 第一步：创建 Neon 数据库

1. 打开 https://neon.tech，注册/登录
2. 点击 **New Project**，区域选 **Asia Pacific (Singapore)** 延迟最低
3. 创建完成后，进入 **SQL Editor**
4. 粘贴 `init.sql` 里的内容，点击 **Run** 初始化表结构

5. 回到 Dashboard，点击 **Connection Details**
6. 选 **Pooled connection**，复制 **Connection string**
   格式如：`postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

---

## 第二步：部署到 Vercel

1. 把这个文件夹推送到 GitHub（新建一个 repo）

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/你的用户名/FlameGames.git
git push -u origin main
```

2. 打开 https://vercel.com，点击 **Add New Project**
3. 导入刚才创建的 GitHub repo
4. 在 **Environment Variables** 里添加两个变量：

| Key | Value |
|-----|-------|
| `DATABASE_URL` | 上一步复制的 Neon 连接字符串 |
| `ADMIN_PASSWORD` | 你设置的管理员密码 |

5. 点击 **Deploy**，等待 1-2 分钟

---

## 第三步：绑定自定义域名

1. Vercel 控制台 → 你的项目 → **Settings → Domains**
2. 添加 `games.viper3.top`
3. 去腾讯云 DNS，添加一条 CNAME 记录：
   - 主机记录：`games`
   - 记录值：`cname.vercel-dns.com`

---

## 使用说明

| 路径 | 说明 |
|------|------|
| `games.viper3.top/` | 游戏展示页（公开） |
| `games.viper3.top/admin` | 管理后台（需密码） |

### 管理后台功能
- ✅ 添加游戏（名称、描述、链接、标签、状态、颜色）
- ✅ 编辑游戏
- ✅ 删除游戏
- ✅ 上下调整排序
- ✅ 切换上线/即将上线状态

前端页面在每次访问时从数据库读取最新数据，**后台改动立即生效**。

---

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 创建 .env.local（参考 .env.example）
cp .env.example .env.local
# 编辑 .env.local，填入 DATABASE_URL 和 ADMIN_PASSWORD

# 3. 启动
npm run dev
# 打开 http://localhost:3000
```
