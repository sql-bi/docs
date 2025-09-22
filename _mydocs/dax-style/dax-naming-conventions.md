---
layout:     page
title:      DAX Naming Conventions
published:  true
order:      /
---

The naming conventions for DAX coding in reality involve many objects of the semantic model and reflect the need of exposing clear names to the user and to keep the code readable and maintainable. The following sections describe the conventions for the main DAX and semantic model objects.

## Golden rules for all objects
- All names should be written using names that are clear for the business users and understandable in the reports.
- Avoid using abbreviations or acronyms unless they are widely recognized and understood by the business users.

## Tables
- Do not use any technical prefix, like `dim` or `fact`.
- Use a single noun when possible for a table name.
    - When more words are part of a table name, separate them by using a space if the table may be visible to the users, like `Coupons Orders`.
    - You might use PascalCase (e.g., `PricingConfiguration`) if the table name is designed to be invisible to the user.
- Use singular nouns for qualitative business entities (e.g., `Customer`, `Product`, `Sales Region`).
- Use uncountable or plural nouns for quantitative business entities (e.g., `Sales`, `Inventory`, `Revenue`, `Movements`).

## Columns
- Do not use any technical prefix, like `date` or `string`.
- Use a single noun when possible for a column name.
    - When more words are part of a column name, separate them by using a space if the table may be visible to the users, like `Coupons Orders`.
    - You might use PascalCase (e.g., `PricingConfiguration`) if the column name is designed to be invisible to the user.

## Measures
- The measure name should clearly describe its result.
    - When more words are part of a measure name, separate them by using a space if the measure may be visible to the users, like `Sales Amount`.
    - You might use PascalCase (e.g., `SalesAmount`) if the measure name is designed to be invisible to the user.  
- Consider common acronyms that are widely recognized and understood by the business users, like `ROI` or `YOY`.
- Use time intelligence acronyms like `YTD`, `QTD`, `MTD`, `PY`, `LY` as a suffix, like `Sales Amount YTD` or `Sales Amount PY`. A common list of time intelligence acronyms is provided below:


    | Acronym | Meaning |
    |---------|---------|
    | YTD | Year-to-date |
    | QTD | Quarter-to-date |
    | MTD | Month-to-date |
    | MAT | Moving annual total |
    | PY | Previous year |
    | PQ | Previous quarter |
    | PM | Previous month |
    | PYC | Previous year complete |
    | PQC | Previous quarter complete |
    | PMC | Previous month complete |
    | PP  | Previous period (automatically selects year, quarter, or month) |
    | PYMAT | Previous year moving annual total |
    | YOY | Year-over-year |
    | QOQ | Quarter-over-quarter |
    | MOM | Month-over-month |
    | MATG | Moving annual total growth |
    | POP | Period-over-period (automatically selects year, quarter, or month) |
    | PYTD | Previous year-to-date |
    | PQTD | Previous quarter-to-date |
    | PMTD | Previous month-to-date |
    | YOYTD | Year-over-year-to-date |
    | QOQTD | Quarter-over-quarter-to-date |
    | MOMTD | Month-over-month-to-date |
    | YTDOPY | Year- to-date-over-previous-year |
    | QTDOPQ | Quarter-to-date-over-previous-quarter |
    | MTDOPM | Month-to-date-over-previous-month |

## Variables
- Variable names should be written in PascalCase.
- Define a last variable named Result to hold the final result of the measure or expression.
    - This allows to quickly restore the expression logic when editing it for debugging purposes.
- You may use a prefix like `_` (underscore) for variable names.
    - While this was required to avoid possible name conflicts in the past, it is no longer necessary.
    - However, it can still be useful to visually distinguish variables from other objects in the code.

## User-defined functions

### Function names
- Function names should be written in PascalCase.
- The dot character (.) is permitted within function names and is recommended for delineating categories.
    - This serves as an effective analogue to namespaces commonly found in many programming languages.
- **Model-dependent** functions should include a prefix (like `Local.`) to avoid conflicts with future DAX function names
    - However, the prefix may be further specialized if needed.
    - For complex models with numerous model-dependent functions warranting categorization, `Local.` should serve as the initial segment of the prefix.
    - Examples:
        - `GetCustomerDiscount`
        - `Local.GetCustomerDiscount` if you prefer to make it more explicit that the function is model-dependent.
        - `Local.Checkout.GetCustomerDiscount` where Checkout is a prefix to group similar or related functions.
        - **Do not use** `Checkout.GetCustomerDiscount` because it would appear as a model-independent function.

- **Model-independent** functions must begin with a prefix indicating at least the containing library.
    - Examples:
        - `Math.SumTwoNumbers` where Math is the library name.
        - `Math.Common.SumTwoNumbers` where Math is the library name and Common is a prefix to group similar or related functions.
        - `CompanyName.Math.SumTwoNumbers` where CompanyName is a prefix for all the libraries of the company.
        - **Do not use** `SumTwoNumbers` because it would appear as a model-dependent function.
        - You cannot use `Dax` as a noun part of the function name, as Microsoft reserves it.
        - You should not use `DaxLib` as an initial prefix for a function name, as it is reserved for general-purpose libraries maintained by the [DAX Lib](https://daxlib.org) community.

### Parameters
- Use [camelCase](https://en.wikipedia.org/wiki/Camel_case) for parameter names.
- Include a suffix indicating the parameter type for `EXPR` parameters:
    - `Column` for a column reference.
    - `Table` for a table reference.
    - `Measure` for a measure reference.
    - `Expr` for a DAX expression that is not necessarily a single column reference, table reference, or measure reference.
    - `Calendar` for a calendar reference, which cannot be an expression.

As a result, `YearlySales` is interpreted as a variable, whereas `yearlySales` indicates a parameter. Adhering to these conventions significantly improves code readability, particularly when working with complex functions. 

Examples of `EXPR` parameter names are: `lookupTable`, `listPriceColumn`, `amountMeasure`, `metricExpr`.

### Comments

Comments describing functions are typically introduced with a triple forward slash (///) directly before the function declaration. This notation serves to document the function’s purpose. For example, the following function converts the temperature from Celsius to Fahrenheit:
```
/// Convert from Celsius(°C) to Fahrenheit(°F)
FUNCTION CelsiusToFahrenheit = ( temperature: DOUBLE ) =>
        ( temperature * ( 9 / 5 ) ) + 32
```

**NOTE**: *There is no official proposal for documenting function parameters and return values. The following information is subject to change in future versions of Power BI Desktop and Tabular Editor. We will update this page as soon as a standard will be defined.*

Here is a possible technique inspired by the JSDoc standard (https://en.wikipedia.org/wiki/JSDoc) that can be used in September 2025 version of Power BI Desktop and shows the parameters in the function description:
```
/// Convert from Celsius(°C) to Fahrenheit(°F)
/// @param temperature – The temperature in Celsius
/// @returns The temperature converted to Fahrenheit
FUNCTION CelsiusToFahrenheit = ( temperature: DOUBLE ) =>
        ( temperature * ( 9 / 5 ) ) + 32
```

Here is the technique adopted for parameters by Tabular Editor 3 in September 2025 release:
```
/// Convert from Celsius(°C) to Fahrenheit(°F)
FUNCTION CelsiusToFahrenheit = ( 
    // The temperature in Celsius
    temperature: DOUBLE 
) =>
    ( temperature * ( 9 / 5 ) ) + 32
```
