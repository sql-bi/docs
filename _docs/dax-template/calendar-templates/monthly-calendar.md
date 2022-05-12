---
layout:     page
title:      Monthly calendar
published:  true
order:      20
---

The monthly calendar template creates a 
Gregorian calendar for monthly-based reports that can be used with the [Month-related calculations](https://www.daxpatterns.com/month-related-calculations/).

The following are the global variables that can be customized in the [DefaultVariables](./../configuration/config-object/custom-table.md#defaultvariables) setting of the template configuration.
All the global variables are defined as strings in the JSON configuration, even when the content is a number.

## __FirstFiscalMonth
Month number (1-12) of the first fiscal month of the year.

## __MonthsInYear
Number of months in one year. It must be 12 when the template generates a Date table. In future versions of the template that generate one row for each month without using a Date column, this number could be 13 to support accounting calendars that have an additional month for adjusting journal entry transactions.