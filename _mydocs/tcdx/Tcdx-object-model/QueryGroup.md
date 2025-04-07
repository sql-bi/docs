---
layout:     page
title:      QueryGroup
published:  true
draft:      true
order:      /02
---

# **QueryGroup Class Documentation**

## **Overview**
The **`QueryGroup`** class in the **TCDX object model** represents a **group of executed queries** against a tabular model. It is used to **track query execution metadata**, including query frequency, execution times, and the **referenced model elements** (tables, columns, and measures).

## **Purpose**
The `QueryGroup` class serves the following key functions:
- **Captures query execution details**, including timing statistics and execution counts.
- **Links queries to specific model dependencies**, providing insights into data usage.
- **Enables query performance analysis** by tracking execution time distributions.
- **Supports governance and auditing** by documenting query activity within a Consumer or dataset.

By analyzing query groups, organizations can **optimize data model performance**, **identify slow queries**, and **understand how tabular models are being accessed**.

---

## **Public Properties**
The `QueryGroup` class consists of the following key properties:

| **Property**                 | **Type**                        | **Description**  |
|------------------------------|--------------------------------|------------------|
| `QueryGroupType`             | `EnumQueryGroupType`           | Defines the source of queries (`QueryAnalytics`, `Profiler`, `ExtendedEvents`, etc.). |
| `QueryGroupName`             | `TcdxName`                     | The name of the **query group**. |
| `CorrelationId`              | `string`                       | A unique identifier used to link the query group to external logs. |
| `QueryGroupProperties`       | `Dictionary<string, int>`      | A key-value collection of **custom properties** related to the query group. |
| `Model`                     | `ModelDependency`              | A reference to the **tabular model** used in the queries. |
| `Item`                      | `Item`                         | The **Item** (e.g., a pivot table or Power BI visual) that issued the queries. |
| `TableQueries`              | `Dictionary<string, int>`      | A count of **queries referencing each table** in the tabular model. |
| `ColumnQueries`             | `Dictionary<string, int>`      | A count of **queries referencing each column** in the tabular model. |
| `MeasureQueries`            | `Dictionary<string, int>`      | A count of **queries referencing each measure** in the tabular model. |
| `TokenQueries`              | `Dictionary<string, int>`      | A count of queries referencing **columns or measures** (if the distinction is unclear). |
| `NumberOfQueries`           | `int`                          | The **total number** of queries executed. |
| `TotalExecTimeMilliseconds` | `long`                         | The **total execution time** of all queries (in milliseconds). |
| `MaxExecTimeMilliseconds`   | `int`                          | The **longest execution time** of a single query (in milliseconds). |
| `MinExecTimeMilliseconds`   | `int`                          | The **shortest execution time** of a single query (in milliseconds). |
| `AverageExecTimeMilliseconds` | `int`                       | The **average execution time** of queries (in milliseconds). |
| `StandardDeviationExecTimeMilliseconds` | `double`          | The **standard deviation** of query execution times. |
| `UtcStart`                  | `DateTime`                     | The **start timestamp** of query execution capture. |
| `UtcEnd`                    | `DateTime`                     | The **end timestamp** of query execution capture. |

---

### **Property Details**
- **QueryGroupType**  
  - Specifies the **source** of the queries, such as:
    - `QueryAnalytics` → Queries captured via **Power BI Service Query Analytics**.
    - `Profiler` → Queries captured from **SQL Profiler**.
    - `ExtendedEvents` → Queries captured using **Extended Events**.
    - `OtherQueryGroupType` → Any other source of query logs.

- **CorrelationId**  
  - Can be used to **link the QueryGroup** to an external log file.
  - Useful when query details are stored separately for **privacy or security reasons**.

- **QueryGroupProperties**  
  - A dictionary storing **additional metadata** about the query group.

- **Model**  
  - A `ModelDependency` reference linking the **queries to the tabular model**.

- **Item**  
  - The `Item` (such as a Power BI visual or an Excel pivot table) that executed the queries.

- **TableQueries, ColumnQueries, MeasureQueries, TokenQueries**  
  - These dictionaries store **counters** for how frequently specific **tables, columns, and measures** were queried.

- **Execution Time Statistics**  
  - **TotalExecTimeMilliseconds** → Cumulative execution time of all queries.  
  - **MaxExecTimeMilliseconds** → Longest execution time recorded for a query.  
  - **MinExecTimeMilliseconds** → Shortest execution time recorded for a query.  
  - **AverageExecTimeMilliseconds** → Mean execution time for all queries.  
  - **StandardDeviationExecTimeMilliseconds** → Variability in execution times.

- **UtcStart & UtcEnd**  
  - Define the **time range** during which the queries were recorded.

---

## **Relationships with Other Classes**
The `QueryGroup` class interacts with multiple components in the **TCDX model**:

- **ModelDependency** → Links the queries to the specific tabular model.
- **Item** → Represents the data component (e.g., pivot table, Power BI visual) that generated the queries.
- **TableDependency, ColumnDependency, MeasureDependency** → Capture references to the tables, columns, and measures queried.

### **Class Diagram Representation**
```
QueryGroup
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
- **QueryGroupsCollection** → *contains multiple* `QueryGroup`
- **QueryGroup** → *references* `ModelDependency`
- **QueryGroup** → *references* `Item`
- **QueryGroup** → *references* `TableDependency`, `ColumnDependency`, `MeasureDependency`

---

## **Conclusion**
The `QueryGroup` class is a **critical component** of the **TCDX** object model, enabling structured tracking of **query execution details** within tabular models. By capturing query sources, execution times, and referenced model elements, it provides **valuable insights** for performance tuning and governance.

This class is particularly useful for:
- **Auditing & Governance** → Identifying frequently queried model elements and ensuring compliance.
- **Performance Optimization** → Analyzing slow queries and optimizing model design.
- **Usage Analysis** → Understanding which Power BI visuals or Excel pivot tables are driving the most query activity.

By integrating `QueryGroup` into the TCDX model, organizations can **gain deep insights** into **query patterns and execution performance**, improving both **data model efficiency** and **reporting effectiveness** across Power BI, Excel, and other analytics platforms.

## Note: 
for privacy reasons, strings are implemented as **TcdxName** objects, to allow a future implemtation of objects anonymization.