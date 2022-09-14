---
layout:     page
title:      Registry
published:  true
order:      /
toc_max:    2
---

Bravo uses registry settings to store company policies, configuration related to the setup, and advanced settings not exposed in the user interface.

## Policies
The **HKEY_LOCAL_MACHINE\SOFTWARE\Policies\SQLBI\Bravo\OptionSettings** registry hive includes the following registry settings to control policies across the organization.

### UseSystemBrowserForAuthentication
*REG_DWORD* 

0. Uses Bravo user interface for user authentication.
1. Uses the system browser for user authentication.

### TelemetryEnabled
*REG_DWORD* 

0. Disables Telemetry.
1. Enables Telemetry.

### CustomTemplatesEnabled
*REG_DWORD* 

0. Disables custom templates.
1. Enables custom templates.

### CustomTemplatesOrganizationRepositoryPath
*REG_SZ* 

Path pointing to a folder that contains [template package files](../features/manage-dates/customize-date-template.md#template-workspace-and-package) to distribute as Organization templates.

### UpdateCheckEnabled
*REG_DWORD* 

0. Disables check for updated versions.
1. Enables check for updated versions.

### UpdateChannel
*REG_DWORD* 

0. (Default) **Stable** builds are the best ones to use, they are a result of the code being built in Canary, tested in Dev and bug fixed in Beta
1. Beta (not available).
2. **Dev** builds will carry the improvements made to the application and tested by the developers, but the testing is limited and there could be more bugs.

### BuiltInTemplatesEnabled
*REG_DWORD* 

0. Disables bult-in templates.
1. Enables bult-in templates.


## User settings
The **HKEY_CURRENT_USER\Software\SQLBI\Bravo** registry hive includes the following registry settings.

### applicationTitleVersionHidden
*REG_DWORD* 

0. (Default) Shows the version number in windows title.
1. Hides the version number in windows title.

### programMenuShortcutInstalled
*REG_DWORD* 

0. Reports that the program menu shortcut is not installed.
1. Reports that the program menu shortcut is installed.

## Machine settings
The **HKEY_LOCAL_MACHINE\SOFTWARE\SQLBI\Bravo** registry hive includes the following registry settings.

### applicationTelemetryEnabled
*REG_SZ*

0. Disables application telemetry.
1. Enables application telemetry.

### desktopShortcutEnabled
*REG_SZ*

0. Disables desktop shortcut creation during setup.
1. Enables desktop shortcut creation during setup.

### installerTelemetryEnabled
*REG_SZ*

0. Disables installation telemetry.
1. Enables installation telemetry.

### installFolder
*REG_SZ*

Program folder where Bravo is installed.

### programMenuShortcutEnabled
*REG_SZ*

0. Disables program menu shortcut creation during setup.
1. Enables program menu shortcut creation during setup.