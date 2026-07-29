---
layout: base
title: 学习首页
description: 从数感和代数起步，逐步进入本科数学基础、证明训练和研究方向。
permalink: /
search: false
---

<section class="learning-intro">
  <div class="site-container">
    <p class="eyebrow">系统学习路线</p>
    <h1>数学自学教材</h1>
    <p class="intro-lead">从数感和代数起步，经过本科数学基础，最终进入证明训练和研究方向。按知识依赖向前走，每一步都用例题、练习和代码验证。</p>
    <div class="intro-actions">
      <a class="button primary" id="continue-learning" href="{{ '/books/prelude/' | relative_url }}">开始第一册 <span>→</span></a>
      <a class="button secondary" href="{{ '/guide/' | relative_url }}">查看学习方法</a>
    </div>
  </div>
</section>

<section class="home-progress-section">
  <div class="site-container home-progress" aria-label="教材学习进度">
    <div>
      <span>全套进度</span>
      <strong id="home-progress-count">0 / 11 册</strong>
    </div>
    <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="home-progress-track"><span id="home-progress-value"></span></div>
    <b id="home-progress-percent">0%</b>
  </div>

  <div class="site-container learning-principles" aria-label="学习方式">
    <div><span>01</span><strong>按依赖前进</strong><small>主线顺序清晰</small></div>
    <div><span>02</span><strong>每天 45-90 分钟</strong><small>阅读、手算、复述</small></div>
    <div><span>03</span><strong>用代码验证</strong><small>把抽象概念跑出来</small></div>
  </div>
</section>

<section class="curriculum-section">
  <div class="site-container">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Curriculum</p>
        <h2>完整学习路径</h2>
      </div>
      <a href="{{ '/dependencies/' | relative_url }}">查看知识依赖图 →</a>
    </div>

{%- for stage in site.data.curriculum.stages %}
<section class="stage-row">
  <header>
    <h3>{{ stage.title }}</h3>
    <p>{{ stage.description }}</p>
  </header>
  <div class="course-list">
{%- for book in stage.books %}
    <a class="course-row" href="{{ book.url | relative_url }}" data-course-id="{{ book.id }}">
      <span class="course-code">{{ book.code }}</span>
      <span class="course-copy">
        <small>{{ book.level }}</small>
        <strong>{{ book.title }}</strong>
        <em>{{ book.description }}</em>
      </span>
      <span class="course-duration">{{ book.duration }}</span>
      <i class="course-status" aria-label="未完成"></i>
    </a>
{%- endfor %}
  </div>
</section>
{%- endfor %}
  </div>
</section>

<section class="concept-band">
  <div class="site-container concept-grid">
    <div>
      <p class="eyebrow">Visual Learning</p>
      <h2>先看懂关系，再记住公式</h2>
      <p>教材会用函数图像、矩阵变换和迭代过程解释抽象概念。第 1 册已经包含函数机器、斜率变化、二次函数开口和单位圆动画。</p>
      <a href="{{ '/books/functions/' | relative_url }}">进入函数与初等数学 →</a>
    </div>
    <figure>
      <img src="{{ '/textbook/assets/functions/function-machine.png' | relative_url }}" alt="函数机器把输入按照规则变成输出">
      <figcaption>函数就是输入经过规则得到输出。</figcaption>
    </figure>
  </div>
</section>
