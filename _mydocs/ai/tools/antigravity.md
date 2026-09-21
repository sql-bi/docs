---
layout:      page
title:       "Set up Google Antigravity for agentic development with Power BI Desktop"
menu_title:  "Google Antigravity"
description: "How to configure Google Antigravity, the Power BI Modeling MCP server, and the Power BI report authoring skill to modify a semantic model and a report with an AI agent."
published:   true
order:       /50
modified:    2026-09-13
---
*This article describes how to configure Google Antigravity so that an AI agent can read and modify a Power BI semantic model open in Power BI Desktop, and the report of a Power BI project.*

The only requirement we assume is **Power BI Desktop**, already installed. Everything else is part of this setup.

Sample model used in all the steps: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**. Please, download it before you start.

At the end you have an agent in a desktop application that reads and writes the semantic model, and that also creates and validates report pages.

Antigravity is the agentic development platform of Google. It ships as several products: the desktop application, a command-line client, a software development kit, and the extensions for the other editors. This article covers the **desktop application**, because it has a panel for the MCP servers that makes the state of the connection visible.

One point deserves attention from the beginning, because it produces a silent failure: Antigravity is a desktop application, started from the Start menu, and it does not inherit the `PATH` of your command prompt. When a server does not connect, the way the command is launched is usually the reason, not the configuration.

## Requirements

