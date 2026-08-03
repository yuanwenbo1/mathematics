# 数学自学教材网站

这是一个基于 GitHub Pages + Jekyll 的中文数学学习网站，面向所有希望系统自学数学的学生。前三册按中国现行课程标准完整覆盖小学、初中和高中数学，后续继续进入大学数学、应用专题和研究方向。教材正文位于 `textbook/`，中小学分章正文位于 `textbook/k12/`，网站模板位于 `_layouts/`，静态样式和脚本位于 `assets/`。

中小学主题与章节的逐项对应见[中国中小学数学课程覆盖索引](https://yuanwenbo1.github.io/mathematics/k12-coverage/)。

配套训练见[训练题库与分级检测](https://yuanwenbo1.github.io/mathematics/exercises/)，其中小学、初中、高中各有 200 道基础题，共 600 题，并附参考答案和错题复练建议。

连续学习顺序见[中小学连续学习路线](https://yuanwenbo1.github.io/mathematics/continuity/)，其中明确教材章节与题组的对应、正确率门槛、错题复测和小学到初中、初中到高中、高中到大学的衔接条件。

后续教材按“一课一核心”拆分：文章数量增加用于补足课时、例题和训练，不通过重复叙述扩充篇幅；代码和跨领域应用放在数学主线之后作为选学。

## 本地预览

安装 Ruby 和 Jekyll 后运行：

```bash
jekyll serve --baseurl ""
```

然后访问 `http://127.0.0.1:4000/`。

## 发布教材

教材 Markdown 需要在文件开头保留 Front Matter：

```yaml
---
layout: book
title: 教材标题
permalink: /books/example/
search: true
---
```

新增教材后，同时在 `_data/curriculum.yml` 中加入导航信息。推送到 `main` 分支后，GitHub Actions 会使用 Jekyll 构建并发布到 GitHub Pages。

小学、初中和高中采用“学段入口页 + 每章一个 Markdown 文件”的结构：

```text
textbook/k12/primary/   小学分章正文
textbook/k12/junior/    初中分章正文
textbook/k12/senior/    高中分章正文
_data/k12_chapters.json 分章标题、顺序、地址和摘要
```

调整章节正文时直接编辑对应的分章文件。新增、删除或调整章节顺序时，还要同步修改 `_data/k12_chapters.json` 以及相邻章节 Front Matter 中的 `prev_url`、`next_url`；三个原有学段文件只作为总览和分章入口，不再承载全部正文。

## PWA 应用

网站支持安装到手机或电脑桌面，并预缓存教材、题库、搜索索引和必要图片。核心文件如下：

- `manifest.webmanifest`：应用名称、图标、启动地址和快捷入口；
- `service-worker.js`：整站预缓存、访问缓存、离线兜底和版本更新；
- `offline.md`：无法命中缓存时显示的离线页面；
- `assets/icons/`：普通、可遮罩和 Apple Touch 应用图标。

PWA 必须通过 HTTPS 或 `localhost` 测试。修改缓存内容时无需手工维护版本号，Jekyll 每次构建都会生成新的缓存版本；已安装的用户会收到更新提示。

## Android 离线应用

Android 应用使用 Capacitor 封装网站，并把发布时的全部教材、题库、图片和搜索资源打入 APK。安装后无需联网即可阅读；学习进度和错题状态保存在应用本地，不会在教材更新时被覆盖。

应用导航中的“检查更新”会从 GitHub Pages 拉取最新教材包。APP 启动、回到前台或网络恢复时也会自动检查；发现新课程后弹出更新说明，由用户选择“稍后”或“下载并更新”。Android 系统还会每隔数小时在后台检查一次静态版本清单，发现新版本时发送本地通知，不依赖 Firebase、账号系统或单独的消息服务器。

下载前会核对发布版本、文件大小、页面数量和 SHA-256，校验失败时保留原有离线教材。更新包只包含教材正文、图片和搜索索引，不包含可执行脚本。

更新架构保持为三个静态层次：

1. APK 内置完整教材，任何时候都能离线阅读；
2. `app-content-version.json` 只负责声明最新版本、大小和校验值；
3. `app-content.json` 是可选下载的课程内容包，校验成功后原子写入本地数据库。

后台通知采用 Android 系统定时任务主动检查版本清单。这不是实时云推送，系统可能根据电量和网络状况延后检查，但它不需要维护后端服务，符合本项目优先简单、可靠和低成本的目标。

本地构建需要 Node.js 22、JDK 21 和 Android SDK 36：

```powershell
npm ci
npm run build:runtime
# 先用 Jekyll 构建 _site，或从已发布网站生成离线镜像
npm run app:mirror
npm run cap:sync
cd android
.\gradlew.bat assembleDebug
```

调试安装包生成在 `android/app/build/outputs/apk/debug/app-debug.apk`。推送到 `main` 后，GitHub Actions 也会自动构建并保存 30 天可下载的 APK 构建产物。正式公开分发前应另行配置私有签名密钥并生成 release 包，签名密钥不能提交到仓库。

## 联系与反馈

如果你发现教材内容有错误、网站使用有问题，或希望沟通项目合作，可以发送邮件至 [624799284@qq.com](mailto:624799284@qq.com)。为了便于定位问题，反馈时请尽量附上教材名称、页面地址和问题描述。

## 赞赏支持

如果这套教材对你有帮助，可以通过下面的微信赞赏码自愿支持项目维护。GitHub Sponsors 或 Gitee 赞赏通道开通后，也会在这里提供官方入口。

<p align="center">
  <img src="assets/images/wechat-support.png" alt="微信赞赏码" width="320">
</p>

> **声明：**所有赞赏均为自愿、无偿支持，不解锁任何功能，不提供售后、答疑、定制开发、商用授权或其他附加权益。是否赞赏不会影响教材内容、代码功能、更新获取或正常使用。

赞赏收入将按照适用法律法规履行申报及纳税义务。

<!-- 官方赞助渠道开通后，在此添加经过验证的 GitHub Sponsors 或 Gitee 赞赏链接。 -->
