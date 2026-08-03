---
layout: book
title: "高中数学 · 第 3 章：二次函数"
description: "二次函数："
permalink: /books/functions/chapter-03/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-03
prev_url: /books/functions/chapter-02/
prev_title: "第 2 章：一次函数"
next_url: /books/functions/chapter-04/
next_title: "第 4 章：反比例函数、绝对值函数和分段函数"
search: true
---

# 第 3 章：二次函数

### 3.1 形式

二次函数：

```text
y = ax^2 + bx + c
```

其中 `a ≠ 0`。如果 `a = 0`，这一项就不是二次项，函数会退化成一次函数。

最简单的例子：

```text
y = x^2
```

图像是一条抛物线。

### 3.2 开口方向

`a` 决定抛物线开口方向。

```text
a > 0：开口向上，有最小值。
a < 0：开口向下，有最大值。
```

下面这个动态图只改变 `a`，你可以观察抛物线怎样从向下开口变成向上开口。

![二次函数开口变化动态图]({{ '/textbook/assets/functions/quadratic-opening.gif' | relative_url }})

### 3.3 顶点

二次函数有最大值或最小值。

例如：

```text
y = x^2
```

最小值是 0，在 `x = 0` 处取得。

这个点叫顶点。

### 3.4 配方与顶点

把一般式配成顶点式，能直接读出顶点和最值：

```text
y = x^2 - 4x + 7
  = (x - 2)^2 + 3
```

因为 `(x - 2)^2 >= 0`，所以函数在 `x = 2` 时取得最小值 `3`，顶点是 `(2, 3)`。
