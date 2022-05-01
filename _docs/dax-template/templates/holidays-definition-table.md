---
layout:     page
title:      Holidays Definition Table
published:  true
order:      /
---

The HolidaysDefinitionTable class creates a table with the content specified in the [Holidays Definition](../configuration/definitions.md) configuration. The class does not have real parameters other than the list of holidays definition that populates the table.

~~~
{
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
    {
      "IsoCountry": "US",
      "MonthNumber": 1,
      "DayNumber": 0,
      "WeekDayNumber": 1,
      "OffsetWeek": 3,
      "OffsetDays": 0,
      "HolidayName": "Martin Luther King, Jr.",
      "SubstituteHoliday": "NoSubstituteHoliday",
      "ConflictPriority": 100
    },
    ...
~~~

The DAX calculated table generated is a single DATETABLE function that includes the content specified, replacing the [SubstituteHoliday](../configuration/definitions.md#substituteholiday) names with the corresponding integer values.

~~~
HolidaysDefinition = 
DATATABLE (
    "ISO Country", STRING,
    "MonthNumber", INTEGER,
    "DayNumber", INTEGER,
    "WeekDayNumber", INTEGER,
    "OffsetWeek", INTEGER,
    "OffsetDays", INTEGER,
    "HolidayName", STRING,
    "SubstituteHoliday", INTEGER,
    "ConflictPriority", INTEGER,
    "FirstYear", INTEGER,
    "LastYear", INTEGER,
    {
        { "US", 1, 1, 0, 0, 0, "New Year's Day", 0, 100, 0, 0 },
        { "US", 1, 0, 1, 3, 0, "Martin Luther King, Jr.", 0, 100, 0, 0 },
        ...
    }
)
~~~
