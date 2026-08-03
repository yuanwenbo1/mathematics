---
layout: base
title: 学习首页
description: 面向所有自学者，完整覆盖中国小学、初中和高中数学，并继续通向大学数学。
permalink: /
search: false
---

<section class="home-workspace">
  <div class="site-container">
    <header class="workspace-heading">
      <div>
        <p class="eyebrow">数学自学教材</p>
        <h1>今天，从一个核心概念开始</h1>
        <p>按知识依赖逐步学习，每一节都经过讲解、例题、练习和验收。</p>
      </div>
      <a class="workspace-guide-link" href="{{ '/guide/' | relative_url }}">选择适合的起点 <span aria-hidden="true">→</span></a>
    </header>

    <div class="home-dashboard">
      <section class="continue-panel" aria-labelledby="continue-heading">
        <span class="panel-label">继续学习</span>
        <h2 id="continue-heading">小学数学 · 数数、数位和十进制</h2>
        <p>理解十进制位值，是后续四则运算和小数学习的基础。</p>
        <div class="continue-actions">
          <a class="button primary" id="continue-learning" href="{{ '/books/prelude/foundation-01/' | relative_url }}">开始学习 <span aria-hidden="true">→</span></a>
          <a class="text-link" href="{{ '/library/' | relative_url }}">查看全部教材</a>
        </div>

        <div class="resume-strip" id="resume-strip" hidden>
          <div>
            <span>上次学到</span>
            <strong id="resume-title">继续上次阅读</strong>
            <small id="resume-detail">阅读进度 0%</small>
          </div>
          <a class="resume-arrow" id="resume-link" href="{{ '/library/' | relative_url }}" aria-label="继续上次阅读">→</a>
        </div>
      </section>

      <aside class="progress-panel" aria-label="教材学习进度">
        <div class="progress-panel-head">
          <span class="panel-label">全套进度</span>
          <strong id="home-progress-percent">0%</strong>
        </div>
        <div class="home-progress">
          <div>
            <strong id="home-progress-count">0 / 11 册</strong>
            <span>学习状态保存在本机，离线也能继续查看</span>
          </div>
          <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="home-progress-track"><span id="home-progress-value"></span></div>
        </div>
        <dl class="progress-summary">
          <div><dt>中小学主线</dt><dd>3 册 · 75 章</dd></div>
          <div><dt>基础与进阶</dt><dd>8 册</dd></div>
          <div><dt>训练题库</dt><dd>600 题</dd></div>
        </dl>
      </aside>
    </div>

    <section class="daily-learning" aria-labelledby="daily-heading">
      <div class="daily-heading">
        <div>
          <span class="panel-label">今日学习</span>
          <h2 id="daily-heading">一次完整学习，建议 45-90 分钟</h2>
        </div>
        <a href="{{ '/continuity/' | relative_url }}">查看连续学习路线</a>
      </div>
      <ol class="daily-task-list">
        <li>
          <span class="task-number">01</span>
          <span class="task-copy"><strong>理解核心概念</strong><small>先看解释和图示，用自己的话复述</small></span>
          <span class="task-time">20 分钟</span>
          <a href="{{ '/books/prelude/foundation-01/' | relative_url }}" aria-label="开始理解核心概念">→</a>
        </li>
        <li>
          <span class="task-number">02</span>
          <span class="task-copy"><strong>跟做典型例题</strong><small>遮住答案，完整写出每一步理由</small></span>
          <span class="task-time">20 分钟</span>
          <a href="{{ '/books/prelude/foundation-01/' | relative_url }}" aria-label="开始跟做典型例题">→</a>
        </li>
        <li>
          <span class="task-number">03</span>
          <span class="task-copy"><strong>完成基础训练</strong><small>当场纠错，第二天再做一次错题</small></span>
          <span class="task-time">20-50 分钟</span>
          <a href="{{ '/exercises/primary/' | relative_url }}" aria-label="开始基础训练">→</a>
        </li>
      </ol>
    </section>
  </div>
</section>

<section class="curriculum-section home-curriculum">
  <div class="site-container">
    <div class="section-heading">
      <div>
        <p class="eyebrow">学习路径</p>
        <h2>从小学到大学，按依赖前进</h2>
      </div>
      <a href="{{ '/dependencies/' | relative_url }}">查看知识依赖图 <span aria-hidden="true">→</span></a>
    </div>

{%- for stage in site.data.curriculum.stages %}
<section class="stage-row" id="home-stage-{{ stage.id }}">
  <header>
    <span class="stage-index">0{{ forloop.index }}</span>
    <h3>{{ stage.title }}</h3>
    <p>{{ stage.description }}</p>
  </header>
  <div class="course-list">
{%- for book in stage.books %}
    {% assign book_chapters = site.data.k12_chapters[book.id] %}
    <a class="course-row" href="{{ book.url | relative_url }}" data-course-id="{{ book.id }}">
      <span class="course-code">{{ book.code }}</span>
      <span class="course-copy">
        <small>{{ book.level }}</small>
        <strong>{{ book.title }}</strong>
        <em>{{ book.description }}</em>
      </span>
      <span class="course-meta">{% if book_chapters %}{{ book_chapters.size }} 章{% else %}{{ book.duration }}{% endif %}</span>
      <i class="course-status" aria-label="未完成"></i>
      <span class="course-arrow" aria-hidden="true">→</span>
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
      <p class="eyebrow">直观理解</p>
      <h2>先看懂关系，再记住公式</h2>
      <p>教材用数轴、几何图形、表格和函数图像解释抽象概念。先建立直觉，再通过推理和训练把理解固定下来。</p>
      <a href="{{ '/k12-coverage/' | relative_url }}">查看中小学课程覆盖索引 →</a>
    </div>
    <figure>
      <img src="{{ '/textbook/assets/functions/function-machine.png' | relative_url }}" alt="函数机器把输入按照规则变成输出">
      <figcaption>函数就是输入经过规则得到输出。</figcaption>
    </figure>
  </div>
</section>
