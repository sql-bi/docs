---
layout:     page
title:      SQL Scripts
menu_title: SQL Scripts
published:  true
order:      /11
---

# Scripts for importing data into SQL Server

The set of scripts under `scripts/sql` allow you to import CSV output files to a Sql Server database. The scripts create the required tables, indexes and relationship and import data using sql bulk insert. The underlying SQL scripts are executed using SQLCMD from the command line.


## Sql_ImportData.cmd

**Warning**: on every run, the script deletes and recreates the tables from scratch. Be careful: do not point the script to a production database or to a database in which you already have data. **You risk to lose the existing data**.

Steps:
 - Create the set of data, as CSV files, as usual.
 - Copy the output files under `scripts/sql/inputcsv` 
 - Adapt the script to your SQL server instance. SQLCMD requires sql server name and other parameters to connect to you sql server. The script defaults are: 
 `sqlcmd -S (LocalDb)\MSSQLLocalDB -d ContosoDGV2Test`
 - Run the import script. When asked, choose what to import:
    - sales : mamages base tables + sales table
    - orders : mamages base tables + orders/order-rows tables
    - both: mamages base tables + sales/orders/order-rows tables


Resulting database:

![Img2](images/sql-01.png)



## SQLBI_ALL_DB.cmd

Specific scripts used by SQLBI for creating Sql Server database backups, available in the ready-to-use repository. The database are: Contoso 100k, Contoso 1M, Contoso 10M and Contoso 100M.

 - `SQLBI_ALL_DB.cmd` : import data into the 4 databases, backup them and compress the resulting file.
 - `SQLBI_CreateSqlDatabases.ps1` : creates the 4 databases on the specified SQL Server