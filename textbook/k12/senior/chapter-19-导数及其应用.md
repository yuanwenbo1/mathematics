---
layout: book
title: "高中数学 · 第 19 章：导数及其应用"
description: "函数在区间上的平均变化率："
permalink: /books/functions/chapter-19/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-19
prev_url: /books/functions/chapter-18/
prev_title: "第 18 章：数列与数学归纳法"
next_url: /books/functions/chapter-17/
next_title: "第 17 章：必修概率与统计"
search: true
---

# 第 19 章：导数及其应用

### 19.1 从平均变化率到瞬时变化率

函数在区间上的平均变化率：

```text
[f(x0+Δx)-f(x0)] / Δx
```

当 `Δx` 趋近 0，若比值趋近确定值，就得到 `f` 在 `x0` 处的导数。导数表示瞬时变化率，几何上是切线斜率。

![割线趋近切线并得到导数]({{ '/textbook/assets/senior/derivative-tangent.svg' | relative_url }})

*点 `Q` 沿曲线靠近 `P` 时，割线斜率趋近切线斜率。*

### 19.2 基本求导规则

```text
(c)' = 0
(x^n)' = nx^(n-1)
(e^x)' = e^x
(ln x)' = 1/x
(sin x)' = cos x
(cos x)' = -sin x
(u±v)' = u'±v'
(uv)' = u'v+uv'
(u/v)' = (u'v-uv')/v^2
```

简单复合函数 `f(ax+b)` 还要乘内部函数导数 `a`。

### 19.3 用导数研究函数

在区间上 `f'(x)>0` 时函数递增，`f'(x)<0` 时函数递减。极值点通常在导数为 0 或导数不存在处寻找，并通过导数左右符号变化判断。

例：`f(x)=x^3-3x`，`f'(x)=3x^2-3=3(x-1)(x+1)`。根据符号表可得：

```text
(-∞,-1) 递增
(-1,1) 递减
(1,+∞) 递增
```

所以 `x=-1` 为极大值点，`x=1` 为极小值点。

### 19.4 优化问题

优化建模要明确自变量、目标函数、定义域，再求驻点和边界值。不能只求 `f'(x)=0` 就宣布最值，还要检查端点、不可导点和现实约束。
