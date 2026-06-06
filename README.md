# Agnes AI Studio

基于 Agnes AI API 的图片/视频生成工具，支持 Cloudflare Pages 和 Workers 部署。

> **隐私说明**: 所有配置信息（API Key、端点、模型等）仅保存在你的浏览器本地（localStorage），不会上传到任何服务器。

## 功能

- **图片生成**: 文生图 / 图生图，支持 URL 和 Base64 输出
- **视频生成**: 文生视频 / 图生视频 / 多图参考 / 关键帧动画
- **异步轮询**: 视频任务自动创建并轮询结果
- **API Key 即用**: 内置 Agnes AI 默认端点和模型，只需填写 API Key
- **暗色/亮色主题**: 支持主题切换，偏好自动保存
- **画廊展示**: 生成结果网格展示，点击在新标签页打开，支持下载

## 默认 API

| 类型 | 端点 | 模型 |
|------|------|------|
| 图片 | `https://apihub.agnes-ai.com/v1/images/generations` | `agnes-image-2.1-flash` |
| 视频 | `https://apihub.agnes-ai.com/v1/videos` | `agnes-video-v2.0` |
| 查询 | `https://apihub.agnes-ai.com/agnesapi` | - |

## 部署方式

### 方式一：Cloudflare Pages（推荐，纯静态）

直接将 `index.html` 部署到 Cloudflare Pages：

1. 在 Cloudflare 控制台创建 Pages 项目
2. 上传 `index.html` 文件
3. 绑定自定义域名（可选）

适用于 API 支持 CORS 的场景。

### 方式二：Cloudflare Workers

通过 Worker 提供 HTML 服务：

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

## 使用

1. 在顶部 API Key 栏输入你的 Agnes AI API Key 并保存
2. 选择图片或视频标签页
3. 选择子模式（文生图/图生图/文生视频/图生视频/多图参考/关键帧）
4. 输入提示词，点击生成
5. 图片模式可选择 URL 或 Base64 输出格式
6. 视频模式可调节分辨率、帧数、帧率
7. 点击生成结果在新标签页中查看，支持下载

## 项目结构

```
├── index.html      # 前端页面（单文件，可独立使用）
├── worker.js       # Cloudflare Worker（可选，用于 HTML 服务）
└── wrangler.toml   # Wrangler 部署配置（可选）
```
