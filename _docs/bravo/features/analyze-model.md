---
layout:     page
title:      Analyze Model
published:  true
order:      /
---
Analyze Model shows the space consumed by columns in the model.

The purpose is to find where a model consumes memory in order to remove the more expensive columns that are not useful.

<img src="../images/analyze-model-01.png" width="700" class="naked">

1. The highlighted **unreferenced columns** are columns not used in measures and relationships of the model. However, unreferenced columns could be used in reports. Make sure that they are unnecessary at the report level before removing them from the model.
2. The **Smaller columns...** link shows all the model columns, instead of showing only the five largest columns of the model by default.
3. **Group by Table** shows the columns grouped by table.
4. The **cardinality** value reports the number of rows in a table and the number of unique values in each column.
5. The **size** value represents the amount of memory consumed by each table and column.
6. **Save as VPAX** saves the information collected by Analyze Model into an external VPAX file. The VPAX file can be opened by Bravo, [DAX Studio](https://daxstudio.org/), [Tabular Editor](https://tabulareditor.com/), and [VertiPaq Analyzer](https://www.sqlbi.com/tools/vertipaq-analyzer/).
7. The **treemap** visualization shows the same memory size as an area.


The Group by Table visualization displays data in two levels: table and column.

<img src="../images/analyze-model-02.png" width="700" class="naked">

1. Filters the displayed columns by typing partial column names in the **Search Column** textbox.
2. **Show unreferenced columns only** displays only unreferenced columns, hiding columns that are used by relationships and DAX expressions in the model.
3. **Expands all** the table names, showing all the filtered columns for all the tables. The expand all does not remove the filter applied by the Search Column textbox.
4. **Collapses all** shows only table names, removing the detail of the columns. The size of each table only considers the columns filtered by the Search Column textbox.

Use Power BI Desktop to remove columns that are not useful after verifying that they are not used by any report. Remember that Bravo only checks that columns are referenced within the model, but it cannot verify whether a column is used in a report.