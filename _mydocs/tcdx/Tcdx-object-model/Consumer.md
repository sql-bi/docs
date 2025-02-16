---
layout:     page
title:      Consumer
published:  false
draft:      true
order:      /01
---

The **Consumer** represents a client who uses the Models, with the information of the referenced tables and measures

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
for privacy reasons, strings are implemented as **TcdxName** objects, to allow a future implemtation of objects anonymization.
