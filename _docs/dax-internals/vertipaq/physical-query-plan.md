---
layout:     page
title:      Physical Query Plan in VertiPaq
published:  true
order:      /
---

## Common physical query plan operators


| Operator               | Description |
|------------------------|-------------|
| AggregationSpool       | Aggregates the result of a Cache operator, by aggregating some of the columns contained in the datacache. |
| Cache              | Identifies the use of a datacache. Retrieves the content of a datacache returned by a storage engine query. In a single query plan, there might be several Cache operators reading the same datacache. In this scenario, there will be a single storage engine query generating the datacache, which is then consumed in different parts of the query plan. |
| CrossApply         | Performs the Cartesian product (cross-join) between two tables. The cardinality of the resulting table is not exposed directly. If the result is immediately consumed by a Spool operator, then the resulting number of records is visible. However, if a Filter operator is executed before any spool, the number of records produced by the CrossApply and then filtered is not visible and you can see only the number of filtered rows. |
| DataPostFilter     | Retrieves a subset of rows from a datacache resulting from a vertical fusion operation. While Cache retrieves the entire datacache, DataPostFilter retrieves some of the values based on a filter condition. |
| Filter            | Filters one table thus reducing the number of rows. |
| GroupSemiJoin     | Groups two tables by performing a semi-join. |
| InnerHashJoin     | Performs an inner join between two tables. |
| ProjectionSpool   | Projects the result of a Cache operator; selects some of the columns contained in the datacache.|
| SpoolIterator     | Summarizes a table by performing one aggregation (sum/count/distinct count/min/max/average) over a value obtained from an expression (or a column in simpler cases) and grouping by one or more columns of the original table. |
| SpoolLookup       | Summarizes a table by performing an aggregation (sum/count/distinct count/min/max/average) over   a value obtained from an expression (or a column in simpler cases). Returns a single value. |
| TableCtor         | Builds a table from a table constructor syntax. |
| TreatAs           | Changes the data lineage of a table (like TREATAS in DAX). |