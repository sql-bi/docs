---
layout:     page
title:      Scripts
menu_title: Scripts
published:  true
order:      /03
---



Under `script/dataset`, there are 3 scripts:
 - `make_tool.cmd` : compiles the tool in release mode, using dotnet from the command line.
 - `build_all.cmd` : creates the sets of data published on the ready-to-use repository.
 - `build_single.cmd` : create a single set of data.

Steps:
 - run `build_tool.cmd`
 - run `build_single.cmd`. When asked, enter the code of the set of data you want to create. E.g.: `csv-100k`, `delta-1m`, `parquet-10m`, etc.