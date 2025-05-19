---
layout:     page
title:      Item
published:  true
draft:      true
order:      /03
---

# Item

## Overview
The `Item` class in the `TCDX` object model represents an individual object within a [`Consumer`](./Consumer.md) that interacts with a tabular model. Examples of Items include:
- Pivot tables in an Excel workbook.
- Visual elements (e.g., charts, tables, cards) in a Power BI report.

Each `Item` contains metadata and dependencies that describe how it interacts with the tabular model, including tables, columns, and measures.

## Purpose
The `Item` class serves as a bridge between a [`Consumer`](./Consumer.md) (Excel workbook, Power BI report) and the tabular model it interacts with. It provides detailed information about:
- The model dependency that the Item references.
- The tables, columns, and measures used within the Item.
- Custom properties that describe the Item's characteristics, such as its type and query language.

By capturing these details, the `Item` class helps with auditing, optimization, and governance of tabular model usage.

---

## Public Properties
The `Item` class consists of the following key properties:

| Property         | Type                | Description  |
|----------------------|------------------------|------------------|
| `ItemProperties`     | `Dictionary<string, TcdxName>` | A key-value collection of custom properties that provide additional metadata about the Item. |
| `Model`             | [`ModelDependency`](./ModelDependency.md)       | A reference to the tabular model used by the Item. |
| `TableDependencies`  | [`List<TableDependency>`](./TableDependency.md) | A list of tables from the tabular model that are referenced by the Item. |
| `ColumnDependencies` | [`List<ColumnDependency>`](./ColumnDependency.md) | A list of columns from the tabular model that are used within the Item. |
| `MeasureDependencies` | [`List<MeasureDependency>`](./MeasureDependency.md) | A list of measures applied in the Item. |

### Property Details
- ItemProperties  
  This dictionary holds metadata about the Item, including:
  - `ItemType`: Specifies the type of the Item (e.g., PivotTable, Power BI Visual).
  - `QueryLanguage`: Defines the query language used by the Item (`DAX`, `MDX`, `SQL`, or `Undefined`).

- Model  
  - ModelDependency  
    The [`ModelDependency`](./ModelDependency.md) property links the Item to a specific tabular model, helping track which dataset the Item is referencing.

  - TableDependencies  
    A collection of [`TableDependency`](./TableDependency.md) objects that represent the tables accessed by the Item. This is useful for analyzing data consumption patterns.

  - ColumnDependencies  
    A collection of [`ColumnDependency`](./ColumnDependency.md) objects that specify the columns being queried or displayed within the Item.

  - MeasureDependencies  
    A collection of [`MeasureDependency`](./MeasureDependency.md) objects that track which calculated measures are used within the Item.

  ---

### Class Diagram Representation
```
Item
├── ItemProperties : Dictionary<string, TcdxName>
├── Model : ModelDependency
├── TableDependencies : List<TableDependency>
├── ColumnDependencies : List<ColumnDependency>
└── MeasureDependencies : List<MeasureDependency>
```
- [`Consumer`](./Consumer.md) → *contains multiple* `Item`
- `Item` → *references* [`ModelDependency`](./ModelDependency.md)
- `Item` → *has* [`TableDependency`](./TableDependency.md), [`ColumnDependency`](./ColumnDependency.md), [`MeasureDependency`](./MeasureDependency.md)

---

## Conclusion
The `Item` class is a core component of the TCDX model, enabling detailed tracking of how tabular models are used within Excel workbooks and Power BI reports. By maintaining references to models, tables, columns, and measures, it helps improve data analysis, governance, and performance tuning.

## Note: 
for privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implementation of objects anonymization.

