---
layout:     page
title:      Column Segment
published:  true
order:      /
---
Column segment metrics:
- **Cardinality**: number of rows of the segment (like Rows of columns segment).
- **Rows**: number of rows of the segment (like Cardinality of columns segment).
- **Data Size**: bytes for all the compressed data in segment. It does not include dictionary and column hierarchies.
- **Database Size %**: ratio of *Table Size* vs. *Database Size* (sum of *Table Size* of all the tables).
- **Segments #**: number of segments.
- **Partitions #**: number of partitions.
- **Encoding_**: encoding type of the segments (*HASH*/*VALUE*); shows *Many* for group of segments with different encoding.
- **RI Violations**: number of relationships with referential integrity violations, assigned to the table on the one-side of the M:1 relationship; such table has an additional blank row.
- **Bid. Filters**: number of relationships with bidirectional filter propagation.
- **MMR**: number of many-to-many cardinality relationships.