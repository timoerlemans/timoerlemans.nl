---
title: Blog
layout: layouts/page.html
---



<div>
{%- if collections.blog.length > 0 -%}
<h2>Blogposts</h2>
<ul>
{%- for post in collections.blog | reverse -%}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a> (<time datetime="{{ post.data.postDate | date('yyyy-MM-dd') }}">{{ post.data.postDate | date('d MMMM yyyy', post.data.lang) }}</time>)</li>
{%- endfor -%}
</ul>
{%- else -%}
    <p>Nothing to see here yet... Come back in a little while.</p>
{%- endif -%}
</div>
