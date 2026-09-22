---
layout:      page
title:       "Set up Claude Code Desktop for agentic development with Power BI Desktop"
menu_title:  "Claude Code Desktop"
description: "How to configure Claude Code Desktop, the Power BI Modeling MCP server, and the Power BI report authoring skill to modify a semantic model and a report with an AI agent."
published:   true
order:       /20
modified:    2026-09-08
---
*This article describes how to configure Claude Code Desktop so that an AI agent can read and modify a Power BI semantic model open in Power BI Desktop, and the report of a Power BI project.*

The only requirement we assume is **Power BI Desktop**, already installed. Everything else is part of this setup.

Sample model used in all the steps: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**. Please, download it before you start.

At the end you have an agent in a window that reads and writes the semantic model, and that also creates and validates report pages.

One clarification on the product. **Claude Code Desktop is the Code tab of the Claude desktop application.** There is no separate download for it: you install the Claude application, sign in, and select the **Code** tab. The command-line client is the same agent with a different interface, and the two share the configuration.

## Requirements

- **Power BI Desktop**, installed.
- **[Node.js](https://nodejs.org/en/download) 22 or later**. The Power BI Modeling MCP server is started with `npx`, which is part of Node.js. The application does not need it for itself. A new machine does not have it, so step 1 installs it.
- **[Git for Windows](https://git-scm.com/downloads/win)**. On Windows the Code tab does not work without it, and the marketplace of the skills cannot be downloaded in step 11. Install it and restart the application.
- **Windows 10 version 1809 or later**, or Windows Server 2019 or later.
- A **Claude account with a Pro, Max, Team, or Enterprise plan**, or a Console account with credits. The free plan does not include Claude Code, and the Code tab asks for an upgrade. Check the [plans page](https://claude.com/pricing) before you start.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Modeling MCP server** runs on your machine and connects to Power BI Desktop like an external tool. Claude Code Desktop is the client that hosts the agent, and it starts the server as a local process.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.

## Step 1: install Node.js

A new installation of Windows does not have it. `npm` and `npx` are part of Node.js, and the Power BI Modeling MCP server is started with `npx`.

### Open the command prompt

Several steps of this article ask you to type a command. Windows has two programs that run the commands, and they are not interchangeable:

- The **command prompt**. Press `Windows+R`, type `cmd`, and press Enter. The window shows a folder path followed by `>`.
- **PowerShell**. Press `Windows+R`, type `powershell`, and press Enter. The line starts with `PS`.

Every command of this article says which of the two to use. To open a window already positioned in a folder, open that folder in File Explorer, type `cmd` in the address bar, and press Enter. When an installation asks for administrator rights, find **Command Prompt** in the Start menu, right-click it, and choose **Run as administrator**.

### Install Node.js

Choose one of the two methods. LTS stands for Long Term Support.
<!-- options -->
**Option 1: WinGet.** In the **command prompt**:

```text
winget install --id OpenJS.NodeJS.LTS --source winget
```
<video src="videos/AIsetup-NodeJS.mp4" 
 autoplay loop muted width="500"></video>

**Option 2: the installer.** Download it from [nodejs.org/en/download](https://nodejs.org/en/download) and run it.

<!-- /options -->

Both methods write in the folders of the machine, so they ask for administrator rights. If you do not have them, use one of the options at the end of this step.

Close the command prompt and open it again, so that it reads the updated path. Then verify the installation, in the **command prompt**:

```text
node --version
```

The command returns the version you installed. The LTS installer provides 22 or later.

### Install Node.js without administrator rights

<!-- options -->
These are options, not a replacement of the installer. Use one of them when the machine is managed and you do not have administrator rights. Each one writes in your user profile, and each one provides `npm` and `npx`.

**Option 1: the standalone binary.** The [download page](https://nodejs.org/en/download) offers a standalone archive besides the installer. Extract it in a folder of your user profile, for example `%LOCALAPPDATA%\nodejs`, and add that folder to the `Path` variable of the user, in **Settings > System > About > Advanced system settings > Environment variables**. Nothing else is installed.

**Option 2: fnm, the Fast Node Manager.** It installs and switches the versions of Node.js in your user profile. Install fnm with WinGet, in the **command prompt**:

```text
winget install Schniz.fnm
```

Add this line to your **PowerShell** profile, so that every session finds Node.js. The command `notepad $PROFILE`, typed in PowerShell, opens that file:

```text
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

Open a new **PowerShell** window, install the LTS version, and read the version number it installed:

```text
fnm install --lts
```

```text
fnm list
```

Then set that version as the default, replacing `<version>` with the number of the LTS entry of the list:

```text
fnm default <version>
```

**Option 3: Scoop.** It is a package manager that installs in `%USERPROFILE%\scoop`. Install it in **PowerShell**, in a window that is not elevated:

```text
irm get.scoop.sh | iex
```

Then install Node.js, in the same **PowerShell** window:

```text
scoop install nodejs-lts
```
<!-- /options -->

With any of the three options, close the window, open a **command prompt**, and verify with `node --version` and `npm --version`.

## Step 2: install the Claude desktop application

There is no Microsoft Store version.

<!-- options -->
Choose one of the two methods.

**Option 1: the installer.** Download it from [claude.com/download](https://claude.com/download), which offers the version for the x64 and the ARM64 processors.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install -e --id Anthropic.Claude
```
<!-- /options -->

The WinGet package is published by Anthropic, and the documentation of Anthropic does not mention it. The download from the web page is the documented method.

## Step 3: install Git

Claude Desktop requires Git for some operations, and Windows does not include it. Install it, then close the command prompt and open it again.

<!-- options -->
Choose one of the two methods.

**Option 1: the installer.** Download it from [git-scm.com/downloads/win](https://git-scm.com/downloads/win) and run it.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install --id Git.Git --source winget
```

<video src="videos/AIsetup-skill-tools-install.mp4" 
 autoplay loop muted width="500"></video>

<!-- /options -->
## Step 4: open the sample model

1. Download **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.
2. **Extract the archive** in a local folder, for example `C:\Demo`. Please, do not open the file directly from the compressed folder.
3. Open **ContosoDemo10k.pbix** in Power BI Desktop and leave Power BI Desktop open.

The title bar shows **ContosoDemo10k**. You use that name in step 6.

<video src="videos/AIsetup-CopyContosoDemo.mp4" 
 autoplay loop muted width="500"></video>

## Step 5: open the application and sign in

1. Start **Claude** from the Start menu.
2. Sign in with your Anthropic account.
3. Select the **Code** tab. The tabs are Chat, Cowork, and Code, and only the third one is the agent of this article.
4. Select the folder of the sample, for example `C:\Demo`, and accept the trust dialog for that folder.

The selector next to the send button controls the permission mode. The modes are Manual, Accept edits, Plan, Auto, and Bypass permissions. Keep **Manual** for this setup, so that every write asks for a confirmation. The mode is remembered for each folder.

One note: the command `/permissions` is not available in this tab. The rules are written in the settings files.

## Step 6: register the Power BI Modeling MCP server

There is no extension to install. The server is an npm package, and the application starts it on demand.

The Code tab reads the MCP servers from three places: the connectors of the application, the file `%USERPROFILE%\.claude.json`, and a `.mcp.json` file in the folder of the project. We use the first file, because it applies to every folder.

Open `%USERPROFILE%\.claude.json` in a text editor and add the server at the top level of the file:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--readonly"]
    }
  }
}
```

The `--readonly` argument blocks every write operation. We suggest it for the first session, so that a wrong prompt cannot modify anything. Step 8 replaces it.

Restart the application, so that it reads the file again. The command `/mcp` in the Code tab lists the servers and the state of the connection.

The **+** button next to the box where you write opens the **Connectors** panel, which is the graphical way to add an MCP server. It is available in the local sessions, and not in the sessions that run in the cloud or in the Windows Subsystem for Linux.

## Step 7: connect to Power BI Desktop

Send this prompt:

```text
Connect to 'ContosoDemo10k' in Power BI Desktop
```

The answer reports the model name and an active connection. The first call to the MCP server raises a confirmation prompt. Read it: it is the only checkpoint before a change.

## Step 8: verify the connection

Send these two prompts to the agent, one after the other:

```text
List the tables and their row counts
Show me the relationships in the model
```

Both answers arrive in a few seconds. The chain works: Claude Code Desktop, MCP server, Power BI Desktop.

## Step 9: enable the write operations

The session started in read-only mode, so the next prompt would fail. Remove the restriction:

1. Close the application.
2. Open `%USERPROFILE%\.claude.json` and remove `"--readonly"` from the `args` array.
3. Start the application again, select the **Code** tab and the folder, and connect again, as in step 6.

Then send this prompt:

```text
Create a measure that returns the Sales Amount of the previous year using the same format of the original measure.
```

The measure appears in Power BI Desktop without a refresh. Each write operation raises a confirmation prompt. The same approach applies to bulk operations, like format strings and display folders on hundreds of objects in a single request.

## Step 10: enable the preview features for the report layer

The MCP server operates on the semantic model. The report layer requires a different tool, the **Power BI report authoring skill**, which works only on **PBIP** files in **PBIR** format. PBIP stands for Power BI Project, PBIR for Power BI enhanced report format. The skill cannot modify a `.pbix` file.

In Power BI Desktop, open **File > Options and settings > Options > Preview features** and enable these three options:

- **Power BI Project (.pbip) save option**
- **Store reports using enhanced metadata format (PBIR)**
- **Enable external tool access to Power BI Desktop through secure local APIs**

The third option is the **Power BI Desktop Bridge**, and it is enabled by default. The report authoring skill uses it to reload the project and to capture a screenshot of a page, so that the agent verifies its own work. Verify that the option is checked.

Restart Power BI Desktop.

<video src="videos/AIsetup-PowerBI-enable-preview-report-layer.mp4" 
 autoplay loop muted width="500"></video>

## Step 11: save the sample as a project

Use **File > Save as** and choose the **Power BI Project (\*.pbip)** file type. Power BI Desktop creates this structure:

```text
ContosoDemo10k.pbip
ContosoDemo10k.SemanticModel/
ContosoDemo10k.Report/
.gitignore
```

The model is a set of **TMDL** files (Tabular Model Definition Language) and the report is a set of JSON files. Put the folder under source control and commit a baseline, so to undo a wrong operation with one command.

<video src="videos/AIsetup-PowerBI-save-as-PBIP.mp4" 
 autoplay loop muted width="500"></video>
 
## Step 12: install the report authoring skill

**Git is required for this step**, and step 3 installed it already. The marketplace is downloaded with `git`. If it cannot be downloaded, verify in the **command prompt** that `git --version` answers.

The skills call two command-line tools. Install them in the **command prompt**:

```text
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

The skill is part of the **powerbi-authoring** plugin, published in the [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) marketplace by Microsoft. The plugin contains five skills: semantic model authoring, report planning, report design, report authoring, and report management.

The commands `/plugin marketplace add` and `/plugin install` belong to the command-line client and are not available in the Code tab. In the application the plugins are installed from a panel, and the marketplace of Microsoft is declared in a settings file.

1. Select the **+** button next to the box where you write, then **Plugins**, then **Add plugin**.
2. Select the **+** button next to **Filter by** that opens the **Add marketplace** dialog.
3. Select **Add from a repository** and provide `microsoft/skills-for-fabric` as a URL, then click **Use "microsoft/skills-for-fabric"** in the dropdown list, then click the **Sync** button.
4. Select **Code** to filter the skill from fabric-collection and press the **+** button in the **Powerbi authoring** area.
5. Install **powerbi-authoring** from the `fabric-collection` marketplace.
6. Click **Continue** in the dialog that warns about the need to install the powerbi-modeling-mcp server.

You can click the settings icon to see the list of skills installed for the Powerbi authoring plugin.

**The plugin declares its own copy of the MCP server**, with the same name `powerbi-modeling-mcp` and without `--readonly`. Verify with `/mcp` which definition is active before you rely on read-only mode.

One known problem: the file that the plugin uses to declare the server has contained a transport name that Claude Code does not accept, which produces an error at the installation. If you see a message about an unsupported source type, update the application first. If the error remains, clone the repository in the **command prompt** and copy the five folders of `plugins\powerbi-authoring\skills` into `%USERPROFILE%\.claude\skills` instead of installing the plugin, because the report skills do not need the server declared by the plugin.

## Step 13: connect the agent to the project

Select the folder that contains the `.pbip` file, so that the agent sees both the model folder and the report folder. Then send this prompt:

```text
Open semantic model from PBIP folder 'C:\Demo\ContosoDemo10k.SemanticModel'
```

The MCP server manages the semantic model folder. The authoring skill reads and writes the report folder as files.

## Step 14: create a report page

```text
Create a report page with a line chart showing Sales Amount by Quarter, and a card showing the Sales Amount of the last year that has data.
```

Then ask the agent to validate the report, which checks the structure of the PBIR files, and open the `.pbip` file in Power BI Desktop. The skill runs this command, and you can run it yourself in the **command prompt**:

```text
powerbi-report-author validate "C:\Demo\ContosoDemo10k.Report"
```

**Save any manual change in Power BI Desktop before the agent iterates.** The agent reads the files on disk and does not see the unsaved state. Editing in both places at the same time loses one set of changes.

The examples in the documentation use cards, bar charts, clustered column charts, tables, KPI cards, and slicers, and the skill converts the legacy `card` and `matrix` visuals into the modern `cardVisual` and `pivotTable`. There is no published list of the supported visuals, so expect some trial and error. Q&A, Bing maps, and filled maps are announced for deprecation, and Microsoft recommends avoiding them.

## Configuration options

The command-line arguments of the MCP server go in the `args` array of the JSON entry.

| Option | Default | Description |
|---|---|---|
| `--start` | required | Starts the server. |
| `--readwrite` | enabled | Allows write operations, each one with a confirmation. |
| `--readonly` | | Blocks all the write operations. |
| `--skipconfirmation` | | Removes the confirmation prompts. |
| `--compatibility` | `PowerBI` | Set it to `Full` for Analysis Services databases. |
| `--authmode` | `interactive` | Set it to `serviceprincipal` for unattended scenarios. |

For the service principal authentication, set `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the environment of the server, with either `AZURE_CLIENT_SECRET` or `AZURE_CLIENT_CERTIFICATE_PATH`.

On a model that matters, run the first session with **`--readonly`**, as in step 5.

## Alternative installation methods

**Manual installation.** Download the VSIX package of the Visual Studio Code extension of the MCP server, rename it with the `.zip` extension, extract it, and configure the path of the executable. This avoids the download that `npx` performs at every start:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "type": "stdio",
      "command": "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe",
      "args": ["--start"]
    }
  }
}
```

**If `npx` does not start on Windows**, use the command interpreter as the launcher:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@microsoft/powerbi-modeling-mcp@latest", "--start"]
    }
  }
}
```

The `npx` command is a `.cmd` script on Windows, and a process that starts it without a shell can fail to find it.

Claude Code accepts three transports, `stdio`, `sse`, and `http`. The value `local`, used by other clients, is rejected.

**The file of the chat application.** The Code tab also reads the servers declared in `%APPDATA%\Claude\claude_desktop_config.json`, which is the file of the chat side of the application, reachable from **Settings > Developer > Edit Config**. When the same name is declared in two files, the definition of this one wins in the local sessions. Use one file only, to avoid a configuration that is hard to read.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- The report authoring skill operates on **PBIP projects in PBIR format**, not on a `.pbix` file.
- Neither of them can do anything your permissions do not allow, because they operate with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model of the service you signed in to.
- The MCP server, the report authoring skill, and the Power BI Desktop Bridge are all **in preview**. Behavior and tools can change before general availability.
- The agent proposes and executes. The review is your responsibility.
- The Code tab does not work on Windows without Git for Windows.
- The commands `/plugin` and `/permissions` are not available in the Code tab. The equivalent operations are in the panels and in the settings files.
- The Cowork tab does not share the configuration of the Code tab. A skill installed here does not appear there.

## Troubleshooting

**The Code tab reports that Git is missing.**
Install Git for Windows and restart the application.

**The Code tab asks for an upgrade.**
Claude Code requires a Pro, Max, Team, or Enterprise plan. The free plan does not include it.

**The MCP server does not appear in the list of tools.**
Run `/mcp` in the Code tab. Verify that the entry is at the top level of `%USERPROFILE%\.claude.json`, restart the application, and verify in the Task Manager that the process of the server is running.

**The server does not start and the message mentions `npx` or `spawn`.**
Use the `cmd` form of the alternative installation methods, or the absolute path of the executable. The application inherits the variables of the user and of the system, and does not read the profile of PowerShell, so restart it after a change of the path.

**The plugin does not install and the message mentions an unsupported source type.**
Update the application. If the message remains, copy the five folders of `plugins\powerbi-authoring\skills` into `%USERPROFILE%\.claude\skills`, as described in step 11.

**The `npm` or the `npx` command is not found.**
Node.js is not installed, or the terminal was opened before the installation. Close the terminal, open it again, and run `node --version`. See step 1.

**The marketplace cannot be added, and the message mentions `git`.**
Git is not installed, or the command prompt was opened before the installation. Install Git for Windows as in step 11, then close the command prompt and open it again.

**The server starts and provides no tools.**
Verify that Node.js is installed and that `npx` runs. The first start downloads the package, so it takes longer than the following ones. Run `npx -y @microsoft/powerbi-modeling-mcp@latest --help` once in the **command prompt**, so that the package is already in the cache.

**Cannot connect to Power BI Desktop.**
The file must be open, and the name in the prompt must match the title bar: `ContosoDemo10k`, not `ContosoDemo10k.pbix`. After a restart of Power BI Desktop the port changes. Connect again.

**The write operations are rejected.**
You need write permission on the model, and the server must not run with `--readonly`. See step 8.

**The agent reports that a command is not available when it validates the report.**
Install the two command-line tools of step 11, `@microsoft/powerbi-report-authoring-cli` and `@microsoft/powerbi-desktop-bridge-cli`, then restart the client.

**The report authoring skill does not modify the report.**
It requires PBIP in PBIR format. Verify both preview features and save the project again, because enabling PBIR does not convert a project already saved.

**The report changes do not appear in Power BI Desktop.**
Reload the project. Power BI Desktop shows the version loaded before. Verify the preview option of the Power BI Desktop Bridge, so that the agent reloads the project without your intervention.

**The agent modifies objects you did not mention.**
Name the objects explicitly. For example, "add display folders to the measures in the Sales table" instead of "apply the best practices".

## Conclusions

Install Node.js and Git for Windows, install the Claude desktop application, declare the **Power BI Modeling MCP server** in `%USERPROFILE%\.claude.json`, open a model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Install Git for Windows before you open the Code tab.
- Declare the server in one file only, because three files are read and the same name in two of them is confusing.
- Register the server by its package name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- Open the folder of the project in the client, so that the model and the report are both visible to the agent.
- For the report layer, use PBIP with PBIR, and save in Power BI Desktop before the agent iterates.

## References

- [The desktop application](https://code.claude.com/docs/en/desktop): the Code tab, the connectors, and the files it reads.
- [Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart): the installation and the first session.
- [MCP servers](https://code.claude.com/docs/en/mcp): the JSON schema and the scopes.
- [Permissions](https://code.claude.com/docs/en/permissions): the modes and the trust of a folder.
- [Discover plugins](https://code.claude.com/docs/en/discover-plugins): the marketplaces and the panel of the plugins.
- [Download Claude](https://claude.com/download): the installer for Windows.
- [ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip): the sample model used in this article.
- [Download Node.js](https://nodejs.org/en/download): the LTS installer and the standalone archive, both providing `npm` and `npx`.
- [Schniz/fnm](https://github.com/Schniz/fnm): the Fast Node Manager, one of the options that does not require administrator rights.
- [Scoop](https://scoop.sh/): the package manager that installs in the user profile.
- [What are the Power BI MCP servers?](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview): the comparison between the local and the remote server.
- [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp): repository, configuration reference, and the complete list of tools.
- [Power BI report authoring skill](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview): what the skill does and its limits.
- [Install Skills for Fabric](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install): the marketplace and the installation commands for the plugins.
- [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric): the repository that publishes the skills.
- [What is the Power BI Desktop Bridge?](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-desktop-bridge-overview): the preview setting and the operations it provides.
- [Power BI Desktop projects (PBIP)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview): how to save a project and the folder structure.
- [Power BI Desktop project report folder](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report): the PBIR format and the preview settings.

*The content of this article was verified in September 2026, with the `@microsoft/powerbi-modeling-mcp` package installed from npm with the `@latest` tag, and with version 0.3.15 of the skills-for-fabric marketplace. Command names, preview settings, and plan boundaries change over time, so the linked documentation is the authority.*
