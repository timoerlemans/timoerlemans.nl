---
title: Blog
layout: 'layouts/page.html'
description: 'Alle posts van Tim Oerlemans op Substack — software, boeken en wat er tussendoor gebeurt.'
---

<h1>Blog</h1>
<hr class="rule">

{% if substack.length > 0 %}
<div class="posts-section">
  {% for post in substack %}
  <div class="post-item">
    <a class="post-item__title" href="{{ post.url }}" rel="noopener noreferrer" target="_blank">{{ post.title }}</a>
    <time class="post-item__date" datetime="{{ post.date | date('yyyy-MM-dd') }}">{{ post.date | date('d MMMM yyyy', 'nl') }}</time>
    {% if post.teaser %}<p class="post-item__teaser">{{ post.teaser }}</p>{% endif %}
  </div>
  {% endfor %}
</div>
{% else %}
<p>Geen posts gevonden. Probeer het later opnieuw of bezoek <a href="https://oerlemans.substack.com" rel="noopener noreferrer" target="_blank">Substack</a> direct.</p>
{% endif %}
