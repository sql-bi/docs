---
layout:     page
title:      Language
published:  true
order:      /
---

Defines the translations for one template.
~~~
    {
      "Iso": "it",
      "Table": {...},
      "Columns": [...],
      "Hierarchies": [...],
      "Measures": [...]
    }
~~~

## Iso
Defines the ISO code of the localization, e.g. en-US.

## Table
Defines the localization of a table. It is unusual to translate a table in Bravo because the user can customize the table name.
~~~
      "Table": {
        "OriginalName": null,
        "Name": "",
        "Description": ""
      }
~~~

### OriginalName
Original table name.
### Name
Localized table name.
### Description
Localized table description.


## Measures
Array of objects defining the localization of a measure. Each object has the following properties.
~~~
     "Measures": [
        {
          "OriginalName": "Last Transaction Date",
          "Name": "Data Ultima Transazione",
          "Description": "",
          "DisplayFolders": "",
          "FormatString": "dd/mm/yyyy"
        },
        ...
      ]
~~~
### OriginalName
Original measure name.
### Name
Localized measure name.
### Description
Localized measure description.
### DisplayFolders
Localized display folder of the measure.
### FormatString
Localized format string of the measure.


## Columns
Array of objects defining the localization of a column. Each object has the following properties.

~~~
     "Columns": [
        {
          "OriginalName": "Year Month",
          "Name": "Anno Mese",
          "Description": "",
          "DisplayFolders": ""
        },
        ...
      ]
~~~

### OriginalName
Original column name.
### Name
Localized column name.
### Description
Localized column description.
### DisplayFolders
Localized display folder of the column.
### FormatString
Localized format string of the column.

## Hierarchies
Array of objects defining the localization of a hierarchy. Each object has the following properties.
~~~
      "Hierarchies": [
        {
          "OriginalName": "Fiscal",
          "Name": "Fiscale",
          "Description": "",
          "DisplayFolders": "",
          "Levels": [
            {
              "OriginalName": "Year",
              "Name": "Anno",
              "Description": ""
            },
            {
              "OriginalName": "Quarter",
              "Name": "Trimestre",
              "Description": ""
            },
            {
              "OriginalName": "Month",
              "Name": "Mese",
              "Description": ""
            }
          ]
        },
        ...
      ]
~~~

### OriginalName
Original hierarchy name.
### Name
Localized hierarchy name.
### Description
Localized hierarchy description.
### DisplayFolders
Localized display folder of the hierarchy.

### Levels
Array of objects defining the localization of a hierarchy level. Each object has the following properties.

#### OriginalName
Original hierarchy level name.

#### Name
Localized hierarchy level name.

#### Description
Localized hierarchy level description.

