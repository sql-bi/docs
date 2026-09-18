---
layout:      page
title:       "Set up the ChatGPT desktop app for agentic development with Power BI Desktop"
menu_title:  "ChatGPT desktop app"
description: "How to configure the ChatGPT desktop app, the Power BI Modeling MCP server, and the Power BI report authoring skill to modify a semantic model and a report with an AI agent."
published:   true
order:       /10
modified:    2026-09-13
---
*This article describes how to configure the ChatGPT desktop app so that an AI agent can read and modify a Power BI semantic model open in Power BI Desktop, and the report of a Power BI project.*

The only requirement we assume is **Power BI Desktop**, already installed. Everything else is part of this setup.

Sample model used in all the steps: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**. Please, download it before you start.

At the end you have an agent in a window that reads and writes the semantic model, and that also creates and validates report pages.

One clarification on the application, because two of them carry a similar name. This article covers the **new ChatGPT desktop app**, the one that contains the Chat, Work, and Codex surfaces in a single window. It replaced the separate Codex application, and the previous desktop application was renamed **ChatGPT Classic**. ChatGPT Classic does not run agents on your machine, so it is not the application to install here.

## Requirements

- **Power BI Desktop**, installed.
- **[Node.js](https://nodejs.org/en/download) 22 or later**. The Power BI Modeling MCP server is started with `npx`, which is part of Node.js. A new machine does not have it, so step 1 installs it.
- **Windows 10 version 1809 or later**, and WinGet available on the machine. The application uses them to prepare its sandbox.
- A **ChatGPT account with a paid plan**, Plus, Pro, Business, or Enterprise. The free plan does not include the agent, and it does not include the MCP servers. Check the [plans page](https://learn.chatgpt.com/docs/pricing) before you start.
- **[Git for Windows](https://git-scm.com/downloads/win)**. The repository of the skills is downloaded with `git`, and Windows does not include it. Step 11 installs it.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Modeling MCP server** runs on your machine and connects to Power BI Desktop like an external tool. The ChatGPT desktop app is the client that hosts the agent, and it starts the server as a local process.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.

**If your organization manages ChatGPT centrally**, an administrator can restrict the MCP servers with an allow list, and can disable them completely. In that case the configuration below is accepted and no tool appears.

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

## Step 2: install the ChatGPT desktop app

The application is published in the **Microsoft Store**, which requires no administrator rights.

<!-- options -->
Choose one of the two methods.

**Option 1: the Store.** Open [apps.microsoft.com/detail/9plm9xgg6vks](https://apps.microsoft.com/detail/9plm9xgg6vks) and install the application from there. The web page [chatgpt.com/features/desktop](https://chatgpt.com/features/desktop/) leads to the same product.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install --id 9PLM9XGG6VKS -s msstore
```
<!-- /options -->

Please, use the product identifier `9PLM9XGG6VKS`. The Store contains a second listing, **ChatGPT Classic**, with the identifier `9NT1R1C2HH7J`, which is the previous application and does not run agents on your machine.

The application runs natively on Windows, in PowerShell. The Windows Subsystem for Linux, version 2, is an option you can configure later.

## Step 3: open the sample model

1. Download **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.
2. **Extract the archive** in a local folder, for example `C:\Demo`. Please, do not open the file directly from the compressed folder.
3. Open **ContosoDemo10k.pbix** in Power BI Desktop and leave Power BI Desktop open.

The title bar shows **ContosoDemo10k**. You use that name in step 6.

## Step 4: open the application and sign in

1. Start the **ChatGPT desktop application** from the Start menu.
2. Sign in with your ChatGPT account.
3. Open the folder of the sample, for example `C:\Demo`. The folder you open becomes the workspace of the session, and the agent writes only inside it.

Below the box where you write, the **Ask for approval** option controls the checkpoints. Keep it active for this setup.

The permission profiles are three: `read-only`, `workspace`, which allows the writes inside the folder you opened, and `danger-full-access`, which removes the limits. The second one is the profile of this setup.

## Step 5: register the Power BI Modeling MCP server

There is no extension to install. The server is an npm package, and the application starts it on demand.

1. Open **Settings**, then select **MCP servers**.
2. Select **Add server**.
3. Enter the name `powerbi-modeling-mcp`, choose **STDIO**, and write this command in the field of the dialog. It is not typed in the command prompt, the application runs it:

   Command to launch:
   - `C:\Program Files\nodejs\npx.cmd`

   Arguments (one argument per line):
      - `-y`
      - `@microsoft/powerbi-modeling-mcp@latest`
      - `--start`
      - `--readonly`
   
The `--readonly` argument blocks every write operation. We suggest it for the first session, so that a wrong prompt cannot modify anything. Step 8 replaces it.

The application writes the entry in `%USERPROFILE%\.codex\config.toml`, and you can edit that file directly:

```toml
[mcp_servers.powerbi-modeling-mcp]
command = "npx"
args = ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--readonly"]
startup_timeout_sec = 60
```

The default timeout is 10 seconds, and the first start of `npx` downloads the package, so raise it as in the example. Restart the server after an edit of the file.

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

Both answers arrive in a few seconds. The chain works: the ChatGPT desktop app, MCP server, Power BI Desktop.

## Step 8: enable the write operations

The session started in read-only mode, so the next prompt would fail. Remove the restriction:

1. Open **Settings > MCP servers**, select `powerbi-modeling-mcp`, and remove `--readonly` from the command. In the file, remove the same argument from the `args` array.
2. Select **File/Quit ChatGPT**.
3. Start ChatGPT desktop app and connect again, as in step 6.

Then send this prompt:

```text
Create a measure that returns the Sales Amount of the previous year using the same format of the original measure.
```

The measure appears in Power BI Desktop without a refresh. Each write operation raises a confirmation prompt, if **Ask for approval** is active. The same approach applies to bulk operations, like format strings and display folders on hundreds of objects in a single request.

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

The skill is part of the **powerbi-authoring** plugin of the [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) repository, published by Microsoft. The plugin contains five skills: semantic model authoring, report planning, report design, report authoring, and report management.

**Microsoft does not name this application in the compatibility list of the skills.** Two paths exist, and the first one depends on your role in the organization.

<!-- options -->
Choose one of the two paths.

**Path 1: import the marketplace.** The application accepts a marketplace published in the format of Claude Code, and the repository publishes exactly that format. In the administration of a Business or Enterprise workspace, open **Plugins > Add > Import marketplace**, enter the address of the repository, and authorize the access. This path is available to an administrator of the workspace, not to an individual account.

**Path 2: the skills folder.** The application discovers the skills in `%USERPROFILE%\.agents\skills`, in the same `SKILL.md` format used by the repository. Clone the repository and copy the folders, in the **command prompt**:

```text
git clone https://github.com/microsoft/skills-for-fabric.git C:\Demo\skills-for-fabric
```

```text
xcopy /E /I "C:\Demo\skills-for-fabric\plugins\powerbi-authoring\skills" "%USERPROFILE%\.agents\skills"
```

Please, verify the folder names in the repository before you copy, because the layout changes between versions. The repository also has a `skills` folder in its root, which contains all the skills of the collection. The five skills of the report layer are the ones in the folder of the plugin.
<!-- /options -->

Restart the application, and ask the agent to list the skills it can use.

The second path is not documented by Microsoft or by OpenAI, and it can stop working with any update of the repository. Treat it as a manual installation and verify the result on the sample before you use it on a model that matters.

## Step 12: connect the agent to the project

Open the folder that contains the `.pbip` file as the workspace of the session, so that the agent sees both the model folder and the report folder. Then send this prompt:

```text
Open semantic model from PBIP folder 'C:\Demo\ContosoDemo10k.SemanticModel'
```

The MCP server manages the semantic model folder. The authoring skill reads and writes the report folder as files.

## Step 13: create a report page

```text
Create a report page with a line chart showing Sales Amount by Quarter, and a card showing the Sales Amount of the last year that has data.
```

Then ask the agent to validate the report, which checks the structure of the PBIR files, and open the `.pbip` file in Power BI Desktop. Review the final result.

**NOTE: Save any manual change in Power BI Desktop before the agent iterates.** The agent reads the files on disk and does not see the unsaved state. Editing in both places at the same time loses one set of changes.

The examples in the documentation use cards, bar charts, clustered column charts, tables, KPI cards, and slicers, and the skill converts the legacy `card` and `matrix` visuals into the modern `cardVisual` and `pivotTable`. There is no published list of the supported visuals, so expect some trial and error. Q&A, Bing maps, and filled maps are announced for deprecation, and Microsoft recommends avoiding them.

## Configuration options

The command-line arguments of the MCP server go at the end of the command in the dialog of the application, or in the `args` array of the TOML section.

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

```toml
[mcp_servers.powerbi-modeling-mcp]
command = "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe"
args = ["--start"]
```

**If `npx` does not start on Windows**, use the command interpreter as the launcher, and declare the variables the server needs:

```toml
[mcp_servers.powerbi-modeling-mcp]
command = "cmd"
args = ["/c", "npx", "-y", "@microsoft/powerbi-modeling-mcp@latest", "--start"]
```

The `npx` command is a `.cmd` script on Windows, and a process that starts it without a shell can fail to find it. A server started by this application does not always inherit the variables of the user, so the absolute path of the executable is the most reliable form.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- The report authoring skill operates on **PBIP projects in PBIR format**, not on a `.pbix` file.
- Neither of them can do anything your permissions do not allow, because they operate with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model of the service you signed in to.
- The MCP server, the report authoring skill, and the Power BI Desktop Bridge are all **in preview**. Behavior and tools can change before general availability.
- The agent proposes and executes. The review is your responsibility.
- Some permission modes run the session without access to the network, and a server that calls a remote service fails in that mode.
- The report authoring skill has no self-service installation for an individual account. The paths of step 11 require an administrator, or a manual copy.

## Troubleshooting

**The Store installs the wrong application.**
Use the identifier `9PLM9XGG6VKS`. The identifier `9NT1R1C2HH7J` is ChatGPT Classic, the previous application.

**The MCP server does not appear in the list of tools.**
Open **Settings > MCP servers** and verify that the entry exists and is not disabled. Then verify that your plan includes MCP, and that your organization does not restrict the servers.

**The server times out at the start.**
Raise `startup_timeout_sec` in the TOML section. The default is 10 seconds, which is not enough for the first download of the package.

**The server does not start and the error mentions `npx` or a missing variable.**
A server started by this application does not always inherit the environment of the user. Use the `cmd` form, or the absolute path of the executable, as in the alternative installation methods.

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

Install Node.js, install the ChatGPT desktop app from the Microsoft Store, register the **Power BI Modeling MCP server** in the settings, open a model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Install the product with the identifier `9PLM9XGG6VKS`, not ChatGPT Classic.
- Open the folder of the project as the workspace, so that the writes stay inside it.
- Raise `startup_timeout_sec` when the server is started with `npx`.
- Register the server by its package name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- Open the folder of the project in the client, so that the model and the report are both visible to the agent.
- For the report layer, use PBIP with PBIR, and save in Power BI Desktop before the agent iterates.

## References

- [The Windows application](https://learn.chatgpt.com/docs/windows/windows-app): the installation and the requirements on Windows.
- [MCP servers](https://learn.chatgpt.com/docs/extend/mcp): the dialog of the application and the configuration file.
- [Configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference): every key accepted in `config.toml`.
- [Permissions](https://learn.chatgpt.com/docs/permissions): the three profiles and the workspace roots.
- [Skills](https://learn.chatgpt.com/docs/build-skills): the `SKILL.md` format and the folders where the skills are discovered.
- [Plans](https://learn.chatgpt.com/docs/pricing): the plans that include the agent and MCP.
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
