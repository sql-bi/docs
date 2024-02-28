---
layout:     page
title:      Column
published:  true
order:      /
---
Column metrics:
- **Cardinality**: column cardinality (number of unique values of a column)
- **Data Size**: bytes for all the compressed data in segments and partitions. It does not include dictionary and column hierarchies.
- **Columns Hierarchies Size**: bytes of automatically generated hierarchies for columns (used by MDX).
- **Columns Total Size**: bytes of all the structures related to a column (sum of *Data Size*, *Dictionary Size*, and *Columns Hierarchies Size*).
- **Dictionary Size**: bytes of dictionary structures.
- **Table Size**: bytes of the table of the column (sum of *Columns Total Size* of all the columns plus *User Hierarchies Size* and *Relationships Size* of the table).
- **Table Size %**: ratio of *Columns Total Size* vs. *Table Size*
- **Database Size %**: ratio of *Table Size* vs. *Database Size* (sum of *Table Size* of all the tables).
- **Segments #**: number of segments.
- **Partitions #**: number of partitions.
- **Columns #**: number of columns (always 1 for a single column).
- **Encoding_**: encoding type of the column (*HASH*/*VALUE*).