---
layout:     page
title:      ModelDependency
published:  true
draft:      true
order:      /04
---

# ModelDependency

## Overview
The `ModelDependency` class in the `TCDX` object model represents a tabular model dependency, providing information about the connection between a Consumer or QueryGroup and a specific tabular model. This class is a fundamental component in tracking how different Consumers and Items interact with the underlying data models.

## Purpose
The primary role of the `ModelDependency` class is to:
- Establish a reference to the server and model being used.
- Facilitate dependency tracking across tables, columns, and measures.
- Provide a structured way to analyze data usage within a Consumer or QueryGroup.

## Public Properties
The `ModelDependency` class consists of the following properties:

| Property   | Type          | Description  |
|---------------|------------------|------------------|
| `ServerName`  | `TcdxName`        | The name of the server where the tabular model is hosted. |
| `ModelName`   | `TcdxName`        | The name of the tabular model referenced by the Consumer or QueryGroup. |
| `Model`       | `Dax.Metadata.Model` | A reference to the tabular model within the [`VertiPaq Analyzer (VPAX) object model`](https://docs.sqlbi.com/vertipaq-analyzer/), if available. |

## Relationships with Other Classes
The `ModelDependency` class is referenced by multiple dependency classes, including:
- [`TableDependency`](.\TableDependency.md) – To track table-level dependencies.
- [`ColumnDependency`](.\ColumnDependency.md) – To track column-level dependencies.
- [`MeasureDependency`](.\MeasureDependency.md) – To track measure dependencies.
- [`Item`](.\Item.md) – To establish which model a specific Item belongs to.
- [`QueryGroup`](.\QueryGroup.md) – To reference the model involved in query execution.

### Class Diagram Representation
```
ModelDependency
├── ServerName : TcdxName
├── ModelName : TcdxName
└── Model : Dax.Metadata.Model
```
References:
- [`TableDependency`](.\TableDependency.md) → `ModelDependency`
- [`ColumnDependency`](.\ColumnDependency.md) → `ModelDependency`
- [`MeasureDependency`](.\MeasureDependency.md) → `ModelDependency`

## Conclusion
The `ModelDependency` class plays a crucial role in the TCDX model by ensuring that every Consumer, QueryGroup, and Item correctly references the tabular model it depends on. It serves as a link between external Consumers and the underlying tabular model, making it an essential part of data tracking, optimization, and governance.

## Note: 
for privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implementation of objects anonymization.
