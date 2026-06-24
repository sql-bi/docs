---
layout:     page
title:      NuGet package Dax.Formatter
menu_title: NuGet package
published:  true
order:      /0
---
`Dax.Formatter` is a .NET client library that formats DAX expressions by calling the DAX Formatter service. It supports both single and batch requests and exposes an asynchronous API. The package is published by SQLBI under the MIT license.

- **Package**: [`Dax.Formatter`](https://www.nuget.org/packages/Dax.Formatter/) on NuGet
- **Source**: [github.com/sql-bi/DaxFormatter](https://github.com/sql-bi/DaxFormatter)

> The library does not format DAX itself. It sends the expression to `https://api.daxformatter.com` and returns the formatted result, so an internet connection is required.

## Installation

Add the package to your project with the .NET CLI:

```bash
dotnet add package Dax.Formatter --version 1.2.2
```

Or with the Package Manager console in Visual Studio:

```powershell
NuGet\Install-Package Dax.Formatter -Version 1.2.2
```

## Usage

### Quick start

Create a `DaxFormatterClient` and call `FormatAsync` with the DAX expression to format. The simplest overload takes the expression as a string and uses the default formatting options:

```csharp
using Dax.Formatter;

var client = new DaxFormatterClient();
var response = await client.FormatAsync("evaluate 'Table' order by 'Table'[Column]");

Console.WriteLine(response.Formatted);
```

> Reuse a single `DaxFormatterClient` instance across requests to minimize latency.

### Single request

Use `DaxFormatterSingleRequest` when you want to set formatting options or provide model metadata while formatting one expression:

```csharp
using Dax.Formatter;
using Dax.Formatter.Models;

var client = new DaxFormatterClient();
var request = new DaxFormatterSingleRequest
{
    Dax = "evaluate 'Table' order by 'Table'[Column]",
    DatabaseName = "MyDatabaseName",
    ServerName = "MyServerName",
    ListSeparator = ',',
    DecimalSeparator = '.',
    MaxLineLength = DaxFormatterLineStyle.LongLine,
    SkipSpaceAfterFunctionName = DaxFormatterSpacingStyle.BestPractice,
    ServerMode = Dax.Formatter.AnalysisServices.ServerMode.Tabular,
    ServerType = Dax.Formatter.AnalysisServices.ServerType.AnalysisServices,
    ServerEdition = Dax.Formatter.AnalysisServices.ServerEdition.Enterprise,
    ServerLocation = Dax.Formatter.AnalysisServices.ServerLocation.OnPremise,
};

var response = await client.FormatAsync(request);
Console.WriteLine(response.Formatted);
```

### Multiple request (batch)

To format several expressions, send them in a single API call with `DaxFormatterMultipleRequest`. This is the recommended way to format many expressions, because it avoids one round trip per expression. Add the expressions to the `Dax` list; the response is a list aligned to the request order:

```csharp
using Dax.Formatter;
using Dax.Formatter.Models;

var client = new DaxFormatterClient();
var request = new DaxFormatterMultipleRequest
{
    DatabaseName = "MyDatabaseName",
    ServerName = "MyServerName",
    ListSeparator = ',',
    DecimalSeparator = '.',
    MaxLineLength = DaxFormatterLineStyle.LongLine,
    SkipSpaceAfterFunctionName = DaxFormatterSpacingStyle.BestPractice,
    ServerMode = Dax.Formatter.AnalysisServices.ServerMode.Tabular,
    ServerType = Dax.Formatter.AnalysisServices.ServerType.AnalysisServices,
    ServerEdition = Dax.Formatter.AnalysisServices.ServerEdition.Enterprise,
    ServerLocation = Dax.Formatter.AnalysisServices.ServerLocation.OnPremise,
};

request.Dax.Add("evaluate 'Table' order by 'Table'[Column]");
request.Dax.Add("X=CALCULATE([Amt],USERELATIONSHIP(Sales[DueDateKey],'Date'[DateKey]))");

var responses = await client.FormatAsync(request);

foreach (var response in responses)
{
    Console.WriteLine(response.Formatted);
}
```

### Reading errors

Formatting also validates the expression. When the DAX has a syntax error, `Formatted` is not returned and the `Errors` list describes the problem with line and column information:

```csharp
var response = await client.FormatAsync("evaluate(");

if (response.Errors is { Count: > 0 })
{
    foreach (var error in response.Errors)
    {
        Console.WriteLine($"({error.Line}, {error.Column}): {error.Message}");
    }
}
else
{
    Console.WriteLine(response.Formatted);
}
```

> The DAX Formatter services does not validate the full DAX syntax: it is possible that the expression is syntactically correct but semantically invalid.

## Request parameters

`DaxFormatterSingleRequest` and `DaxFormatterMultipleRequest` share the same set of parameters (inherited from `DaxFormatterRequest`); the only difference is how the expression is supplied. All parameters except the DAX expression are optional: omit one to keep its default value.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `Dax` | `string` (single) / `List<string>` (multiple) | — | The DAX expression(s) to format. This is the only required value. |
| `ListSeparator` | `char` | `,` | Character used to separate function arguments and list items in the formatted output. |
| `DecimalSeparator` | `char` | `.` | Character used as the decimal separator in the formatted output. Must be consistent with `ListSeparator`. |
| `MaxLineLength` | `DaxFormatterLineStyle?` | `LongLine` | Controls line breaking: long lines vs. short lines. See values below. |
| `SkipSpaceAfterFunctionName` | `DaxFormatterSpacingStyle?` | `BestPractice` | Whether to insert a space between a function name and its opening parenthesis. See values below. |
| `ServerName` | `string?` | `null` | Optional model context. Anonymized (SHA256-hashed) by the library before being sent. |
| `DatabaseName` | `string?` | `null` | Optional model context. Anonymized (SHA256-hashed) by the library before being sent. |
| `ServerVersion` | `string?` | `null` | Optional Analysis Services version string, e.g. `14.0.800.192`. |
| `DatabaseCompatibilityLevel` | `string?` | `null` | Optional database compatibility level. |
| `ServerEdition` | `ServerEdition?` | `null` | Optional Analysis Services edition. See values below. |
| `ServerType` | `ServerType?` | `null` | Optional engine/product hosting the model. See values below. |
| `ServerMode` | `ServerMode?` | `null` | Optional server mode. See values below. |
| `ServerLocation` | `ServerLocation?` | `null` | Optional deployment location. See values below. |
| `CallerApp` | `string?` | assembly name | Optional name identifying the calling application. |
| `CallerVersion` | `string?` | assembly version | Optional version identifying the calling application. |

> The server and database parameters are telemetry context for the service and do **not** affect the formatted result. `ServerName` and `DatabaseName` are hashed by the library, so the actual names are never transmitted.

### Formatting style values

`MaxLineLength` — `DaxFormatterLineStyle`:

| Value | Meaning |
|---|---|
| `LongLine` *(default)* | Keep expressions on long lines, breaking less often. |
| `ShortLine` | Prefer shorter lines, breaking more often. |

`SkipSpaceAfterFunctionName` — `DaxFormatterSpacingStyle`:

| Value | Meaning |
|---|---|
| `SpaceAfterFunction` | Insert a space after the function name, e.g. `SUM ( ... )`. |
| `NoSpaceAfterFunction` | No space after the function name, e.g. `SUM( ... )`. |
| `BestPractice` *(default)* | Alias of `SpaceAfterFunction` — the SQLBI recommended style. |

### Server metadata values

These enums live in the `Dax.Formatter.AnalysisServices` namespace and are all optional.

`ServerMode`: `Multidimensional`, `SharePoint`, `Tabular`, `Default`.

`ServerLocation`: `OnPremise`, `Azure`.

`ServerType`: `AnalysisServices`, `PowerBIDesktop`, `PowerBIReportServer`, `PowerPivot`, `SSDT`, `AzureAnalysisServices`, `PowerBIService`, `Offline`

`ServerEdition`: `Standard`, `Standard64`, `Enterprise`, `Enterprise64`, `Developer`, `Developer64`, `Evaluation`, `Evaluation64`, `LocalCube`, `LocalCube64`, `BusinessIntelligence`, `BusinessIntelligence64`, `EnterpriseCore`, `EnterpriseCore64`.

## Response

`FormatAsync` returns a `DaxFormatterResponse` (or a list of them for a batch request):

| Property | Type | Description |
|---|---|---|
| `Formatted` | `string?` | The formatted DAX expression. |
| `Errors` | `List<DaxFormatterError>?` | Syntax errors found while formatting, if any. |

Each `DaxFormatterError` exposes:

| Property | Type | Description |
|---|---|---|
| `Line` | `int?` | Line of the error in the submitted expression. |
| `Column` | `int?` | Column of the error in the submitted expression. |
| `Message` | `string?` | Description of the error. |

## Key API

- `DaxFormatterClient` — the main client used to invoke formatting requests.
- `DaxFormatterSingleRequest` — describes a single-expression request.
- `DaxFormatterMultipleRequest` — describes a batch request with optional model metadata and formatting options.
- `DaxFormatterResponse` / `DaxFormatterError` — the formatted result and any validation errors.

## Related

- [MCP Server (HTTP)](mcp-http) and [MCP Server (stdio)](mcp-stdio) — access the same service from AI assistants.
- [GitHub repository](github) — source code, issues, and contributions.
