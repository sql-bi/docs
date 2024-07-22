---
layout:     page
title:      Details
menu_title: Details
published:  true
order:      /01
---

## Data structure

Output elements:
 - Customers
 - Stores
 - Dates
 - CurrencyExchanges
 - Sales 
 - Orders & OrderRows (optional)

Data schema (Sales version):

![Schema Sales](images/schema-sales.svg)


Data schema (Orders & OrderRows version):

![Schema Sales](images/schema-orders.svg)

<br/>

Customers set of data is filled with fake, but realistic, customers data.

 
## Pre-data-preparation: static data from SQLBI repository

The tool needs some files containing static data: fake customers, exchange rates, postal codes, etc. The files are cached under cache folder specified as a parameter on the command line. The files are downloaded from a specific SQLBI repository if not found in the cache folder. In normal usage, if you reuse the same cache folder, the files are downloaded only on the first run.
After downloading, some files are processed to create a consistent set of fake customers. The output file, customersall.csv, is placed under cache folder. If you delete it, it will be recreated on the following run.

https://github.com/sql-bi/Contoso-Data-Generator-V2-Data/releases/tag/static-files



