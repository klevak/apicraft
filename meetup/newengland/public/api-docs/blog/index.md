---
layout: default
title: "PIF @ VA"
published: true
---

## Developers @ VA

{% for post in site.posts limit:5000 %}

### [{{ post.title }}](/va-developer{{ post.url }})

{{ post.date | date:"%m-%d-%Y" }}

<img src="{{ post.image }}" width="175" align="right" style="padding: 20px;" />
{{ post.content | strip_html | truncatewords: 200     }}...[View Full Blog Post](/va-developer{{ post.url }})    

- - -
{% endfor %}