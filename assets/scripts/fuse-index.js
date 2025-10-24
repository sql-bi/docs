---
---
var searchIndex = [{% for collection in site.collections %}{% assign colsize = collection.files | size %}{% if colsize > 0 %}{% for page in site[collection.label] %}{% unless page.unlisted %}{% unless page.redirect %}
{
"id": {{ page.id | slugify | jsonify }},
"url": {{ page.url | remove: 'index.html' | jsonify }},
"title": {{ page.title | strip_html | strip_newlines | jsonify }},
"content": {{ page.content | strip_html | newline_to_br | replace: '<br />', ' ' | strip_newlines | jsonify }}
}{% endunless %}{% endunless %}{% unless forloop.last %},{% endunless %}{% endfor %}{% endif %}{% endfor %}
];