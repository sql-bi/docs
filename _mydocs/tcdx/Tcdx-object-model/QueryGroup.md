---
layout:     page
title:      QueryGroup
published:  false
draft:      true
order:      /02
---

The **QueryGroup** represents a represents a single object in the client who uses the Model, with the information of the referenced tables and measures.

| Member | Values |  Notes |
| -- | -- | -- |
| QueryGroupType | QueryAnalytics, Profiler, ExtendedEvents, OtherQueryGroupType | The source of the imported queries | 
| QueryGroupName | TcdxName | |
| CorrelationId | string | the correlation can be used to link the qeury group to a separate log file containing the queries, that are not to be included into the tcdx file for privacy reasons |
| QueryGroupProperties | Key/Value collection | a collection of custom properties that depend on the source of the aquired queries |
| Model | ModelDepenency | the reference to the referenced Model (_dummyModelDepenency if none) |
| Item | Item | reference to the Item with the objects referenced by the query |
| TableQueries | table name/counter | collection with the counters of the number of queries referencing the table |
| ColumnQueries | column name/counter | collection with the counters of the number of queries referencing the column |
| MeasurQueries | measure name/counter | collection with the counters of the number of queries referencing the measure |
| TokenQueries | column or measure name/counter | collection with the counters of the number of queries referencing the measure or column when it was not possible to distinguish them from the context |
| NumberOfQueries | int | total number of executed queries |
| TotalExecTimeMilliseconds | long | total duration of all the execution in milliseconds |
| MaxExecTimeMilliseconds | int | maximum duration of executed queries in milliseconds |
| MinExecTimeMilliseconds | int | minimum duration of executed queries in milliseconds |
| AverageExecTimeMilliseconds | int | average duration of executed queries in milliseconds |
| StandardDeviationExcTimeMilliseconds | int | standard devaiation of the duration of executed queries in milliseconds |
| UtcStart | DateTime | start time of the capture of the queries |
| UtcEnd | DateTime | finish time of the capture of the queries |

The **QueryGroupsCollectionProperties** is a container for **QueryGroup** objects

| Member | Values |  Notes |
| -- | -- | -- |
| QueryGroups | List of query groups | |
| QueryGroupsCollectionProperties | key/value collection | a custom key value collection for custom properties for the grouip of query groups |
 
## Note: 
for privacy reasons, strings are implemented as **TcdxName** objects, to allow a future implemtation of objects anonymization.