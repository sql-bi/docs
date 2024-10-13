---
---
var searchIndex = [{% for collection in site.collections %}{% assign colsize = collection.files | size %}{% if colsize > 0 %}{% for page in site[collection.label] %}{% unless page.unlisted %}{% unless page.redirect %}
{
"id": "{{ page.id | slugify }}",
"url": "{{ page.url | remove: 'index.html' }}",
"title": "{{ page.title }}",
"content": `{{ page.content | strip_html | newline_to_br | replace: '<br />', ' ' | strip_newlines | remove:'"' | remove:'`' }}`
}{% endunless %}{% endunless %}{% unless forloop.last %},{% endunless %}{% endfor %}{% endif %}{% endfor %}
];