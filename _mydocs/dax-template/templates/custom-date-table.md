---
layout:     page
title:      Custom Date Table
published:  true
order:      /
---

The CustomDateTable template class creates a Date table using the configurations described in [Config](../configuration/config-object/index.md) and applying the business logic defined by the following definition. The [Custom Date Table](./custom-date-table.md) definition extends the generic [Custom Template Table](./custom-template-table.md) definition.

## CalendarType
Specify a single calendar type assigned to the Date table. When specified, it creates a list with a single item in [CalendarTypes](#calendartypes), ignoring the [CalendarTypes](#calendartypes) definition.

## CalendarTypes
Specify a list of calendar types assigned to the Date table. It is ignored if [CalendarType](#calendartype) is defined.
