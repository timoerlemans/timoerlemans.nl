---
layout: 'layouts/page.html'
title: 'Tim Oerlemans'
description: 'Persoonlijke website van Tim Oerlemans — software, boeken en wat er tussendoor gebeurt.'
---

<h1 class="hero__tagline">Software,<br>boeken & leven.</h1>
<hr class="rule">
<p class="hero__intro">Ik schrijf over softwareontwikkeling, de boeken die ik lees en alles wat er tussendoor gebeurt. Front-end developer in Nederland, werkzaam bij <a href="https://www.vanspaendonck.nl/" rel="noopener noreferrer" target="_blank">Van Spaendonck</a>.</p>

<a class="substack-cta" href="https://oerlemans.substack.com" rel="noopener noreferrer" target="_blank">Abonneer op Substack →</a>

{% if substack.length > 0 %}
<section class="posts-section" aria-labelledby="recent-posts">
  <h2 class="section-label" id="recent-posts">Recente posts</h2>
  {% for post in substack | first(5) %}
  <div class="post-item">
    <a class="post-item__title" href="{{ post.url }}" rel="noopener noreferrer" target="_blank">{{ post.title }}</a>
    <time class="post-item__date" datetime="{{ post.date | date('yyyy-MM-dd') }}">{{ post.date | date('d MMMM yyyy', 'nl') }}</time>
    {% if post.teaser %}<p class="post-item__teaser">{{ post.teaser }}</p>{% endif %}
  </div>
  {% endfor %}
</section>
{% endif %}
