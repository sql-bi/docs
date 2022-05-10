---
layout:     page
title:      Holidays Table
published:  true
order:      /
---

The HolidaysTable class creates a table with two columns, Holiday Date and Holiday Name, with all the holidays generated from the [Holidays Definition Table](./holidays-definition-table.md) for the range of years specified by the [Holidays Configuration](../configuration/config-object/index.md#holidays).

The DAX code of the calculated table generated includes the business logic to support all the possible calculations supported by the [Holidays Definition Table](./holidays-definition-table.md), without removing the code not required by the configuration used.