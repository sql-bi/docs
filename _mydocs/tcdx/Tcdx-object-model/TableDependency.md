---
layout:     page
title:      TableDependency
published:  true
draft:      true
order:      /05
---

# TableDependency

## Overview
The `TableDependency` class in the TCDX object model represents a table-level dependency between a Consumer (Excel, Power BI report, etc.) and a tabular model. It is used to track which tables within a model are referenced by a given Consumer or Item. 

## Purpose
The primary functions of the `TableDependency` class include:
- Tracking table dependencies within a tabular model.
- Providing metadata about the tables accessed by a Consumer.
- Facilitating auditing and optimization of data models by analyzing table usage patterns.

This class is essential for governance, performance tuning, and data lineage tracking within Power BI, Excel, and other tabular model consumers.

---

## Public Properties
The `TableDependency` class consists of the following key properties:

| **Property**    | **Type**                | **Description**  |
|----------------|------------------------|------------------|
| `Model`       | [`ModelDependency`](.\ModelDependency.md)       | A reference to the tabular model where the table resides. |
| `TableName`   | [`TcdxName`](.\TcdxName.md)              | The name of the referenced table within the tabular model. |
| `ModelTable`  | `Dax.Metadata.Table`    | A reference to the table in the VertiPaq Analyzer (VPAX) object model, if available. |

### Property Details
- `Model`  
  - This property links the `TableDependency` to a specific tabular model via a [`ModelDependency`](.\ModelDependency.md) object.
    - It helps track which model the table belongs to.

- `TableName`  
  - Stores the name of the table being referenced within the tabular model.
  - Allows identification of table dependencies for a given Consumer.

- `ModelTable`  
  - If available, this property provides a reference to the DAX Metadata representation of the table.
  - This enables deeper analysis of table structure, relationships, and optimization potential.

---

## Relationships with Other Classes
The `TableDependency` class interacts with multiple components in the TCDX model:

- [`ModelDependency`](.\ModelDependency.md) → Links the table to the specific tabular model.
- [`Consumer`](.\Consumer.md) → Stores table dependencies used within Excel, Power BI, or other client applications.
- [`Item`](.\Item.md) → Represents individual objects (pivot tables, visuals) that reference specific tables.
- [`ColumnDependency`](.\ColumnDependency.md) → Tracks column-level dependencies within the referenced table.
- [`MeasureDependency`](.\MeasureDependency.md) → Captures measure dependencies that rely on a specific table.

### Class Diagram Representation
```
TableDependency
├── Model : ModelDependency
├── TableName : TcdxName
└── ModelTable : Dax.Metadata.Table
```
- [`Item`](.\Item.md) → *references multiple* [`TableDependency`]
- [`TableDependency`] → *references* [`ModelDependency`](.\ModelDependency.md)
- [`ColumnDependency`](.\ColumnDependency.md) → *references* [`TableDependency`]
- [`MeasureDependency`](.\MeasureDependency.md) → *references* [`TableDependency`]

---

## Conclusion
The `TableDependency` class plays a critical role in tracking table-level dependencies within the TCDX object model. By linking Consumers, Items, and tabular models, it provides a structured approach to analyzing data consumption patterns.

This class is particularly useful for:
- Auditing → Understanding which tables are most frequently used in reports and workbooks.
- Performance Optimization → Identifying unnecessary table references and improving data model efficiency.
- Governance & Data Lineage → Ensuring compliance with best practices for data modeling and usage.

By integrating `TableDependency` into the TCDX model, organizations can gain insights into tabular model usage and enhance overall data management across Power BI, Excel, and other reporting tools.

## Note: 
For privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implementation of objects anonymization.
