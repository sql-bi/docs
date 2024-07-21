---
layout:     page
title:      VertiPaq Analyzer
published:  true
order:      /vertipaq-analyzer
---
VertiPaq Analyzer is a set of open-source libraries designed to represent statistical information related to Tabular models. They use a file format (VPAX) to persist extracted information. The purpose of the VPAX file is to easily transfer statistical information extracted from a Tabular model (also known as the semantic model in Power BI).

The VertiPaq Analyzer libraries are published as NuGet packages and are integrated into several tools, including a command line tool (CLI) designed for streamlined management and automation within DevOps pipelines.

## VertiPaq Analyzer Libraries

The VertiPaq Analyzer libraries source code is available in the [VertiPaq-Analyzer GitHub repository](https://github.com/sql-bi/VertiPaq-Analyzer). Each module has a corresponding NuGet package:
- **[Dax.Metadata](https://www.nuget.org/packages/Dax.Metadata/)** is a representation of the Tabular model including additional information from DMV and statistics about data distribution in the model. This is a .NET Standard library without dependencies on the Tabular Object Model (TOM). Dax.Metadata is the core of VertiPaq Analyzer and includes all the information about the data model in a format that will allow a complete anonymization of the data model in a future release.
- **[Dax.Model.Extractor](https://www.nuget.org/packages/Dax.Model.Extractor/)** populates the Dax.Metadata.Model extracting data from a Tabular model. This library depends on TOM and .NET.
- **[Dax.ViewModel](https://www.nuget.org/packages/Dax.ViewModel/)** provides a view over Dax.Metadata.Model data that can be integrated in applications using the view model, such as the one implemented in DAX Studio (use DAX Studio 2.9.4 or later version). This library is a .NET Standard library.
- **[Dax.ViewVpaExport](https://www.nuget.org/packages/Dax.ViewVpaExport/)** exports the Dax.Metadata.Model for the consumption in VertiPaq Analyzer 2.0 client tools. This library is a .NET Standard library.
- **[Dax.Vpax](https://www.nuget.org/packages/Dax.Vpax/)** supports the VPAX format. This library depends on .NET.

Using the VertiPaq Analyzer libraries, a client tool can easily extract the information from a Tabular model, export it in a standard file, and read the same information for visualization purposes.

## VPAX Format

The VPAX file format is a ZIP file containing the following files:

- **DaxModel.json** is a serialization of the Dax.Metadata.Model.
- **DaxVpaView.json** is a serialization of the Dax.ViewVpaExport that is used to import data in the VertiPaq Analyzer 2.0 Excel file using a specific macro.
- **Model.bim** is an optional file that exports the complete model in TOM format. This file is not used by current client tools, but it could be useful for future extensions.

## Tools

- **[Bravo for Power BI](https://bravo.bi/)**: extract save, and read VPAX files. Includes an embedded visualization of data size information.
- **[DAX Studio](https://daxstudio.org/)**: extract, save, and read VPAX files. Includes an embedded visualization of the most important views.
- **[Tabular Editor 3](https://tabulareditor.com/)**: extract, save, and read VPAX files. Includes an embedded visualization of the most important views.
- **[VertiPaq Analyzer 2 Excel file](https://www.sqlbi.com/tools/vertipaq-analyzer/)**: read VPAX files and show predefined reports using PivotTables and Excel tables. See [Excel metrics](excel-metrics/index).
