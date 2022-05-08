---
layout:     page
title:      Definitions
published:  true
order:      /
---

The Dax Templates library has a number of definitions used by specific templates.

## HolidaysDefinition
The HolidaysDefinition template use the following definition to create a HolidaysDefinition table.

~~~
  "Holidays": [
    {
      "IsoCountry": "US",
      "MonthNumber": 1,
      "DayNumber": 1,
      "WeekDayNumber": 0,
      "OffsetWeek": 0,
      "OffsetDays": 0,
      "HolidayName": "New Year's Day",
      "SubstituteHoliday": "NoSubstituteHoliday",
      "ConflictPriority": 100
    },
    ...
~~~
 
### Holidays
Array of holidays, each defined as follows.

#### IsoCountry
Two-letter ISO code of the country.

#### MonthNumber
Number of month - use 99 for relative dates using Easter as a reference.

#### DayNumber
Absolute day (ignore [WeekDayNumber](#weekdaynumber) when other than 0).

#### WeekDayNumber
Day of the week, as a number:
- **0** : Sunday
- **1** : Monday
- **2** : Tuesday
- **3** : Wednesday
- **4** : Thursday
- **5** : Friday
- **6** : Saturday

#### OffsetWeek
Number of the week in the month, negative if the reference is the last one in the month
- **1** : first week
- **2** : second week
- ...
- **-2** : second-last week
- **-1** : last week

#### OffsetDays
Days to add after [OffsetWeek](#offsetweek) and [WeekDayNumber](#weekdaynumber) have been applied.

#### HolidayName
Name of the holiday.

#### SubstituteHoliday
Define the logic to move an holiday to another day in case the date is already a non-working day (e.g. "in lieu of...")

- **NoSubstituteHoliday** (0): no substitution.
- **SubstituteHolidayWithNextWorkingDay** (1): substitute the holiday with the next working day.
- **SubstituteHolidayWithNextNextWorkingDay** (2): substitute the holiday with the second next working day. Use only for the holiday immediately before another holiday marked with *SubstituteHolidayWithNextWorkingDay*.
For example, use *SubstituteHolidayWithNextNextWorkingDay* for Christmas and *SubstituteHolidayWithNextWorkingDay* for Boxing Day.
- **FridayIfSaturdayOrMondayIfSunday** (-1): if the holidays falls on a Saturday then it is observed on Friday; if it falls on a Sunday then it is observed on Monday.

#### ConflictPriority
Priority in case of two or more holidays in the same date.
A lower number corresponds to an higher priority.

For example, marking Easter relative days with 150 and other holidays with 100 means that other holidays take precedence over Easter-related days; use 50 for Easter related holidays to invert such a priority.

#### FirstYear
First year for the holiday, 0 if it is not defined.

#### LastYear
Last year for the holiday, 0 if it is not defined.

## TranslationDefinition

A single Translation.Definition object includes an array for all the available translations.

~~~
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
~~~

### Translations
Array of [Language](#language) objects, one for each supported ISO localization. 

## Language
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

### Iso
Defines the ISO code of the localization, e.g. en-US.

### Table
Defines the localization of a table. It is unusual to translate a table in Bravo because the user can customize the table name.
~~~
      "Table": {
        "OriginalName": null,
        "Name": "",
        "Description": ""
      }
~~~

#### OriginalName
Original table name.
#### Name
Localized table name.
#### Description
Localized table description.


### Measures
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
#### OriginalName
Original measure name.
#### Name
Localized measure name.
#### Description
Localized measure description.
#### DisplayFolders
Localized display folder of the measure.
#### FormatString
Localized format string of the measure.


### Columns
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

#### OriginalName
Original column name.
#### Name
Localized column name.
#### Description
Localized column description.
#### DisplayFolders
Localized display folder of the column.
#### FormatString
Localized format string of the column.

### Hierarchies
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

#### OriginalName
Original hierarchy name.
#### Name
Localized hierarchy name.
#### Description
Localized hierarchy description.
#### DisplayFolders
Localized display folder of the hierarchy.

#### Levels
Array of objects defining the localization of a hierarchy level. Each object has the following properties.

##### OriginalName
Original hierarchy level name.

##### Name
Localized hierarchy level name.

##### Description
Localized hierarchy level description.

