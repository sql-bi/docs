---
---
layout:     page
title:      QueryGroupsCollection
published:  true
draft:      true
order:      /10
---

# QueryGroupsCollection Class Documentation

## Overview
The `QueryGroupsCollection` class in the TCDX object model acts as a container for multiple []`QueryGroup`](.\QueryGroup.md) objects, representing collections of executed queries against a tabular model. It is used to aggregate, organize, and analyze query activity across different Consumers (such as Excel workbooks or Power BI reports). 

This class enables structured tracking of query executions, providing insights into query performance, frequency, and data access patterns.

---

## Purpose
The `QueryGroupsCollection` class is designed to:
- Store multiple QueryGroup objects, each representing a set of executed queries.
- Provide metadata about the collection of QueryGroups.
- Enable batch processing of query analytics within a single TCDX file.
- Support performance analysis by tracking query execution times and referenced elements.
- Enhance governance and auditing by documenting how tabular models are queried.

By using this class, organizations can analyze query performance, optimize data models, and ensure efficient usage of tabular models.

---

## Public Properties
The `QueryGroupsCollection` class consists of the following key properties:

| Property                           | Type                                       | Description       |
|------------------------------------|--------------------------------------------|-------------------|
| `QueryGroupsCollectionProperties` | `Dictionary<string, TcdxName>`             | A key-value collection of custom properties related to the QueryGroups collection. |
| `QueryGroups`                      | `List<QueryGroup>`                         | A list of QueryGroup objects, each representing a set of executed queries. |

### Property Details
- QueryGroupsCollectionProperties
  - Stores metadata about the collection of []`QueryGroup`](.\QueryGroup.md) objects.
  - Examples of properties:
    - `Query Source` → Defines whether queries were captured via Query Analytics, Extended Events, or Profiler.
    - `Environment Information` → Additional details about the dataset or reporting environment.

- QueryGroups
  - Holds a list of QueryGroup objects, each representing a set of queries executed against a tabular model.
  - Allows batch processing of multiple QueryGroups within a single TCDX file.

---

## Methods
The `QueryGroupsCollection` class typically includes methods for managing QueryGroup objects, such as:

### AddQueryGroup(QueryGroup queryGroup)
Description:  
Adds a [`QueryGroup`](.\QueryGroup.md) object to the collection.

### GetAllQueryGroups()
Returns: `List<QueryGroup>`  
Description:  
Retrieves all `QueryGroup` objects within the collection.

### FindQueryGroupByName(TcdxName queryGroupName)
Returns: [`QueryGroup`](.\QueryGroup.md) *(if found)*  
Description:  
Searches for a [`QueryGroup`](.\QueryGroup.md) object by name within the collection.

---

## Relationships with Other Classes
The `QueryGroupsCollection` class interacts with multiple components in the TCDX model:

- [`QueryGroup`](.\QueryGroup.md) → Represents a set of executed queries and their associated performance metrics.
- [`ModelDependency`]](.\ModelDependency.md) → Each [`QueryGroup`](.\QueryGroup.md) references the tabular model that was queried.
- [`Item`](.\Item.md) → A [`QueryGroup`](.\QueryGroup.md) may be linked to an [`Item`](.\Item.md) (such as a Power BI visual or an Excel pivot table) that issued the queries.
- [`ConsumersCollection`](.\ConsumersCollection.md) → The [`Consumer`](.\Consumer.md) objects in the queries tracked in [`QueryGroup`](.\QueryGroup.md) objects.

### Class Diagram Representation
```
QueryGroupsCollection
├── QueryGroupsCollectionProperties : Dictionary<string, TcdxName>
└── QueryGroups : List<QueryGroup>
      ├── QueryGroupType : EnumQueryGroupType
      ├── QueryGroupName : TcdxName
      ├── CorrelationId : string
      ├── QueryGroupProperties : Dictionary<string, int>
      ├── Model : ModelDependency
      ├── Item : Item
      ├── TableQueries : Dictionary<string, int>
      ├── ColumnQueries : Dictionary<string, int>
      ├── MeasureQueries : Dictionary<string, int>
      ├── TokenQueries : Dictionary<string, int>
      ├── NumberOfQueries : int
      ├── TotalExecTimeMilliseconds : long
      ├── MaxExecTimeMilliseconds : int
      ├── MinExecTimeMilliseconds : int
      ├── AverageExecTimeMilliseconds : int
      ├── StandardDeviationExecTimeMilliseconds : double
      ├── UtcStart : DateTime
      └── UtcEnd : DateTime
```
- [`QueryGroupsCollection`](.\QueryGroupsCollection.md) → *contains multiple* []`QueryGroup`](.\QueryGroup.md)
- [`QueryGroup`](.\QueryGroup.md) → *references* [`ModelDependency`](.\ModelDependency.md)
- [`QueryGroup`](.\QueryGroup.md) → *references* [`Item`](.\Item.md)
- [`QueryGroup`](.\QueryGroup.md) → *references* [`TableDependency`](.\TableDependency.md), [`ColumnDependency`](.\ColumnDependency.md), [`MeasureDependency`](.\MeasureDependency.md)

---

## Conclusion
The `QueryGroupsCollection` class is a fundamental component of the TCDX object model, providing a structured way to store, organize, and analyze multiple QueryGroups that capture query execution details.

This class is particularly useful for:
- Auditing & Governance → Tracking how frequently tabular models are queried and by which sources.
- Performance Optimization → Identifying slow queries and optimizing model design.
- Usage Analysis → Understanding which tables, columns, and measures are frequently queried.

By integrating `QueryGroupsCollection` into the TCDX model, organizations can gain insights into query execution patterns, improve query performance, and enhance governance of tabular model interactions across Power BI, Excel, and other analytics platforms.

## Note: 
for privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implemtation of objects anonymization.