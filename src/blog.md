---
title: Blog
layout: layouts/page.html
---



<div>
{%- if collections.blogposts.length > 0 -%}
## Blogposts
<ul>
{%- for post in collections.blogposts -%}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a> ({{post.data.postDate}})</li>
{%- endfor -%}
</ul>
{%- else -%}
    <p>Nothing to see here yet... Come back in a little while.</p>
{%- endif -%}
</div>
