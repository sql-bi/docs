---
layout:     page
title:      Date Template
published:  true
order:      /
---

Configuration specific for date table template. Bravo has a simplified configuration and assigns the same First Year value to both [FirstYearMin](#firstyearmin) and [FirstYearMax](#firstyearmax), and the same Last Year value to both [LastYearMin](#lastyearmin) and [LastYearMax](#lastyearmax).

## FirstYearMin
If defined, it is the minimum value for the first year generated in the Date table. If the year found by the automatic scan is less than [FirstYearMin](#firstyearmin), then the Date table will start from the [FirstYearMin](#firstyearmin) year.

## FirstYearMax
If defined, it is the maximum value for the first year generated in the Date table. If the year found by the automatic scan is greater than [FirstYearMax](#firstyearmax), then the Date table will start from the [FirstYearMax](#firstyearmax) year.

## LastYearMin
If defined, it is the minimum value for the last year generated in the Date table. If the year found by the automatic scan is less than [LastYearMin](#lastyearmin), then the Date table will start from the [LastYearMin](#lastyearmin) year.

## LastYearMax
If defined, it is the maximum value for the first year generated in the Date table. If the year found by the automatic scan is greater than [LastYearMax](#lastyearmax), then the Date table will start from the [LastYearMax](#lastyearmax) year.

## HolidaysReference
Configuration for holidays used to create working and non-working days in the Date table.

### IsEnabled
Use **true** to generate the Date table using the Holidays table, or **false** to ignore holidays related information.

### TableName
Name of the Holidays table.

### DateColumnName
Name of the column of Date data type in the Holidays table.

### HolidayColumnName
Name of the column of type string containing the name of the holiday for each corresponding date in the Holidays table. 
