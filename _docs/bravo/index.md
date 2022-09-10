---
layout:     home
title:      Bravo for Power BI
published:  true
order:      /
---

# Introduction
Bravo for Power BI helps you author a Power BI model:
- [**Analyze Model**](#analyze-model): find the more expensive columns and tables.
- [**Format DAX**](#format-dax): format existing DAX measures.
- [**Manage Dates**](#manage-dates): create a Date table and apply time intelligence functions to existing measures.
- [**Export Data**](#export-data): export data from Power BI to Excel and CSV files.

## Installation
Bravo installation provides different options.

The setup programs are available in two categories:
- **Self-contained**: The self-contained portable setup options include the .NET runtime required for the installation. The presence of the .NET runtime increase the size of the setup, but it gurantees that all the required components are installed if necessary.
- **Framework-dependent**: The setup does not include the required .NET runtime. The setup is smaller, but it will fail if the required .NET runtime framework is not already installed on the target computer.

For each cateory, we have the following variations:
- **Default setup**: requires administrative rights and installs Bravo as an External Tool for Power BI Desktop.
- **User**: does not require administrative rights, but it does not install Bravo as an External Tool in Power BI Desktop.
- **Portable**: there is not setup; just extract the ZIP file content into a local folder and run Bravo straight from the executable included in that folder.

[Download and install the latest version](https://github.com/sql-bi/Bravo/releases/latest) from GitHub.

## User interface

Bravo has a user interface based on a single window that allow multiple connections.

<img src="images/general-ui-01.png" width="700" class="naked">

1) Create a **connection** to a model in Power BI, or load a VertiPaq Analyzer file. 
2) Open a **new connection**
3) **Operations** available on the selected connection. They are all disabled where there are no open connections. Each operation is applied to the tab that is currently active. 
4) **Collapse or expand** the operations pane.
5) Open **documentation and help videos**.
6) Open the **Alert pane** that shows important messages like new updates available.
7) Open the **Options dialog box** to specify all the settings for Bravo.
8) **Theme selection**: Switch beween light theme, dark theme, or automatic. The default setting is automatic, which chooses between light mode and dark mode based on Windows settings.
9) **Login** to the Power BI service, required to connect Bravo to a dataset published on Power BI service. The first time, Bravo may request the username to locate the right endpoint for the authentication. During the sign in, a browser window appears to complete the login process. Login is not required to access local files. Bravo remembers log in credentials on following runs, just like Power BI Desktop does: use the same button to explicitly **Logout**. 

Other two common elements of the user interface appear in all the operation pages.

<img src="images/general-ui-02.png" width="300" class="naked">

1) **Synchronize**: Synchronize the information in Bravo with the information in Power BI Desktop. For example, if you add a measure or import a new table, you can update the information in Bravo by clicking the “Synchronize” button.
2) **Help**: Open a browser window pointing to the documentation.

## Options

<todo assign="marco">Complete this section</todo>

# Features

<todo assign="marco">Complete this section</todo>

## Analyze Model
<todo assign="marco">Complete this section</todo>

## Format DAX
<todo assign="marco">Complete this section</todo>

## Manage Dates
<todo assign="marco">Complete this section</todo>

## Export Data
<todo assign="marco">Complete this section</todo>

# Feedback and support
<todo assign="marco">Complete this section</todo>

## Issues and feedback
<todo assign="marco">Complete this section</todo>

## Contribute
<todo assign="marco">Complete this section</todo>
