# 李子衡的个人博客

你好，我是李子衡，一名计算机专业学生。这里收录了我的开发作品和技术文章。每个项目都有截图、可操作的样例，以及对应的实现代码。[我的 GitHub 主页](https://github.com/fate788)

| 作品 | 可以体验的内容 | 独立源码仓库 |
| --- | --- | --- |
| 校园场务 | 从学生报名到现场签到，查看签到时段对结果的影响 | [campus-events](https://github.com/fate788/campus-events) |
| 双账核对工作台 | 核对两份样例账单，查看原始行并填写复核意见 | [ledger-reconciliation](https://github.com/fate788/ledger-reconciliation) |
| 故障响应工作台 | 跟随一次任务积压演练，回看告警和恢复记录 | [incident-response](https://github.com/fate788/incident-response) |
| 门诊候补与改约工作台 | 释放虚构号源，观察到期递补，再为停诊场次的预约安排新时段 | [clinic-scheduling](https://github.com/fate788/clinic-scheduling) |

## 打开博客

下载或克隆本仓库，直接打开根目录中的 `index.html`，即可离线浏览作品、体验样例和阅读源码。要通过本地 HTTP 预览，可以在仓库根目录运行以下命令。

```sh
python -m http.server 8000 --bind 127.0.0.1
```

打开 [本地博客](http://127.0.0.1:8000/)。各产品的后端可根据对应仓库的 README 单独启动。

## 内容与维护

- `projects.js` 保存作品、技术方向和文章内容。`github-links.js` 保存作者主页及各项目仓库地址。
- `project-detail.js` 和 `samples.js` 提供详情页与交互样例。`source/` 提供可按文件和行号浏览的离线源码快照。
- `downloads/` 保存与快照对应的源码包和运行包，方便下载及离线体验。
- 在仓库根目录运行 `node scripts/check-site.mjs` 检查站内资源、下载包和 JavaScript 语法。GitHub Actions 也会在提交和拉取请求时运行这项检查。
