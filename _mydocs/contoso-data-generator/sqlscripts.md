---
layout:     page
title:      SQL Scripts
menu_title: SQL Scripts
published:  true
order:      /11
---

# Scripts for importing data into SQL Server

The set of scripts under `scripts/sql` import CSV output files in an SQL Server database. The scripts create the required tables, indexes, and relationships, and import data using the BULK INSERT tool. The underlying SQL scripts are executed using SQLCMD from the command line.


## Sql_ImportData.cmd

**WARNING**: on every run, the script deletes and recreates the tables from scratch. Be careful: do not point the script to a production database or to a database in which you already have data. **You risk losing the existing data**.

Steps:
 - Create the set of data, as CSV files, as usual.
 - Copy the output files under `scripts/sql/inputcsv` 
 - Adapt the script to your SQL server instance. SQLCMD requires SQL Server name and other parameters to connect to an SQL Server instance. The script defaults are: 
 `sqlcmd -S (LocalDb)\MSSQLLocalDB -d ContosoDGV2Test`
 - Run the import script. When asked, choose what to import:
    - sales : Manages base tables + sales table
    - orders : Manages base tables + orders/order-rows tables
    - both: Manages base tables + sales/orders/order-rows tables


Resulting database:

![Img2](images/sql-01.png)



## SQLBI_ALL_DB.cmd

Specific scripts used by SQLBI to create SQL Server database backups. It is available in the ready-to-use repository.

The databases are named with the structure "Contoso V2 10k", where "Contoso V2" is a fixed name and 10k is an approximation of the number of orders included.

 - `SQLBI_CreateSqlDatabases.ps1` : PowerShell script that creates the databases on the specified SQL Server instance.
 - `SQLBI_ALL_DB.cmd` : For each database, import data from CSV files, backup them, and compress the resulting file.

