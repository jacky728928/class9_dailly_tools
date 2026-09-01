# 班级管理工具

轻便、美观、易修改的班级管理网页应用，集 **课表展示 / 作业收交 / 考勤打卡 / 卫生打扫排班** 于一体。
纯前端（HTML + 独立数据文件），无后端，双击即可运行；部署到 GitHub Pages 后，相关负责人可在浏览器里直接编辑并通过 GitHub API 自动提交回仓库。

## 功能模块

| 模块 | 说明                                              |
| -- | ----------------------------------------------- |
| 课表 | 周课表网格（行=节次、列=周一\~周五），学科色编码，当前节次高亮；可编辑科目/老师、增删节次 |
| 作业 | 卡片化作业列表，进度条 + 已交/未交名单；点击学生切换提交状态，支持新增/删除、全选     |
| 考勤 | 按日期逐人标记 到/缺/迟/请，顶部统计出勤率与各状态人数；支持"全部到勤"          |
| 卫生 | 按周排班，每天分配值日学生；可点击分配、新增周、复制上周排班                        |

## 本地预览

直接双击 `index.html` 用浏览器打开即可（无需任何服务器/构建）。

> 提示：若用 `file://` 协议打开，少数浏览器对 `<script src>` 的 localStorage 限制不影响本工具；如遇异常，可用 `python -m http.server` 在本目录起一个本地服务后访问 `http://localhost:8000`。

## 文件结构

```
class-manager/
├── index.html   # 页面结构
├── data.js      # 数据（维护者最终关心的文件）
├── app.js       # 全部逻辑：渲染/编辑/同步
├── styles.css   # 样式
└── README.md    # 本说明
```

## 部署到 GitHub Pages（免费云端访问）

1. 在 GitHub 新建一个仓库（如 `class-data`，公开 public）。
2. 把 `class-manager/` 目录里的全部文件推送到仓库（根目录或某子路径均可）。
3. 仓库 **Settings → Pages → Source** 选 `main` 分支、`/(root)` 文件夹，保存。
4. 等几十秒，访问形如 `https://<你的用户名>.github.io/class-data/` 的地址即可打开应用。

## 配置云端编辑（GitHub API 自动提交）

让负责人在浏览器里改数据并自动写回仓库，需配置一次 Token：

1. 申请 GitHub 细粒度 Personal Access Token：

   * GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token。

   * **Repository access** 选 `Only select repositories` → 勾选刚建的 `class-data` 仓库。

   * **Permissions → Repository permissions → Contents** 设为 **Read and write**（其余保持 No access）。

   * 生成后复制 token（形如 `github_pat_...`）。
2. 在网页右上角点 **⚙ 设置**，填写：

   * 仓库 Owner（你的用户名）、Repo（仓库名）、分支（默认 `main`）、文件路径（默认 `data.js`）。

   * 粘贴 Token。
3. 保存设置。之后改完数据点 **同步到云端**，data.js 即被自动更新并产生一次 commit。

> ⚠ 安全提示：Token 仅存在当前浏览器的 localStorage，不会上传到任何第三方。请勿在公共电脑留存；建议使用细粒度 token 且只授该仓库 Contents:write 权限。GitHub Pages 默认走 HTTPS，传输加密。

## 协同编辑流程

* **改数据**：任一负责人打开网页 → 在四个模块里增删改 → 数据先存浏览器本地（防丢）→ 点"同步到云端"提交。

* **拉取最新**：因浏览器会缓存本地改动，要获取他人最新提交：**硬刷新页面**（Ctrl/⌘ + F5 重新拉取 data.js）→ 点 ⚙ 设置 → **重置为文件数据**（清空本地覆盖，载入最新文件内容）。

* **多人协作**：建议约定一人主编辑或错开时段，避免同时改同一字段产生覆盖（本工具为轻量级，不做服务端冲突合并）。

## 自定义

* **学科颜色**：编辑 `data.js` 顶部 `meta.subjectColors`。

* **班级名/学期**：编辑 `data.js` 的 `meta.className` / `meta.semester`。

* **学生名单**：编辑 `data.students`（`id` 用于关联，请保持稳定）。

* 所有改动既可直接改 `data.js`，也可在页面内编辑后同步。

