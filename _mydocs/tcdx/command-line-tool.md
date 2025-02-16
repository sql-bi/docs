---
layout:     page
title:      Tcdx command line tool
published:  false
draft:      true
order:      /
---
**Dax.Tcdx.CLI** is a command-line tool developed in .NET and distributed as a [dotnet tool](https://learn.microsoft.com/en-us/dotnet/core/tools/global-tools).

The tool is open-source; its source code is available in the [Tcdx GitHub repository](https://github.com/sql-bi/tcdx).

The tool's primary goal is to simplify the use of TCDX libraries

# Install the Tcdx command line tool
The tool is available on NuGet at [Dax.Tcdx.CLI](https://www.nuget.org/packages/Dax.Tcdx.CLI) and it is compatible with Windows and Linux.

It can be installed using the following command:
```
dotnet tool install Dax.Tcdx.CLI --global
```
Once installed, the tool can be invoked by typing ```tcdx``` in the command line. To get information about the available features and parameters, run ```tcdx –-help```.