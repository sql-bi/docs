---
layout:     page
title:      SQL Scripts
menu_title: SQL Scripts
published:  true
order:      /11
---

## Scripts for importing data into SQL Server

The set of scripts under `scripts/sql` allow you to import CSV output files to a Sql Server database. The scripts create the required tables, indexes and relationship and import data using sql bulk insert. The underlying SQL scripts are executed using SQLCMD from the command line.  

**Warning**: on every run, the script deletes and recreates the tables from scratch. Be careful: do not point the script to a production database or to a database in which you already have data. **You risk to lose the existing data**.

Steps:
 - Create the data, as CSV files, as usual.
 - Copy the output files under `scripts/sql/inputcsv` 
 - Adapt the script to your SQL server instance. SQLCMD requires sql server name and other parameters to connect to you sql server. The script defaults are: 
 `sqlcmd -S (LocalDb)\MSSQLLocalDB -d ContosoDGV2Test`
 - Run the import script that fit you needs:
    - `SqlDBSales.cmd` : import base tables + sales
    - `SqlDBOrders.cmd` : import base tables + orders/rows
    - `SqlDBAll.cmd` : import base tables + sales + orders/rows


Resulting database:

![Img2](images/sql-01.png)

