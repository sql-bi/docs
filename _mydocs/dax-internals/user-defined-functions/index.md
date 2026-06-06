---
layout:     page
title:      User-defined functions (UDF)
published:  true
order:      /
next_reading: true
next_reading_title: false
---

A DAX user-defined function (UDF) is a named, reusable expression declared with the `DEFINE FUNCTION` statement. UDFs are not subroutines invoked on a call stack; they expand inline at the call site as macros. The function body is substituted wherever the function is called, which means that expressions only valid in certain positions (such as CALCULATE modifiers) can be encapsulated inside a function and remain valid after expansion.

UDFs can be defined at query level inside a `DEFINE` block or stored in a semantic model and shared across all measures and calculated columns in that model.

Related SQLBI articles: 
- [Introducing user-defined functions in DAX](https://www.sqlbi.com/articles/introducing-user-defined-functions-in-dax/)
- [Model-dependent and model-independent user-defined functions in DAX](https://www.sqlbi.com/articles/model-dependent-and-model-independent-user-defined-functions-in-dax/)
- [Understanding parameter types in DAX user-defined functions](https://www.sqlbi.com/articles/understanding-parameter-types-in-dax-user-defined-functions-udf/)
- [UDFs vs. calculation groups](https://www.sqlbi.com/articles/dax-user-defined-functions-udf-vs-calculation-groups/)

Content in this section: