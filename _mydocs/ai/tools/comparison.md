---
layout:      page
title:       "AI hosts for Power BI Desktop: a comparison"
menu_title:  "Comparison of the clients"
description: "How ten AI clients install on Windows, how each one registers the Power BI Modeling MCP server, and which of them can run the Power BI report authoring skill."
published:   true
order:       /00
modified:    2026-09-13
---
*This article compares the AI clients that connect to Power BI Desktop through the Power BI Modeling MCP server on Windows, to choose one before starting a setup.*

MCP stands for Model Context Protocol. The **Power BI Modeling MCP server** is the same npm package in every row of the tables below, `@microsoft/powerbi-modeling-mcp`, started with `npx` as a local process. What changes between the clients is how you declare it, how you approve what it does, and whether the client can also run the **Power BI report authoring skill**, which works on the report of a PBIP project. PBIP stands for Power BI Project.

All ten clients support a local MCP server on Windows. **Node.js** is a requirement in every row, because the server is started with `npx`.

## Installation and account

| Client | Microsoft Store | Other installation on Windows | Account |
|---|---|---|---|
| GitHub Copilot CLI | no | `npm install -g @github/copilot`, or `winget install GitHub.Copilot` | GitHub, with a plan that includes MCP |
| Visual Studio Code | **yes** | download from code.visualstudio.com, or `winget install Microsoft.VisualStudioCode` | GitHub, with a plan that includes agent mode and MCP |
| ChatGPT desktop app | **yes**, identifier `9PLM9XGG6VKS` | download from chatgpt.com | ChatGPT, paid plan |
| Codex CLI | no | installer of OpenAI, `winget install -e --id OpenAI.Codex`, or `npm install -g @openai/codex` | ChatGPT |
| Claude Code Desktop | no | download from claude.com, or `winget install -e --id Anthropic.Claude` | Claude, Pro or higher |
| Claude Code | no | installer of Anthropic, `winget install Anthropic.ClaudeCode`, or `npm install -g @anthropic-ai/claude-code` | Claude, Pro or higher |
| Google Antigravity | no | download from antigravity.google/download | personal Google account, free with weekly rate limits |
| Grok Build | no | installer of SpaceXAI, or `winget install xAI.GrokBuild` | SpaceXAI, plan that includes Grok Build |
| Kiro | no | download from kiro.dev | GitHub, Google, or AWS, free plan included |
| Qwen Code | no | installer of the project, or `npm install -g @qwen-code/qwen-code@latest` | paid key of a supported provider |

Two of the ten are published in the Microsoft Store. Six of them are on WinGet, and four are npm packages, so a machine without administrator rights installs most of them in the user profile.

## Registration of the MCP server

| Client | Command | Configuration file | Format |
|---|---|---|---|
| GitHub Copilot CLI | `copilot mcp add` | `%USERPROFILE%\.copilot\mcp-config.json` | JSON |
| Visual Studio Code | the extension registers the server | `.vscode\mcp.json`, or the file opened by **MCP: Open User Configuration** | JSON |
| ChatGPT desktop app | Settings, MCP servers, Add server | `%USERPROFILE%\.codex\config.toml` | TOML |
| Codex CLI | `codex mcp add` | `%USERPROFILE%\.codex\config.toml` | TOML |
| Claude Code Desktop | the Connectors panel | `%USERPROFILE%\.claude.json` | JSON |
| Claude Code | `claude mcp add` | `%USERPROFILE%\.claude.json` | JSON |
| Google Antigravity | the MCP Servers panel | `%USERPROFILE%\.gemini\config\mcp_config.json` | JSON |
| Grok Build | `grok mcp add` | `%USERPROFILE%\.grok\config.toml` | TOML |
| Kiro | the MCP Servers panel | `%USERPROFILE%\.kiro\settings\mcp.json` | JSON |
| Qwen Code | `qwen mcp add` | `%USERPROFILE%\.qwen\settings.json` | JSON |

Every client also reads a configuration of the project, in the folder you open, with a name that changes between them. The user scope is the simplest choice for a first setup, because it does not depend on the folder.

