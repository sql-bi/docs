---
layout:     page
title:      Configuration
published:  true
order:      /
---

## Dax Template configuration files

The template configurations are described in JSON files. There are properties that can reference external JSON files, such as the *Template* attribute in the *Templates* list, and the *LocalizationFiles* list.
```JSON
{
  "Config": {
    "Templates": [
      {
        "Class": "HolidaysDefinitionTable",
        "Table": "HolidaysDefinition",
        "Template": "HolidaysDefinition.json",
        ...
      },
      {
        "Class": "HolidaysTable",
        "Table": "Holidays",
        "Template": null,
        ...
      },
      {
        "Class": "CustomDateTable",
        "Table": "Date",
        "Template": "DateTemplate-04.json",
        ...
      },
      {
        "Class": "MeasuresTemplate",
        "Table": null,
        "Template": "TimeIntelligence-04.json",
        ...
    ],
    "LocalizationFiles": [
      "DateLocalization-04.json"
    ],
    ...
  }
}
```

However, the external JSON files can be included in the main JSON file after the *Configuration* object, using a section with the same name of the JSON file but without the ".JSON" extension.

```JSON
{
  "Config": {
    "Templates": [
      {
        "Class": "HolidaysDefinitionTable",
        "Table": "HolidaysDefinition",
        "Template": "HolidaysDefinition.json",
        ...
      },
      {
        "Class": "HolidaysTable",
        "Table": "Holidays",
        "Template": null,
        ...
      },
      {
        "Class": "CustomDateTable",
        "Table": "Date",
        "Template": "DateTemplate-04.json",
        ...
      },
      {
        "Class": "MeasuresTemplate",
        "Table": null,
        "Template": "TimeIntelligence-04.json",
        ...
    ],
    "LocalizationFiles": [
      "DateLocalization-04.json"
    ],
    ...
  },
  "HolidaysDefinition": ...,
  "DateTemplate-04": ...,
  "TimeIntelligence-04": ...,
  "DateLocalization-04": ...
}
```

The [Config](config-object/index.md) object contains the complete configuration of the templates to apply.