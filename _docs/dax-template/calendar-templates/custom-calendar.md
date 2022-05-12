---
layout:     page
title:      Custom calendar
published:  true
order:      /
---

The Custom calendar creates a Gregorian calendar compatible with [Custom time-related calculations](https://www.daxpatterns.com/custom-time-related-calculations/), which is based on DAX code that can support non-standard calculations and it does not use the standard DAX time-intelligence functions.

The following are the global variables that can be customized in the [DefaultVariables](./../configuration/config-object/custom-table.md#defaultvariables) setting of the template configuration.
All the global variables are defined as strings in the JSON configuration, even when the content is a number.

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

## __WorkingDays
By default it uses the [WorkingDays](../configuration/config-object/holidays.md#workingdays) configuration in the global configuration. If specified, it overrides the global configuration setting. It is a string defined as described in [WorkingDays](../configuration/config-object/holidays.md#workingdays). 

## __WorkingDayType
Description of working days for the Working Day column.

## __NonWorkingDayType
Description of non-working days for the Working Day column.