- **Power BI Desktop**, installed.
- **[Node.js](https://nodejs.org/en/download) 22 or later**. The Power BI Modeling MCP server is started with `npx`, which is part of Node.js. Antigravity does not need it for itself. A new machine does not have it, so step 1 installs it.
- **Windows 10, 64 bit, or later**, on an x64 or an ARM64 processor.
- A **personal Google account**. Antigravity signs you in with an account of the `@gmail.com` domain, in the countries where it is available, and it is not available below 18 years of age. An account of Google Workspace is not the documented path, and the [FAQ](https://antigravity.google/docs/faq) suggests a personal account when the sign-in fails. The free use has weekly rate limits, and the subscriptions Google AI Pro and Google AI Ultra raise them. Check the [plans page](https://antigravity.google/docs/plans) before you start.
- **[Git for Windows](https://git-scm.com/downloads/win)**. The repository of the skills is downloaded with `git`, and Windows does not include it. Step 11 installs it.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Modeling MCP server** runs on your machine and connects to Power BI Desktop like an external tool. Antigravity is the client that hosts the agent, and it starts the server as a local process.

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

A version manager deserves one more remark here. Antigravity starts the MCP server from a desktop application, not from your terminal, and a version manager that publishes Node.js only in the profile of the shell is invisible to that application. In that case use the absolute path of the executable, as in the alternative installation methods at the end of this article.

## Step 2: install Antigravity

There is no Microsoft Store version.

<!-- options -->
Choose one of the two methods.

**Option 1: the download page.** Open [antigravity.google/download](https://antigravity.google/download), which offers **Download for x64** and **Download for ARM64**, and run the installer. Choose the entry of **Antigravity**, the desktop application, and not the command-line client or the extensions for the other editors.

**Option 2: WinGet.** In the **command prompt**:

```text
winget install -e --id Google.Antigravity
```
<!-- /options -->

Please, use the identifier `Google.Antigravity`. The repository contains two more packages of the same family, `Google.AntigravityIDE`, which is the standalone editor, and `Google.AntigravityCLI`, which is the command-line client. They are different products, and the panels named in this article belong to the desktop application. The command `winget search Google.Antigravity` lists the three, with the version of each one.

The download page does not mention WinGet, and the two channels can offer different versions. When they diverge, the download page is the documented method.

Windows SmartScreen can block the installer, because it is recent. Select **More info** and then **Run anyway**.

Antigravity drives Google Chrome for the tools that operate on a browser. That part is not used in this setup, so Chrome is not a requirement of this article.

## Step 3: open the sample model

1. Download **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.
2. **Extract the archive** in a local folder, for example `C:\Demo`. Please, do not open the file directly from the compressed folder.
3. Open **ContosoDemo10k.pbix** in Power BI Desktop and leave Power BI Desktop open.

The title bar shows **ContosoDemo10k**. You use that name in step 6.

<video src="videos/AIsetup-CopyContosoDemo.mp4" 
 autoplay loop muted width="500"></video>

## Step 4: open the application and sign in

1. Start **Antigravity** from the Start menu.
2. Sign in with your Google account. The browser opens, you authenticate, and the control returns to the application.
3. Create a **Project** on the folder of the sample, for example `C:\Demo`.

A Project is the configuration of the folders that define the environment of the agent, and it can contain more than one folder. The agent reads and writes inside those folders, so the folder of the model and the folder of the report have to be part of the Project. This is the second reason for which the agent appears to do nothing: it is not blocked, it does not see the files.

The permissions of an operation are evaluated on three lists, **Deny**, **Ask**, and **Allow**, in this order of precedence. The tools of an MCP server are in **Ask** by default, so each call waits for your confirmation. Keep that default for this setup.

How much the agent does without asking is decided in **Settings**, page **General**, section **Agent Settings**. The control at the top, **Security Preset**, chooses a level of autonomy, and the value **Custom** reveals the settings that compose it:

- **Outside of folders file access policy** decides what happens when the agent reaches a file outside the folders of the Project. Inside them it reads and writes without asking, which is the reason for which step 12 adds the folder of the report.
- **Terminal Command Auto Execution** decides whether a command of the agent waits for your approval. **Request Review** asks every time, **Always Proceed** does not.
- **Enable Sandbox Mode (Preview)** restricts the tools of the agent to an isolated local sandbox.
- **Tool Permissions**, with the button **Open**, is where the three lists are edited, for the files, for the terminal, and for the MCP tools.

Keep the confirmations of the commands while you work on the model, and read step 13 before you start on the report, because that is where they become expensive.

## Step 5: register the Power BI Modeling MCP server

There is no extension to install. The server is an npm package, and Antigravity starts it on demand.

Antigravity has a store that installs some servers with one click, in **Settings > Customizations > Installed MCP Servers**, with the button **Add MCP**. At the time of writing the Power BI Modeling MCP server is not among them, so you write the entry in the configuration file.

Antigravity reads two files: `%USERPROFILE%\.gemini\config\mcp_config.json`, which applies to every Project, and `.agents\mcp_config.json` in the folder of the project, which wins over the first one. We use the file of the user, which serves the desktop application, the command-line client, and the extensions, all at once.

1. Press **Open MCP Config** to open `%USERPROFILE%\.gemini\config\mcp_config.json` in the Antigravity editor. Create the file, and the folders, if they do not exist.
2. Write this content:

   ```json
   {
     "mcpServers": {
       "powerbi-modeling-mcp": {
         "command": "npx",
         "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--readonly"],
         "disabled": false
       }
     }
   }
   ```

3. Save the file, open **Settings > Customizations > Installed MCP Servers**, and select the **Refresh** button.

The `--readonly` argument blocks every write operation. We suggest it for the first session, so that a wrong prompt cannot modify anything. Step 8 replaces it.

**If the server does not connect**, the reason is almost always that the application does not find `npx`. On Windows `npx` is a `.cmd` script, and a process that starts it without a shell does not resolve it. Use the command interpreter as the launcher:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--readonly"],
      "disabled": false
    }
  }
}
```

The panel of the servers shows the state of each one, the toggle that enables it, and the trash can that removes it. The `disabledTools` property, an array of names, hides single tools of a server from the model, and `disabled` turns off the whole server without removing the entry.

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

Both answers arrive in a few seconds. The chain works: Antigravity, MCP server, Power BI Desktop.

## Step 8: enable the write operations

The session started in read-only mode, so the next prompt would fail. Remove the restriction:

1. Open **Settings > Customizations > Installed MCP Servers** and press **Open MCP Config** to open the file `%USERPROFILE%\.gemini\config\mcp_config.json` again.
2. Remove `"--readonly"` from the `args` array and save.
3. Select the refresh button in **Settings > Customizations > Installed MCP Servers**, then connect again, as in step 6.

Then send this prompt:

```text
Create a measure that returns the Sales Amount of the previous year using the same format of the original measure.
```

The measure appears in Power BI Desktop without a refresh. Each write operation raises a confirmation prompt. The same approach applies to bulk operations, like format strings and display folders on hundreds of objects in a single request.

When the confirmations become too many, the permissions accept a pattern instead of an answer at a time. Open them in **Settings**, page **General**, section **Agent Settings**, with the button **Open** of **Tool Permissions**: `mcp(powerbi-modeling-mcp/*)` covers every tool of this server, and `mcp(powerbi-modeling-mcp/<tool>)` covers one of them. Moving that pattern to the **Allow** list removes the checkpoint, so keep it in **Ask** while you learn what the agent does.

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

**Antigravity is not named in the compatibility list of Microsoft**, and it has no command that installs a plugin from that marketplace. Antigravity has its own agent skills, in the same `SKILL.md` format, so the installation is manual and it is a copy of folders.

Clone the repository, in the **command prompt**:

```text
git clone https://github.com/microsoft/skills-for-fabric.git C:\Demo\skills-for-fabric
```

Then copy the folders of the skills where Antigravity discovers them, `%USERPROFILE%\.gemini\config\skills` for every Project, or `.agents\skills` in the folder of the project for the current one, in the **command prompt**:

```text
xcopy /E /I "C:\Demo\skills-for-fabric\plugins\powerbi-authoring\skills" "%USERPROFILE%\.gemini\config\skills"
```

Please, verify the folder names in the repository before you copy, because the layout changes between versions. The repository also has a `skills` folder in its root, which contains all the skills of the collection. The five skills of the report layer are the ones in the folder of the plugin. Each skill is a folder with a `SKILL.md` file, whose front matter declares a `description`, and a `name` that defaults to the name of the folder.

The guidance of the repository is a different thing from the skills. Microsoft publishes it in an `AGENTS.md` file in the root of the repository, and Antigravity reads the rules in `%USERPROFILE%\.gemini\GEMINI.md` for every Project, and in the folder `.agents\rules` of the project. Copy the content you want in one of those files. Each rules file is limited to 12,000 characters, so keep the part that concerns the report layer instead of the whole document.

Restart Antigravity, then ask the agent to list the skills it can use, so that you see the five names before you send a prompt that needs them.

This combination is not documented by Microsoft or by Google, and it can stop working with any update of the repository. Treat it as a manual installation and verify the result on the sample before you use it on a model that matters.

## Step 12: connect the agent to the project

Add the folder that contains the `.pbip` file to the Project, so that the agent sees both the model folder and the report folder. A Project spans more than one folder, so the folder of the sample and the folder of the skills can both be part of it.

Then send this prompt:

```text
Open semantic model from PBIP folder 'C:\Demo\ContosoDemo10k.SemanticModel'
```

The MCP server manages the semantic model folder. The authoring skill reads and writes the report folder as files.

## Step 13: create a report page

Before this step, relax the security settings. A report page is not a single operation: the skill writes the JSON files of the report, runs `powerbi-report-author` to validate them, and calls the Power BI Desktop Bridge to reload the project and to capture a screenshot, and it repeats the sequence at every iteration. With a confirmation at every command, one page costs a dozen of them, and the agent waits at each one.

In **Settings**, page **General**, section **Agent Settings**, set **Security Preset** to **Custom**, which reveals the settings that compose it, and set **Terminal Command Auto Execution** to **Always Proceed**. The presets that remove every confirmation at once exist, and they are more than this step needs: what costs time here is the approval of the commands, and the tools of the MCP server can stay in **Ask**.

The two layers do not carry the same risk, and this is the reason for which we relax one and not the other. The report is a set of files in a PBIP project, so a wrong iteration is undone with `git checkout` when the folder is under source control, which is the reason for the baseline commit of step 10. A write on the semantic model, instead, reaches Power BI Desktop immediately, and the confirmation is the only checkpoint before it. Put **Terminal Command Auto Execution** back on **Request Review** when you return to the model.

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

For the service principal authentication, set `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the `env` object of the entry, with either `AZURE_CLIENT_SECRET` or `AZURE_CLIENT_CERTIFICATE_PATH`. The syntax `${VAR_NAME}` reads a variable of the environment, so a secret does not end in the file.

On a model that matters, run the first session with **`--readonly`**, as in step 5.

## Alternative installation methods

**Manual installation.** Download the VSIX package of the Visual Studio Code extension of the MCP server, rename it with the `.zip` extension, extract it, and configure the path of the executable. This avoids the download that `npx` performs at every start, and it is also the answer when the application does not find `npx`, or when Node.js is installed by a version manager that publishes it only in the profile of the shell:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "command": "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe",
      "args": ["--start"],
      "disabled": false
    }
  }
}
```

The documentation of Antigravity asks for the absolute path of the executable in the `command` property, and this form respects it.

**The command interpreter as the launcher.** The form with `cmd` of step 5 keeps the download of `npx`, and it solves the same problem without a manual extraction:

```json
{
  "mcpServers": {
    "powerbi-modeling-mcp": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@microsoft/powerbi-modeling-mcp@latest", "--start"],
      "disabled": false
    }
  }
}
```

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- The report authoring skill operates on **PBIP projects in PBIR format**, not on a `.pbix` file.
- Neither of them can do anything your permissions do not allow, because they operate with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model of the service you signed in to. The collection of the data is refused in the Settings panel.
- The MCP server, the report authoring skill, and the Power BI Desktop Bridge are all **in preview**. Behavior and tools can change before general availability.
- The agent proposes and executes. The review is your responsibility.
- Antigravity signs in with a **personal Google account**, in the countries where it is available, and the free use has weekly rate limits that depend on the work the agent does, not on the number of the prompts.
- The agent reads and writes inside the folders of the Project. A folder that is not part of it is not visible, and no message says so.
- Run the MCP server natively on Windows. A server started through the Windows Subsystem for Linux adds a translation of the paths that the Power BI tools do not expect.
- The report authoring skill has no marketplace installation for Antigravity. The manual path of step 11 is not covered by the documentation of Microsoft or of Google.

## Troubleshooting

**The MCP server does not appear in the list of tools.**
Open **Settings > Customizations > Installed MCP Servers**, verify that the toggle of the server is on and that `disabled` is `false`, then select the refresh button.

**The server does not start, or the message contains `spawn npx ENOENT`.**
Antigravity does not find `npx`, because a desktop application does not inherit the path of your command prompt, and because `npx` is a `.cmd` script on Windows. Use the form with `cmd` of step 5, or the absolute path of the executable of the alternative installation methods.

**The agent asks a confirmation at every command while it writes the report.**
That is **Terminal Command Auto Execution** on **Request Review**, and the skill runs several commands per iteration. Set **Security Preset** to **Custom** and that setting to **Always Proceed**, as in step 13, then put it back when you return to the model.

**The agent does not see the files of the project.**
The folder is not part of the Project. Add it, in the configuration of the folders of the Project, and send the prompt again. See step 4.

**A skill does not appear.**
Verify the position of the folders, `%USERPROFILE%\.gemini\config\skills` or `.agents\skills` in the project, and that each folder contains a `SKILL.md` file with a `description` in its front matter. Restart Antigravity after the copy.

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
Install the two command-line tools of step 11, `@microsoft/powerbi-report-authoring-cli` and `@microsoft/powerbi-desktop-bridge-cli`, then restart Antigravity, so that it reads the updated path.

**The report authoring skill does not modify the report.**
It requires PBIP in PBIR format. Verify both preview features and save the project again, because enabling PBIR does not convert a project already saved.

**The report changes do not appear in Power BI Desktop.**
Reload the project. Power BI Desktop shows the version loaded before. Verify the preview option of the Power BI Desktop Bridge, so that the agent reloads the project without your intervention.

**The agent modifies objects you did not mention.**
Name the objects explicitly. For example, "add display folders to the measures in the Sales table" instead of "apply the best practices".

**The session stops before the work is finished.**
The free use has weekly rate limits, and a long agentic task consumes more than a short prompt. Check the [plans page](https://antigravity.google/docs/plans).

## Conclusions

Install Node.js, install Antigravity, declare the **Power BI Modeling MCP server** in `mcp_config.json`, create a Project on the folder of the model, open the model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Start the server with `cmd /c`, or with the absolute path of the executable, when it does not connect. A desktop application does not inherit the path of your terminal.
- Keep the tools of the MCP server in **Ask**, so that every call of a tool is visible.
- Relax the security settings for the report layer, where a baseline commit undoes a wrong iteration, and not for the semantic model, where the confirmation is the only checkpoint.
- Register the server in the file of the user, so that it does not depend on the configuration of the project.
- Register the server by its package name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- Put the folder of the project in the Project of Antigravity, so that the model and the report are both visible to the agent.
- For the report layer, use PBIP with PBIR, and save in Power BI Desktop before the agent iterates.

## References

- [Antigravity download](https://antigravity.google/download): the desktop application, the command-line client, and the extensions, with the system requirements.
- [Getting started](https://antigravity.google/docs/getting-started): the products, the first Project, and the first agent.
- [Projects](https://antigravity.google/docs/projects/): the folders that define what the agent sees.
- [MCP](https://antigravity.google/docs/mcp/): the configuration files, the JSON schema, every property, and the store of the servers.
- [Skills](https://antigravity.google/docs/skills/): the `SKILL.md` format and the folders where the skills are discovered.
- [Rules](https://antigravity.google/docs/rules-workflows/): the files of the rules, their position, and their limit of characters.
- [Permissions](https://antigravity.google/docs/permissions/): the lists Deny, Ask, and Allow, and the patterns of the MCP tools.
- [Plans](https://antigravity.google/docs/plans): the free use, the rate limits, and the subscriptions.
- [FAQ](https://antigravity.google/docs/faq): the accounts and the countries where Antigravity is available.
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
