---
layout:     page
title:      Consumer
published:  true
draft:      true
order:      /01
---

# Consumer

## Overview
The `Consumer` class in the TCDX object model represents a client application that interacts with a tabular model. This can include:
- Excel workbooks containing pivot tables and other data-connected components.
- Power BI reports with visuals that reference tabular models.
- Other client applications that query and consume tabular model data.

Each Consumer contains metadata about its origin, interactions with the tabular model, and a collection of [`Item`](./Item.md) objects (such as pivot tables or Power BI visuals) that utilize the model.

---

## Purpose
The `Consumer` class serves the following key functions:
- Identifies the data source: Tracks the application (Excel, Power BI, etc.) accessing the tabular model.
- Captures interaction metadata: Stores details such as host system, file location, and modification timestamps.
- Maintains a collection of Items: Each Item represents an individual data-connected object within the Consumer, such as a pivot table in Excel or a visual in Power BI.
- Tracks model dependencies: Establishes relationships between the Consumer and the tabular model it references.

By organizing this data in a structured manner, the `Consumer` class enables auditing, optimization, and governance of tabular model usage.

---

## Public Properties
The `Consumer` class consists of the following key properties:

| Property           | Type                | Description  |
|------------------------|------------------------|------------------|
| `ConsumerType`        | `EnumConsumerType`     | Defines the type of client application (e.g., `Excel`, `PowerBIService`, `PowerBIDesktop`). |
| `HostName`           | `TcdxName`              | The system or environment where the Consumer is located (e.g., computer name). |
| `Container`          | `TcdxName`              | The location within the host where the Consumer resides (e.g., file path or dataset container). |
| `FileName`          | `TcdxName`              | The actual name of the Consumer file, if applicable. |
| `Uri`               | `TcdxName`              | The Universal Resource Identifier (URI) for cloud-based Consumers. |
| `UtcAcquisition`     | `DateTime`              | The timestamp when the Consumer data was extracted. |
| `UtcModification`    | `DateTime`              | The last known modification time of the Consumer. |
| `ConsumerProperties` | `Dictionary<string, TcdxName>` | A key-value collection of custom properties specific to the Consumer type. |
| `Items`             | [`List<Item>`](./Item.md) | A list of `Item` objects within the Consumer, each representing an individual object (e.g., pivot table, Power BI visual). |

### Property Details
- ConsumerType  
  Specifies the type of client interacting with the tabular model. Common values include:
  - `Excel` → An Excel workbook containing pivot tables or other data connections.
  - `PowerBIService` → A report hosted in Power BI Service.
  - `PowerBIDesktop` → A Power BI Desktop (.pbix) file.

- HostName  
  Identifies the system or cloud environment where the Consumer is located.

- Container & FileName  
  - `Container` represents the folder or dataset location where the Consumer is stored.
  - `FileName` provides the actual file name if applicable.

- Uri  
  Stores the URL or cloud-based identifier of the Consumer when applicable (e.g., Power BI datasets stored in the cloud).

- UtcAcquisition & UtcModification  
  These timestamps record when the Consumer metadata was collected and when it was last modified.

- ConsumerProperties  
  A dictionary storing additional custom properties, which can vary depending on the type of Consumer.

- Items  
  A collection of [`Item`](./Item.md) objects representing individual components (e.g., Excel pivot tables, Power BI visuals) that reference tabular model elements.

---

## Methods
The `Consumer` class includes the following methods:

### GetModels()
Returns: `IEnumerable<ModelDependency>`  
Description: Retrieves a collection of [`ModelDependency`](./ModelDependency.md) objects representing the tabular models that the Consumer references.

---

## Relationships with Other Classes
The `Consumer` class interacts with multiple components in the TCDX model:

- [`ConsumersCollection`](./ConsumersCollection.md) → Contains multiple Consumers.
- [`Item`](./Item.md) → Represents individual components within a Consumer (e.g., pivot tables, visuals).
- [`ModelDependency`](./ModelDependency.md) → Tracks which tabular model the Consumer interacts with.

### Class Diagram Representation
```
Consumer
├── ConsumerType : EnumConsumerType
├── HostName : TcdxName
├── Container : TcdxName
├── FileName : TcdxName
├── Uri : TcdxName
├── UtcAcquisition : DateTime
├── UtcModification : DateTime
├── ConsumerProperties : Dictionary<string, TcdxName>
└── Items : List<Item>
```
- [`ConsumersCollection`](./ConsumersCollection.md) → *contains multiple* `Consumer`
- `Consumer` → *contains multiple* [`Item`](./Item.md)
- `Consumer` → *references* [`ModelDependency`](./ModelDependency.md)

---

## Conclusion
The `Consumer` class is a central component in the `TCDX` object model, enabling structured tracking of how Excel workbooks, Power BI reports, and other clients interact with tabular models. It provides valuable metadata for auditing, performance optimization, and governance, ensuring efficient management of tabular model usage.

By linking `Consumer`, [`Item`](./Item.md), and [`ModelDependency`](./ModelDependency.md) objects, the `TCDX` model allows for detailed analysis of how data is utilized across different reporting tools and analytics applications.

## Note: 
for privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implementation of objects anonymization.
