---
layout: book
title: "高中数学 · 第 14 章：三角函数与解三角形"
description: "以 x 轴正半轴为始边，逆时针为正角，顺时针为负角。弧度定义为弧长与半径之比："
permalink: /books/functions/chapter-14/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-14
prev_url: /books/functions/chapter-07/
prev_title: "第 7 章：三角函数"
next_url: /books/functions/chapter-15/
next_title: "第 15 章：平面向量与复数"
search: true
---

# 第 14 章：三角函数与解三角形

### 14.1 任意角、弧度制与单位圆

以 `x` 轴正半轴为始边，逆时针为正角，顺时针为负角。弧度定义为弧长与半径之比：

```text
180° = π rad
弧长 l = αr
扇形面积 S = αr^2/2
```

单位圆上终边与圆交于 `(x,y)`，则 `cos α=x, sin α=y`，当 `x!=0` 时 `tan α=y/x`。

### 14.2 诱导公式与基本恒等式

```text
sin^2 α + cos^2 α = 1
tan α = sin α / cos α
sin(-α) = -sin α
cos(-α) = cos α
sin(α+2π) = sin α
cos(α+2π) = cos α
```

应通过单位圆理解符号和周期，不要把诱导公式当作互不相关的口诀。

### 14.3 和差角与倍角

```text
sin(α+β) = sinα cosβ + cosα sinβ
cos(α+β) = cosα cosβ - sinα sinβ
sin 2α = 2sinα cosα
cos 2α = cos^2α - sin^2α
```

化简时先观察角之间的关系，再决定展开还是合并。

### 14.4 正弦定理与余弦定理

在三角形 `ABC` 中，边 `a,b,c` 分别对应角 `A,B,C`：

```text
a/sin A = b/sin B = c/sin C = 2R
a^2 = b^2 + c^2 - 2bc cos A
S = 1/2 * bc * sin A
```

正弦定理适合已知两角一边或两边及其中一边的对角；余弦定理适合已知两边及夹角或三边。SSA 情形可能有两解、一解或无解，必须结合三角形条件判断。
