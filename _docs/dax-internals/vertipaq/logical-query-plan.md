---
layout:     page
title:      Logical Query Plan in VertiPaq
published:  true
order:      /
---

## Common logical query plan operators

| Operator         | Description                                                                                                                                                                |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AddColumns       | Adds columns to a table.                                                                                                                                                   |
| Calculate        | Calculates a scalar expression by applying specific filters. It corresponds to the CALCULATE function in DAX.                                                              |
| CalculateTable   | Calculates table expression by applying specific filters. It corresponds to the CALCULATETABLE function in DAX.                                                            |
| Filter_VertiPaq  | Returns a table usually applied as a filter to a Calculate operator.                                                                                                       |
| GroupBy_VertiPaq | Performs group by of the table using the specified columns.                                                                                                                |
| GroupSemiJoin    | Joins the result of two operators, returning all the rows in the first table if there is a match with the result of the second operator.                                   |
| ScalarVarProxy   | Returns e value of a scalar variable computed inside a variable scope introduced with the VarScope operator.                                                               |
| Scan_Vertipaq    | Performs the scan of a table using the VertiPaq storage engine.                                                                                                            |
| Sum_Vertipaq     | Performs SUM aggregation using the VertiPaq storage engine. Similar operators are available for MIN, MAX, and COUNT aggregations.                                          |
| TableVarProxy    | Returns the value of a table variable computed inside a variable scope introduced with the VarScope operator.                                                              |
| VarScope         | Opens variable scope. It contains a list of variable definitions defined with the VarName property. The result of the VarScope operator is the last operator in the scope. |

