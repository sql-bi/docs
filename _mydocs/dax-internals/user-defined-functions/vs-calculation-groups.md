---
layout:     page
title:      UDFs vs. calculation groups
published:  true
order:      /06
---

UDFs and calculation groups are both tools for encapsulating and reusing DAX logic, but they serve different purposes and operate through different mechanisms.

## Comparison

| | UDFs | Calculation groups |
|---|---|---|
| **Parameterization** | Explicit parameters | None; configuration passes through filter context |
| **Visibility to users** | Invisible; developer tool only | Visible in slicers, fields, and report filters |
| **Expansion** | Macro-expanded at the call site | Applied as a transformation to selected measures at query time |
| **Scope of application per visual** | Independent per call; different arguments per measure | Applied uniformly to all measures in the visual |
| **Independent per-measure variation** | Yes | No |
| **Performance overhead** | Minimal; parameters are resolved before execution | Filter context manipulation at query time |
| **Model storage** | Function object in semantic model | Calculation group table with calculation items |

## When to use UDFs

- The same logic must be applied in multiple places with **different arguments** per call.
- The logic is complex enough that duplication creates a maintenance risk.
- Two or more measures in the same visual need **independent parameterized expressions**.
- The consumer is a developer; end-user discoverability is not required.

## When to use calculation groups

- A transformation (e.g., currency conversion, period comparison) should apply **uniformly to all measures** in a visual.
- The selection needs to be **user-facing and interactive** (e.g., a slicer to switch between "Actual" and "Budget").
- The same item applies to every measure without per-measure variation.

## Performance note

Calculation groups pass configuration through the filter context, which requires additional filter manipulation at query time. For complex logic invoked many times within a single query, this overhead can be significant. UDFs resolve parameters before execution and produce a more efficient query plan when the same parameterized logic is needed repeatedly with varying arguments.

See [DAX user-defined functions (UDF) vs. calculation groups](https://www.sqlbi.com/articles/dax-user-defined-functions-udf-vs-calculation-groups/).
