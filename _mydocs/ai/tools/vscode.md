---
layout:      page
title:       "Set up VS Code for agentic development with Power BI Desktop"
menu_title:  "Visual Studio Code"
description: "How to configure Visual Studio Code and the Power BI Authoring MCP server to modify a semantic model with an AI agent."
published:   true
order:       /30
modified:    2026-09-08
---
*This article describes how to configure Visual Studio Code so that an AI agent can read and modify a Power BI semantic model open in Power BI Desktop.*

The only requirement we assume is **Power BI Desktop**, already installed. Everything else is part of this setup.

Sample model used in all the steps: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**. Please, download it before you start.

## Requirements

- **Power BI Desktop**, installed.
- A **GitHub account**. Free to create. Step 4 asks for it.
- A **GitHub Copilot plan**. Every plan includes agent mode and MCP. If you sign in without a subscription, you are enrolled in **Copilot Free**, which includes them with a limited allowance of GitHub AI Credits and automatic model selection only. Check the [plans page](https://docs.github.com/en/copilot/get-started/plans) before you start.
- **Acceptance of the [license terms](https://go.microsoft.com/fwlink/?LinkId=2381247) of the Power BI Authoring MCP server**, once. Version 1.0 and later require it. The extension accepts them by default, as step 2 explains.
- **Git**, only for the report layer. Visual Studio Code uses Git to download the report authoring skill. The section [Install the report authoring skill](#install-the-report-authoring-skill) shows how to install it.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Authoring MCP server** runs on your machine and connects to Power BI Desktop like an external tool. The chat panel of Visual Studio Code hosts the agent, and it requires no separate installation.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.

## Step 1: install Visual Studio Code

Install from the **Microsoft Store** on Windows, which requires no administrator rights, or download it from [code.visualstudio.com](https://code.visualstudio.com/).

Launch Visual Studio Code. The **chat panel** is already available. There is no chat extension to install.

## Step 2: install the Power BI Authoring MCP server

1. Open the **Extensions** view with `Ctrl+Shift+X`.
2. Search for **Power BI Authoring MCP Server**, published by Microsoft. The identifier is `analysis-services.powerbi-modeling-mcp`.
3. Install it.

Use the release version. Version 1.0.0 is newer than all the pre-release versions. Select **Switch to Pre-release Version** only when a pre-release has a higher version number than the release. In that case, select **Restart Extensions** after the change.

The extension registers the MCP server. There is no separate download, no runtime, and no configuration file to write.

The extension starts the server with the arguments of its `args` setting. The default value is `--start --accept-eula`. The `--accept-eula` argument, also written `--accepteula`, accepts the [license terms](https://go.microsoft.com/fwlink/?LinkId=2381247) of the server. Version 1.0 and later of the server require this acceptance before the first use. To review and accept the license terms in the chat, remove the argument from the setting. Step 4 shows how.

**If your organization manages Copilot centrally**, an administrator must enable the MCP servers option in the Copilot policy settings on github.com. Until then, the extension installs and provides no tools.

## Step 3: open the sample model

1. Download **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.
2. **Extract the archive** in a local folder, for example `C:\Demo`. Please, do not open the file directly from the compressed folder.
3. Open **ContosoDemo10k.pbix** in Power BI Desktop and leave Power BI Desktop open.

The title bar shows **ContosoDemo10k**. You use that name in the next step.

<video src="videos/AIsetup-CopyContosoDemo.mp4" 
 autoplay loop muted width="500"></video>

## Step 4: connect the agent

1. Open the **chat panel** and set the mode selector to **Agent**. In Ask mode the MCP server is never used.
2. Send this prompt:

```text
Connect to 'ContosoDemo10k' in Power BI Desktop
```

This first prompt triggers the **GitHub sign-in**. A browser window opens, you sign in, and the control returns to Visual Studio Code.

The answer reports the model name and an active connection.

The first connection and the first write operation raise a **confirmation prompt** each. Read them: they are the only checkpoint before a change.

The server also provides the built-in prompt `ConnectToPowerBIDesktop`, available by typing `/` in the chat box.

{% include ai/mcp-eula-connect-note.md %}

## Step 5: verify the connection

```text
List the tables and their row counts
Show me the relationships in the model
```

Both answers arrive in a few seconds. The chain works: Visual Studio Code, agent mode, MCP server, Power BI Desktop.

## Step 6: modify the model

```text
Create a measure that returns the Sales Amount of the previous year using the same format of the original measure.
```

The measure appears in Power BI Desktop without a refresh. The same approach applies to bulk operations, like format strings and display folders on hundreds of objects in a single request.

## Manipulating reports in Power BI

The report layer requires a different tool, the **Power BI report authoring skill**. It works only on **PBIP** files in **PBIR** format, and it cannot modify a `.pbix` file. PBIP stands for Power BI Project, PBIR for Power BI enhanced report format.

### Save the sample as a project

PBIP and PBIR are generally available, and PBIR is the default report format. They do not require a preview feature.

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
 
### Install the report authoring skill

The skill is part of the **powerbi-authoring** plugin, published by Microsoft in the [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) repository. The plugin contains two skills: `semantic-model-authoring` and `powerbi-report-cli`. The second one covers report planning, design, authoring, and management.

The installation has four parts: the command-line tools, Git, the Microsoft marketplace, and the plugin.

**Install the command-line tools.** The skills call two command-line tools. These tools require **Node.js** 20.0 or later. If Node.js is not installed, follow step 1 of the [GitHub Copilot CLI guide](github-copilot-cli.md). Then install the tools in a terminal:

```text
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

**Install Git.** Visual Studio Code uses Git to download the plugin from its marketplace. Without Git, the installation of the plugin fails.

1. Open a terminal and run `git --version`. If the command shows a version number, Git is installed. Go to the next part.
2. Download [Git for Windows](https://git-scm.com/download/win) and install it. Keep the default options, which add Git to the `PATH`. As an alternative, run `winget install --id Git.Git -e` in a terminal.
3. Close all the windows of Visual Studio Code, then open Visual Studio Code again. Visual Studio Code reads the `PATH` only when it starts.

**Add the Microsoft marketplace.** By default, Visual Studio Code searches the plugins in the **copilot-plugins** and **awesome-copilot** marketplaces of GitHub. The search does not show the powerbi-authoring plugin until you add the **skills-for-fabric** marketplace of Microsoft.

1. Open the **Settings** editor with `Ctrl+,`.
2. Search for `chat.plugins.enabled` and verify that the setting is checked.
3. Search for `chat.plugins.marketplaces`.
4. Select **Add Item**, enter `microsoft/skills-for-fabric`, and select **OK**.

To edit the settings file instead, run **Preferences: Open User Settings (JSON)** from the Command Palette. Add this entry. If the setting already exists, add the string to its list.

```json
"chat.plugins.marketplaces": [
    "microsoft/skills-for-fabric"
]
```

**Install the plugin.**

1. Open the **Extensions** view with `Ctrl+Shift+X`.
2. Enter `@agentPlugins powerbi` in the search field.
3. Select **powerbi-authoring** and select **Install**.
4. The first time you install a plugin from a marketplace, Visual Studio Code shows a trust prompt. Review the source and confirm.

You can also install the plugin from the Agent Customizations editor: run **Chat: Open Customizations** from the Command Palette, or select the gear icon in the Chat view, then select **Plugins** > **Browse Marketplace**.

Type `/skills` in the chat input. The list includes the two skills of the plugin.

**The plugin registers its own copy of the MCP server**, with the name `powerbi-modeling-mcp`. This copy starts with `npx` and does not include `--accepteula`. The extension of step 2 already provides the server. Run **MCP: List Servers** from the Command Palette and verify which servers are active. If the plugin copy is active, accept the license terms in the chat, as step 4 shows.

The skill also uses the **Power BI Desktop Bridge**, which is enabled by default. In Power BI Desktop, open **File > Options and settings > Options > Security** and, under **Desktop Bridge**, verify that **Enable external tool access to Power BI Desktop through secure local APIs** is checked. The skill uses it to reload the project and to capture a screenshot of a page.

### Create a report page

Open the folder that contains the `.pbip` file with **File > Open Folder**, so that the agent sees both the model folder and the report folder. In **Agent** mode, send this prompt:

```text
Open semantic model from PBIP folder 'C:\Demo\ContosoDemo10k.SemanticModel'
```

Then ask for a page:

```text
Create a report page with a line chart showing Sales Amount by Quarter, and a card showing the Sales Amount of the last year that has data.
```

Ask the agent to validate the report, and open the `.pbip` file in Power BI Desktop. **Save any manual change in Power BI Desktop before the agent iterates.** The agent reads the files on disk and does not see the unsaved state.

## Configuration options

Settings are available under `@ext:Microsoft.powerbi-modeling-mcp`, and as command-line arguments for a manual configuration. The extension has two settings: `args`, with the command-line arguments, and `environmentVariables`, with comma-separated `KEY=value` pairs. The default of `args` is `--start --accept-eula`. If you change it, keep `--accept-eula`, or accept the license terms in the chat.

| Option | Default | Description |
|---|---|---|
| `--start` | required | Starts the server. |
| `--accepteula` | | Accepts the license terms of the server. Version 1.0 and later require the acceptance before the first use. |
| `--readwrite` | enabled | Allows write operations, each one with a confirmation. |
| `--readonly` | | Blocks all the write operations. |
| `--skipconfirmation` | | Removes the confirmation prompts. |
| `--compatibility` | `PowerBI` | Set it to `Full` for Analysis Services databases. |
| `--authmode` | `interactive` | Set it to `serviceprincipal` for unattended scenarios. |

For the service principal authentication, set `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the environment, with either `AZURE_CLIENT_SECRET` or `AZURE_CLIENT_CERTIFICATE_PATH`.

{% include ai/mcp-eula-config.md %}

On a model that matters, run the first session with **`--readonly`**.

## Alternative installation methods

**NPX**, the Node package executor, requires Node.js 20.0 or later:

```json
{
  "powerbi-modeling-mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--accepteula"]
  }
}
```

**Manual installation.** Download the VSIX package, rename it with the `.zip` extension, extract it, and configure the path:

```json
{
  "powerbi-modeling-mcp": {
    "type": "stdio",
    "command": "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe",
    "args": ["--start", "--accepteula"],
    "env": {}
  }
}
```

Visual Studio Code reads two formats of MCP configuration. Since version 1.143, new chat sessions use the **Copilot harness** by default, and this harness reads the portable format directly:

- `.mcp.json` in the root of the workspace.
- `%USERPROFILE%\.copilot\mcp-config.json` for your user. This is the same file that GitHub Copilot CLI uses.

These two files put the servers in a top-level `mcpServers` object. To write the user file, run **MCP: Add Server** from the Command Palette, select **Global**, and then select **Copilot Global**.

The older format is `.vscode/mcp.json` for a workspace, or the file opened by the **MCP: Open User Configuration** command. These files put the servers in a top-level `servers` object. Visual Studio Code forwards these servers to the Copilot harness, except the servers that use input variables such as `${input:...}`. The guided flow of **MCP: Add Server** labels these locations as deprecated.

Commit the `.mcp.json` file of the workspace to share one configuration in a team.

{% include ai/mcp-eula-snippet-note.md %}

The server communicates over stdio, so any MCP client can run it with the NPX configuration. Visual Studio Code and Copilot are required only for the extension.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- It cannot do anything your permissions do not allow, because it operates with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model used by your client.
- The local MCP server is **generally available**. The report authoring skill is newer, and its behavior and tools can still change.
- The agent proposes and executes. The review is your responsibility.

## Troubleshooting

{% include ai/mcp-eula-troubleshooting.md %}

**The MCP server does not appear in the list of tools.**
Run **MCP: List Servers** from the Command Palette with `Ctrl+Shift+P`. Then verify, in this order: the chat panel is in **Agent** mode, your Copilot plan includes MCP, your organization has enabled MCP servers in the Copilot policy.

**Cannot connect to Power BI Desktop.**
The file must be open, and the name in the prompt must match the title bar: `ContosoDemo10k`, not `ContosoDemo10k.pbix`. After a restart of Power BI Desktop the port changes. Connect again.

**The write operations are rejected.**
You need write permission on the model, and the server must not run with `--readonly`.

**The powerbi-authoring plugin does not appear in the Agent Plugins view.**
Add `microsoft/skills-for-fabric` to the `chat.plugins.marketplaces` setting, as [Install the report authoring skill](#install-the-report-authoring-skill) shows. Verify that the `chat.plugins.enabled` setting is on. Then search for `@agentPlugins powerbi` again.

**The installation of the plugin fails with `Failed to install plugin 'powerbi-authoring': spawn git ENOENT`.**
Visual Studio Code does not find Git. Install [Git for Windows](https://git-scm.com/download/win). Close all the windows of Visual Studio Code and open it again. Then install the plugin again. If Git is already installed, run `git --version` in a new terminal. If the command fails, add the `cmd` folder of Git, by default `C:\Program Files\Git\cmd`, to the `PATH`.

**The agent reports that a command is not available when it validates the report.**
Install the two command-line tools, `@microsoft/powerbi-report-authoring-cli` and `@microsoft/powerbi-desktop-bridge-cli`, then restart Visual Studio Code.

**The report authoring skill does not modify the report.**
It requires PBIP in PBIR format. Make a change in Power BI Desktop and save the project again. Power BI converts a project in the older PBIR-Legacy format to PBIR when you save it. Versions of Power BI Desktop released before September 2026 still require the **Power BI Project (.pbip) save option** and **Store reports using enhanced metadata format (PBIR)** preview features. Update Power BI Desktop, or enable these two preview features.

**The report changes do not appear in Power BI Desktop.**
Reload the project. Power BI Desktop shows the version loaded before. Verify the Desktop Bridge setting under **Options > Security**, so that the agent reloads the project without your intervention.

**The agent modifies objects you did not mention.**
Name the objects explicitly. For example, "add display folders to the measures in the Sales table" instead of "apply the best practices".

## Conclusions

Install Visual Studio Code, install the **Power BI Authoring MCP Server** extension, open a model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Install the extension by its name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- For the report layer, install Git and add the Microsoft marketplace before you search for the plugin.
- For the report layer, use PBIP with PBIR, and save in Power BI Desktop before the agent iterates.

## References

- [ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip): the sample model used in this article.
- [What are the Power BI MCP servers?](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview): the comparison between the local and the remote server.
- [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp): repository, configuration reference, and the complete list of tools.
- [Power BI Authoring MCP Server](https://marketplace.visualstudio.com/items?itemName=analysis-services.powerbi-modeling-mcp): the extension in the Visual Studio Marketplace.
- [Power BI report authoring skill](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview): what the skill does and its limits.
- [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric): the repository that publishes the skill.
- [Agent plugins in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-plugins): how to find, install, and manage plugins.
- [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration): the two configuration formats, and the servers that Visual Studio Code forwards to the Copilot harness.
- [Git for Windows](https://git-scm.com/download/win): the Git installer that Visual Studio Code requires to install a plugin.
- [Power BI Desktop projects (PBIP)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview): how to save a project and the folder structure.
- [Power BI Desktop project report folder](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report): the PBIR format and the conversion from PBIR-Legacy.
- [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup): the sign-in process.
- [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans): the plans that include agent mode and MCP.

*The content of this article was verified in September 2026, with version 0.5.13 of the extension. Version numbers, preview settings, and plan boundaries change over time, so the linked documentation is the authority.*
