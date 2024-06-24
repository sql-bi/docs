---
layout:     page
title:      Scripts
menu_title: Scripts
published:  true
order:      /03
---



Under `script/dataset`, there are 3 ready to use scripts:
 - `make_tool.cmd` : compiles the tool in release mode, using dotnet from the command line.
 - `build_all_datasets.cmd` : creates the sets of data published on the ready-to-use repository.
 - `build_dataset.cmd` : create a single dataset.

Steps:
 - run `build_tool.cmd`
 - run `build_dataset.cmd`. When asked, enter the code of the dataset you want to create. E.g.: `csv-100k`, `delta-1m`, `parquet-10m`, etc.