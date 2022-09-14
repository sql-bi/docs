---
layout:     page
title:      Manage Dates
published:  true
order:      /3
---

Manage Dates creates a *Date* table with relationships to other date columns of a Power BI model. The template can also add measures implementing time intelligence calculations from DAX Patterns.

The *Date* table created by Bravo is a standard calculated table: Bravo is not necessary to refresh the Date table.

There are different scenarios depending on the presence of a *Date* table in an existing model:
- The model **does not have a Date table**: Bravo creates a new *Date* table that must be connected to other tables in the model by creating the required relationships in Power BI Desktop
- The model **already has an imported *Date* table**: Bravo cannot replace the existing *Date* table. Bravo can create a table with a different name, or the existing *Date* table must be deleted from the model using Power BI Desktop before using the Manage Dates feature.
- The model **has an existing *Date* calculated table**: Bravo can overwrite the existing table with a new one using the selected template. The resulting table may have different column names. Existing relationships are preserved if the key column name has the same name.

Changing an existing Date table could break existing reports. Creating a backup of the original PBIX file is a best practice. By opening a backup in another Power BI Desktop window, it is possible to restore the changed columns in the corrupted visuals of a report.

The preview pane shows the content obtained by using the [changing the parameters](#choosing-parameters) set for the the selected template.

The **Preview Changes** button shows a preview of the changes that will be applied to the model. These changes are applied to the model by clicking the **Apply Changes** button.

## Choosing parameters

### Calendar

- **Template**:
    - *Standard*
    - *Standard - Fiscal*
    - *Monthly*
    - *Monthly - Fiscal*
    - *Custom*
    - *Custom - Fiscal*
    - *Weekly*
- **First Month of the Year**: Month number (1-12) of the first fiscal month of the year.
- **First Day of the Week**: First day of the week.
- **Weekly System**: Specify how to distribute the 13 weeks of a quarter in the three underlying periods.
    - *4-4-5*
    - *4-5-4*
    - *5-4-4*
- **Weekly System**: Defines the method used to define the fiscal year:
    - *Last*: Last Saturday of the month at fiscal year end. The fiscal year is defined as the final Saturday (if Sunday is selected as first day of the week) in the fiscal year end month.
    - *Nearest*: Saturday nearest the end of month. The fiscal year is defined as the Saturday (if Sunday is selected as first day of the week) that falls closest to the last day of the fiscal year end month.
- **Date defining the Fiscal Year**: Defines how to compute the start of the fiscal year:
    - *First of the year*: First day of the fiscal year.
    - *Last of the year*: Last day of the fiscal year.
- **Last Weekday of the Year**
    - *Last of the Year*: Last Saturday of the month at fiscal year end. The fiscal year is defined as the final Saturday (if Sunday is selected as first day of the week) in the fiscal year end month.
    - *Closest to the Year End*: Saturday nearest the end of month. The fiscal year is defined as the Saturday (if Sunday is selected as first day of the week) that falls closest to the last day of the fiscal year end month.
The **Manage Templates** link opens the [Templates](../../configuration/options.md#templates) section to [customize a date template](customize-date-template.md).

### Interval

- **First Year**: Force the first year of the *Date* table. If not defined, uses the Automatic Scan setting.
- **Last Year**: Force the first year of the *Date* table. If not defined, uses the Automatic Scan setting.
- **Automatic Scan**: Defines how to scan the date columns in other tables of the model in order to define the range of years to generate in the *Date* table:
    - *Full* scans all the columns containing dates.
    - *Chose Columns...* only considers an arbitrary selection of tables and columns.
    - *Active Relationships* only considers the date columns that are part of an active relationship.
    - *Inactive Relationships* only considers the date columns that are part of both active and inactive relationships.

### Dates

- **Regional Format**: Regional format to generate day and month names.
- **Dates Table**: Name of the visible *Date* table, which only includes a reference to another hidden table specified in *Dates Definition Table*.
- **Dates Definition Table**: Name of the hidden caculated table containing the complete DAX code to generates the *Date* table. Because the DAX code required for a *Date* table is very long, the hidden table referenced by *Date* does not hide the report area when any column of the *Date* table is selected in the Fields pane of Power BI. 

### Holidays

- **Holidays**: enables/disables the generation of columns related to Holidays in the final *Date* table. When enabled, the template creates additional tables to store the holidays definition and the holidays active in for the selected period and country.
- **Holidays Country**: specified for which country to generate holidays in the *Date* table.
- **Holidays Table**: name of the hidden Holidays table created by the template.
- **Holidays Table**: name of the hidden HolidaysDefinition table created by the template.

### Time Intelligence

- **Time Intelligence Functions**: enables/disables the generation of time intellignece measures.
- **Target Measures**
    - *All Measures*: Generates the time intelligence version for all the model measures.
    - *Choose Measures*: Generates the time intelligence version only for the selected measures.