One difference is worth knowing before a long debugging session: **Google Antigravity does not inherit the path of your terminal**, because it is a desktop application, so a server declared with a bare `npx` can fail to start without a message that explains it. **Grok Build** goes in the opposite direction and also reads the MCP servers declared for Claude Code, so a server can be active without appearing in its own file.

## The report authoring skill

The report layer requires the **powerbi-authoring** plugin, published by Microsoft in the skills-for-fabric repository. Two clients install it with a command, the others need a manual copy of the skill folders.

| Client | Installation of the skill | Documented by Microsoft |
|---|---|---|
| GitHub Copilot CLI | `/plugin marketplace add` and `/plugin install` | yes |
| Visual Studio Code | not available today | the limit is documented |
| Claude Code | `/plugin marketplace add` and `/plugin install` | yes |
| Claude Code Desktop | the marketplace declared in the settings, then the plugin panel | partially |
| Grok Build | the marketplace of Claude Code, read without any setting | no |
| ChatGPT desktop app | import of the marketplace by an administrator, or copy in `.agents\skills` | no |
| Codex CLI | clone of the repository, and copy in `.agents\skills` | the clone, yes |
| Google Antigravity | copy in `.gemini\config\skills`, or in `.agents\skills` | no |
| Kiro | copy in `.kiro\skills` | no |
| Qwen Code | copy in `.qwen\skills` | no |

The skills use the same `SKILL.md` format in every client, which is why the manual copy works at all. The rows marked as not documented are combinations that nobody tests: they can stop working with any update of the repository.

Two tools complete the report layer in every client, and they are installed with npm:

```text
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

## How to choose

- **The shortest path to the report layer** is GitHub Copilot CLI or Claude Code, because the plugin installs with two commands and Microsoft documents them.
- **The shortest path to the semantic model only** is any of the ten. Visual Studio Code is the only one where the report authoring skill is not offered, and the prompt that connects to Power BI Desktop is the same everywhere.
- **On a managed machine without administrator rights**, prefer a client that installs in the user profile: the npm packages, the installers of Anthropic, OpenAI, and SpaceXAI, and the Microsoft Store version of the ChatGPT desktop app.
- **If you already use Claude Code**, Grok Build reuses its configuration, including the marketplaces and the MCP servers.
- **If you want to see the state of the connection**, Google Antigravity, Kiro, and the Claude desktop application show it in a panel, the command-line clients show it with a command.

## Limitations

- The MCP server operates on the **semantic model**, not on the report.
- The report authoring skill operates on **PBIP projects in PBIR format**, not on a `.pbix` file. PBIR stands for Power BI enhanced report format.
- Model metadata does not stay local: table names, column names, measure definitions, and query results are sent to the language model of the service you signed in to.
- The MCP server, the report authoring skill, and the Power BI Desktop Bridge are all **in preview**. Behavior and tools can change before general availability.
- The plans and the free quotas of these services change often. The tables report what the vendors published, and the linked pages are the authority.

## References

- [What are the Power BI MCP servers?](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview): the comparison between the local and the remote server.
- [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp): repository, configuration reference, and the complete list of tools.
- [Power BI report authoring skill](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-report-authoring-skill-overview): what the skill does and its limits.
- [Install Skills for Fabric](https://learn.microsoft.com/en-us/fabric/fundamentals/skills-for-fabric-install): the clients for which Microsoft documents the installation.
- [microsoft/skills-for-fabric](https://github.com/microsoft/skills-for-fabric): the repository that publishes the skills.
- [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers): the configuration of the first row.
- [MCP servers in Codex](https://developers.openai.com/codex/mcp): the configuration shared by Codex CLI and the ChatGPT desktop app.
- [MCP servers in Claude Code](https://code.claude.com/docs/en/mcp): the scopes and the JSON schema.
- [MCP in Google Antigravity](https://antigravity.google/docs/mcp/): the configuration files, the JSON schema, and every property.
- [MCP servers in Grok Build](https://docs.x.ai/build/features/mcp-servers): the TOML configuration and the compatibility with Claude Code.
- [MCP configuration in Kiro](https://kiro.dev/docs/mcp/configuration/): the two files and every property.
- [MCP servers in Qwen Code](https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/): the JSON schema and the approval of a project server.

*The content of this article was verified in September 2026. Command names, installation channels, and plan boundaries change often in this area, so the linked documentation is the authority.*
