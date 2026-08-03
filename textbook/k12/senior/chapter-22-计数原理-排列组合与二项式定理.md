---
layout: book
title: "高中数学 · 第 22 章：计数原理、排列组合与二项式定理"
description: "分类完成任务，各类互不重叠且覆盖全部，使用分类加法计数原理；分步完成任务，每一步都必须完成，使用分步乘法计数原理。先判断“分类”还是“分步”，再列式。"
permalink: /books/functions/chapter-22/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-22
prev_url: /books/functions/chapter-17/
prev_title: "第 17 章：必修概率与统计"
next_url: /books/functions/chapter-23/
next_title: "第 23 章：条件概率、随机变量与统计推断"
search: true
---

# 第 22 章：计数原理、排列组合与二项式定理

### 22.1 两个计数原理

分类完成任务，各类互不重叠且覆盖全部，使用分类加法计数原理；分步完成任务，每一步都必须完成，使用分步乘法计数原理。先判断“分类”还是“分步”，再列式。

### 22.2 排列与组合

```text
排列数 A(n,m) = n!/(n-m)!
组合数 C(n,m) = n!/[m!(n-m)!]
```

排列关注顺序，组合不关注顺序。有限制条件时可用直接法、间接法、捆绑法、插空法或分类讨论，但各类必须不重不漏。

### 22.3 二项式定理

```text
(a+b)^n = Σ C(n,k) a^(n-k)b^k，k=0,...,n
```

通项 `C(n,k)a^(n-k)b^k` 可用于求指定项、常数项和系数。二项式系数满足对称性 `C(n,k)=C(n,n-k)`。
