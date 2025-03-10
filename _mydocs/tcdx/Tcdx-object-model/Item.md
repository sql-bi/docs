---
layout:     page
title:      Item
published:  false
draft:      true
order:      /03
---

# **TCDX Items**

In the **TCDX model**, a **Consumer** represents an entity that interacts with a tabular model, such as an **Excel workbook** or a **Power BI report**. Within each Consumer, there exist **Items**, which are individual components that reference and utilize data from the tabular model. These Items provide a structured way to track how Consumers interact with data, making it easier to analyze and optimize tabular model usage.

## **Understanding TCDX Items**
An **Item** in the TCDX model represents a distinct object within a Consumer that interacts with a tabular model. For example:
- **In Excel**: An Item could be a **pivot table** that queries data from the model.
- **In Power BI**: An Item could be a **visual component** such as a chart, table, or card that references measures and dimensions.

Each Item contains critical references that describe its dependencies within the tabular model, allowing for detailed analysis of data consumption patterns.

## **Components of an Item**
Each **Item** in the TCDX model is characterized by multiple dependencies that define how it interacts with the underlying data:

### **1. Model Dependency**
An Item maintains a reference to the **ModelDependency**, which links it to a specific **Tabular model**. This establishes the primary relationship between the Item and the data source it queries.

### **2. Table Dependencies**
Items include **TableDependency** references, identifying which tables from the tabular model are being accessed.

### **3. Column Dependencies**
An Item may reference specific **columns** from the referenced tables, captured as **ColumnDependency** objects. These dependencies indicate which fields are directly used in a pivot table or Power BI visual.

### **4. Measure Dependencies**
Measures are recorded as **MeasureDependency** objects.

### **5. Custom Properties**
Each Item may also contain **custom properties** that provide additional metadata, such as:
- **ItemType**: Specifies the type of object (e.g., Pivot Table, Power BI Visual).
- **QueryLanguage**: Indicates the query language used (e.g., DAX, MDX, SQL).




## **Why TCDX Items Matter** <todo visible> ---- fuffa da rimuovere o da aggiustare ?</todo>
By structuring data consumption in this way, the TCDX model enables:
- **Auditing**: Understanding which tables, columns, and measures are most frequently used.
- **Optimization**: Identifying inefficiencies in data model utilization.
- **Governance**: Ensuring compliance with best practices in data reporting and management.

TCDX Items serve as the fundamental building blocks for analyzing how Consumers interact with tabular models, providing valuable insights for performance tuning and data governance.

| Member | Values |  Notes |
| -- | -- | -- |
| ItemProperties | keyvalue collection | a key/value collection for the custom properties of the Item. The property **ItemType** is used to specify the type of the object. The property **QueryLanguage** can be **DAX**, **MDX**, **SQL**, **Undefined*** |
| Model | ModelDependency | reference to the Model |
| TableDependencies | list of TableDependency | the referenced tables |
| ColumnDependencies | list of ColumnDependency | the referenced columns |
| MeasureDependencies | list of MeasureDependency | the referenced measures |

