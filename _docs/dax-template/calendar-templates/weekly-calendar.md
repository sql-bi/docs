---
layout:     page
title:      Weekly calendar
published:  true
order:      3
---

Whe Weekly calendar template creates a calendar for ISO 8601 or other week-based calendars (like 4-4-5) with 52 or 53 weeks in each year. It can be used with the [Week-related calculations](https://www.daxpatterns.com/week-related-calculations/).

The following are the global variables that can be customized in the [DefaultVariables](./../configuration/config-object/custom-table.md#defaultvariables) setting of the template configuration.
All the global variables are defined as strings in the JSON configuration, even when the content is a number.

For ISO calendar use:
- FiscalCalendarFirstMonth = 1 (ISO always starts in January)
- FirstDayOfWeek = 1 (ISO always starts on Monday)
- WeeklyType = "Nearest" (ISO use the nearest week type algorithm)

For US calendars where the fiscal year ends with the last Saturday of the month, use:
- FirstDayOfWeek = 0 (US weeks start on Sunday)
- WeeklyType = "Last"

For US calendars where the fiscal year ends with the Saturday nearest the end of the month, use:
- FirstDayOfWeek = 0 (US weeks start on Sunday)
- WeeklyType = "Nearest"

## __FirstFiscalMonth
Month number (1-12) of the first fiscal month of the year.

## __FirstDayOfWeek
First day of the week expressed as an integer number:
- 0: Sunday
- 1: Monday
- 2: Tuesday
- 3: Wednesday
- 4: Thursday
- 5: Friday
- 6: Saturday

## __TypeStartFiscalYear
Defines how to compute the start of the fiscal year:
- 0: First day of the fiscal year
- 1: Last day of fiscal year


## __QuarterWeekType

## __WeeklyType
Defines the method used to define the fiscal year:
- **Last**: Last Saturday of the month at fiscal year end. The fiscal year is defined as the final Saturday (if Sunday is selected as first day of the week) in the fiscal year end month.
- **Nearest**: Saturday nearest the end of month. The fiscal year is defined as the Saturday (if Sunday is selected as first day of the week) that falls closest to the last day of the fiscal year end month.

For a more complete description see [4-4-5 calendar](https://en.wikipedia.org/wiki/4%E2%80%934%E2%80%935_calendar) on Wikipedia.


## __WorkingDays
By default it uses the [WorkingDays](../configuration/config-object/holidays.md#workingdays) configuration in the global configuration. If specified, it overrides the global configuration setting. It is a string defined as described in [WorkingDays](../configuration/config-object/holidays.md#workingdays). 

## __WorkingDayType
Description of working days for the Working Day column.

## __NonWorkingDayType
Description of non-working days for the Working Day column.

## __OffsetYears
Increase the range of fiscal years before/after boundaries defined. For example, if "1" is used, then the calendar range adds two years, one before and one after the years obtained by the configuration (autoscan or manually defined).