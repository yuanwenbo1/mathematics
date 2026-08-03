---
layout: book
title: "高中数学 · 第 18 章：数列与数学归纳法"
description: "数列按确定顺序排列，每一项有唯一序号，可用通项公式、递推公式、列表或图像表示。由递推式确定数列时还必须给出足够的初始条件。"
permalink: /books/functions/chapter-18/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-18
prev_url: /books/functions/chapter-10/
prev_title: "第 10 章：本册综合练习"
next_url: /books/functions/chapter-19/
next_title: "第 19 章：导数及其应用"
search: true
---

# 第 18 章：数列与数学归纳法

### 18.1 数列是离散函数

数列按确定顺序排列，每一项有唯一序号，可用通项公式、递推公式、列表或图像表示。由递推式确定数列时还必须给出足够的初始条件。

### 18.2 等差数列

```text
an = a1 + (n-1)d
Sn = n(a1+an)/2 = na1 + n(n-1)d/2
```

等差数列的点 `(n,an)` 落在一条直线上，体现它与一次函数的联系。

### 18.3 等比数列

```text
an = a1 q^(n-1)
当 q != 1：Sn = a1(1-q^n)/(1-q)
当 q = 1：Sn = na1
```

等比数列与指数函数相连，可描述复利、人口变化和衰减等离散过程。使用模型时要说明公比和时间间隔。

### 18.4 数学归纳法

证明与正整数 `n` 有关的命题：

1. 验证起始值成立。
2. 假设 `n=k` 时成立。
3. 在该假设下证明 `n=k+1` 时成立。

两步缺一不可。归纳假设不是结论本身，而是连接相邻情形的桥梁。
