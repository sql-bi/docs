---
layout:     home
title:      Bravo for Power BI
published:  true
order:      /
---

<img src="images/bravo-logo-github.png" width="200" class="naked">

# Introduction
Bravo for Power BI helps to author a Power BI model:
- [**Analyze Model**](features/analyze-model.md) finds the more expensive columns and tables.
- [**Format DAX**](features/format-dax.md) formats existing DAX measures.
- [**Manage Dates**](features/manage-dates.md) creates a Date table and apply time intelligence functions to existing measures.
- [**Export Data**](features/export-data.md) exports data from Power BI to Excel and CSV files.

## Installation
Bravo installation provides different options.

The setup programs are available in two categories:
- **Self-contained**: The self-contained portable setup options include the .NET runtime required for the installation. The presence of the .NET runtime increases the size of the setup, but it gurantees that all the required components are installed if necessary.
- **Framework-dependent**: The setup does not include the required .NET runtime. The setup is smaller, but it will fail if the required .NET runtime framework is not already installed on the target computer.

For each cateory, we have the following variations:
- **Default setup**: requires administrative rights and installs Bravo as an External Tool for Power BI Desktop.
- **User**: does not require administrative rights, but it does not install Bravo as an External Tool in Power BI Desktop.
- **Portable**: there is no setup; just extract the ZIP file content into a local folder and run Bravo straight from the executable included in that folder.

[Download and install the latest version](https://github.com/sql-bi/Bravo/releases/latest) from GitHub.

## User interface

Bravo has a user interface based on a single window that allows multiple connections.

<img src="images/general-ui-01.png" width="700" class="naked">

1. Creates a **connection** to a model in Power BI, or loads a VertiPaq Analyzer file. 
2. Opens a **new connection**
3. **Operations** available on the selected connection. They are all disabled where there are no open connections. Each operation is applied to the tab that is currently active. 
4. **Collapses or expands** the operations pane.
5. Opens **documentation and help videos**.
6. Opens the **Alert pane** showing important messages like new updates available.
7. Opens the [**Options dialog box**](options.md) to specify all the settings for Bravo.
8. **Theme selection**: Switches beween light theme, dark theme, or automatic. The default setting is automatic, which chooses between light mode and dark mode based on Windows settings.
9. **Login** to the Power BI service, required to connect Bravo to a dataset published on Power BI service. The first time, Bravo may request the username to locate the right endpoint for the authentication. During the sign in, a browser window appears to complete the login process. Login is not required to access local files. Bravo remembers log in credentials on following runs, just like Power BI Desktop does: use the same button to explicitly **Logout**. 

Other two common elements of the user interface appear in all the operation pages.

<img src="images/general-ui-02.png" width="300" class="naked">

1. **Synchronizes** the information in Bravo with the information in Power BI Desktop. For example, if you add a measure or import a new table, you can update the information in Bravo by clicking the “Synchronize” button.
2. Opens a **Help** page in a browser window pointing to the documentation.


# Feedback and support
Bravo is an open source project available on GitHub at [https://github.com/sql-bi/Bravo/](https://github.com/sql-bi/Bravo/).

Users and developers can contribute to Bravo in many ways:
- Submit [issues](https://github.com/sql-bi/Bravo/issues) for bugs or have for new features.
- Answer to questions made by other Bravo users in the [Discussions](https://github.com/sql-bi/Bravo/discussions) page.
- [Add or edit translations](https://github.com/sql-bi/Bravo#how-to-help-with-translations) in non-English languages.
- Write C# and TypeScript code for new features by forking the [Bravo GitHub repository](https://github.com/sql-bi/Bravo).