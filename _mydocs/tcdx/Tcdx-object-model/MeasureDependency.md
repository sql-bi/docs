---
layout:     page
title:      MeasureDependency
published:  true
draft:      true
order:      /07
---

# MeasureDependency Class Documentation

## Overview
The `MeasureDependency` class in the `TCDX` object model represents a measure-level dependency between a Consumer (Excel workbook, Power BI report, etc.) and a tabular model. It is used to track which measures within a model are referenced by a given Consumer or Item.

## Purpose
The `MeasureDependency` class is designed to:
- Track measure dependencies within a tabular model.
- Provide metadata about the measures accessed by a Consumer or Item.
- Support performance analysis and optimization by identifying frequently used or underutilized measures.
- Assist with governance and auditing by documenting how measures are referenced in reports and analytics tools.

This class is essential for query performance analysis, dependency tracking, and governance within Power BI, Excel, and other analytics environments.

---

## Public Properties
The `MeasureDependency` class consists of the following key properties:

| Property    | Type                | Description  |
|----------------|------------------------|------------------|
| `Model`       | [`ModelDependency`](./ModelDependency.md) | A reference to the tabular model where the measure resides. |
| `MeasureName` | `TcdxName`              | The name of the referenced measure within the tabular model. |
| `Table`       | [`TableDependency`](./TableDependency.md)       | A reference to the table dependency associated with this measure. |
| `ModelMeasure` | `Dax.Metadata.Measure`  | A reference to the measure in the [`VertiPaq Analyzer (VPAX) object model`](https://docs.sqlbi.com/vertipaq-analyzer/), if available. |

### Property Details
- Model  
  - Links the `MeasureDependency` to a specific tabular model via a [`ModelDependency`](./ModelDependency.md) object.
  - Ensures that measure dependencies are correctly attributed to their respective models.

- MeasureName  
  - Stores the name of the measure being referenced.
  - Essential for identifying which calculated measures are used within a Consumer.

- Table  
  - Provides a reference to the TableDependency associated with this measure.
  - Helps track how tables and measures are used together.

- ModelMeasure  
  - If available, this property provides a reference to the DAX Metadata representation of the measure.
  - Enables further analysis of measure calculations, dependencies, and performance.

---

## Relationships with Other Classes
The `MeasureDependency` class interacts with multiple components in the TCDX model:

- [`ModelDependency`](./ModelDependency.md) → Links the measure to the specific tabular model.
- [`TableDependency`](./TableDependency.md) → Represents the table that contains the referenced measure.
- [`Consumer`](./Consumer.md) → Stores measure dependencies used within Excel, Power BI, or other client applications.
- [`Item`](./Item.md) → Represents individual objects (pivot tables, visuals) that reference specific measures.

### Class Diagram Representation
```
MeasureDependency
├── Model : ModelDependency
├── MeasureName : TcdxName
├── Table : TableDependency
└── ModelMeasure : Dax.Metadata.Measure
```
- [`Item`](./Item.md) → *references multiple* `MeasureDependency`
- [`MeasureDependency`](./TableDependency.md) → *refers to* [`TableDependency`](./TableDependency.md)
- [`MeasureDependency`](./ModelDependency.md) → *refers to* [`ModelDependency`](./ModelDependency.md)

---

This class is particularly useful for:
- Auditing → Understanding which measures are frequently used in reports and workbooks.
- Performance Optimization → Identifying inefficient or underutilized measures to improve calculation performance.
- Governance & Data Lineage → Ensuring compliance with best practices for measure usage and report design.

By integrating `MeasureDependency` into the TCDX model, organizations can enhance data governance and performance across Power BI, Excel, and other reporting tools.

## Note: 
for privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implementation of objects anonymization.
