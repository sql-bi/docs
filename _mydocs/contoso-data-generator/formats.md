---
layout:     page
title:      Output formats and related parameters
menu_title: Output formats
published:  true
order:      /02
next_reading: true
---

Every output format has specific parameter to be set inside config.json

## CSV

| Parameter | Values |  Notes |
| -- | -- | -- |
| OutputFormat | "CSV" |   |
| CsvMaxOrdersPerFile | -1 or a number >1 |  Maximum number of Orders per file |
| CsvGzCompression | 0 or 1 | Apply GZ compression to output CSV files |

For creating a single big CSV file:
```
"OutputFormat": "CSV"
"CsvMaxOrdersPerFile": -1
"CsvGzCompression": 0
```

For creating multiple CSV files:
```
"OutputFormat": "CSV"
"CsvMaxOrdersPerFile": 50000
"CsvGzCompression": 0
```

For creating multiple CSV.GZ files:
```
"OutputFormat": "CSV"
"CsvMaxOrdersPerFile": 50000
"CsvGzCompression": 1
```

## Parquet

| Parameter | Values |  Notes |
| -- | -- | -- |
| OutputFormat | "PARQUET" |   |
| ParquetOrdersRowGroupSize | integer | Number of orders per parquet Row Group. Default value is 500000. Do not change if not strictly required. 

Example:

```
"OutputFormat": "PARQUET"
```


## Delta Table

| Parameter | Values |  Notes |
| -- | -- | -- |
| OutputFormat | "DELTATABLE" |   |
| DeltaTableOrdersPerFile | integer | Number of orders per parquet file. |
| ParquetOrdersRowGroupSize | integer | Number of orders per parquet Row Group. Default value is 500000. Do not change if not strictly required. 

Example:

```
"OutputFormat": "DELTATABLE"
"DeltaTableOrdersPerFile": 250000
```
