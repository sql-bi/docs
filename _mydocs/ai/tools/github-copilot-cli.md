---
layout:      page
title:       "Set up GitHub Copilot CLI for agentic development with Power BI Desktop"
menu_title:  "GitHub Copilot CLI"
description: "How to configure GitHub Copilot CLI, the Power BI Authoring MCP server, and the Power BI report authoring skill to modify a semantic model and a report with an AI agent."
published:   true
order:       /40
modified:    2026-09-08
---
*This article describes how to configure GitHub Copilot CLI so that an AI agent can read and modify a Power BI semantic model open in Power BI Desktop, and the report of a Power BI project.*

The only requirement we assume is **Power BI Desktop**, already installed. Everything else is part of this setup.

Sample model used in all the steps: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**. Please, download it before you start.

At the end you have an agent in the terminal that reads and writes the semantic model, and that also creates and validates report pages. The report part is the reason to use the command line: the report authoring skill is not offered in the Visual Studio Code extension marketplace today. GitHub Copilot CLI is not the only client that supports it, Claude Code uses the same plugin marketplace, and Cursor, Codex, and Windsurf have their own path. This article covers the GitHub one.

## Requirements

- **Power BI Desktop**, installed.
- **[Node.js](https://nodejs.org/en/download) 22 or later**. GitHub Copilot CLI requires it when installed with npm, and the Power BI Authoring MCP server is started with `npx`, which is part of Node.js. A new machine does not have it, so step 1 installs it.
- **[PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) 7 or later** on Windows. GitHub documents PowerShell 6 as the minimum, the Skills for Fabric documentation asks for PowerShell 7. Install 7, in step 1.
- The **[Microsoft Visual C++ Redistributable x64](https://aka.ms/vc14/vc_redist.x64.exe)**. GitHub Copilot CLI does not run without it, and a new installation of Windows does not always have it. Step 2 installs it.
- A **GitHub account**. Free to create. Step 5 asks for it.
- **[Git for Windows](https://git-scm.com/downloads/win)**. The marketplace of the skills is downloaded with `git`, and Windows does not include it. Step 11 installs it.
- A **GitHub Copilot plan that includes MCP**. Every plan includes GitHub Copilot CLI, MCP is a different matter: if you sign in without a subscription, you are enrolled in **Copilot Free**, which currently does not include MCP. Check the [plans page](https://docs.github.com/en/copilot/get-started/plans) before you start.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Authoring MCP server** runs on your machine and connects to Power BI Desktop like an external tool. GitHub Copilot CLI is the client that hosts the agent, and it starts the server as a local process.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.

**If your organization manages Copilot centrally**, an administrator must enable both the GitHub Copilot CLI policy and the MCP servers option in the Copilot policy settings on github.com. Until then, the commands below run and provide no tools.

## Step 1: install Node.js and PowerShell 7

A new installation of Windows has neither of them. `npm` and `npx` are part of Node.js, and GitHub Copilot CLI uses PowerShell to run the commands it proposes.

### Open the command prompt

Several steps of this article ask you to type a command. Windows has two programs that run the commands, and they are not interchangeable:

- The **command prompt**. Press `Windows+R`, type `cmd`, and press Enter. The window shows a folder path followed by `>`.
- **PowerShell**. Press `Windows+R`, type `powershell`, and press Enter. The line starts with `PS`. PowerShell 7, installed below, is a separate program: it appears in the Start menu as **PowerShell 7**, and its command is `pwsh`.

Every command of this article says which of the two to use. To open a window already positioned in a folder, open that folder in File Explorer, type `cmd` in the address bar, and press Enter. When an installation asks for administrator rights, find **Command Prompt** in the Start menu, right-click it, and choose **Run as administrator**.

### Install the two programs

**Node.js.** 

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

**PowerShell 7.**

<!-- options -->
Choose one of the two methods. The [installation page](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) of Microsoft documents the others, including the MSI package.

**Option 1: the Microsoft Store.** Install it from [the Store page](https://www.microsoft.com/store/apps/9MZ1SNWT0N5D), which requires no administrator rights.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install --id Microsoft.PowerShell --source winget
```
<!-- /options -->

Close the command prompt and open it again, so that it reads the updated path. Then verify both installations, in the **command prompt**:

```text
node --version
```

```text
pwsh --version
```

The first command returns 22 or later, the second one returns 7 or later.

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

## Step 2: install GitHub Copilot CLI

**First, install the Microsoft Visual C++ Redistributable x64.** GitHub Copilot CLI depends on it, and a new installation of Windows does not always include it.

<!-- options -->
Choose one of the two methods.

**Option 1: the browser.** Open this address and run the installer it downloads:

```text
https://aka.ms/vc14/vc_redist.x64.exe
```

**Option 2: WinGet.** In the **command prompt**:

```text
winget install --id Microsoft.VCRedist.2015+.x64 --source winget
```
<!-- /options -->

The installer asks for administrator rights, and it reports that the product is already installed when a more recent version is present. Restart the machine if it asks for it.

**Then install the client.**

<!-- options -->
Choose one of the two methods.

**Option 1: npm.** In the **command prompt**:

```text
npm install -g @github/copilot
```

**Option 2: WinGet.** In the **command prompt**:

```text
winget install GitHub.Copilot
```
<!-- /options -->

Verify the installation, in the **command prompt**:

```text
copilot --version
```

## Step 3: open the sample model

1. Download **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.
2. **Extract the archive** in a local folder, for example `C:\Demo`. Please, do not open the file directly from the compressed folder.
3. Open **ContosoDemo10k.pbix** in Power BI Desktop and leave Power BI Desktop open.

The title bar shows **ContosoDemo10k**. You use that name in step 6.

<video src="videos/AIsetup-CopyContosoDemo.mp4" 
 autoplay loop muted width="500"></video>

## Step 4: register the Power BI Authoring MCP server

There is no extension to install. The server is an npm package, and GitHub Copilot CLI starts it on demand.

Run this command in the **command prompt**:

```text
copilot mcp add powerbi-modeling-mcp -- npx -y @microsoft/powerbi-modeling-mcp@latest --start --readonly
```

The `--readonly` argument blocks every write operation. We suggest it for the first session, so that a wrong prompt cannot modify anything. Step 8 replaces it.

The command writes the entry in `%USERPROFILE%\.copilot\mcp-config.json`. You can edit that file directly instead of running the command:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "type": "local",
      "command": "npx",
      "args": [
        "-y",
        "@microsoft/powerbi-modeling-mcp@latest",
        "--start",
        "--readonly"
      ]
    }
  }
}
```

To share one configuration in a team, put the same `mcpServers` block in a `.mcp.json` file in the root of the project folder, and commit it. The project file takes precedence over the user file.

Verify the registration, in the **command prompt**:

```text
copilot mcp list
```

## Step 5: start the agent and sign in

1. Open a **command prompt** in the folder that contains the sample, for example `C:\Demo`.
2. Start the client:

   ```text
   copilot
   ```

3. Answer the **trust prompt** for the folder. The agent reads and writes files only in the folders you trust. Choose to remember the folder if you plan to work on the report later.
4. Sign in, if the client asks for it:

   ```text
   /login
   ```

A browser window opens, you sign in with your GitHub account, and the control returns to the terminal.

The first call to the MCP server raises a **tool approval prompt**. Read it: together with the confirmation prompt of the server, it is the only checkpoint before a change.

## Step 6: connect to Power BI Desktop

Send this prompt:

```text
Connect to 'ContosoDemo10k' in Power BI Desktop
```

The answer reports the model name and an active connection.

## Step 7: verify the connection

Send these two prompts to the agent, one after the other:

```text
List the tables and their row counts
Show me the relationships in the model
```

Both answers arrive in a few seconds. The chain works: GitHub Copilot CLI, MCP server, Power BI Desktop.

## Step 8: enable the write operations

The session started in read-only mode, so the next prompt would fail. Remove the restriction:

1. Exit the client with `/quit`.
2. Remove the read-only registration, in the **command prompt**:

   ```text
   copilot mcp remove powerbi-modeling-mcp
   ```

3. Register the server again without `--readonly`:

   ```text
   copilot mcp add powerbi-modeling-mcp -- npx -y @microsoft/powerbi-modeling-mcp@latest --start
   ```

4. Start `copilot` again and resume the previous session or connect again, as in step 6.

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

<video src="videos/AIsetup-PowerBI-enable-preview-report-layer.mp4" 
 autoplay loop muted width="500"></video>
 
## Step 10: save the sample as a project

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
 
## Step 11: install the report authoring skill

The skill is part of the **powerbi-authoring** plugin, published in the [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) marketplace by Microsoft. The plugin contains five skills: semantic model authoring, report planning, report design, report authoring, and report management.

**Git is required for this step.** The marketplace is downloaded with `git`, and Windows does not include it. Install it, then close the command prompt and open it again.

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

The skills call two command-line tools. Install them first, in the **command prompt**:

```text
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

Then, in the client, add the marketplace and install the plugin:

```text
/plugin marketplace add microsoft/skills-for-fabric
```

```text
/plugin install powerbi-authoring@fabric-collection
```

Restart the client:

```text
/quit
```

Start `copilot` again and list the skills:

```text
/skills
```

The list includes the five skills. The two commands above are typed inside the client. The same operations are available in the **command prompt** as `copilot plugin marketplace add` and `copilot plugin install`.

**The plugin registers its own copy of the MCP server**, with the same name `powerbi-modeling-mcp` and without `--readonly`. When two definitions share a name, the one loaded last wins, so after this step the read-only registration of step 4 could be replaced. Run `copilot mcp list` and verify which arguments are active before you rely on read-only mode.

The Fabric skills are published in the same marketplace, in the `fabric-skills` bundle. They are a separate installation, and they are not required for the steps of this article.

## Step 12: connect the agent to the project

Start `copilot` in a **command prompt** opened in the folder that contains the `.pbip` file, so that the agent sees both the model folder and the report folder. If you started it elsewhere, add the folder inside the client:

```text
/add-dir C:\Demo
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

Then ask the agent to validate the report, which checks the structure of the PBIR files, and open the `.pbip` file in Power BI Desktop. The command behind the validation is this one, and you can also run it yourself in the **command prompt**:

```text
powerbi-report-author validate "C:\Demo\ContosoDemo10k.Report"
```

**Save any manual change in Power BI Desktop before the agent iterates.** The agent reads the files on disk and does not see the unsaved state. Editing in both places at the same time loses one set of changes.

The examples in the documentation use cards, bar charts, clustered column charts, tables, KPI cards, and slicers, and the skill converts the legacy `card` and `matrix` visuals into the modern `cardVisual` and `pivotTable`. There is no published list of the supported visuals, so expect some trial and error. Q&A, Bing maps, and filled maps are announced for deprecation, and Microsoft recommends avoiding them.

## Configuration options

The command-line arguments of the MCP server go after `--start`, in the `args` array of the configuration or after `--` in the `copilot mcp add` command.

| Option | Default | Description |
|---|---|---|
| `--start` | required | Starts the server. |
| `--readwrite` | enabled | Allows write operations, each one with a confirmation. |
| `--readonly` | | Blocks all the write operations. |
| `--skipconfirmation` | | Removes the confirmation prompts. |
| `--compatibility` | `PowerBI` | Set it to `Full` for Analysis Services databases. |
| `--authmode` | `interactive` | Set it to `serviceprincipal` for unattended scenarios. |

For the service principal authentication, set `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the `env` object of the configuration, with either `AZURE_CLIENT_SECRET` or `AZURE_CLIENT_CERTIFICATE_PATH`.

On a model that matters, run the first session with **`--readonly`**, as in step 4.

## Alternative installation methods

**Manual installation.** Download the VSIX package of the Visual Studio Code extension, rename it with the `.zip` extension, extract it, and configure the path of the executable. This avoids the download that `npx` performs at every start:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "type": "stdio",
      "command": "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe",
      "args": ["--start"],
      "env": {}
    }
  }
}
```

**A note on the `type` value.** GitHub Copilot CLI accepts both `local` and `stdio`, and they behave in the same way. `stdio`, which stands for standard input and output, is the name defined by the protocol, so a configuration written with `stdio` also works in Visual Studio Code and in the other MCP clients. Use `stdio` in a file you share, and `local` only if you follow the GitHub examples.

The server is a standard MCP server, so any client can run it with the same configuration. GitHub Copilot CLI is required only for the plugin and the skills.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- The report authoring skill operates on **PBIP projects in PBIR format**, not on a `.pbix` file.
- Neither of them can do anything your permissions do not allow, because they operate with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model of your Copilot plan.
- The MCP server, the report authoring skill, and the Power BI Desktop Bridge are all **in preview**. Behavior and tools can change before general availability.
- The agent proposes and executes. The review is your responsibility.

## Troubleshooting

**The `npm` or the `npx` command is not found.**
Node.js is not installed, or the terminal was opened before the installation. Close the terminal, open it again, and run `node --version`. See step 1.

**The `copilot` command is not found.**
Close and open the terminal again, so that it reads the updated path. With npm, verify that the global folder of npm is in the path.

**The client closes immediately, or reports a missing DLL.**
The Microsoft Visual C++ Redistributable x64 is not installed. Install it from `https://aka.ms/vc14/vc_redist.x64.exe`, as in step 2.

**The MCP server does not appear in the list of tools.**
Run `copilot mcp list` in the terminal, or `/mcp show` in the client. Then verify, in this order: the entry exists, your Copilot plan includes MCP, your organization has enabled the MCP servers option in the Copilot policy.

**The marketplace cannot be added, and the message mentions `git`.**
Git is not installed, or the command prompt was opened before the installation. Install Git for Windows as in step 11, then close the command prompt and open it again.

**The server starts and provides no tools.**
Verify that Node.js is installed and that `npx` runs. The first start downloads the package, so it takes longer than the following ones.

**Cannot connect to Power BI Desktop.**
The file must be open, and the name in the prompt must match the title bar: `ContosoDemo10k`, not `ContosoDemo10k.pbix`. After a restart of Power BI Desktop the port changes. Connect again.

**The write operations are rejected.**
You need write permission on the model, and the server must not run with `--readonly`. See step 8.

**The plugin is not found in the marketplace.**
Verify the exact specification, `powerbi-authoring@fabric-collection`, and add the marketplace first with `/plugin marketplace add microsoft/skills-for-fabric`.

**The skills do not appear after the installation.**
Restart the client with `/quit`, start `copilot` again, and run `/skills`.

**The agent reports that a command is not available when it validates the report.**
Install the two command-line tools of step 11, `@microsoft/powerbi-report-authoring-cli` and `@microsoft/powerbi-desktop-bridge-cli`, then restart the client.

**The server accepts a write operation while you expect read-only mode.**
The plugin of step 11 registers its own definition of `powerbi-modeling-mcp` without `--readonly`. Run `copilot mcp list` and check the arguments in use.

**The report authoring skill does not modify the report.**
It requires PBIP in PBIR format. Verify both preview features and save the project again, because enabling PBIR does not convert a project already saved.

**The agent cannot read the report files.**
The folder must be trusted. Use `/add-dir` with the folder of the project, or start `copilot` from that folder.

**The report changes do not appear in Power BI Desktop.**
Reload the project. Power BI Desktop shows the version loaded before. Verify the preview option of the Power BI Desktop Bridge, so that the agent reloads the project without your intervention.

**The agent modifies objects you did not mention.**
Name the objects explicitly. For example, "add display folders to the measures in the Sales table" instead of "apply the best practices".

## Conclusions

Install Node.js and the Microsoft Visual C++ Redistributable, install GitHub Copilot CLI, register the **Power BI Authoring MCP server** with one command, install the **powerbi-authoring** plugin, open a model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Install the Microsoft Visual C++ Redistributable before the client, so that a missing runtime is not mistaken for a failed installation.
- Register the server by its package name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the tool approval prompts and the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- Start the client in the folder of the project, so that the model and the report are both visible to the agent.
- For the report layer, use PBIP with PBIR, and save in Power BI Desktop before the agent iterates.

## References

- [ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip): the sample model used in this article.
- [Download Node.js](https://nodejs.org/en/download): the LTS installer and the standalone archive, both providing `npm` and `npx`.
- [Schniz/fnm](https://github.com/Schniz/fnm): the Fast Node Manager, one of the options that does not require administrator rights.
- [Scoop](https://scoop.sh/): the package manager that installs in the user profile.
- [Installing PowerShell on Windows](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows): the Microsoft Store, WinGet, and MSI methods.
- [Install GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli): the installation methods and the sign-in process.
- [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers): the `copilot mcp add` command and the configuration files.
- [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference): the slash commands of the interactive session.
- [GitHub Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference): the `/plugin` commands and the marketplace format.
- [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans): the plans that include MCP.
- [What are the Power BI MCP servers?](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview): the comparison between the local and the remote server.
- [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp): repository, configuration reference, and the complete list of tools.
- [Power BI report authoring skill](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview): what the skill does and its limits.
- [Install Skills for Fabric](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install): the marketplace and the installation commands for the plugins.
- [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric): the repository that publishes the marketplace.
- [What is the Power BI Desktop Bridge?](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-desktop-bridge-overview): the preview setting and the operations it provides.
- [Power BI Desktop projects (PBIP)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview): how to save a project and the folder structure.
- [Power BI Desktop project report folder](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report): the PBIR format and the preview settings.

*The content of this article was verified in September 2026, with the `@microsoft/powerbi-modeling-mcp` package installed from npm with the `@latest` tag, and with version 0.3.15 of the skills-for-fabric marketplace. Command names, preview settings, and plan boundaries change over time, so the linked documentation is the authority.*
