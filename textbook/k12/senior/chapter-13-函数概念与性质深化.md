---
layout: book
title: "高中数学 · 第 13 章：函数概念与性质深化"
description: "前十章已介绍常见函数，本章建立高中统一研究方法。"
permalink: /books/functions/chapter-13/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-13
prev_url: /books/functions/chapter-06/
prev_title: "第 6 章：对数函数"
next_url: /books/functions/chapter-07/
next_title: "第 7 章：三角函数"
search: true
---

# 第 13 章：函数概念与性质深化

前十章已介绍常见函数，本章建立高中统一研究方法。

### 13.1 单调性、奇偶性、最值与周期性

- 单调性描述函数在区间上随自变量增大而增大或减小。
- 偶函数满足 `f(-x)=f(x)`，图像关于 `y` 轴对称。
- 奇函数满足 `f(-x)=-f(x)`，图像关于原点对称。
- 周期函数存在非零常数 `T`，使 `f(x+T)=f(x)`。

判断性质前必须先看定义域是否关于原点对称，证明单调性要比较任意 `x1<x2` 时函数值的大小，不能只看几个点。

### 13.2 幂函数、指数函数与对数函数

幂函数 `y=x^α` 的定义域和性质随指数变化。指数函数 `y=a^x` 与对数函数 `y=log_a x` 互为反函数：当 `a>1` 时都递增，当 `0<a<1` 时都递减。

运算规则：

```text
log_a(MN) = log_a M + log_a N
log_a(M/N) = log_a M - log_a N
log_a(M^r) = r log_a M
log_a b = ln b / ln a
```

所有对数运算都要求真数为正。

### 13.3 函数零点与模型

若连续函数在区间端点函数值异号，则区间内至少有一个零点。二分法不断缩小异号区间，可以求方程近似解。

模型选择示例：固定增量适合一次函数，固定增长率适合指数函数，先增长后下降且有极值的关系可能适合二次函数。模型只是对现实的简化，结论必须限定在合理定义域内。
