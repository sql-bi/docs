---
layout:     page
title:      Dimension joins
published:  true
order:      /50
---

The presence of the key column of a one-to-many relationship in the result of a DAX query generates a separate storage engine query to reduce the memory footprint, but this additional query could negatively impact performance in a few cases. Modifying the columns used in the query can produce a different query plan if needed.

## Joins including the key column of the dimension table
When the column on the one-side of the relationship is included in the query, the query plan creates two storage engine queries, one for the table on the one-side of the relationship (dimension) and one for the many-side table (fact), and then joins the results in the formula engine. For example, consider the following query on the *Product* dimension table where the *ProductKey* key column is included:

```DAX
EVALUATE
SUMMARIZECOLUMNS (
    'Product'[ProductKey],
    'Product'[Product Name],
    'Product'[Color],
    'Product'[Brand],
    "Sales", SUM ( Sales[Net Price] )
)
```

The first storage engine query joins *Sales* and *Product*, including only *Product[ProductKey]* from the dimension table and not the other *Product[Product Name]*, *Product[Color]*, and *Product[Brand]* columns:

```xmSQL
SELECT
    'Product'[ProductKey],
    SUM ( 'Sales'[Net Price] )
FROM 'Sales'
    LEFT OUTER JOIN 'Product'
        ON 'Sales'[ProductKey]='Product'[ProductKey];
```

The second storage engine query retrieves all the columns needed from the *Product* table, including also products that are not present in the result of the first query:
```xmSQL
SELECT
    'Product'[ProductKey],
    'Product'[Product Name],
    'Product'[Brand],
    'Product'[Color]
FROM 'Product';
```

This way, the result of the storage engine query on the fact table does not repeat the values of the other columns included in the dimension, reducing the memory footprint. However, this results in an additional storage engine query on the dimension table that is not filtered.

## Joins excluding the key column of the dimension table
When the column on the one-side of the relationship is not included in the query, the query plan creates a single storage engine query that joins the two tables directly. For example, consider the following query on the *Product* dimension table where the *ProductKey* key column is not included:

```DAX
EVALUATE
SUMMARIZECOLUMNS (
    'Product'[Product Code],
    'Product'[Product Name],
    'Product'[Color],
    'Product'[Brand],
    "Sales", SUM ( Sales[Net Price] )
)
```

In this case, there is a single storage engine query that joins *Sales* and *Product*, including all the columns needed from the *Product* table:

```xmSQL
SELECT
    'Product'[Product Code],
    'Product'[Product Name],
    'Product'[Brand],
    'Product'[Color],
    SUM ( 'Sales'[Net Price] )
FROM 'Sales'
    LEFT OUTER JOIN 'Product'
        ON 'Sales'[ProductKey]='Product'[ProductKey];
```

This approach could create a larger memory footprint because all the columns from the dimension table are included in the result of the storage engine query on the fact table, repeating the values of the dimension columns for each matching row in the result, which could have multiple rows if there are joins with other dimension tables. However, it avoids the additional storage engine query on the dimension table, which could improve performance in some cases.

## Performance considerations

For large dimension tables that could be joined with the fact tables including the maxim detail of the dimension with a filter that should lower the number of rows returned, you can consider to hide the key column of the dimension table and make it visible a copy of the column with the same values but not used as key of the relationship. This way, when the user includes the dimension columns in the query, the key column is not included, and the query plan uses a single storage engine query joining the fact and dimension tables directly.

However, this choice double the storage cost of an expensive column of the dimension table, so it should be evaluated carefully.

## External resources

[Impact of primary keys on DAX query performance](https://dax.tips/2025/11/14/the-impact-of-primary-keys-on-dax-query-performance-in-power-bi/) by Phil Seamark
