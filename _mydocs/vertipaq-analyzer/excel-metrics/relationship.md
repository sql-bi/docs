---
layout:     page
title:      Relationship
published:  true
order:      /
---
Relationship metrics:
- **Relationship Type**: shows M:1 or M:M or 1:1 relationship type.
- **Relationship Size**: relationship size (in bytes).
- **Max From Cardinality**: maximum cardinality of columns on the From side of the selected relationships.
- **Max To Cardinality**: maximum cardinality of columns on the To side of the selected relationships.
- **1:M Ratio %**: ratio between the *Max To Cardinality* and the number of rows of the table on the Many side of the relationship.
- **Missing Keys**: Number of unique values on the From side of the relationship that have missing values on the To side of the relationship.
- **Invalid Rows**: number of rows on the From side of the relationship that have a missing key on the To side of the relationship.
- **Bid. Filters**: Show the presence of a bidirectional filter.
- **MMR**: Shows the presence of a many-to-many cardinality relationship.