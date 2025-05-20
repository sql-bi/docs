---
layout:     page
title:      ConsumersCollection
published:  true
draft:      true
order:      /09
---

# ConsumersCollection

## Overview
The `ConsumersCollection` class in the `TCDX` object model serves as a container for multiple Consumer objects, representing different clients (such as Excel workbooks or Power BI reports) that interact with a tabular model. 

This class aggregates and organizes Consumers, making it easier to analyze how tabular models are being utilized across different tools and environments.

---

## Purpose
The `ConsumersCollection` class is designed to:
- Store multiple Consumers that interact with tabular models.
- Provide metadata about the collection of Consumers.
- Enable batch processing of multiple Consumers within a single TCDX file.
- Support auditing and governance by tracking which Consumers are accessing tabular models.

This class plays a crucial role in data governance, optimization, and reporting analysis by helping users understand which applications and reports are interacting with tabular models.

---

## Public Properties
The `ConsumersCollection` class consists of the following key properties:

| Property                  | Type                                    | Description  |
|--------------------------------|--------------------------------------------|------------------|
| `ConsumersCollectionProperties` | `Dictionary<string, TcdxName>` | A key-value collection of custom properties for the Consumers collection. |
| `Consumers`                    | [`List<Consumer>`](./Consumer.md)                           | A list of [`Consumer`](./Consumer.md) objects, each representing a different client application. |

### Property Details
- ConsumersCollectionProperties  
  - Stores metadata about the collection of Consumers.
  - Examples of properties:
    - File Path → The directory where multiple Consumer files are located.
    - Environment Information → Additional details about the dataset or reporting environment.

- Consumers  
  - Holds a list of [`Consumer`](./Consumer.md) objects, each representing an individual Excel workbook, Power BI report, or other client that references a tabular model.
  - Enables batch processing of multiple Consumers within a single TCDX file.

---

## Relationships with Other Classes
The `ConsumersCollection` class interacts with multiple components in the TCDX object model:

- [`Consumer`](./Consumer.md) → Represents individual Excel workbooks, Power BI reports, or other applications that query the tabular model.
- [`Item`](./Item.md) → Each [`Consumer`](./Consumer.md) contains multiple [`Item`](./Item.md) objects, representing pivot tables, visuals, or other interactive components.

### Class Diagram Representation
```
ConsumersCollection
├── ConsumersCollectionProperties : Dictionary<string, TcdxName>
└── Consumers : List<Consumer>
      ├── ConsumerType : EnumConsumerType
      ├── HostName : TcdxName
      ├── Container : TcdxName
      ├── FileName : TcdxName
      ├── Uri : TcdxName
      ├── Items : List<Item>
```
- `ConsumersCollection` → *contains multiple* [`Consumer`](./Consumer.md)
- [`Consumer`](./Consumer.md) → *contains multiple* [`Item`](./Item.md)
- [`Item`](./Item.md) → *references* [`ModelDependency`](./ModelDependency.md)

---

## Conclusion
The `ConsumersCollection` class is a fundamental component of the `TCDX` object model, providing a structured way to store, organize, and analyze multiple Consumers that interact with tabular models.

This class is particularly useful for:
- Auditing & Governance → Tracking which reports and applications access tabular models.
- Performance Analysis → Understanding model usage across multiple Consumers.
- Optimizing Data Models → Identifying frequently used or redundant Consumers for better resource management.

By integrating `ConsumersCollection` into the TCDX model, organizations can gain insights into tabular model usage across multiple reporting tools, improving both data governance and performance optimization.

## Note: 
for privacy reasons, strings are implemented as `TcdxName` objects, to allow a future implemtation of objects anonymization.