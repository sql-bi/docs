---
layout:     page
title:      Options
published:  true
order:      /
---

The Options dialog box includes the settings for all the features available in Bravo for Power BI.
The settings are stored per user and are preserved when Bravo is updated.

# General
- **Theme**: Sets the theme of the user interface:
    - *Light*: Light background
    - *Dark*: Dark background
    - *System*: Use light or dark depending on the Windows settings
- **Language**: Language of the user interface. By changing this setting Bravo must restart and closes existing connections.
- **Restore Alerts**: By clicking *Restore*, hidden alerts are restored in a visible state. The *Restore* button is available when one or more alerts have been ignored by the user.
- **Power BI Account**: When the user is not logged in, the *Sign In* button can start the sign in process to Power BI service. When the user is already logged in, the *Sign Out* link can disconnect from Power BI service.
- **Authenticate in Browser**: When enabled, Bravo uses the default browser to complete the authentication process. This option can be helpful in case the standard login method does not work correctly with two-factor authentication.
### Formatting
- **Automatic Preview**: Enable/disable the automatic preview for [Format DAX](../features/format-dax.md)
- **Separators**: Sets the separators used for the DAX code:
    - *Auto*: Automatic choice of the separators based on heuristic search.
    - *A, B, C, 1234.00*: Uses comma (,) as list separator and dot (.) as decimal separator.
    - *A; B; C; 1234,00*: Uses semicolon (;) as list separator and comma (,) as decimal separator.
- **Lines**: Line style:
    - *Long lines*: Keeps the minimum amount of code in each line.
    - *Short lines*: Tries to keep in the same line an entire DAX expression.
- **Spacing**: Use of space after function names:
    - *Best practice*: Always uses the best practice suggested by DAX Formatter.
    - *Space - IF (*: Includes a space between the function name and the bracket.
    - *No space - IF(*: Puts the bracket just after the function name, without any space.
- **Name-Expression Breaking**: Controls where to start the formatted code in Power BI.
    - *Same Line*: Keeps the formatted code in the same line as the measure name in Power BI. This is the style resulting from editing measures in Tabular Editor, which would display an initial blank line otherwise.
    - *Line Break*: Starts the formatted code the line after the measure name in Power BI. This is the suggested style when the measures are edited in Power BI, which results in an initial blank line in Tabular Editor.
    - *Auto*: Automatically determines the style used in the model for the majority of the measures.
- **Include Time Intelligence**: If enabled, includes in Format DAX also the Time Intelligence measures generated by [Manage Dates](../features/manage-dates/index.md). Because the templates usually generate code already formatted, this setting is disabled by default.
# Proxy
- **Proxy Server**: Specifies a proxy to call external services, like telemetry, updates notification, and DAX Formatter.
    - *None*: Does not use any proxy server.
    - *System*: Uses the proxy server defined in Windows settings.
    - *Custom*: Specifies the proxy server to use.
- **Proxy Server Address**: *(only for Custom)* Specifies the proxy server address.
- **Bypass Local Addresses**: *(only for Custom)* If enabled, does not use the proxy for local (intranet) addresses.
- **Exclude Address List**: *(only for Custom)* List of addresses that do not have to use the proxy server.
- **Custom Credentials**: *(only for System and Custom)* Custom user credentials for the proxy server.
### Diagnostics
- **Telemetry**: Controls whether to send telemetry data to SQLBI. No personal information is collected.
- **Diagnostics Level**: Shows errors and logs in a diagnostics pane in Bravo for Power BI window:
    - *None*: No diagnostic messages.
    - *Basic*: Shows only important messages.
    - *Verbose*: Shows only important messages.
    
# Templates
The Templates tab controls the templates available in the [Manage Dates](../features/manage-dates/index.md).

A **template package** is a single JSON file that contains a user template (extension *.package.json*).

A **template workspace** is an entire folder hierarchy identified by a file with the extension *.code-workspace*.
<img src="images/options-01.png" width="500">
1. **Enable User Date Templates** shows custom user templates in [Manage Dates](../features/manage-dates/index.md)
2. The **Type** of the template can be:
    - *User*: Custom template that has imported in Bravo or has been created locally. More information in [Customize Date Template](../features/manage-dates/customize-date-template.md).
    - *Organization*: template distributed by the organization through group policies. More information in [Deploy Organization Templates](../features/manage-dates/deploy-organization-templates.md).
3. **Edit in Visual Studio Code** opens the template in Visual Studio. This button appears for user templates that are created locally or have been imported with the entire folder. This button does not appear for Organization templates and User templates imported using only the package distribution file.
4. **Show in File Explorer** opens the root folder for the user template. This button appears for user templates that are created locally or have been imported with the entire folder. This button does not appear for Organization templates and User templates imported using only the package distribution file.
5. **Removes** a user template from the list. The template files are not deleted, users should use Show in File Explorer to open the folder before removing the template in order to delete the files.
6. **New Template** creates a new Date template based on a predefined template.
7. **Browse...** imports a template package or workspace.

# About
Shows the Power BI version and provide update options:
- **Stable/Dev combo**: chooses the distribution channel:
    - *Stable*: Less frequent updates with new features and bug fixes that users have already tested in the “Dev” channel.
    - *Dev*: more frequent updates; new features and bug fixes appear as soon as they are implemented. The “Dev” channel is like using a “beta” version of new software: it could be less stable, but issues are also resolved more quickly.
- **Automatically check for updates**: shows an Alert when there is a new version available.