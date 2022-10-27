---
layout:     home
title:      Dax Template
published:  true
order:      /dax-template
---
Dax Template is a library that generates measures, calculated tables, calculated columns, and calculation groups based on composable templates.

For example, Dax Template can be used to create and replace a Date table in a Tabular model.

Use the **[Dax.Template](https://www.nuget.org/packages/Dax.Template/)** NuGet package in your projects.

The source code is available on the **[DaxTemplate](https://github.com/sql-bi/daxtemplate)** GitHub repository.

## Hello, template
The Dax Template library has an engine that execute one or more templates described in a configuration file. 
For example, the following configuration file references a template in the SimpleDateTemplate.json file.
~~~
{
  "Config": {
    "Templates": [
      {
        "Class": "CustomDateTable",
        "Table": "Date",
        "Template": "SimpleDateTemplate.json"
      }
    ],
    "AutoScan": "Full"
  }
~~~
This is the content of the corresponding SimplerDateTemplate.json file, which generates a date table with four columns: Date, Year, Year Month Number, and Year Month.

|    Date   | Year | Year Month Number | Year Month |
|-----------|------|-------------------|------------|
|  1/1/2022 | 2022 |             24264 | Jan 2022   |  
|  1/2/2022 | 2022 |             24264 | Jan 2022   |

~~~
{
    "Steps": [
      {
        "Name": "__Calendar",
        "Expression": "CALENDARAUTO()"
      }
    ],
    "RowVariables": [
      {
        "Name": "__Date",
        "Expression": "[Date]"
      },
      {
        "Name": "__YearNumber",
        "Expression": "YEAR ( __Date )"
      },
      {
        "Name": "__MonthNumber",
        "Expression": "MONTH ( __Date )"
      }
    ],
    "Columns": [
      {
        "Name": "Date",
        "DataType": "DateTime",
        "Step": "__Calendar"
      },
      {
        "Name": "Year",
        "Expression": "__YearNumber",
        "DataType": "Int64"
      },
      {
        "Name": "Year Month Number",
        "Expression": "__YearNumber * 12 + __MonthNumber - 1",
        "DataType": "Int64",
        "IsHidden": true
      },
      {
        "Name": "Year Month",
        "Expression": "FORMAT ( __Date, \"mmm yyyy\" )",
        "DataType": "String",
        "SortByColumn": "Year Month Number",
        "IsHidden": true
      }
    ],
    "Hierarchies": [
      {
        "Name": "Calendar",
        "Levels": [
          {
            "Name": "Year",
            "Column": "Year"
          },
          {
            "Name": "Month",
            "Column": "Year Month"
          },
          {
            "Name": "Date",
            "Column": "Date"
          }
        ]
      }
    ]
}
~~~

References to external file can be overridden by corresponding objects. The following configuration file includes the SimpleDateTemplate definition in the same JSON file of the configuration.
~~~
{
  "Config": {
    "Templates": [
      {
        "Class": "CustomDateTable",
        "Table": "Date",
        "Template": "SimpleDateTemplate.json"
      }
    ]
  },
  "SimpleDateTemplate": {
    "Steps": [
      {
        "Name": "__Calendar",
        "Expression": "CALENDARAUTO()"
      }
    ],
    "RowVariables": [
      {
        "Name": "__Date",
        "Expression": "[Date]"
      },
      {
        "Name": "__YearNumber",
        "Expression": "YEAR ( __Date )"
      },
      {
        "Name": "__MonthNumber",
        "Expression": "MONTH ( __Date )"
      }
    ],
    "Columns": [
      {
        "Name": "Date",
        "DataType": "DateTime",
        "Step": "__Calendar"
      },
      {
        "Name": "Year",
        "Expression": "__YearNumber",
        "DataType": "Int64"
      },
      {
        "Name": "Year Month Number",
        "Expression": "__YearNumber * 12 + __MonthNumber - 1",
        "DataType": "Int64",
        "IsHidden": true
      },
      {
        "Name": "Year Month",
        "Expression": "FORMAT ( __Date, \"mmm yyyy\" )",
        "DataType": "String",
        "SortByColumn": "Year Month Number",
        "IsHidden": true
      }
    ],
    "Hierarchies": [
      {
        "Name": "Calendar",
        "Levels": [
          {
            "Name": "Year",
            "Column": "Year"
          },
          {
            "Name": "Month",
            "Column": "Year Month"
          },
          {
            "Name": "Date",
            "Column": "Date"
          }
        ]
      }
    ]
  }
}
~~~

The template defines the DAX code and the metadata of the elements built in the tabular model. The [CustomDateTable](./templates/custom-date-table.md) template class used in this example creates a calculated table specifying column attributes and hierarchies.

The template for a calculated table has these main elements:
- [**GlobalVariables**](./templates/custom-template-table.md#globalvariables): DAX expressions assigned to variables only once and accessible in all the steps. Their value does not change row-by-row. There are no global variables used in the previous example. 
- [**Steps**](./templates/custom-template-table.md#steps): List of DAX table expressions that defines explicit step of the calculation.
- [**RowVariables**](./templates/custom-template-table.md#rowvariables): DAX expressions assigned to variables for each row of the generated table.
- [**Columns**](./templates/custom-template-table.md#columns): List of columns generated in the output table. Each column can have a DAX expression that can reference variables defined in RowVariables and GlobalVariables.
- [**Hierarchies**](./templates/custom-template-table.md#hierarchies): List of hierarchies create in the Tabular model. It is optional and there is only one hierarchy created in the previous example.

There is no need to worry about the order in which steps and variables are defined. The DAX Template engine automatically arrange the proper sort order based on dependencies found in the calculations. Circualr dependencies are not allowed.

## Calendar templates
The [Calendar templates](./calendar-templates/index.md) are examples of date templates implementing common calendars that are also used by Bravo for Power BI.