---
layout:     page
title:      Parameter types
published:  true
order:      /02
---

Each parameter has two independent properties: a **data type** (what expressions it accepts) and a **passing mode** (how the argument is transferred from call site to function body).

## Passing modes

### VAL

The argument is evaluated once, in the evaluation context of the caller, before the function body runs. The parameter behaves like a `VAR` bound to that value. Changes in filter or row context inside the function body have no effect on the parameter's value.

Semantic equivalent for a call `F( SUM ( Sales[Quantity] ) )` with parameter `qty : VAL`:

```dax
VAR qty = SUM ( Sales[Quantity] )
RETURN <body>
```

### EXPR

The argument expression is captured unevaluated and substituted inline at every reference to the parameter inside the function body. The expression is re-evaluated each time it is referenced, in the evaluation context present at that point in the body.

Semantic equivalent for a call `F( SUM ( Sales[Quantity] ) )` with parameter `qty : EXPR`:

```dax
-- every reference to qty in the body becomes SUM ( Sales[Quantity] )
```

**Context transition:** EXPR parameters do **not** receive automatic context transition in row contexts, unlike a measure reference. To ensure correct behavior inside iterators, wrap the parameter reference in CALCULATE:

```dax
CALCULATE ( paramExpr )
```

`MEASUREREF` (see below) is the only reference type that guarantees context transition automatically.

## Data types

| Type | Accepts | Passing mode | Notes |
|---|---|---|---|
| `ANYVAL` | Any scalar or table | VAL (default) | Default when no type hint is specified |
| `SCALAR` | Scalar expressions only | VAL or EXPR | Accepts a subtype to restrict the data type |
| `TABLE` | Table expressions only | VAL or EXPR | |
| `ANYREF` | Any expression | EXPR (forced) | No semantic guarantee on the expression kind |
| `MEASUREREF` | Measure references only | EXPR (forced) | Guarantees context transition in row contexts |
| `COLUMNREF` | Column references only | EXPR (forced) | Enables model-independent column access |
| `TABLEREF` | Model table references only | EXPR (forced) | Provides full column and relationship access |
| `CALENDARREF` | Calendar references only | EXPR (forced) | Intended for time intelligence functions |

`ANYREF`, `MEASUREREF`, `COLUMNREF`, `TABLEREF`, and `CALENDARREF` force EXPR passing mode and cannot be declared as VAL.

### Scalar subtypes

`SCALAR` can be qualified with a subtype that restricts the accepted data type and enables automatic coercion:

| Subtype | Accepts |
|---|---|
| `VARIANT` (default) | Any scalar data type |
| `INT64` | Integer |
| `DECIMAL` | Fixed-decimal number |
| `DOUBLE` | Floating-point number |
| `NUMERIC` | Any numeric type (INT64, DECIMAL, DOUBLE) |
| `STRING` | Text |
| `DATETIME` | Date or timestamp |
| `BOOLEAN` | True/False |

Coercion applies independently to each parameter; it does not propagate across parameters.

## Type declaration syntax

```
<ParameterName> : <Type> [<Subtype>] [<PassingMode>]
```

When only a passing mode is written without a type, the type defaults to `ANYVAL`:

```dax
FUNCTION F = ( a : VAL, b : EXPR ) => ...
```

## Type checking

Type checking and coercion apply differently depending on the parameter category:

**Scalar subtypes** (`INT64`, `DECIMAL`, `DOUBLE`, etc.) do not reject incompatible arguments; they coerce them. Each argument is independently converted to the declared type before the function body runs. No error is raised; see the coercion note under *Scalar subtypes* above.

**Reference types** (`MEASUREREF`, `COLUMNREF`, `TABLEREF`, `CALENDARREF`) perform genuine type checking at call time. Passing an incompatible expression produces an error that identifies the expected and received types, for example: *"An invalid argument type was passed into parameter 'amountMeasure' of the user-defined function. Expected 'MEASUREREF' but got 'SCALAR'."* There is a known limitation for `COLUMNREF`: when a column reference is invalid, the internal syntax error from the function body surfaces before any custom validation error the function author may have written.

**`ANYREF`** performs no type checking. An incompatible argument may produce confusing errors deep inside the function body or, in the worst case, incorrect results with no error at all. Functions using `ANYREF` must handle the general case defensively, for example by wrapping every reference to the parameter in `CALCULATE` to guarantee context transition regardless of what was passed.

## Introspection functions

Two functions are available for use inside a function body with `COLUMNREF` or `TABLEREF` parameters:

- **`TABLEOF ( columnRef )`**: returns the table in which the referenced column is defined.
- **`NAMEOF ( columnRef )`**: returns the column's fully qualified name as a string.

These functions are intended to support runtime validation, for example checking that two `COLUMNREF` parameters belong to the same table:

```dax
IF (
    NAMEOF ( TABLEOF ( col1 ) ) <> NAMEOF ( TABLEOF ( col2 ) ),
    ERROR ( "col1 and col2 must belong to the same table" )
)
```

This pattern does not work reliably today: when the column parameters are used incorrectly in the function body, DAX generates its own internal error from that usage before the `IF`/`ERROR` validation code executes, hiding the custom error message. The intent is correct and the pattern is expected to work once the evaluation order is enforced.

See [Understanding parameter types in DAX user-defined functions](https://www.sqlbi.com/articles/understanding-parameter-types-in-dax-user-defined-functions-udf/).
