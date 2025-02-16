---
layout:     page
title:      Item
published:  false
draft:      true
order:      /03
---

The **Item** represents a single object of the client who uses one Model, with the information of the referenced model, tables and measures. For instance a pivot table in a Excel Workbook type of **Consumer**

| Member | Values |  Notes |
| -- | -- | -- |
| ItemProperties | keyvalue collection | a key/value collection for the custom properties of the Item. The property **ItemType** is used to specify the type of the object. The property **QueryLanguage** can be **DAX**, **MDX**, **SQL**, **Undefined*** |
| Model | ModelDependency | reference to the Model |
| TableDependencies | list of TableDependency | the referenced tables |
| ColumnDependencies | list of ColumnDependency | the referenced columns |
| MeasureDependencies | list of MeasureDependency | the referenced measures |

