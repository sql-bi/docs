---
layout:     page
title:      Scan
published:  true
order:      /
---

Configuration section for the automatic scan of the model to retrieve a date range for the Date table from existing date columns in the model.

## OnlyTablesColumns
List of tables and columns to include in the scan. If not specified, all the model columns are included by default if the *SelectedTablesColumns* [AutoScan](#autoscan) setting is active.

A table name includes all the Date columns of the specified table. Use fully qualified names like *'table name'[column name]* to include individual columns.

## ExceptTablesColumns
List of tables and columns to be excluded in the scan. This setting is used on when the *SelectedTablesColumns* [AutoScan](#autoscan) setting is active.

A table name excludes all the Date columns of the specified table. Use fully qualified names like *'table name'[column name]* to exclude individual columns.

## AutoScan
Defines the automatic scan to find the date range for a date table. Multiple settings can be active at the same time.

- **Disabled** (0): Does not scan data to find min/max date.
- **SelectedTablesColumns** (1): Scan [OnlyTablesColumns](#onlytablescolumns) excluding [ExceptTablesColumns](#excepttablescolumns).
- **ScanActiveRelationships** (2): Scan active relationships connected to the target Date table.
- **ScanInactiveRelationships** (4): Scan inactive relationships connected to the target Date table.
- **Full** (127): Use all the scan features.

