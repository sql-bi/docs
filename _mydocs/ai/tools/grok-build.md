---
layout:      page
title:       "Set up Grok Build for agentic development with Power BI Desktop"
menu_title:  "Grok Build"
description: "How to configure Grok Build, the Power BI Modeling MCP server, and the Power BI report authoring skill to modify a semantic model and a report with an AI agent."
published:   true
order:       /60
modified:    2026-09-08
---
*This article describes how to configure Grok Build so that an AI agent can read and modify a Power BI semantic model open in Power BI Desktop, and the report of a Power BI project.*

The only requirement we assume is **Power BI Desktop**, already installed. Everything else is part of this setup.

Sample model used in all the steps: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**. Please, download it before you start.

At the end you have an agent in the terminal that reads and writes the semantic model, and that also creates and validates report pages.

One clarification on the name. **Grok Build** is also the name of a web feature that builds applications in the browser. This article is about the **command-line client** of SpaceXAI, the one you start with `grok` in the command prompt.

Grok Build reads the configuration of Claude Code without any setting: marketplaces, plugins, skills, MCP servers, and instruction files. This is what makes the report authoring skill usable here, because that skill is published for Claude Code and has no marketplace of its own for other clients.

## Requirements

- **Power BI Desktop**, installed.
- **[Node.js](https://nodejs.org/en/download) 22 or later**. The Power BI Modeling MCP server is started with `npx`, which is part of Node.js. A new machine does not have it, so step 1 installs it.
- **Microsoft Visual C++ 2015 Redistributable or later**. The WinGet package installs it as a dependency. If you use the installer of SpaceXAI, install it separately when the client does not start.
- An **SpaceXAI account with a plan that includes Grok Build**, or an **SpaceXAI API key** with credits. Check the [plans page](https://x.ai/pricing) before you start.
- **[Git for Windows](https://git-scm.com/downloads/win)**. The repository of the skills is downloaded with `git`, and Windows does not include it. Step 11 installs it.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Modeling MCP server** runs on your machine and connects to Power BI Desktop like an external tool. Grok Build is the client that hosts the agent, and it starts the server as a local process.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.

## Step 1: install Node.js

A new installation of Windows does not have it. `npm` and `npx` are part of Node.js, and the Power BI Modeling MCP server is started with `npx`.

### Open the command prompt

Several steps of this article ask you to type a command. Windows has two programs that run the commands, and they are not interchangeable:

- The **command prompt**. Press `Windows+R`, type `cmd`, and press Enter. The window shows a folder path followed by `>`.
- **PowerShell**. Press `Windows+R`, type `powershell`, and press Enter. The line starts with `PS`.

Every command of this article says which of the two to use. To open a window already positioned in a folder, open that folder in File Explorer, type `cmd` in the address bar, and press Enter. When an installation asks for administrator rights, find **Command Prompt** in the Start menu, right-click it, and choose **Run as administrator**.

### Install Node.js

<!-- options -->
Choose one of the two methods. LTS stands for Long Term Support.

**Option 1: the installer.** Download it from [nodejs.org/en/download](https://nodejs.org/en/download) and run it.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install --id OpenJS.NodeJS.LTS --source winget
```
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

## Step 2: install Grok Build

<!-- options -->
Choose one of the two methods.

**Option 1: the installer of SpaceXAI.** In **PowerShell**:

```text
irm https://x.ai/cli/install.ps1 | iex
```

**Option 2: WinGet.** In the **command prompt**:

```text
winget install xAI.GrokBuild
```
<!-- /options -->

There is no Microsoft Store version of Grok Build. The Store contains other applications with a similar name, published by other companies.

The WinGet package is a portable installation, so the command is available only in a command prompt opened after the installation.

Verify the installation, in the **command prompt**:

```text
grok --version
```

## Step 3: open the sample model

1. Download **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.
2. **Extract the archive** in a local folder, for example `C:\Demo`. Please, do not open the file directly from the compressed folder.
3. Open **ContosoDemo10k.pbix** in Power BI Desktop and leave Power BI Desktop open.

The title bar shows **ContosoDemo10k**. You use that name in step 6.

## Step 4: register the Power BI Modeling MCP server

There is no extension to install. The server is an npm package, and Grok Build starts it on demand.

Run this command in the **command prompt**:

```text
grok mcp add powerbi-modeling-mcp -- npx -y @microsoft/powerbi-modeling-mcp@latest --start --readonly
```

The `--readonly` argument blocks every write operation. We suggest it for the first session, so that a wrong prompt cannot modify anything. Step 8 replaces it.

The command writes the entry in `%USERPROFILE%\.grok\config.toml`. You can edit that file directly instead of running the command:

```toml
[mcp_servers.powerbi-modeling-mcp]
command = "npx"
args = ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--readonly"]
startup_timeout_sec = 120
```

The documentation of SpaceXAI asks for a higher `startup_timeout_sec` when the server is started with `npx`, because the first start downloads the package. The default is 30 seconds.

Verify the registration, in the **command prompt**:

```text
grok mcp list
```

The command `grok mcp doctor` reports the servers that fail to start, and `grok inspect` lists everything the client loaded, including the servers it read from the configuration of other clients.

## Step 5: start the agent and sign in

1. Open a **command prompt** in the folder that contains the sample, for example `C:\Demo`.
2. Start the client:

   ```text
   grok
   ```

3. Sign in. The client opens a browser at the first start. With an API key, set the variable before you start it. This form of the command works only in **PowerShell**, so start the client from PowerShell when you use a key:

   ```text
   $env:XAI_API_KEY="xai-..."
   ```

The permission mode is shown in the interface and changes with `Shift+Tab`. The three modes are **ask**, which is the default, **auto**, and **always-approve**. Keep **ask** for this setup.

The command `/mcps` opens the tab of the MCP servers, where `r` reloads the configuration after you edit the file.

## Step 6: connect to Power BI Desktop

Send this prompt:

```text
Connect to 'ContosoDemo10k' in Power BI Desktop
```

The answer reports the model name and an active connection. The first call to the MCP server raises a confirmation prompt. Read it: it is the only checkpoint before a change.

## Step 7: verify the connection

Send these two prompts to the agent, one after the other:

```text
List the tables and their row counts
Show me the relationships in the model
```

Both answers arrive in a few seconds. The chain works: Grok Build, MCP server, Power BI Desktop.

## Step 8: enable the write operations

The session started in read-only mode, so the next prompt would fail. Remove the restriction:

1. Exit the client.
2. Remove the read-only registration, in the **command prompt**:

   ```text
   grok mcp remove powerbi-modeling-mcp
   ```

3. Register the server again without `--readonly`:

   ```text
   grok mcp add powerbi-modeling-mcp -- npx -y @microsoft/powerbi-modeling-mcp@latest --start
   ```

4. Start `grok` again and connect again, as in step 6.

Then send this prompt:

```text
Create a measure that returns the Sales Amount of the previous year using the same format of the original measure.
```

The measure appears in Power BI Desktop without a refresh. Each write operation raises a confirmation prompt. The same approach applies to bulk operations, like format strings and display folders on hundreds of objects in a single request.

## Step 9: enable the preview features for the report layer

The MCP server operates on the semantic model. The report layer requires a different tool, the **Power BI report authoring skill**, which works only on **PBIP** files in **PBIR** format. PBIP stands for Power BI Project, PBIR for Power BI enhanced report format. The skill cannot modify a `.pbix` file.

In Power BI Desktop, open **File > Options and settings > Options > Preview features** and enable these three options:

- **Power BI Project (.pbip) save option**
- **Store reports using enhanced metadata format (PBIR)**
- **Enable external tool access to Power BI Desktop through secure local APIs**

The third option is the **Power BI Desktop Bridge**, and it is enabled by default. The report authoring skill uses it to reload the project and to capture a screenshot of a page, so that the agent verifies its own work. Verify that the option is checked.

Restart Power BI Desktop.

## Step 10: save the sample as a project

Use **File > Save as** and choose the **Power BI Project (\*.pbip)** file type. Power BI Desktop creates this structure:

```text
ContosoDemo10k.pbip
ContosoDemo10k.SemanticModel/
ContosoDemo10k.Report/
.gitignore
```

The model is a set of **TMDL** files (Tabular Model Definition Language) and the report is a set of JSON files. Put the folder under source control and commit a baseline, so to undo a wrong operation with one command.

## Step 11: install the report authoring skill

**Git is required for this step.** The repository is downloaded with `git`, and Windows does not include it. Install it, then close the command prompt and open it again.

<!-- options -->
Choose one of the two methods.

**Option 1: the installer.** Download it from [git-scm.com/downloads/win](https://git-scm.com/downloads/win) and run it.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install --id Git.Git --source winget
```
<!-- /options -->

The skills call two command-line tools. Install them in the **command prompt**:

```text
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

The skill is part of the **powerbi-authoring** plugin, published in the [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) marketplace by Microsoft. The plugin contains five skills: semantic model authoring, report planning, report design, report authoring, and report management.

The marketplace is published in the format of Claude Code, and Grok Build reads that format without any setting. Two paths are available.

<!-- options -->
Choose one of the two paths.

**Path 1: the marketplace tab.** Open the marketplace tab in the client:

```text
/marketplace
```

In the Marketplace dialog box:
1. Add source (**a**) specifying the repository name `microsoft/skills-for-fabric`.
2. Select `powerbi-authoring` and install (**i**).

The tab also lists the plugins that Grok Build already reads from the configuration of Claude Code, if that client is installed on the same machine.

**Path 2: the skills folder.** Clone the repository and copy the skills of the plugin in the folder where Grok Build discovers them, in the **command prompt**:

```text
git clone https://github.com/microsoft/skills-for-fabric.git C:\Demo\skills-for-fabric
```

```text
xcopy /E /I "C:\Demo\skills-for-fabric\plugins\powerbi-authoring\skills" "%USERPROFILE%\.grok\skills"
```

Please, verify the folder names in the repository before you copy, because the layout changes between versions. The repository also has a `skills` folder in its root, which contains all the skills of the collection. The five skills of the report layer are the ones in the folder of the plugin.

Restart the client and list the skills:

```text
/skills
```
<!-- /options -->

The plugin also declares its own copy of the MCP server, with the same name `powerbi-modeling-mcp` and without `--readonly`. Run `grok inspect` and verify which definition is active before you rely on read-only mode.

## Step 12: connect the agent to the project

Start the client in the **command prompt**, in the folder that contains the `.pbip` file, so that the agent sees both the model folder and the report folder:

```text
grok --cwd "C:\Demo"
```

Then send this prompt:

```text
Open semantic model from PBIP folder 'C:\Demo\ContosoDemo10k.SemanticModel'
```

The MCP server manages the semantic model folder. The authoring skill reads and writes the report folder as files.

## Step 13: create a report page

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

The command-line arguments of the MCP server go after `--` in the `grok mcp add` command, or in the `args` array of the TOML section.

| Option | Default | Description |
|---|---|---|
| `--start` | required | Starts the server. |
| `--readwrite` | enabled | Allows write operations, each one with a confirmation. |
| `--readonly` | | Blocks all the write operations. |
| `--skipconfirmation` | | Removes the confirmation prompts. |
| `--compatibility` | `PowerBI` | Set it to `Full` for Analysis Services databases. |
| `--authmode` | `interactive` | Set it to `serviceprincipal` for unattended scenarios. |

For the service principal authentication, set `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the environment of the server, with either `AZURE_CLIENT_SECRET` or `AZURE_CLIENT_CERTIFICATE_PATH`.

On a model that matters, run the first session with **`--readonly`**, as in step 4.

## Alternative installation methods

**Manual installation.** Download the VSIX package of the Visual Studio Code extension of the MCP server, rename it with the `.zip` extension, extract it, and configure the path of the executable. This avoids the download that `npx` performs at every start:

```toml
[mcp_servers.powerbi-modeling-mcp]
command = "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe"
args = ["--start"]
```

**A project configuration.** The argument `--scope project` writes the entry in `.grok\config.toml`, in the current folder. Grok Build reads the files from the current folder up to the root of the repository, and a server defined in the project replaces the one with the same name defined for the user.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- The report authoring skill operates on **PBIP projects in PBIR format**, not on a `.pbix` file.
- Neither of them can do anything your permissions do not allow, because they operate with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model of the service you signed in to.
- The MCP server, the report authoring skill, and the Power BI Desktop Bridge are all **in preview**. Behavior and tools can change before general availability.
- The agent proposes and executes. The review is your responsibility.
- The sandbox of Grok Build is not available on Windows. The permission rules still apply, the isolation of the file system does not.
- The compatibility with the configuration of Claude Code is documented by SpaceXAI, the specific combination with the Fabric skills is not tested by Microsoft.

## Troubleshooting

**The `grok` command is not found.**
Open a new terminal, so that it reads the updated path. The WinGet package is portable, and the path is set at the installation.

**The client does not start and reports a missing library.**
Install the Microsoft Visual C++ 2015 Redistributable or later.

**The MCP server does not appear in the list of tools.**
Run `grok mcp doctor` in the terminal, or `/mcps` in the client, then `r` to reload after an edit of the file. The command `grok inspect` shows every server that the client loaded and where it read it.

**The server times out at the start.**
Raise `startup_timeout_sec` in the TOML section. The documentation asks for a higher value with servers started by `npx`.

**Two definitions of the same server are active.**
The plugin of step 11 declares its own `powerbi-modeling-mcp`, and Grok Build also reads the configuration of Claude Code. Run `grok inspect` and remove the definition you do not want.

**The `npm` or the `npx` command is not found.**
Node.js is not installed, or the terminal was opened before the installation. Close the terminal, open it again, and run `node --version`. See step 1.

**The `git` command is not found.**
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

Install Node.js, install Grok Build, register the **Power BI Modeling MCP server** with one command, open a model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Raise `startup_timeout_sec` when the server is started with `npx`.
- Run `grok inspect` before you trust a configuration, because the client also reads the files of other clients.
- Register the server by its package name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- Open the folder of the project in the client, so that the model and the report are both visible to the agent.
- For the report layer, use PBIP with PBIR, and save in Power BI Desktop before the agent iterates.

## References

- [Grok Build](https://docs.x.ai/build/overview): the installation methods and the sign-in process.
- [MCP servers](https://docs.x.ai/build/features/mcp-servers): the `grok mcp add` command and the TOML configuration.
- [Settings](https://docs.x.ai/build/settings): the position of `config.toml` on Windows.
- [Permissions](https://docs.x.ai/build/features/permissions): the three modes and the rules.
- [Skills, plugins, and marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces): the folders of the skills and the compatibility with Claude Code.
- [x.ai plans](https://x.ai/pricing): the plans that include Grok Build.
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

*The content of this article was verified in September 2026, with the `@microsoft/powerbi-modeling-mcp` package installed from npm with the `@latest` tag. Command names, preview settings, and plan boundaries change over time, so the linked documentation is the authority.*
