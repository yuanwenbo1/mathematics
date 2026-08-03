---
layout: book
title: "高中数学 · 第 15 章：平面向量与复数"
description: "向量同时具有大小和方向。相等向量长度相等且方向相同，零向量方向不确定。向量加法满足平行四边形法则，数乘改变长度并可能改变方向。"
permalink: /books/functions/chapter-15/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-15
prev_url: /books/functions/chapter-14/
prev_title: "第 14 章：三角函数与解三角形"
next_url: /books/functions/chapter-16/
next_title: "第 16 章：立体几何初步"
search: true
---

# 第 15 章：平面向量与复数

### 15.1 平面向量

向量同时具有大小和方向。相等向量长度相等且方向相同，零向量方向不确定。向量加法满足平行四边形法则，数乘改变长度并可能改变方向。

平面向量基本定理：若 `e1,e2` 不共线，则任意平面向量 `a` 都能唯一表示为：

```text
a = λe1 + μe2
```

![向量加法的平行四边形法则]({{ '/textbook/assets/senior/vector-addition.svg' | relative_url }})

*把两个向量移到同一起点，以它们为邻边作平行四边形，对角线就是向量和。*

### 15.2 坐标运算与数量积

设 `a=(x1,y1), b=(x2,y2)`：

```text
a+b = (x1+x2, y1+y2)
a·b = x1x2 + y1y2 = |a||b|cosθ
```

`a·b=0` 且两向量非零时，两向量垂直。向量数量积可计算夹角、长度和投影，也可处理功等物理量。

### 15.3 复数

规定 `i^2=-1`，复数写成 `z=a+bi`。`a` 是实部，`b` 是虚部。复数相等要求实部、虚部分别相等。

```text
(a+bi)+(c+di) = (a+c)+(b+d)i
(a+bi)(c+di) = (ac-bd)+(ad+bc)i
```

共轭复数为 `a-bi`，模为 `|z|=√(a^2+b^2)`。复数可与复平面上的点或向量对应，使代数与几何相连。
