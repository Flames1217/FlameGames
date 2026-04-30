# FlameGames 部署与使用说明

FlameGames 是一个个人休闲游戏合集，目标是让用户随时随地打开浏览器就能玩。

## 项目技术栈
- 前后端：Next.js 14
- 数据库：Neon PostgreSQL
- 部署平台：Vercel
- 管理后台认证：环境变量密码

## 一、准备数据库（Neon）
1. 打开 `https://neon.tech` 并创建项目。
2. 进入 SQL Editor，执行仓库中的 `init.sql`。
3. 在 Connection Details 里复制 `Pooled connection` 连接串。

## 二、配置环境变量
在本地 `.env.local` 和 Vercel 环境变量中都要配置：

| Key | 说明 |
| --- | --- |
| `DATABASE_URL` | Neon 的连接字符串 |
| `ADMIN_PASSWORD` | 后台登录密码 |

## 三、部署到 Vercel
1. 把仓库推送到 GitHub。
2. 在 Vercel 导入该仓库并部署。
3. 在 Vercel 项目中配置好环境变量后重新部署。

## 四、域名与子路径
- 主站：`games.viper3.top` 指向本项目。
- 子路径反向代理：
  - `/wolfcha` 和 `/wolfcha/*` 代理到 `wolfcha.vercel.app`
  - `/drysland` 和 `/drysland/*` 代理到 `drysland-nu.vercel.app`

> 当前仓库已包含 `vercel.json` 与 `next.config.js` 的 rewrite 配置。

## 五、本地运行
```bash
pnpm install
pnpm dev
```
访问：`http://localhost:3000`

## 页面说明
- `/`：游戏主页（公开）
- `/games/[slug]`：游戏详情页（iframe 承载）
- `/admin`：管理后台（密码登录）

## 管理后台支持
- 新增游戏
- 编辑游戏
- 删除游戏
- 上下移动排序
- 切换 `live/soon` 状态
