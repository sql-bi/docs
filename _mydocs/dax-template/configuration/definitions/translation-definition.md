---
layout:     page
title:      Translation.Definition
published:  true
order:      /
---

A single Translation.Definition object includes an array for all the available translations.

```json
  "Translations": [
    {
      "Iso": "it",
      "Table": {...},
      "Columns": [...],
      "Hierarchies": [...],
      "Measures": [...]
    },
    ...
  ]
```

## Translations
Array of [Language](./language.md) objects, one for each supported ISO localization. 
