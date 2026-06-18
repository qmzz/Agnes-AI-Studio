# Agnes AI Studio

基于 Agnes AI API 的图片与视频生成工具，支持单文件静态页面和 Cloudflare Workers 部署。

> **隐私说明**：配置与生成记录（API Key、端点、模型、图片/视频结果 URL 等）仅保存在你的浏览器本地 localStorage 中。生成请求默认直连 Agnes AI API；直连失败时会通过同源 Worker 代理重试，代理仅允许 Agnes 域名。

## 功能

- **图片生成**：文生图、图生图，支持 720p、1080p、1k、2k、4k 尺寸。图生图使用公网可访问的参考图 URL。
- **视频生成**：文生视频、图生视频、多图参考、关键帧。参考图均使用公网可访问的图片 URL。
- **生成记录本地保留**：图片和视频结果保存在浏览器 localStorage，刷新页面不会丢失；需要手动点击删除才会清理。
- **结果操作**：支持新标签打开、下载、删除、复制 URL；图片结果可一键设为图生图/图生视频参考图，历史记录可按类型筛选并手动清空。
- **帧率/帧数联动**：视频帧数按 `帧数 = 帧率 × 时间 + 1` 自动生成，最高 441 帧。
- **视频任务可观测**：视频生成会持久显示任务状态、任务 ID、轮询状态和失败原因，支持复制任务 ID、清除任务日志，并在长任务中自动降低轮询频率。
- **主题切换**：支持暗色/亮色主题，本地保存偏好。
- **高级设置**：可自定义图片 API、视频 API、视频查询 API 和模型名称；Worker 代理带同源校验、Agnes 域名白名单和基础限流。

## 默认 API

| 类型 | 端点 | 模型 |
|------|------|------|
| 图片 | `https://apihub.agnes-ai.com/v1/images/generations` | `agnes-image-2.1-flash` |
| 视频 | `https://apihub.agnes-ai.com/v1/videos` | `agnes-video-v2.0` |
| 视频查询 | `https://apihub.agnes-ai.com/agnesapi` | - |

## 使用说明

1. 在顶部 API Key 输入框填写你的 Agnes AI API Key 并保存。
2. 选择“图片生成”或“视频生成”。
3. 图片模式支持文生图和图生图；图生图需要填写公网图片 URL。
4. 视频模式支持文生视频、图生视频、多图参考、关键帧；非文生视频模式需要填写一个或多个公网图片 URL。
5. 点击生成后，结果会显示在页面下方并自动保存到浏览器本地。
6. 历史结果可打开、下载、删除；图片结果可点击“参考”继续作为图生图参考图。

## 部署

### 手动部署到 Cloudflare Workers

适合想快速试用、不想连接 GitHub 的情况。

1. 在 Cloudflare 控制台进入 **Workers & Pages**，创建一个 Worker。
2. 打开在线编辑器，将 `worker.js` 的代码复制进去。
3. 将 `index.html` 的内容按 Worker 代码中的导入方式一并加入项目资源。
4. 保存并部署，访问 Worker 地址即可。

### 自动部署到 Cloudflare Workers

适合长期维护或希望跟随 GitHub 仓库更新的情况。

1. Fork 本项目到你的 GitHub 账号。
2. 在 Cloudflare 控制台连接 GitHub 仓库。
3. 选择 Worker 部署方式，入口文件使用 `worker.js`。
4. 保留仓库中的 `wrangler.toml`，它会声明 Worker 名称、入口文件、兼容日期，并把 `index.html` 作为文本资源打包给 Worker。
5. 部署完成后，Worker 会返回 `index.html` 页面，并提供 `/api/proxy` 作为 Agnes API 的同源兜底代理。代理仅允许 `agnes-ai.com` 与 `apihub.agnes-ai.com`。

### 静态页面部署

如果只需要前端页面，不需要 Worker 代理能力，也可以把 `index.html` 作为静态页面部署到任意静态托管服务。也可以把 `index.html` 下载到本地，直接用浏览器打开。此模式下生成请求会直接访问 Agnes API，无法使用同源 `/api/proxy` 兜底。

## 项目结构

```text
├── index.html      # 前端单页应用
├── worker.js       # Cloudflare Worker 入口
├── wrangler.toml   # Wrangler 配置
├── README.md       # 项目说明
├── CHANGELOG.md    # 版本变更记录
└── LICENSE
```
