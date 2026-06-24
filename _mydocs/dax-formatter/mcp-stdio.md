---
layout:     page
title:      MCP Server (stdio)
menu_title: MCP Server (stdio)
published:  true
order:      /2
---
The DAX Formatter **MCP Server (stdio)** is a local [Model Context Protocol](https://modelcontextprotocol.io) server, published as the npm package [`@sqlbi/daxformatter-mcp`](https://www.npmjs.com/package/@sqlbi/daxformatter-mcp). Your AI client launches it as a local process (over standard input/output) and uses its single tool, `format_dax`, to format and validate DAX.

- **Package**: [`@sqlbi/daxformatter-mcp`](https://www.npmjs.com/package/@sqlbi/daxformatter-mcp) on npm
- **Transport**: stdio (the client spawns the server as a child process)
- **Tool**: `format_dax` formats and validates DAX expressions, reporting syntax errors with line and column information.
- **Requirements**: Node.js 18 or later
- **License**: MIT
- **Source**: [github.com/sql-bi/DaxFormatter](https://github.com/sql-bi/DaxFormatter) (directory `mcp`)

> Like the HTTP MCP server, this package does not format DAX locally: it forwards expressions to the DAX Formatter service, so an internet connection is required. Choose this stdio server when your client launches MCP tools as local processes; choose the [HTTP server](mcp-http) when you prefer a hosted endpoint with nothing to install.

The server runs **locally on your machine**: no install step, no account, no API key, no login. Find your app below, follow the short steps, and afterwards just ask your assistant to *"format this DAX"*. There is nothing to install ahead of time: the configurations below run the latest version on demand with `npx`.

## Visual Studio Code
<a href="https://vscode.dev/redirect/mcp/install?name=DaxFormatter&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40sqlbi%2Fdaxformatter-mcp%22%5D%7D"><img src="https://img.shields.io/badge/VS_Code-Install_DAX_Formatter-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white" alt="Install in VS Code" class="naked"/></a>
<a href="(https://insiders.vscode.dev/redirect/mcp/install?name=DaxFormatter&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40sqlbi%2Fdaxformatter-mcp%22%5D%7D&quality=insiders"><img src="https://img.shields.io/badge/VS_Code_Insiders-Install_DAX_Formatter-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white" alt="Install in VS Code Insiders" class="naked"/></a>

Click a badge above: VS Code opens and asks you to confirm. That's it. Alternatively, add it from the terminal:

```bash
code --add-mcp "{\"name\":\"DaxFormatter\",\"type\":\"stdio\",\"command\":\"npx\",\"args\":[\"-y\",\"@sqlbi/daxformatter-mcp\"]}"
```

## Claude (Desktop and Code)

In **Claude Desktop**, add it through the config file:

1. Open **Settings → Developer → Edit Config** to reveal `claude_desktop_config.json`.
2. Inside `mcpServers`, add the standard `DaxFormatter` entry shown in [Any other MCP client](#any-other-mcp-client) below.
3. Restart Claude Desktop, then confirm the server appears under **Settings → Developer**.

The `format_dax` tool is now available in chat. The same connector is automatically shared with **Claude Code**, so you set it up once for both.

You can also add it from the Claude Code terminal:

```bash
# -s user enables it in every project; omit -s for the current project only
claude mcp add -s user DaxFormatter -- npx -y @sqlbi/daxformatter-mcp

# check it was added
claude mcp get DaxFormatter
```

## Codex (app and CLI)

In the **Codex app**:

1. Open **Settings → Integrations → MCP servers → Add**.
2. Choose the **command (STDIO)** type and give it a name (e.g. `DaxFormatter`).
3. Set the command to `npx`, then use **Add argument** to add the two arguments separately: first `-y`, then `@sqlbi/daxformatter-mcp`.
4. Click **Save**.

The `format_dax` tool is now available in your threads. The app and the CLI share the same settings, so this also covers the **Codex CLI** and IDE extension.

You can also add it from the terminal:

```bash
# add it to the user-level Codex configuration (available in every project)
codex mcp add DaxFormatter -- npx -y @sqlbi/daxformatter-mcp

# check it was added
codex mcp get DaxFormatter
codex mcp list
```

Both the app and the CLI write the same entry to `~/.codex/config.toml` (Windows: `%USERPROFILE%\.codex\config.toml`), which you can also edit by hand:

```toml
[mcp_servers.DaxFormatter]
command = "npx"
args = ["-y", "@sqlbi/daxformatter-mcp"]
```

> To scope the server to one repository, put the same table in a project-scoped `.codex/config.toml` at the repo root instead. Codex loads it only for **trusted** projects and prompts for trust on first use.

## Any other MCP client

Don't see your app above? Most MCP-aware tools read a standard JSON config. Add this entry to your client's configuration file, or to a `.mcp.json` at the root of a project to share it with everyone working on that repo:

```json
{
  "mcpServers": {
    "DaxFormatter": {
      "command": "npx",
      "args": ["-y", "@sqlbi/daxformatter-mcp"]
    }
  }
}
```

If your client uses a settings UI instead of a file, configure a **stdio** server with command `npx` and arguments `-y @sqlbi/daxformatter-mcp`.

## What it does

The server exposes a single tool, **`format_dax`**. Just ask your assistant to format or check some DAX and it will use it:

- Formats one or more DAX expressions in a single call.
- Reports syntax errors with their line and column, so the same call both **formats** and **validates** (an expression that can't be parsed comes back unformatted, with the errors).
- Optional formatting controls: line style, spacing, and the list/decimal separators.

You may want to specify the use of format_dax to avoid the agent trying to format DAX itself.

## Privacy

Your DAX is sent to the DAX Formatter web service (`daxformatter.com`), where the formatting happens. If you provide server or database names, they are **SHA-256 hashed** before being sent: they never leave your machine in clear text.

## Related

- [MCP Server (HTTP)](mcp-http) — the hosted, remote sibling of this server.
- [NuGet package `Dax.Formatter`](nuget) — the .NET client for the same service.
