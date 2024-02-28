---
layout:     page
title:      Registry
published:  true
order:      /
toc_max:    2
---

Bravo uses registry settings to store company policies, configuration related to the setup, and advanced settings not exposed in the user interface.

>Attributes that use a *REG_DWORD* type for a boolean 0/1 have the same behavior of 1 for any values that is not 0. In other words, 0 is False and any other number is True.

## Policies
The **HKEY_LOCAL_MACHINE\SOFTWARE\Policies\SQLBI\Bravo\OptionSettings** registry hive includes the following registry settings to control policies across the organization.

### UseSystemBrowserForAuthentication
*REG_DWORD* 

<ol>
<li value="0">Uses Bravo user interface for user authentication.</li>
<li value="1">Uses the system browser for user authentication.</li>
</ol>

### TelemetryEnabled
*REG_DWORD* 

<ol>
<li value="0">Disables Telemetry.</li>
<li value="1">Enables Telemetry.</li>
</ol>

### CustomTemplatesEnabled
*REG_DWORD* 

<ol>
<li value="0">Disables custom templates.</li>
<li value="1">Enables custom templates.</li>
</ol>

### CustomTemplatesOrganizationRepositoryPath
*REG_SZ* 

Path pointing to a folder that contains [template package files](../features/manage-dates/customize-date-template.md#template-workspace-and-package) to distribute as Organization templates.

### UpdateCheckEnabled
*REG_DWORD* 

<ol>
<li value="0">Disables check for updated versions.</li>
<li value="1">Enables check for updated versions.</li>
</ol>

### UpdateChannel
*REG_DWORD* 

<ol>
<li value="0">(Default) **Stable** builds are the best ones to use, they are a result of the code being built in Canary, tested in Dev and bug fixed in Beta</li>
<li value="1">Beta (not available).</li>
<li value="2">**Dev** builds will carry the improvements made to the application and tested by the developers, but the testing is limited and there could be more bugs.</li>
</ol>

### BuiltInTemplatesEnabled
*REG_DWORD* 

<ol>
<li value="0">Disables bult-in templates.</li>
<li value="1">Enables bult-in templates.</li>
</ol>

## User settings
The **HKEY_CURRENT_USER\Software\SQLBI\Bravo** registry hive includes the following registry settings.

### applicationTitleVersionHidden
*REG_DWORD* 

<ol>
<li value="0">(Default) Shows the version number in windows title.</li>
<li value="1">Hides the version number in windows title.</li>
</ol>

### programMenuShortcutInstalled
*REG_DWORD* 

<ol>
<li value="0">Reports that the program menu shortcut is not installed.</li>
<li value="1">Reports that the program menu shortcut is installed.</li>
</ol>

## Machine settings
The **HKEY_LOCAL_MACHINE\SOFTWARE\SQLBI\Bravo** registry hive includes the following registry settings.

### applicationTelemetryEnabled
*REG_SZ*

<ol>
<li value="0">Disables application telemetry.</li>
<li value="1">Enables application telemetry.</li>
</ol>

### desktopShortcutEnabled
*REG_SZ*

<ol>
<li value="0">Disables desktop shortcut creation during setup.</li>
<li value="1">Enables desktop shortcut creation during setup.</li>
</ol>

### installerTelemetryEnabled
*REG_SZ*

<ol>
<li value="0">Disables installation telemetry.</li>
<li value="1">Enables installation telemetry.</li>
</ol>

### installFolder
*REG_SZ*

Program folder where Bravo is installed.

### programMenuShortcutEnabled
*REG_SZ*

<ol>
<li value="0">Disables program menu shortcut creation during setup.</li>
<li value="1">Enables program menu shortcut creation during setup.</li>
</ol>
