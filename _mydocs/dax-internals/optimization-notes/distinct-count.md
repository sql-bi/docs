---
layout:     page
title:      Distinct Count
published:  true
order:      /60
---

The DISTINCTCOUNT function in DAX can generate different storage engine queries depending on the complete DAX query. This page includes special notes about storage engine optimization.

## DISTINCTCOUNT on primary keys

The DISTINCTCOUNT function in DAX is automatically converted to a COUNTROWS when the argument is a key column of the table.
For example, consider the following expression: 
```DAX
DISTINCTCOUNT ( 'Product'[ProductKey] )
```

If *ProductKey* is on the one-side of a regular one-to-many relationship, or it is marked as a key column of the table, then the code corresponds to: 
```DAX
COUNTROWS ( 'Product' )
```

Because COUNTROWS usually produces a more efficient query plan, this is usually an optimization that does not have side effects.