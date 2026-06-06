---
layout:     page
title:      Optional parameters
published:  true
order:      /03
---

A parameter is optional when its declaration includes a **default expression**. When the caller omits the argument, DAX evaluates the default expression and uses its result as the parameter value.

## Syntax

```
<ParameterName> [ : <TypeHint> ] = <DefaultExpression>
```

A parameter without `=` is mandatory; a parameter with `=` is optional.

```dax
DEFINE
    FUNCTION Increment = ( x : NUMERIC, y : NUMERIC = 1 ) => x + y
```

`x` is mandatory; `y` is optional with a default of `1`.

## Omitting arguments

### Trailing omission

Optional parameters at the end of the parameter list are omitted by stopping the argument list early:

```dax
Increment ( 3 )       -- y uses default 1; returns 4
Increment ( 10, 20 )  -- y is 20; returns 30
```

### Skipping a middle parameter

To skip an optional parameter that is not the last one, write an **empty position** — a comma with no value before it:

```dax
IncrementLimit ( 5, , 20 )  -- y uses its default; limit is 20
```

## Position and arity

Optional parameters can appear in any position in the signature; required parameters can follow optional ones. Callers can always reach a required parameter by leaving an empty position for each optional parameter before it (`MyFunc ( 1, , 3 )` omits the second argument).

The minimum number of arguments a caller must supply — the function's arity — is determined by the **position of the rightmost required parameter**. If a function has three parameters and only the second is optional, callers must still supply at least three arguments: there is no way to omit the third, because it is required and comes last.

The recommended practice is: **once a parameter is optional, all following parameters should also be optional.** Placing a required parameter after an optional one forces callers to write empty positions just to reach it, which is harder to read and easy to get wrong.

## Detecting absent arguments with BLANK

When no fixed value is a natural default, use `BLANK()` as the default expression and test with `ISBLANK` inside the function body:

```dax
DEFINE
    FUNCTION RoundDivision =
        (
            x        : NUMERIC,
            y        : NUMERIC,
            digits   = BLANK ()
        ) =>
            VAR Result = DIVIDE ( x, y )
            RETURN
                IF (
                    ISBLANK ( digits ),
                    Result,
                    ROUND ( Result, digits )
                )
```

**Limitation:** The function cannot distinguish an omitted argument from an explicitly passed `BLANK()`. `RoundDivision ( 2, 3, BLANK() )` is indistinguishable from `RoundDivision ( 2, 3 )`.

## Rules for default expressions

### Context

Like the function expression body, a default expression inherits the **filter context of the caller** but does **not** inherit any row context. It is evaluated as if written at the call site, outside any iterator.

### Scope

A default expression can only reference names — columns, tables, measures, variables, functions — that are **visible at the point where the UDF is defined**, not where it is called. It cannot reference another parameter of the same function.

### Type

Type checking of the default expression against the parameter's type hint is enforced only **when the default is used** (i.e., the caller omitted the argument). When the caller provides an explicit argument, the type hint is applied to that argument instead.
