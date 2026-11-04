# Cloudflare Pages 修复补丁

此补丁适用于现有 designchen 仓库，保留原站所有源文件和作品资源。未修改原 Sites 网站；此补丁尚未发布到您的 Cloudflare 账号。

## 先更新 GitHub 仓库

解压后把 pages 文件夹放进原仓库根目录，与 package.json、public、content 同级。提交并推送到 main。现有素材不要删除。

## Pages 构建配置

- 构建命令：node pages/build.mjs
- 构建输出目录：dist-pages
- 根目录：留空（仓库根目录）
- 生产分支：main

保存后重新部署。这个构建不需要新增依赖。生成的 dist-pages 根目录会同时包含 index.html、style.css、脚本、assets、_worker.js 和 _routes.json。Pages 使用高级模式的 Worker 提供浏览量 API，其余资源由 Pages 静态资源服务提供。

## 开通真实共享浏览量

在 Cloudflare 账号中创建一个新的 D1 数据库（不要使用或覆盖其他项目的数据库），执行 pages/init-database.sql 初始化。然后在 Pages 项目 设置 → 绑定 中添加 D1 数据库绑定，变量名必须是 DB，选择新建的数据库，再重新部署。

SQL 带有旧站历史总数快照：2036（2000 历史基数＋36 次服务器记录）。正式切换前应从旧站同步最新累计数。SQL 只用于新的空数据库，不要对已有数据库反复执行。数据库未配置前网页仍能展示，浏览量显示暂不可用，不会伪造增长。

## 检查

验证首页、CSS、脚本和图片，检查13个视频播放及拖动；验证不同浏览器共享计数、同一浏览器当天刷新不重复计数。最后进行关闭 VPN 的国内网络实测。

此补丁解决发布结构与 API 适配，不保证 Cloudflare Pages 在所有国内网络都可访问。czrdesign.fun 当前仍指向原站；仅在新部署验证完成后，再通过 Pages 自定义域向导切换，避免直接手动改错解析。
