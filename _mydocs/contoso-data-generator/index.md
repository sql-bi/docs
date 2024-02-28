---
layout:     home
title:      Contoso Data Generator
menu_title: Contoso Data Generator
published:  true
order:      /contoso-data-generator
next_reading: true
---

The Contoso Data Generator is a tool to generate sample databases with random generated orders for the Contoso data model in order to provide demo data.

It consist of a c# program, to generate the orders and a set of powershell and t-sql scripts, to generate the database, that import the generated orders files, and fixed customers, product, stores, and currency exchange files.

The tool is available on github: 

[Contoso-Data-Generator](https://github.com/sql-bi/Contoso-Data-Generator)

The release v1.0.0 contains a set of downloadable Contoso databases of different sizes, a ready-to-use version of the tool, and the source code in compressed formats. 

The pre-generated database files require the SQL Server 2019 or newer, but we expect the tool to be working starting from SQL Server 2016 (we did just a few tests with SQL Server 2017).

[Contoso-Data-Generator-release-v1.0.0](https://github.com/sql-bi/Contoso-Data-Generator/releases/tag/v1.0.0)
