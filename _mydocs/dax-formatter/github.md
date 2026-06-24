---
layout:     page
title:      GitHub repository
menu_title: GitHub repository
published:  true
order:      /3
---
The clients for the DAX Formatter service are open source and developed in the public repository [`sql-bi/DaxFormatter`](https://github.com/sql-bi/DaxFormatter) on GitHub, under the MIT license.

## What the repository contains

The repository hosts the client SDKs and the local MCP server that wrap the DAX Formatter service:

- **.NET client** — the [`Dax.Formatter`](nuget) C# library, published as a NuGet package.
- **TypeScript client** — `@sqlbi/daxformatter`, the JavaScript/TypeScript counterpart for browser and Node.js.
- **MCP Server (stdio)** — [`@sqlbi/daxformatter-mcp`](mcp-stdio), the local Model Context Protocol server.

> All of these are clients of the same service. The formatting logic runs server-side at `https://api.daxformatter.com`; the repository provides the transport, schemas, and packaging around it.

## Contributing

The project welcomes community contributions:

- Report bugs or request features through the [issues](https://github.com/sql-bi/DaxFormatter/issues) page.
- Submit pull requests for fixes and improvements.

Build and CI/CD are automated with GitHub Actions; see the repository for the .NET SDK version requirements and contribution details.

## Related resources

- Online service: [daxformatter.com](https://www.daxformatter.com)
- Formatting rules: [Rules for DAX code formatting](https://www.sqlbi.com/articles/rules-for-dax-code-formatting/)
- [NuGet package `Dax.Formatter`](nuget) · [MCP Server (HTTP)](mcp-http) · [MCP Server (stdio)](mcp-stdio)
