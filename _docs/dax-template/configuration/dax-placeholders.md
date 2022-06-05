---
layout:     page
title:      Dax Placeholders
published:  true
order:      /
---
The DAX expressions written in a Dax template can reference special DAX placeholders.

## Table templates

The placeholders used in table templates are identified by the **@@** prefix.

### @@GETCALENDAR()
Returns the base calendar table expression to generate a Date table. This result is commonly used in Date templated to get the initial CALENDAR or CALENDARAUTO expression defined by the configuration in terms of dates range and constraints.

### @@GETCONFIG( < settings > )
Returns the value of the corresponding **setting** in the configuration.

For example, this code returns the value of the setting WorkingDays:
~~~
@@GETCONFIG( WorkingDays )
~~~

### @@GETHOLIDAYNAME( < date > )
Retrieve the name of the holiday specified in the **date** provided as an argument (must be a valid DAX date expression).

### @@GETISO()
Returns the IsoFormat specified in the Config object.

### @@GETLASTSTEP()
Retrieves the table expression computed so far in a calculated table expression. It is usueful to iterate the table expression built with the DAX expressions that do not depend on the current expression.

For example, it can be used to retrieve the first day of a custom fiscal month by writing:
~~~
MINX ( 
    FILTER ( 
        @@GETLASTSTEP(), 
        [Fiscal Year Month Number] = __FiscalYearMonthNumber 
    ), 
    [Date]
)
~~~

### @@GETMAXDATE()
Returns the maximum date found in the columns specified for the autoscan.

### @@GETMAXYEAR( < maxYear > )
Returns the maximum year applying to the default **maxYear** the constraints specified in the configuration settings [LastYearMin](./config-object/date-template.md#lastyearmin) and [LastYearMax](./config-object/date-template.md#lastyearmax).


### @@GETMINDATE()
Returns the minimum date found in the columns specified for the autoscan.

### @@GETMINYEAR( < minYear > )
Returns the minimum year applying to the default **minYear** the constraints specified in the configuration settings [FirstYearMin](./config-object/date-template.md#lastyearmin) and [FirstYearMax](./config-object/date-template.md#lastyearmax).

## Measure templates
The DAX placeholders used in table templates can be identified by **\*\_** and **\_\*** delimiters, or by the **@@** prefix.

### @\_C-\<column-attribute-name\>\_@
Returns a single column marked with the attribute specified as column-attribute-name. If zero, two or more columns are found with the specified attribute, an error is thrown. 

### @\_CL-\<column-attribute-name\>\_@
Returns a list of columns marked with the attribute specified as column-attribute-name.

### @\_T-\<table-attribute-name\>\_@
Returns a single table marked with the attribute specified as column-attribute-name. If zero, two or more table are found with the specified attribute, an error is thrown.

### @\_TL-\<table-attribute-name\>\_@
Returns a list of tables marked with the attribute specified as tables-attribute-name.

### @\_MEASURE\_@
Returns the original measure name.
### @\_MEASUREFOLDER\_@
Returns the original measure folder name.
### @\_TEMPLATE\_@
Returns the template name.
### @\_TEMPLATEFOLDER\_@
Returns the template item folder name. For example the *YOY* template item that has *Growth* defined in the DisplayFolder property would generate the following result for the Sales Amount measure:
~~~
@_MEASURE_@\@_TEMPLATEFOLDER_@

Sales Amount\Growth
 ~~~

### @@GETMEASURE( < templateName > )
Returns a measure reference to the original measure if the **templateName** is not defined, or a measure reference to the corresponding template measure specified in **templateName**.
For example, the following code in a measure template:
~~~
VAR __ValueCurrentPeriod = @@GETMEASURE()
VAR __ValuePreviousPeriod = @@GETMEASURE( PY )
~~~

results in the following code when applied to the measure *Sales Amount* (according to the configuration for prefix/suffix in template names, here the prefix is used):
~~~
VAR __ValueCurrentPeriod = [Sales Amount]
VAR __ValuePreviousPeriod = [PY Sales Amount]
~~~