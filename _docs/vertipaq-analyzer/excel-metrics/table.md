---
layout:     page
title:      Table
published:  true
order:      /
---
Table metrics:
- **Cardinality**: table cardinality (number of rows of a table).
- **Rows**: number of rows of the table (same as Cardinality, it is different at partition or segment level).
- **Data Size**: bytes for all the compressed data in segments and partitions. It does not include dictionary and column hierarchies.
- **Columns Hierarchies Size**: bytes of automatically generated hierarchies for columns (used by MDX).
- **User Hierarchies Size**: bytes of user-defined hierarchies.
- **Relationship Size**: bytes of relationships between tables.
- **Columns Total Size**: bytes of all the structures related to a column (sum of *Data Size*, *Dictionary Size*, and *Columns Hierarchies Size*).
- **Dictionary Size**: bytes of dictionary structures.
- **Table Size**: bytes of the table of the column (sum of *Columns Total Size* of all the columns plus *User Hierarchies Size* and *Relationships Size* of the table).
- **Table Size %**: ratio of *Columns Total Size* vs. *Table Size*
- **Database Size %**: ratio of *Table Size* vs. *Database Size* (sum of *Table Size* of all the tables).
- **Segments #**: number of segments.
- **Partitions #**: number of partitions.
- **Columns #**: number of columns (always 1 for a single column).
- **Encoding_**: encoding type of the segments (*HASH*/*VALUE*); shows *Many* for group of segments with different encoding.
- **RI Violations**: number of relationships with referential integrity violations, assigned to the table on the one-side of the M:1 relationship; such table has an additional blank row.
- **Bid. Filters**: number of relationships with bidirectional filter propagation.
- **MMR**: number of many-to-many cardinality relationships.