---
layout:      page
title:       "Microsoft Copilot and Power BI Desktop"
menu_title:  "Microsoft Copilot"
description: "Why Microsoft Copilot is not one of the setup guides: as of September 2026 it does not create the objects of a semantic model in Power BI Desktop."
published:   true
order:       /05
modified:    2026-09-18
---
*This page explains why Microsoft Copilot does not have a setup guide in this section, and what we will do when that changes.*

**As of September 2026, Microsoft Copilot is not integrated with Power BI Desktop to create the elements of a semantic model**: tables, relationships, and measures. For this reason, the courses and the guides of this section rely on the other AI tools, which reach the model through the [Power BI Authoring MCP server](index.md).

This is not a judgment on the quality of Copilot. It is a difference in what the product is allowed to do today.

## What Copilot does today in Power BI Desktop

Copilot is present in Power BI Desktop, and within its scope it is useful:

- **Ask data questions** about the model that is open, or about a semantic model reached with a live connection.
- **Write DAX queries** in the DAX query view, explain a query you wrote yourself, and explain a DAX function or concept.
- **Generate descriptions for measures** that already exist in the model.
- **Help with the report**, with summaries and narrative visuals on the canvas.

## What it does not do

Copilot does not act on the **structure** of the model. It does not create or modify tables, it does not create relationships, and it does not write a measure into the model on your behalf.

The closest thing is the DAX query view, where Copilot can define a measure inside a query it generates. Even there, the measure exists only in the query until **you** decide to apply it to the model, one measure at a time. There is no equivalent step for a table or a relationship.

This is the gap with the clients described in the [setup guides](index.md). Those clients connect to Power BI Desktop through the Power BI Authoring MCP server, which exposes the operations of the object model: create a table, create a relationship, write a measure, set a format string, run a DAX query. An agent chains those operations and shows you the result, and you approve what it writes.

## Two practical consequences for a student

- **Copilot cannot follow the exercises** of the courses, because the exercises ask the agent to modify the model. Use one of the clients in the [setup guides](index.md) instead.
- **Copilot in Power BI Desktop requires a Fabric capacity**. It has to be enabled at the tenant level and consumed from a workspace on a paid Fabric capacity (F2 or higher) or a Power BI Premium capacity (P1 or higher). A Pro licence alone is not enough. The other clients need an account with their own vendor, and none of them needs a Fabric capacity.

## We will update this page

Microsoft is building the agentic layer of Power BI Desktop in the open: the **Power BI Authoring MCP server** and the **Power BI Desktop Bridge** are both published by Microsoft, and they are the same components the other clients use. It is reasonable to expect that Copilot will eventually reach the model the same way.

**When Microsoft releases a feature that aligns Copilot with the tools of the other AI vendors, we will update this section**, and Copilot will get a setup guide like the others.

## Sources

- [Copilot in Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction): the capabilities and the requirements.
- [Use Copilot with semantic models](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-semantic-models): what Copilot does while you develop a model, and its limits.
- [Write DAX queries with Copilot](https://learn.microsoft.com/en-us/dax/dax-copilot): the DAX query view experience, and how a suggested measure reaches the model.
- [What is the Power BI Desktop Bridge?](https://learn.microsoft.com/en-us/power-bi/developer/agentic/power-bi-desktop-bridge-overview): the preview setting and the operations it provides.

*The content of this page was verified in September 2026. This is the area of Power BI that changes fastest, so the linked documentation is the authority.*
