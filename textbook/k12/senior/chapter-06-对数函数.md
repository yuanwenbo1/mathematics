---
layout: book
title: "高中数学 · 第 6 章：对数函数"
description: "对数回答的问题是："
permalink: /books/functions/chapter-06/
category: "高中数学"
book_id: functions
chapter_id: functions-chapter-06
prev_url: /books/functions/chapter-05/
prev_title: "第 5 章：指数函数"
next_url: /books/functions/chapter-13/
next_title: "第 13 章：函数概念与性质深化"
search: true
---

# 第 6 章：对数函数

### 6.1 对数是什么

对数回答的问题是：

```text
底数要多少次方，才能得到这个数？
```

例如：

```text
log2(8) = 3
```

因为：

```text
2^3 = 8
```

对数函数里，底数也有要求：

```text
底数 a > 0 且 a ≠ 1
真数 x > 0
```

所以 `log2(8)` 有意义，但 `log2(-8)` 在实数范围内没有意义。

### 6.2 对数和指数互逆

```text
log_a(a^x) = x
```

这里默认 `a > 0` 且 `a ≠ 1`。

指数函数和对数函数互为反函数。图像上，它们关于 `y = x` 对称。

![指数函数和对数函数互逆]({{ '/textbook/assets/functions/exp-log-inverse.png' | relative_url }})

### 6.3 对数运算律

在真数为正、底数满足 `a > 0` 且 `a ≠ 1` 时：

```text
log_a(MN) = log_a(M) + log_a(N)
log_a(M/N) = log_a(M) - log_a(N)
log_a(M^n) = n log_a(M)
```

最小例题：`log_2(32) = log_2(2^5) = 5`。
