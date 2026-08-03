---
layout: book
title: "高中数学 · 第 21 章：平面解析几何"
description: "直线方程常用点斜式、两点式和一般式 Ax+By+C=0。两直线平行或垂直可由斜率判断，竖直线需要单独处理。"
permalink: /books/functions/chapter-21/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-21
prev_url: /books/functions/chapter-20/
prev_title: "第 20 章：空间向量与立体几何"
next_url: /books/functions/chapter-08/
next_title: "第 8 章：数列和求和"
search: true
---

# 第 21 章：平面解析几何

### 21.1 直线与圆

直线方程常用点斜式、两点式和一般式 `Ax+By+C=0`。两直线平行或垂直可由斜率判断，竖直线需要单独处理。

```text
两点距离 = √((x2-x1)^2+(y2-y1)^2)
点 (x0,y0) 到直线 Ax+By+C=0 的距离
= |Ax0+By0+C|/√(A^2+B^2)
```

圆的标准方程：

```text
(x-a)^2+(y-b)^2=r^2
```

判断直线与圆、圆与圆的位置关系，可比较几何距离与半径，也可联立方程研究解的个数。

### 21.2 椭圆、双曲线与抛物线

- 椭圆：到两个定点的距离之和为常数。
- 双曲线：到两个定点的距离之差的绝对值为常数。
- 抛物线：到定点与定直线距离相等。

标准方程示例：

```text
椭圆：x^2/a^2 + y^2/b^2 = 1  （a>b>0）
双曲线：x^2/a^2 - y^2/b^2 = 1
抛物线：y^2 = 2px  （p>0）
```

椭圆、双曲线满足 `c^2=a^2-b^2`、`c^2=a^2+b^2`。研究圆锥曲线要同时使用定义、方程、图像和几何性质。

![椭圆、双曲线和抛物线的定义与形状对比]({{ '/textbook/assets/senior/conic-comparison.svg' | relative_url }})

*椭圆看距离和，双曲线看距离差，抛物线比较到焦点和准线的距离。*

### 21.3 直线与圆锥曲线综合

联立直线和曲线方程通常得到一元二次方程。判别式判断交点个数，根与系数关系处理弦长、中点和斜率问题。代数运算后必须检查几何条件和特殊斜率。
