---
layout:     page
title:      xmSQL code in VertiPaq
published:  true
order:      /
---

## Syntax
An xmSQL query is similar to a SQL query, with the difference that a GROUP BY is always implicit for the column references.

**xmSQL**
```xmSQL
SELECT customer[country], customer[state]
FROM customer
```

**SQL**
```SQL
SELECT customer.country, customer.state
FROM customer
GROUP BY customer.country, customer.state
```

### Aggregation

The aggregation functions available in xmSQL are `SUM`, `MIN`, `MAX`, `COUNT`, and `DCOUNT`.

**xmSQL**
```xmSQL
SELECT customer[country], customer[state], SUM ( customer[amount] )
FROM customer
```

**SQL**
```SQL
SELECT customer.country, customer.state, SUM ( customer.amount )
FROM customer
GROUP BY customer.country, customer.state
```

The `COUNT` function does not have an argument in xmSQL:

**xmSQL**
```xmSQL
SELECT customer[country], customer[state], COUNT ( )
FROM customer
```

**SQL**
```SQL
SELECT customer.country, customer.state, COUNT ( * )
FROM customer
GROUP BY customer.country, customer.state
```

The `DCOUNT` function is a distinct count that corresponds to the following SQL example:

**xmSQL**
```xmSQL
SELECT customer[country], customer[state], DCOUNT ( customer[city] )
FROM table
```

**SQL**
```SQL
SELECT customer.country, customer.state, COUNT ( DISTINCT customer.city )
FROM customer
GROUP BY customer.country, customer.state
```

### Expressions

Aggregations can only reference a column or an expression in case row-level operators are involved:

**xmSQL**
```xmSQL
WITH $expr0 := sales[quantity] * sales[net price]
SELECT sales[customerkey], SUM ( $expr0 )
FROM sales
```

**SQL**
```SQL
SELECT sales.customerkey, SUM ( sales.quantity * sales.[net price] )
FROM sales
GROUP BY sales.customerkey
```

### Filter (WHERE condition)

The `WHERE` condition in xmSQL is similar to SQL:

**xmSQL**
```xmSQL
SELECT customer[country], SUM ( customer[amount] )
FROM customer
WHERE customer[retention] = 5
```

**SQL**
```SQL
SELECT customer.country, SUM ( customer.amount )
FROM customer
WHERE customer.retention = 5
GROUP BY customer.country
```

The arguments may include a list of items in the IN condition when the filter is prepared by the Formula Engine or by another xmSQL query in the same batch event:

**xmSQL**
```xmSQL
SELECT customer[country], SUM ( customer[amount] )
FROM customer
WHERE customer[retention] IN ( 10, 15, 20 )
```

**SQL**
```SQL
SELECT customer.country, SUM ( customer.amount )
FROM customer
WHERE customer.retention IN ( 10, 15, 20 )
GROUP BY customer.country
```

### Joins and relationships (LEFT OUTER JOIN condition)
Existing regular many-to-one relationships can produce a `LEFT OUTER JOIN` in xmSQL that corresponds to the same syntax in SQL:

**xmSQL**
```xmSQL
SELECT customer[country], SUM ( sales[quantity] )
FROM sales
    LEFT OUTER JOIN customer 
        ON sales[customerKey] = customer[customerKey]
```

**SQL**
```SQL
SELECT customer.country, SUM ( sales.quantity )
FROM sales
    LEFT OUTER JOIN customer 
        ON sales.customerKey = customer.customerKey
GROUP BY customer.country
```
### Joins for cartesian product (INNER JOIN condition)

INNER JOIN is another type of join that is used in conjunction with REDUCED BY. In this case, the table after REDUCED BY is a temporary table defined in the same batch; it usually includes aggregations and is the larger table involved in the join. The INNER JOIN works in the presence of a relationship created with CREATE SHALLOW RELATION in the same batch: the cartesian product of the two tables involved in the join is reduced by including only the rows that satisfy the relationship. The result of INNER JOIN can have more rows than the largest table involved in the join, whereas LEFT JOIN in xmSQL will never return more
rows than those in the initial table.

