---
layout:     page
title:      Tcdx
published:  true
draft:      true
order:      /Tcdx
---

# **Introduction to the TCDX Model**

## **Overview**
The **TCDX Model** is a structured framework designed to **standardize tabular model metadata tracking**, focusing on two primary entities: **Consumers** and **QueryGroups**. These elements capture essential metadata on how **Power BI and SQL Server Analysis Services (SSAS)** tabular models are utilized, facilitating **performance analysis, governance, and interoperability** across multiple tools.

The **TCDX format** is a **community-driven project** aimed at becoming a **universal standard** for metadata extraction and model tracking. It is intended for **adoption, extension, and modification** by various **BI tool vendors and developers**. Implementers must **map their tools' requirements** to the TCDX object model and may **contribute improvements** to enhance the framework.

By offering a **common metadata structure**, TCDX brings **consistency, cross-platform compatibility, and efficient data governance** to the **BI ecosystem**.

---

## **TCDX and the BI Tools Developer Community**
The **TCDX format** is designed to be **an open standard**, enabling BI professionals, vendors, and tool developers to:
- **Adopt a unified metadata structure** across **Power BI, Excel, and SSAS tools**.
- **Extend and modify** the model to accommodate **specific tool requirements**.
- **Contribute to the community**, ensuring **continuous improvement and scalability**.

Since TCDX is a **work in progress**, its growth depends on **community engagement and collaboration**. The Power BI and SSAS communities can drive **innovation and adoption** by:
- **Standardizing metadata structures** for improved **cross-tool compatibility**.
- **Optimizing model performance** through **query execution insights**.
- **Enhancing governance and data lineage tracking**, ensuring **transparent model usage**.

As **more BI tools integrate TCDX**, it will **serve as a common framework** for **tracking and optimizing tabular model usage** across different reporting environments.

---

## **TCDX Object Model**
The **TCDX Object Model** is structured around **three key components**:

### **1. Consumers**
A **Consumer** represents a **client application** that interacts with a tabular model, such as:
- **Excel workbooks** (pivot tables, Power Query connections).
- **Power BI reports** (DAX queries, visuals).
- **Other BI tools** leveraging tabular models.

Each Consumer contains:
- **Metadata about its type** (Excel, Power BI Service, Power BI Desktop).
- **Host system details** (file path, cloud environment).
- **A collection of Items**, representing **pivot tables, reports, and visuals**.
- **Dependencies on tables, columns, and measures**.

Consumers are grouped under a **ConsumersCollection**, allowing for **efficient management of multiple Consumers** in a **single TCDX file**.

### **2. QueryGroups**
A **QueryGroup** captures **queries executed against a tabular model**, tracking:
- **Query execution sources** (Query Analytics, SQL Profiler, Extended Events).
- **Performance statistics**, including **query frequency and execution times**.
- **References to data elements** (tables, columns, measures).

QueryGroups help organizations **optimize queries, refine data models, and improve reporting efficiency**. They are stored in a **QueryGroupsCollection**, organizing query execution data effectively.

### **3. Model Dependencies**
Model dependencies define **relationships between Consumers, QueryGroups, and tabular models**, including:
- **ModelDependency**: The referenced **tabular model**.
- **TableDependency**: The referenced **tables** in the model.
- **ColumnDependency**: The referenced **columns** in the tables.
- **MeasureDependency**: The referenced **measures** used in calculations.

These relationships **enhance visibility into data interactions**, helping BI professionals **optimize reporting and data governance**.

---

## **TCDX as an Industry Standard**
The **TCDX format** aims to be the **de facto standard** for **tabular model metadata tracking**, with an **open architecture** that enables:
- **Adoption by multiple BI tools and vendors**, ensuring **interoperability**.
- **Community-driven development**, allowing implementers to **contribute and refine** the model.
- **Scalability and extensibility**, ensuring that **TCDX can evolve with BI industry needs**.

TCDX relies on **collaboration from the Power BI and SSAS communities** to:
- **Standardize metadata structures** for seamless **cross-platform use**.
- **Enhance model performance** through **detailed query analytics**.
- **Strengthen governance and data lineage tracking** for better **reporting transparency**.

As **more BI tools integrate TCDX**, it will become **the standard framework for managing tabular model interactions**, improving **efficiency, performance, and governance**.

---

## **TCDX File Format**
TCDX metadata is stored in a **ZIP-compressed archive**, containing **JSON-serialized metadata** representing:
- **Consumers** (reporting tools interacting with the model).
- **QueryGroups** (executed queries and performance metrics).

This format is:
- **Optimized for integration** with **BI tools, automation scripts, and DevOps pipelines**.
- **Structured for scalability**, supporting **multi-tool, multi-environment use cases**.
- **Designed for extensibility**, allowing **future metadata enhancements**.

---

## **Integration and Tools**
TCDX is supported by **open-source .NET libraries** and a **command-line tool (CLI)** that simplify:
- **Data extraction** from **Power BI, Excel, and SSAS models**.
- **Query performance analysis** to enhance **reporting efficiency**.
- **DevOps integration** for **automated monitoring and optimization**.

### **TCDX Libraries**
The **TCDX libraries** are hosted on [GitHub](https://github.com/sql-bi/tcdx) and available on **NuGet**:

- **[Dax.Tcdx.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)**  
  Provides a structured representation of **Consumers and QueryGroups**.

- **[Dax.Tcdx](https://www.nuget.org/packages/Dax.Tcdx/)**  
  Enables **reading and writing TCDX files**.

- **[Dax.Tcdx.Module.Unifier](https://www.nuget.org/packages/Dax.Tcdx.Module.Unifier/)**  
  Supports **merging multiple TCDX files**.

### **TCDX Command-Line Tool**
The **[TCDX CLI](https://www.nuget.org/packages/Dax.Tcdx.CLI/)** is a **.NET-based tool** whose purpose is to automate:
- **Query execution tracking**.
- **Metadata extraction and storage**.
- **Report dependency analysis**.

## Note: 
tcdx cli is a work in progress, it now contains the unifier tool, used to merge tcdx files.

#### **Installation**
To install:
```sh
dotnet tool install Dax.Tcdx.CLI --global
tcdx --help
```

## Tcdx Libraries

The Tcdx libraries source code is available in the [Tcdx GitHub repository](https://github.com/sql-bi/tcdx). Each module has a corresponding NuGet package:
- **[Dax.Tcdx.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)** is a representation of the Consumers and QueryGroups using a tabular models. This is a .NET Standard library without dependencies on the Tabular Object Model (TOM). It has a dependency on **[Dax.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)** that is the core of VertiPaq Analyzer and includes all the information about the data model the consumers and the queries are referring to.
- **[Dax.Tcdx](https://www.nuget.org/packages/Dax.Tcdx/)** Library to read and write Tcdx files. This library is a .NET Standard library.
- **[Dax.Tcdx.Module.Unifier](https://www.nuget.org/packages/Dax.Tcdx.Module.Unifier/)** Library to unify Tcdx files. This library is a .NET Standard library.

## Tcdx Format

The TCDX file format is a ZIP file containing the json serialization of the object models for Consumers and Queries:

## Tools

- **[Pivot Scanner](https://sqlbi.com/)**: <todo visible> repository yet to be created for the PivotScanner and ExportPivotScan tools</todo>
