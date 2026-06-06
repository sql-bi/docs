---
layout:     page
title:      Syntax
published:  true
order:      /01
---

## DEFINE FUNCTION statement

A UDF is declared with the `DEFINE FUNCTION` statement:

```dax
DEFINE
    FUNCTION <Name> =
        ( <ParameterList> )
        => <Body>
```

`<ParameterList>` is a comma-separated list of zero or more parameter declarations. An empty parameter list is written as `()`. `<Body>` is any DAX expression, including variables.

Each parameter declaration has the form:

```
<ParameterName> [ : <TypeHint> ] [ = <DefaultExpression> ]
```

A parameter without `= <DefaultExpression>` is mandatory; one with it is optional. See [Parameter types](parameter-types.md) and [Optional parameters](optional-parameters.md).

## Naming

Function names use **Pascal case** to distinguish user-defined functions from built-in DAX functions, which are always uppercase. Dot notation is used for namespacing:

| Convention | Example |
|---|---|
| Generic UDF | `BestCustomers` |
| Model-scoped | `Local.GetCustomerDiscount` |
| Library-distributed | `DaxPatterns.LikeForLike.EntityStatus` |

## Scope

UDFs can be defined in two places:

- **Query level**: inside the `DEFINE` block of a DAX query. The function is visible only within that query.
- **Model level**: stored as a named object in a semantic model. The function is visible from any measure, calculated column, or calculated table in that model, and from DAX queries run against it.

## Return type

A function can return:

- A **scalar value**: usable anywhere a scalar expression is valid.
- A **table**: usable anywhere a table expression is valid.
- A **CALCULATE modifier** (e.g., `REMOVEFILTERS`): only valid as a filter argument inside `CALCULATE` or `CALCULATETABLE`. This special case is possible because UDFs expand as macros; see [Returning CALCULATE modifiers](calculate-modifiers.md).

## Macro-expansion semantics

UDFs are not subroutines. There is no separate call stack or isolated execution context. When a UDF is called, its body is substituted inline at the call site, with each argument replacing its corresponding parameter according to the parameter's passing mode. The result is semantically identical to having written the substituted expression directly at the call site.

A consequence is that the function body may contain language constructs (such as CALCULATE modifiers) that are only syntactically valid in certain positions, provided the function is always called from a position where those constructs are valid.

## Limitations

- **No recursion.** A function cannot call itself, directly or indirectly.
- **No overloading.** Two functions in the same scope cannot share a name.
- A model-level function is model-dependent by default if its body references model objects directly. See [Model dependency](model-dependency.md).
