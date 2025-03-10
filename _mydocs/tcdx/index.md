---
layout:     page
title:      Tcdx
published:  false
draft:      true
order:      /Tcdx
---

# Introduction to the TCDX Model

The **TCDX Model** is a structured representation of tabular model usage, focusing on two primary entities: **Consumers** and **QueryGroups**. These elements capture essential metadata on how Tabular models, such as those implemented in Power BI and SQL Server Analysis Services, are utilized by different clients and queried for data analysis.

## **Purpose and Scope**
TCDX serves as a standardized format for extracting and storing information about:
- **Consumers**: Entities that interact with tabular models, such as Excel files, Power BI reports, or other client applications. It records metadata about the source, location, and interactions with the data model.
- **QueryGroups**: Collections of queries executed against the tabular model. These include execution statistics, query frequency, and references to tables, columns, and measures within the model.

By encapsulating this data in a structured format, TCDX enables efficient analysis, auditing, and optimization of Tabular models usage.

## **Core Components**
### **1. Consumers**
Consumers represent the clients that interact with tabular models. They are categorized by their type (e.g., Excel, Power BI Service, Power BI Desktop) and include details such as:
- The host and location of the consumer.
- Metadata related to the consumer’s acquisition and modification.
- A collection of **Items**, each representing an object (e.g., pivot tables, reports) that references elements of the tabular model.

### **2. QueryGroups**
QueryGroups capture executed queries and provide insights into their performance and usage patterns. Each QueryGroup includes:
- The type of query source (e.g., Query Analytics, Profiler, Extended Events).
- Execution metadata such as total query count, execution time, and performance statistics.
- References to tables, columns, and measures queried within the model.

### **3. Model Dependencies**
Model dependencies define the relationships between Consumers, QueryGroups, and the Tabular models they reference. This includes:
- **ModelDependency**: the referenced Tabular model.
- **TableDependency**: the refernced tables in the the referenced Tabular model.
- **ColumnDependency**: the columns in the the referenced tables.
- **MeasureDependency**: referenced measures in the referenced Tabular model.

## **TCDX File Format**
The extracted metadata is stored in a **TCDX file**, which is a ZIP-compressed archive containing JSON-serialized representations of the Consumers and QueryGroups. This structured approach allows for easy data exchange, analysis, and integration with external tools.

## **Integration and Tools**
The TCDX model is supported by a set of **open-source .NET libraries**, available via NuGet, and includes a **command-line tool (CLI)** for automating data extraction and processing. These libraries and tools purpose is to facilitate:
- Data extraction from Power BI reports, Excel workbooks, and other clients.
- Query analysis for performance optimization.
- Integration with DevOps pipelines for continuous monitoring.
Most of these functionalities are not yet available and are still to be implemented

## **Conclusion**
The aim of **TCDX model** is to provide a powerful framework for understanding and managing the interaction between tabular models and their consumers. By capturing metadata on queries, dependencies, and usage patterns, it enables better decision-making for performance tuning, auditing, and governance in data analytics environments.

## Tcdx Libraries

The Tcdx libraries source code is available in the [Tcdx GitHub repository](https://github.com/sql-bi/tcdx). Each module has a corresponding NuGet package:
- **[Dax.Tcdx.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)** is a representation of the Consumers and QueryGroups using a tabular models. This is a .NET Standard library without dependencies on the Tabular Object Model (TOM). It has a dependency on **[Dax.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)** that is the core of VertiPaq Analyzer and includes all the information about the data model the consumers and the queries are referring to.
- **[Dax.Tcdx](https://www.nuget.org/packages/Dax.Tcdx/)** Library to read and write Tcdx files. This library is a .NET Standard library.
- **[Dax.Tcdx.Module.Unifier](https://www.nuget.org/packages/Dax.Tcdx.Module.Unifier/)** Library to unify Tcdx files. This library is a .NET Standard library.

## Tcdx Format

The TCDX file format is a ZIP file containing the json serialization of the object models for Consumers and Queries:

## Tools

- **[Pivot Scanner](https://sqlbi.com/)**: <todo visible> repository yet to be created for the PivotScanner and ExportPivotScan tools</todo>
