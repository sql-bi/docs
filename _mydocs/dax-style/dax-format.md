---
layout:     page
title:      DAX Format
published:  true
order:      /
---

Rules for formatting DAX code, to improve readability and maintainability. There are the rules implemented by [DAX Formatter](https://www.daxformatter.com).

- Never use shortened [CALCULATE](https://dax.guide/calculate) syntax
    - It means don’t use `[measure](filter)` but `CALCULATE( [measure], filter )` instead
- Always put a space before parenthesis `(` and `)`
- Always put a space before any operand and operator in an expression
- If an expression has to be split in more rows, the operator is the first character in a new line
- A function call in an expression split in more rows has to be always in a new row, preceded by an operator
- Never put a space between table name and column name
- Only use single quotes for table name if it is required
    - Meaning, omit single quotes if table name has no spaces or special characters
    - Use `ThisTable` instead of `'ThisTable'`
    - USe `'This Table'` instead of `This Table`
    - Use `'ThisTable42'` instead of `ThisTable42`
- Never use table names for measure references
- Always use table names for column references
- Always put a space before an argument, if it is in the same line
- Write a function inline only if it has a single argument that is not a function call
- Always put arguments on a new line if the function call has 2 or more arguments
    - The "long" format of DAX Formatter can include more arguments in the same line
    - The "short" format of DAX Formatter strictly follow the one-argument-per-line rule
    - We use the "short" format for educational content, the "long" format in real-world scenarios 
- If the function is written on more lines:
    - The opening parenthesis `(` is on the same line of the function call
    - The arguments are in new lines, indented 4 spaces from the beginning of the function call
    - The closing parenthesis is aligned with the beginning of the function call
    - The comma separating two arguments is on the same line of the previous argument (no spaces before)
