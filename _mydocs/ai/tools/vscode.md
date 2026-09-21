---
layout:      page
title:       "Set up VS Code for agentic development with Power BI Desktop"
menu_title:  "Visual Studio Code"
description: "How to configure Visual Studio Code and the Power BI Modeling MCP server to modify a semantic model with an AI agent."
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
- A **GitHub Copilot plan that includes agent mode and MCP**. If you sign in without a subscription, you are enrolled in **Copilot Free**, which currently does not include agent mode and MCP. Check the [plans page](https://docs.github.com/en/copilot/get-started/plans) before you start.
- **Write permission** on any semantic model you modify. The MCP server follows the same rules as the Power BI external tools.

MCP stands for Model Context Protocol. The **Power BI Modeling MCP server** runs on your machine and connects to Power BI Desktop like an external tool. The chat panel of Visual Studio Code hosts the agent, and it requires no separate installation.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.

## Step 1: install Visual Studio Code

Install from the **Microsoft Store** on Windows, which requires no administrator rights, or download it from [code.visualstudio.com](https://code.visualstudio.com/).

Launch Visual Studio Code. The **chat panel** is already available. There is no chat extension to install.

## Step 2: install the Power BI Modeling MCP server

1. Open the **Extensions** view with `Ctrl+Shift+X`.
2. Search for **Power BI Modeling MCP Server**, published by Microsoft. The identifier is `analysis-services.powerbi-modeling-mcp`.
3. Install it.
4. **Switch to Pre-release Version**  in the extension settings to get the last updates; in that case, **Restart Extensions** after the installation.

The extension registers the MCP server. There is no separate download, no runtime, and no configuration file to write.

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

The report layer requires a different tool, the **Power BI report authoring skill**, with two conditions:

- It works only on **PBIP** files in **PBIR** format, and it cannot modify a `.pbix` file. PBIP stands for Power BI Project, PBIR for Power BI enhanced report format.
- It is **not available in Visual Studio Code today**. See the third part below.

### Enable the two preview features

In Power BI Desktop, open **File > Options and settings > Options > Preview features** and enable both:

- **Power BI Project (.pbip) save option**
- **Store reports using enhanced metadata format (PBIR)**

Restart Power BI Desktop.

### Save the sample as a project

Use **File > Save as** and choose the **Power BI Project (\*.pbip)** file type. Power BI Desktop creates this structure:

```text
ContosoDemo10k.pbip
ContosoDemo10k.SemanticModel/
ContosoDemo10k.Report/
.gitignore
```

The model is a set of **TMDL** files (Tabular Model Definition Language) and the report is a set of JSON files. Put the folder under source control and commit a baseline, so to undo a wrong operation with one command.

### Obtain the report authoring skill

The skill is part of the **powerbi-authoring** plugin, published in the [skills-for-fabric](https://github.com/microsoft/skills-for-fabric) marketplace by Microsoft, together with a report design skill and a report planner skill.

**The Visual Studio Code path stops here.** A search for `@agentPlugins fabric` in the Extensions view returns only the **fabric-skills** bundle published by github/copilot-plugins. The powerbi-authoring plugin is not offered there, and what is available does not work well with Fabric.

Report authoring requires **GitHub Copilot CLI**, or another client that supports these skills, like Claude Code, Cursor, Codex, or Windsurf. Please, check the Agent Plugins view again before assuming this is still accurate.

## Configuration options

Settings are available under `@ext:Microsoft.powerbi-modeling-mcp`, and as command-line arguments for a manual configuration.

| Option | Default | Description |
|---|---|---|
| `--start` | required | Starts the server. |
| `--readwrite` | enabled | Allows write operations, each one with a confirmation. |
| `--readonly` | | Blocks all the write operations. |
| `--skipconfirmation` | | Removes the confirmation prompts. |
| `--compatibility` | `PowerBI` | Set it to `Full` for Analysis Services databases. |
| `--authmode` | `interactive` | Set it to `serviceprincipal` for unattended scenarios. |

For the service principal authentication, set `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` in the environment, with either `AZURE_CLIENT_SECRET` or `AZURE_CLIENT_CERTIFICATE_PATH`.

On a model that matters, run the first session with **`--readonly`**.

## Alternative installation methods

**NPX**, the Node package executor, requires Node.js 20.0 or later:

```json
{
  "powerbi-modeling-mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start"]
  }
}
```

**Manual installation.** Download the VSIX package, rename it with the `.zip` extension, extract it, and configure the path:

```json
{
  "powerbi-modeling-mcp": {
    "type": "stdio",
    "command": "C:\\MCPServers\\PowerBIModelingMCP\\extension\\server\\powerbi-modeling-mcp.exe",
    "args": ["--start"],
    "env": {}
  }
}
```

In Visual Studio Code, the MCP servers are configured in `.vscode/mcp.json` for a workspace, or in the file opened by the **MCP: Open User Configuration** command. Commit the workspace file to share one configuration in a team.

The server communicates over stdio, so any MCP client can run it with the NPX configuration. Visual Studio Code and Copilot are required only for the extension.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- It cannot do anything your permissions do not allow, because it operates with your identity.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model used by your client.
- The MCP server and the report authoring skill are both **in preview**. Behavior and tools can change.
- The agent proposes and executes. The review is your responsibility.

## Troubleshooting

**The MCP server does not appear in the list of tools.**
Run **MCP: List Servers** from the Command Palette with `Ctrl+Shift+P`. Then verify, in this order: the chat panel is in **Agent** mode, your Copilot plan includes MCP, your organization has enabled MCP servers in the Copilot policy.

**Cannot connect to Power BI Desktop.**
The file must be open, and the name in the prompt must match the title bar: `ContosoDemo10k`, not `ContosoDemo10k.pbix`. After a restart of Power BI Desktop the port changes. Connect again.

**The write operations are rejected.**
You need write permission on the model, and the server must not run with `--readonly`.

**The report authoring skill is not available in Visual Studio Code.**
Use GitHub Copilot CLI or another client that supports these skills.

**The report authoring skill does not modify the report.**
It requires PBIP in PBIR format. Verify both preview features and save the project again, because enabling PBIR does not convert a project already saved.

**The report changes do not appear in Power BI Desktop.**
Reload the project. Power BI Desktop shows the version loaded before.

**The agent modifies objects you did not mention.**
Name the objects explicitly. For example, "add display folders to the measures in the Sales table" instead of "apply the best practices".

## Conclusions

Install Visual Studio Code, install the **Power BI Modeling MCP Server** extension, open a model in Power BI Desktop, connect with one prompt.

These are the rules we suggest applying:

- Install the extension by its name, instead of asking the agent to find it.
- Verify the connection with a read-only prompt before any change.
- Keep a backup of the model, or work on a PBIP project under source control.
- Read the confirmation prompts.
- Use `--readonly` for the first session on a model that matters.
- Do not write the connection port in a script.
- For the report layer, use PBIP with PBIR and a client that supports the authoring skill.

## References

- [ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip): the sample model used in this article.
- [What are the Power BI MCP servers?](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview): the comparison between the local and the remote server.
- [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp): repository, configuration reference, and the complete list of tools.
- [Power BI Modeling MCP Server](https://marketplace.visualstudio.com/items?itemName=analysis-services.powerbi-modeling-mcp): the extension in the Visual Studio Marketplace.
- [Power BI report authoring skill](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview): what the skill does and its limits.
- [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric): the marketplace that publishes the skill.
- [Power BI Desktop projects (PBIP)](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-overview): how to save a project and the folder structure.
- [Power BI Desktop project report folder](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report): the PBIR format and the preview settings.
- [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup): the sign-in process.
- [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans): the plans that include agent mode and MCP.

*The content of this article was verified in September 2026, with version 0.5.13 of the extension. Version numbers, preview settings, and plan boundaries change over time, so the linked documentation is the authority.*
