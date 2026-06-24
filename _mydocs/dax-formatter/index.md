---
layout:         page
title:          DAX Formatter
published:      true
order:          /dax-formatter
next_reading:   true
next_reading_title: Ways to access DAX Formatter
---
[DAX Formatter](https://www.daxformatter.com) is a free service by SQLBI that formats DAX expressions according to the [rules for DAX code formatting](https://www.sqlbi.com/articles/rules-for-dax-code-formatting/). All the formatting happens server-side at `https://api.daxformatter.com`: the tools described here are clients, transports, and integrations around that single service.

> Formatting a DAX expression also **validates** it. If the expression contains a syntax error, the service reports it with the line and column of the problem instead of returning formatted code.

## Ways to access DAX Formatter

Beyond the [web interface](https://www.daxformatter.com), the DAX Formatter service can be reached programmatically and from AI assistants:

- [**NuGet package `Dax.Formatter`**](nuget): a .NET client library to format and validate DAX from your own applications and scripts.
- [**MCP Server (HTTP)**](mcp-http): a remote, hosted [Model Context Protocol](https://modelcontextprotocol.io) server. Add one URL to your AI client and let it format DAX — no install, no account.
- [**MCP Server (stdio)**](mcp-stdio): a local MCP server run through `npx`, for AI clients and IDE agents that launch tools as a local process.
- [**GitHub repository**](github): the open-source `sql-bi/DaxFormatter` repository that hosts the .NET and TypeScript clients and the stdio MCP server.

## Which one should I use?

| You want to… | Use |
|---|---|
| Format/validate DAX from .NET code | [NuGet package `Dax.Formatter`](nuget) |
| Format DAX from an AI assistant with zero setup | [MCP Server (HTTP)](mcp-http) |
| Run the MCP server locally as a process | [MCP Server (stdio)](mcp-stdio) |
| Read the source, file issues, or contribute | [GitHub repository](github) |

> Both MCP servers expose the same single tool, `format_dax`, and call the same DAX Formatter service. The HTTP server is remote and hosted by SQLBI; the stdio server runs on your machine.
