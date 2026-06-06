---
layout:     page
title:      Returning CALCULATE modifiers
published:  true
order:      /04
---

Because UDFs expand as macros, a function body can contain expressions that are only syntactically valid in a specific calling position. In particular, a function can "return" a CALCULATE modifier, provided the function is always called as a filter argument of `CALCULATE` or `CALCULATETABLE`.

## Mechanism

`REMOVEFILTERS`, `USERELATIONSHIP`, and other CALCULATE modifiers are not valid as standalone expressions; they are only valid inside `CALCULATE` or `CALCULATETABLE`. When a UDF whose body is a CALCULATE modifier is placed inside `CALCULATE` or `CALCULATETABLE`, macro-expansion substitutes the modifier directly into the correct position, producing a valid expression.

## Pattern 1: function returns a modifier directly

```dax
DEFINE
    FUNCTION Gregorian.RemoveFilterKeepColumns = () =>
        REMOVEFILTERS (
            'Date'[Day of Week],
            'Date'[Day of Week Number],
            'Date'[Day of Week Short]
        )
```

Called as a CALCULATE filter argument:

```dax
CALCULATE (
    MAX ( 'Date'[Date] ),
    Gregorian.RemoveFilterKeepColumns ()
)
```

After macro-expansion this is equivalent to:

```dax
CALCULATE (
    MAX ( 'Date'[Date] ),
    REMOVEFILTERS (
        'Date'[Day of Week],
        'Date'[Day of Week Number],
        'Date'[Day of Week Short]
    )
)
```

This function **cannot** be called anywhere except as a filter argument of `CALCULATE` or `CALCULATETABLE`. Its return is not a scalar or table, so any other calling position is invalid.

## Pattern 2: CALCULATE encapsulated inside the function

An alternative wraps the `CALCULATE` call inside the function and accepts the target expression as an `EXPR` parameter:

```dax
DEFINE
    FUNCTION Gregorian.ComputeRemovingFilterKeepColumns = ( formulaExpr : EXPR ) =>
        CALCULATE (
            formulaExpr,
            REMOVEFILTERS (
                'Date'[Day of Week],
                'Date'[Day of Week Number],
                'Date'[Day of Week Short]
            )
        )
```

Called as:

```dax
Gregorian.ComputeRemovingFilterKeepColumns ( [Sales Amount] )
```

This pattern returns a scalar and has no calling-position restriction. The choice between the two patterns is a matter of design preference; Pattern 1 is more composable when the same modifier needs to appear in many different `CALCULATE` calls with different expressions.

## Practical use case

A common application is centralizing the list of **filter-keep columns**: columns on a date table whose filters must be removed when computing a reference date but preserved by time intelligence functions applied afterward. Placing the `REMOVEFILTERS` list in a function prevents it from being duplicated across many measures and simplifies maintenance when the column list changes.
