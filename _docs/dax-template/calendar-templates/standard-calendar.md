---
layout:     page
title:      Standard calendar
published:  true
order:      1
---

The standard calendar template creates a 
regular Gregorian calendar that can be used with the [Standard time-related calculations](https://www.daxpatterns.com/standard-time-related-calculations/).

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
