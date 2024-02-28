---
layout:     page
title:      IsAvailableInMDX Property
published:  true
order:      /
---

The **IsAvailableInMDX** property allows a static evaluation of the items in a column without requiring a scan when the column is not filtered. 
For example, consider the following code:

```DAX
DEFINE
    MEASURE 'Sales'[M] =
        VAR x =
            SUM ( 'Sales'[Net Price] )
        RETURN
            IF ( ISBLANK ( SELECTEDVALUE ( 'Reporting Scenario'[Scenario] ) ), x, x )

EVALUATE
SUMMARIZECOLUMNS (
    'Product'[Brand],
    "m", [m]
)
```

The *Scenario* column does not have any filter. As such, SELECTEDVALUE would return BLANK if there are two or more values included in the column.
If **IsAvailableMDX** is set to **true**, then the IF condition is statically resolved and there is a single SE query computing the SUM aggregation by *Brand*.
If **IsAvailableMDX** is set to **false**, then the IF condition must query the *Reporting Scenario* table to retrieve the values and the query plan has two branches for the possible evaluations (even though we repeat the same variable in the example, that branch duplication is not optimized).

Regardless of the IsAvailableMDX setting, the presence of a filter in *Scenario* is not statically evaluated and still requires a query to the filter context, when the "else" condition of IF (or the "other" condition of SWITCH) is not blank. When IF/SWITCH don't have the else/other condition, a single filter can [optimize SWITCH](switch-optimization.md) regardless of the IsAvailableInMDX setting.
