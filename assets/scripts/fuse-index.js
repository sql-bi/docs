---
---
var searchIndex = [{% for collection in site.collections %}{% assign colsize = collection.files | size %}{% if colsize > 0 %}{% for page in site[collection.label] %}
    {
        "id": "{{ page.id | slugify }}",
        "url": "{{ page.url | remove: 'index.html' }}",
        "title": "{{ page.title }}",
        "content": `{{ page.content | strip_html | remove:'"' }}`
    }{% unless forloop.last %},{% endunless %}{% endfor %}{% endif %}{% endfor %}
];