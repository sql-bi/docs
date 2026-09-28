---
layout:      page
title:       "AI tools for Power BI Desktop"
menu_title:  "AI tools"
description: "The AI clients that connect to Power BI Desktop through the Power BI Authoring MCP server, with a comparison and one setup guide for each of them."
published:   true
order:       /10
next_reading: false
modified:    2026-09-13
---
Ten clients from eight vendors can read and modify a semantic model while **Power BI Desktop** is open, and all of them do it through the same component: the **Power BI Authoring MCP server**, published by Microsoft as the npm package `@microsoft/powerbi-modeling-mcp` and started as a local process.

What changes between one client and another is the installation, the account it requires, the way the MCP server is declared, and the way each one asks for approval before it writes. Some of them also run the **Power BI report authoring skill**, which works on the report of a PBIP project.

This page collects the comparison that helps you pick one, and a self-contained setup guide for each client. Every guide starts from a machine where only Power BI Desktop is installed, and ends with an agent that writes a measure and, when the client supports it, a report page.

> The list is a snapshot of September 2026, and it is not a ranking. Product names and logos are trademarks of their respective owners. SQLBI is not affiliated with them.

## Choosing a client

[**AI hosts for Power BI Desktop: a comparison**](comparison.md) puts installation and account, registration of the MCP server, and support for the report authoring skill in three tables. It is the shortest way to choose before you start a setup.

## Setup guides

| | Vendor | Setup guides |
| --- | --- | --- |
| <img src="images/openai.png" alt="OpenAI" width="32" class="naked nozoom"> | OpenAI | [The ChatGPT desktop app](chatgpt-desktop.md)<br>[Codex CLI](codex-cli.md) |
| <img src="images/anthropic.jpg" alt="Anthropic" width="32" class="naked nozoom"> | Anthropic | [Claude Code Desktop](claude-code-desktop.md)<br>[Claude Code](claude-code.md) |
| <img src="images/vscode.png" alt="Visual Studio Code" width="32" class="naked nozoom"> | Microsoft | [Visual Studio Code](vscode.md) |
| <img src="images/microsoft-copilot.svg" alt="Microsoft Copilot" width="32" class="naked nozoom"> | Microsoft | [Microsoft Copilot](microsoft-copilot.md) (*no setup guide yet) |
| <img src="images/github.svg" alt="GitHub" width="32" class="naked nozoom"> | GitHub | [GitHub Copilot CLI](github-copilot-cli.md) |
| <img src="images/antigravity.png" alt="Google Antigravity" width="32" class="naked nozoom"> | Google | [Google Antigravity](antigravity.md) |
| <img src="images/grok.svg" alt="Grok" width="32" class="naked nozoom"> | SpaceXAI | [Grok Build](grok-build.md) |
| <img src="images/kiro.svg" alt="Kiro" width="32" class="naked nozoom"> | AWS | [Kiro](kiro.md) |
| <img src="images/qwen.png" alt="Qwen" width="32" class="naked nozoom"> | Alibaba | [Qwen Code](qwen-code.md) |

<small>Product names and logos are trademarks of their respective owners. SQLBI is not affiliated with them.</small>

>> **Microsoft Copilot** is in the table for completeness, without a setup guide. As of September 2026 it does not create the objects of a semantic model in Power BI Desktop, so it cannot follow the exercises of the courses. [More details about the reasons, and what we will do when that changes](microsoft-copilot.md).



## What every setup has in common

- **Power BI Desktop** installed, and **write permission** on any semantic model the agent modifies. The MCP server follows the same rules as the Power BI external tools.
- **Node.js**, because the MCP server is started with `npx`.
- An account with the vendor of the client, on a plan that includes the use of MCP servers.
- The sample model used in all the guides: **[ContosoDemo10k.zip](https://www.sqlbi.com/wp-content/uploads/ContosoDemo10k.zip)**.

> Back up your model before an agent writes to it. With the sample model, extract the archive again if something goes wrong.
