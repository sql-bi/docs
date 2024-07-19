---
layout:     page
title:      VPAX Command Line Tool
published:  true
order:      /
---
**Dax.Vpax.CLI** is a command-line tool developed in .NET and distributed as a [dotnet tool](https://learn.microsoft.com/en-us/dotnet/core/tools/global-tools).

The tool is open-source; its source code is available in the [VertiPaq-Analyzer repository](https://github.com/sql-bi/vertiPaq-Analyzer/).

The tool's primary goal is to simplify the use of VPAX libraries directly from the command line and seamlessly integrate VertiPaq-Analyzer into DevOps pipelines for automated VPAX file extraction and management.

# Install the VPAX command line tool
The tool is available on NuGet at [Dax.Vpax.CLI](https://www.nuget.org/packages/Dax.Vpax.CLI) and it is compatible with Windows and Linux.

It can be installed using the following command:
```
dotnet tool install Dax.Vpax.CLI --global
```
Once installed, the tool can be invoked by typing ```vpax``` in the command line. To get information about the available features and parameters, run ```vpax –help```.

# Automation in DevOps pipelines
You can automate the extraction of VPAX files from a Tabular model using the VPAX command line tool in Azure DevOps pipelines

The following YAML script demonstrates how to install the VPAX tool and extract a VPAX file from a Tabular model.

```YAML
Sample YAML for Azure DevOps

```YAML
trigger: none
pr: none

pool:
  vmImage: windows-latest

steps:
  #
  # Download and install the VertiPaq-Analyzer .NET tool from NuGet.
  # See https://www.nuget.org/packages/Dax.Vpax.CLI
  #
- script: dotnet tool install Dax.Vpax.CLI --global
  displayName: install vpax tool
  #
  # Extract and export model metadata to a VPAX file
  #
  # Arguments:
  #   <path>              Path to write the VPAX file
  #   <connection-string> Connection string to the tabular model
  #
  # Use `vpax export -?` to learn more about the available options.
  #
- script: vpax export "%VPAX_PATH%" "%TABULAR_CONNECTION_STRING%"
  displayName: export vpax
  env:
    # Secret variable that holds the connection string.
    # For more information on how enable Service Principal access to a Power BI workspace in dedicated capacity see the link below.
    # https://blog.tabulareditor.com/2020/06/02/service-principal-access-to-dedicated-capacity-xmla-endpoint
    # https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-service-principal
    TABULAR_CONNECTION_STRING: $(TabularConnectionString)		
    # Variable that holds path where the VPAX file will be extracted.
    # Using $(Build.BuildId) ensures a unique file name for each build.
    VPAX_PATH: $(Build.StagingDirectory)\contoso-$(Build.BuildId).vpax
```

For more information on how enable Service Principal access to a Power BI workspace in a dedicated capacity:
- [Service Principal access to dedicated capacity XMLA endpoint](https://blog.tabulareditor.com/2020/06/02/service-principal-access-to-dedicated-capacity-xmla-endpoint)
- [Automate Premium workspace and semantic model tasks with service principals](https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-service-principal)