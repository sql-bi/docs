---
layout:     page
title:      Model dependency
published:  true
order:      /05
---

A UDF is **model-dependent** when its body references model objects directly — tables, columns, measures, or calendars — by name. It is **model-independent** when all such references arrive exclusively through parameters, making the function portable across semantic models without modification.

## Hidden dependencies

A function accepting a `TABLE` or `TABLE EXPR` parameter may appear model-independent while harboring implicit structural dependencies. If the function body accesses specific column names inside that table (e.g., `tableParam[Quantity]`), it implicitly requires those columns to exist in whatever table the caller passes. To make the function truly model-independent, expose each required column as a separate `COLUMNREF` or `ANYREF` parameter.

## Naming conventions

### Function names

Use dot notation to namespace functions and communicate their intended scope:

| Prefix | Meaning |
|---|---|
| `Local.` | Model-specific; not intended for sharing across models |
| `<LibraryName>.` | Distributed library function (e.g., `DaxPatterns.LikeForLike.EntityStatus`) |

### Parameter names

Use camelCase with a type-indicating suffix when the parameter type carries semantic meaning:

| Suffix | Parameter type |
|---|---|
| `Expr` or `Measure` | EXPR scalar or `MEASUREREF` |
| `Column` | `COLUMNREF` |
| `Table` | `TABLEREF` or `TABLE EXPR` |
| `Calendar` | `CALENDARREF` |

Example: `( salesMeasure : MEASUREREF, dateColumn : COLUMNREF, salesTable : TABLEREF )`

## Validating column parameters

When a function accepts multiple `COLUMNREF` parameters that must belong to the same table, use `TABLEOF` and `NAMEOF` to verify at runtime:

```dax
IF (
    NAMEOF ( TABLEOF ( col1 ) ) <> NAMEOF ( TABLEOF ( col2 ) ),
    ERROR ( "col1 and col2 must belong to the same table" )
)
```

This pattern does not work reliably today: when the column parameters are used incorrectly in the function body, DAX generates its own internal error from that usage before the `IF`/`ERROR` validation code executes, hiding the custom error message. See the same limitation noted in [Parameter types / Introspection functions](parameter-types.md#introspection-functions).

## Portability pattern

Wrapping a model-independent function in a thin model-dependent function is a common pattern to simplify call sites without sacrificing the underlying function's portability. The model-independent function is shared (e.g., via a library); the model-dependent wrapper maps concrete model objects to the required parameters and exposes a shorter signature to measure authors.

Model-independent functions can be published to and consumed from shared DAX libraries such as [daxlib.org](https://daxlib.org).

See [Model-dependent and model-independent user-defined functions in DAX](https://www.sqlbi.com/articles/model-dependent-and-model-independent-user-defined-functions-in-dax/).
