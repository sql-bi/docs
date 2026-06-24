---
layout:     page
title:      MCP Server (HTTP)
menu_title: MCP Server (HTTP)
published:  true
order:      /1
---
The DAX Formatter **MCP Server (HTTP)** is a remote [Model Context Protocol](https://modelcontextprotocol.io) server hosted by SQLBI. It lets AI clients and agents format and validate DAX through a single tool, `format_dax`, without installing anything locally.

- **Transport**: Streamable HTTP (stateless) at `/mcp`.
- **Tool**: `format_dax` formats (and thereby validates) one or more DAX expressions.
- **Authentication**: none. The server is open and anonymous.

> The server does not format DAX itself. All formatting is done server-side by the DAX Formatter service; this endpoint is just the MCP transport and schema around it.

## Server URL

The only value you ever need to paste into your MCP client is the **Server URL**:

```
https://api.daxformatter.com/mcp
```

No account, API key, or login is required. Once the server is added, just ask your assistant to *"format this DAX"*.

## Visual Studio Code

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_DAX_Formatter-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect/mcp/install?name=DaxFormatter&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.daxformatter.com%2Fmcp%22%7D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_DAX_Formatter-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=DaxFormatter&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.daxformatter.com%2Fmcp%22%7D&quality=insiders)

Click a badge above — VS Code opens and asks you to confirm. Alternatively, add it from the terminal:

```bash
code --add-mcp "{\"name\":\"DaxFormatter\",\"type\":\"http\",\"url\":\"https://api.daxformatter.com/mcp\"}"
```

## Claude (Desktop and Code)

In **Claude Desktop**:

1. Open **Customize → Connectors → Add custom connector**.
2. Give it a name (e.g. `DaxFormatter`) and paste the **Server URL** above.
3. Click **Save**.

The `format_dax` tool is now available in chat. The same connector is automatically shared with **Claude Code**, so you set it up once for both.

You can also add it from the Claude Code terminal:

```bash
# -s user enables it in every project; omit -s for the current project only
claude mcp add -s user -t http DaxFormatter https://api.daxformatter.com/mcp

# check it was added and connected
claude mcp get DaxFormatter
```

## Codex (app and CLI)

In the **Codex app**:

1. Open **Settings → Integrations → MCP servers → Add**.
2. Choose the **streamable HTTP / URL** type, give it a name (e.g. `DaxFormatter`), and paste the **Server URL** above.
3. Leave **Bearer token** and **Headers** empty — DAX Formatter needs no login.
4. Click **Save**.

The app and the CLI share the same settings, so this also covers the **Codex CLI**. From the terminal:

```bash
# add globally; available in every project
codex mcp add DaxFormatter --url https://api.daxformatter.com/mcp

# check it was added and connected
codex mcp get DaxFormatter
codex mcp list
```

Both the app and the CLI write the same entry to `~/.codex/config.toml` (Windows: `%USERPROFILE%\.codex\config.toml`), which you can also edit by hand:

```toml
[mcp_servers.DaxFormatter]
enabled = true
url = "https://api.daxformatter.com/mcp"
approval_mode = "approve"   # set to skip the per-call approval prompt
```

## Any other MCP client

Most MCP-aware tools read a standard `.mcp.json` file. Create one where your client expects it (commonly at the root of your project) with:

```json
{
  "mcpServers": {
    "DaxFormatter": {
      "type": "http",
      "url": "https://api.daxformatter.com/mcp"
    }
  }
}
```

If your client uses a different field name for the URL or a settings UI instead of a file, just point it at the **Server URL** with transport type **HTTP (streamable)** and no authentication.

## Related

- [MCP Server (stdio)](mcp-stdio) — the local sibling of this server, run through `npx`.
- [NuGet package `Dax.Formatter`](nuget) — the .NET client for the same service.
