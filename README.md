# 业务管理平台前端模板

Vue 3、Vue Router 和 Vite 构建的知识沉淀管理工作台。两个示例页面可直接运行，便于验证导航和页面状态保留。

## 启动

使用 Node.js 22.12+ 或受 Vite 支持的更新版本，在前端目录运行：

```sh
npm ci
npm run dev
```

## 派生一个平台

1. 将模板源码复制到新前端仓库，排除 `.git/`、`node_modules/`、`dist/` 和私有环境文件。修改包名后运行 `npm install --package-lock-only`。
2. 在 [平台配置](src/config/platform.js) 修改平台名、导航名称、路径及页面加载函数。在 `src/views/` 增加业务页面。配置数组的顺序就是导航与滑页的顺序。
3. 更新[项目定位](description/project.md)，在[文档索引](description/readme.md)登记业务专题。接入受保护的数据前，对齐主系统身份和业务后端授权契约。
4. 运行 `npm run build`。如部署在子路径，使用 `npm run build -- --base=/your-platform/`，将 `dist/` 发布到该路径，配置服务器将该前缀下的页面路由回退至对应的 `index.html`。静态文件按实际路径提供。

构建后可用 `npm run preview` 本地验收；子路径构建使用相同的 `--base`。验收步骤见[工作台框架](description/platform/workspace.md)。

## 对接业务后端

派生项目通过同源的 `GET api/v1/session` 获取当前用户。前端调用入口、后端身份查询映射与联调步骤见[浏览器与业务后端的契约](description/api/backend.md)。机器可读定义见 [OpenAPI v1](description/api/openapi.yaml)。
