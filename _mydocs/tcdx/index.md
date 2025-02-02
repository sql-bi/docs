---
layout:     page
title:      Tcdx
published:  false
draft:      true
order:      /Tcdx
---
Tcdx is a set of open-source libraries designed to represent consumers and queries of tabular models. They use a file format (TCDX) to persist extracted information. The purpose of the TCDX file is to easily transfer information extracted from the consumers of a Tabular model (also known as the semantic model in Power BI), like reports in pbix files or Excel Pivot tables, and the queries executed on the model, that can be extracted for instance from Power BI Service Extended Events. 

The Tcdx libraries are published as NuGet packages and are integrated into several tools, including a command line tool (CLI) designed for streamlined management and automation within DevOps pipelines.

## Tcdx Libraries

The Tcdx libraries source code is available in the [Tcdx GitHub repository](https://github.com/sql-bi/tcdx). Each module has a corresponding NuGet package:
- **[Dax.Tcdx.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)** is a representation of the Consumers and Queries using a tabular models. This is a .NET Standard library without dependencies on the Tabular Object Model (TOM). It has a dependency on **[Dax.Metadata](https://www.nuget.org/packages/Dax.Tcdx.Metadata/)** that is the core of VertiPaq Analyzer and includes all the information about the data model the consumers and the queries are referring to.
- **[Dax.Tcdx](https://www.nuget.org/packages/Dax.Tcdx/)** Library to read and write Tcdx files. This library is a .NET Standard library.
- **[Dax.Tcdx.Module.Unifier](https://www.nuget.org/packages/Dax.Tcdx.Module.Unifier/)** Library to unify Tcdx files. This library is a .NET Standard library.

## Tcdx Format

The TCDX file format is a ZIP file containing the json serialization of the object models for Consumers and Queries:

## Tools

- **[Pivot Scanner](https://sqlbi.com/)**: <todo visible> repository yet to be created for the PivotScanner and ExportPivotScan tools</todo>
