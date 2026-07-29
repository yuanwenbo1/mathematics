---
layout: base
title: 学习首页
description: 面向所有自学者，完整覆盖中国小学、初中和高中数学，并继续通向大学数学。
permalink: /
search: false
---

<section class="learning-intro">
  <div class="site-container">
    <p class="eyebrow">系统学习路线</p>
    <h1>数学自学教材</h1>
    <p class="intro-lead">面向所有想系统自学数学的学生，从中国小学、初中和高中课程开始，继续通向大学数学、证明训练和研究方向。按知识依赖学习，每一步都有讲解、例题、练习和验收。</p>
    <div class="intro-actions">
      <a class="button primary" id="continue-learning" href="{{ '/books/prelude/' | relative_url }}">从小学数学开始 <span>→</span></a>
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
    <div><span>03</span><strong>练习并验收</strong><small>会解释，也会解决问题</small></div>
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
      <p>教材会用实物、图表、几何图形和函数图像解释抽象概念。中小学三册按国家课程标准组织，也适合成年人从任意缺口开始自学。</p>
      <a href="{{ '/k12-coverage/' | relative_url }}">查看中小学课程覆盖索引 →</a>
    </div>
    <figure>
      <img src="{{ '/textbook/assets/functions/function-machine.png' | relative_url }}" alt="函数机器把输入按照规则变成输出">
      <figcaption>函数就是输入经过规则得到输出。</figcaption>
    </figure>
  </div>
</section>