For more information:
[**Explaining REDUCED BY in xmSQL batch events**](https://www.sqlbi.com/blog/marco/2023/05/17/explaining-reduced-by-in-xmsql-batch-events/)

### Reverse joins

REVERSE HASH JOIN and REVERSE BITMAP JOIN join types do not require the presence of a VertiPaq relationship. The difference between the two join types is in the algorithm. The VertiPaq engine chooses between the two based on data distribution. Reverse joins perform the opposite of a regular join. With a LEFT OUTER JOIN, a query scans *Sales* and joins it to *Product* to retrieve column values from *Product* and use them while scanning *Sales*, which reduces the number of rows iterated in *Sales*. A reverse join performs the opposite operation: it lets a filter move from *Sales* to *Product*.

A reverse join is also a possible implementation for a LEFT OUTER JOIN that appears in the *Internal* query corresponding to a *Scan* event. The engine uses a reverse join when the following three conditions are all met:
- the ratio is less than 20%;
- the table on the many-side has at least 131,072 rows;
- the column on the many-side has at least 16,384 unique values.

For example, consider the following query:

**xmSQL**
```xmSQL
SELECT
    SUM ( sales[quantity] )
FROM sales
    LEFT OUTER JOIN customer 
        ON sales[customerKey] = customer[customerKey]
WHERE
    customer[country] = 'Canada'
```

For example, consider the following query:

**xmSQL**
```xmSQL
SELECT
    SUM ( sales[quantity] )
FROM sales
    LEFT OUTER JOIN customer 
        ON sales[customerKey] = customer[customerKey]
WHERE
    customer[country] = 'Canada'
```

Its *Internal* execution can be a single query almost identical to the *Scan* request (just with an additional `COUNT` function), or a sequence of two *Internal* requests.

The first *Internal* request creates a bitmap index with the `RJOIN` function and applies the filter by using a `REVERSE BITMAP JOIN`:

**xmSQL**
```xmSQL
SELECT
RJOIN ( customer[customerKey] ) 
FROM customer
    REVERSE BITMAP JOIN sales
        ON sales[customerKey] = customer[customerKey]
WHERE
    customer[country] = 'Canada';
```

The second *Internal* applies the filters by using the bitmap index on the many-side of the relationship:

**xmSQL**
```xmSQL
SELECT
    SUM ( sales[quantity] ),
    COUNT ( ) 
FROM sales
    LEFT OUTER JOIN customer 
        ON sales[customerKey] = customer[customerKey]
WHERE
    sales[customerKey] INB ( 383007, 238625, 382960, 290918, 258236, 358749, 207855, 265593, 212119, 394181..[1,655 total values, not all displayed] )
```

### Batches

A single xmSQL batch includes two or more internal xmSQL request assigned to temporary tables. Batch are used to split a calculation in multiple steps and corresponds to SQL subqueries.

**xmSQL**
```xmSQL
DEFINE TABLE $TTable2 :=
SELECT
    SIMPLEINDEXN ( store[square meters] )
FROM store
WHERE store[quare meters] >= 3000

DEFINE TABLE $TTable1 :=
SELECT SUM ( sales[quantity] )
FROM sales
    LEFT OUTER JOIN store
        ON sales[storekey] = store[storekey]
WHERE store[square meters] ININDEX $TTable2[$SemijoinProjection];
```

**SQL**
```SQL
SELECT SUM ( sales[quantity] )
FROM sales
FROM sales
    LEFT OUTER JOIN store 
        ON store.storekey  = store.storekey
WHERE store.[square meters] IN (
    SELECT DISTINCT store.[square meters] 
    FROM store
    WHERE store.[square meters] >= 3000
)
```

The subquery created in xmSQL might be unnecessary in SQL. For example, the previous query could have been written as follows:

**SQL**
```SQL
SELECT SUM ( sales[quantity] )
FROM sales
FROM sales
    LEFT OUTER JOIN store 
        ON store.storekey  = store.storekey
WHERE store.[square meters] >= 3000
```

A batch is often used to apply filters using a bitmap index. The function `SIMPLEINDEXN` creates a bitmap index, whereas `ININDEX` tests that a value is active in the following bitmap index.

### Callbacks

Callbacks are required whenever the VertiPaq engine needs to compute an expression that exceeds its capabilities. For example, a simple [IF](https://dax.guide/if/) statement requires a callback. There are multiple types of callbacks:

- **CallbackDataID**: This is the most common type of callback. VertiPaq calls back the formula engine by passing a DAX expression that is computed by the formula engine itself. VertiPaq passes to the formula embedded in the callback, the data ids of the column values fetched during the scan.
- **EncodeCallback**: This callback is used to compute the internal id of query-scoped calculated columns. It is used whenever the query requires grouping by a column that is added inside the query itself. In that case, EncodeCallback computes the id of the expression, providing to VertiPaq the option of grouping by the column.
- **LogAbsValueCallback**: This callback is used to execute the [PRODUCT](https://dax.guide/product/)/[PRODUCTX](https://dax.guide/productx/) function by using the [product rule of logarithms](https://en.wikipedia.org/wiki/Logarithm#Product,_quotient,_power,_and_root)  SUM(LOG(ABS(\<expression\>))) implemented more efficiently by the formula engine with a specific callback.
- **RoundValueCallback**: This callback executes data type conversions that the storage engine cannot perform. For example, the cast from a decimal to a currency using the CURRENCY function in DAX requires this type of callback.
- **MinMaxColumnPositionCallback**: Transforms a column value into its position in the list of all values of the column properly sorted. The transformation uses the attribute hierarchy. If the attribute hierarchy is disabled (Available in MDX=False), then this callback cannot be used, and the column must be materialized to the formula engine to find min/max values.
- **Cond**: Evaluates the conditional logic to handle scenarios where query-defined calculated columns check the presence of the blank row in case of invalid relationships.