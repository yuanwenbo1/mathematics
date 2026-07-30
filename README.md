# 数学自学教材网站

这是一个基于 GitHub Pages + Jekyll 的中文数学学习网站，面向所有希望系统自学数学的学生。前三册按中国现行课程标准完整覆盖小学、初中和高中数学，后续继续进入大学数学、应用专题和研究方向。教材正文位于 `textbook/`，网站模板位于 `_layouts/`，静态样式和脚本位于 `assets/`。

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
