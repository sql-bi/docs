---
layout:     page
title:      Consumer
published:  false
draft:      true
order:      /01
---

# **TCDX Consumer**

In the **TCDX model**, a **Consumer** represents a client application that interacts with a tabular model. Consumers include:
- **Excel workbooks**, containing pivot tables and other data-related components.
- **Power BI reports**, featuring visuals, tables, and analytical elements referencing the model.
- **Other client applications**, which may access tabular models for analysis and reporting.

Each Consumer holds information about its source, metadata, and the **Items** it contains. Items are individual components, such as **pivot tables** in Excel or **visual elements** in Power BI, that reference the tabular model.

## **Structure of a Consumer**
A **Consumer** contains several key attributes that define its characteristics and interactions with the tabular model:

### **1. Consumer Metadata**
Each Consumer has general metadata describing its origin and access details:
- **Consumer Type**: The type of client application (e.g., Excel, Power BI Service, Power BI Desktop).
- **Host Name**: The system or environment where the Consumer is located (e.g., computer name).
- **Container**: The location within the host where the Consumer resides (e.g., file path or dataset container).
- **File Name**: The actual name of the Consumer file, if applicable.
- **URI**: The Universal Resource Identifier (URI) for cloud-based Consumers.
- **Acquisition Timestamp**: The date and time when the Consumer was extracted.
- **Modification Timestamp**: The last known modification time of the Consumer.

### **2. Items in a Consumer**
Within a Consumer, **Items** represent individual data components that interact with the tabular model:
- **In Excel**: An Item could be a **pivot table** or another feature accessing tabular data.
- **In Power BI**: An Item could be a **visual element**, such as a chart or table referencing measures and dimensions.

Each Item tracks its dependencies on the tabular model, capturing:
- The **model** it references.
- The **tables** used.
- The **columns** accessed.
- The **measures** applied.

### **3. Consumer Properties**
Consumers may have additional **custom properties**, stored as key-value pairs, to provide further context about the usage of the data model.

## **Consumer Collections**
Consumers are stored within a **ConsumersCollection**, which acts as a container for multiple Consumers. The collection includes:
- A list of **Consumer** objects.
- **ConsumersCollectionProperties**, a set of custom properties related to the group of Consumers.

## **Importance of Consumers in the TCDX Model**
Tracking Consumers in the TCDX model allows for:
- **Understanding Data Usage**: Analyzing which reports and workbooks access the tabular model.
- **Optimizing Performance**: Identifying which Consumers reference specific tables, columns, and measures to optimize model design.
- **Improving Data Governance**: Ensuring proper usage and tracking of data access across different applications.

By structuring Consumers and their Items in a standardized way, the TCDX model provides **clear insights into how data is utilized across Excel, Power BI, and other analytical tools**.


| Member | Values |  Notes |
| -- | -- | -- |
| ConsumerType | Excel, PowerBIService, PowerBIDesktop, OtherConsumerType | The type of the client imported | 
| HostName | TcdxName | The name of the main entity where the client is located, for intance the Computer name |
| Container | TcdxName | Where the Consumer is located on the HostName, for instance the folder path where the client is located |
| FileName | TcdxName | The name of the Consumer, when it is a file |
| Uri | TcdxName | The Universal Location Identifier of the client, if located in the cloud |
| UtcAcquisition | DateTime | timestamp of the acquisition of the client |
| UtcModification | DateTime | timestamp of the modification of the client |
| ConsumerProperties | key/value collection | a custom key value collection for custom properties that depend on the type of client |
| Items | List of Item | the list of dependencies in the consumer. For instance, if the consumer is an excel workbook, each Item represents a pivot table |

The **ConsumersCollection** is a container for **Consumer** objects

| Member | Values |  Notes |
| -- | -- | -- |
| Consumers | List of consumers | |
| ConsumersCollectionProperties | key/value collection | a custom key value collection for custom properties for the group of consumers. For instance the path containing all the imported clients |
 
## Note: 
for privacy reasons, strings are implemented as **TcdxName** objects, to allow a future implementation of objects anonymization.
