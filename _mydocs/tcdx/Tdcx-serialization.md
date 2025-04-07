---
layout:     page
title:      Tcdx serialization
published:  true
draft:      true
order:      /02
---

# Tcdx serialization and deserialization

## Introduction

The **Dax.Tcdx** NuGet package provides serialization and deserialization capabilities for the **TCDX** object model, a structured representation of tabular model usage in **Power BI, Excel, and other analytical environments**. 

This package enables developers to **import and export TCDX files**, facilitating analysis of how tabular models are consumed by different clients. It works in conjunction with the **Dax.Tcdx**.Metadata** package, which defines the metadata structures required for TCDX operations.

## Purpose

The **Dax.Tcdx** NuGet package is designed to:
- Serialize and deserialize the TCDX object model into structured JSON data.

## Key Features

### Serialization & Deserialization
- Converts the TCDX object model to and from structured JSON format.
- Uses the **Dax.Tcdx.Metadata** package to ensure compatibility with tabular models.

### File Packaging
- Efficiently stores metadata using the **TCDX format**.
- Reads and writes compressed JSON-based structures.

## Methods for Serialization and Deserialization

### Exporting (Serialization)

The following methods are responsible for exporting (serializing) TCDX data:

- **TcdxTools.ExportTcdx(Stream stream, VersionInfo versionInfo, ConsumersCollection consumers, QueryGroupsCollection queryGroups)**  
  This method exports TCDX data into a stream. It calls an internal implementation method to handle serialization.

- **TcdxTools.ExportTcdx(string path, VersionInfo versionInfo, ConsumersCollection consumers, QueryGroupsCollection queryGroups)**  
  This method exports TCDX data into a file located at the specified path.

- **ExportTcdx.ExportVersionInfo(VersionInfo versionInfo)**  
  This method serializes the `VersionInfo` object and writes it as `TcdxVersionInfo.json`.

- **ExportTcdx.ExportConsumers(ConsumersCollection consumers)**  
  This method serializes the `ConsumersCollection` object and writes it as `Consumers.json`.

- **ExportTcdx.ExportQueryGroups(QueryGroupsCollection queryGroups)**  
  This method serializes the `QueryGroupsCollection` object and writes it as `QueryGroups.json`.

### Importing (Deserialization)

The following methods are responsible for importing (deserializing) TCDX data:

- **TcdxTools.ImportTcdx(string path)**  
  Reads a TCDX file and deserializes its contents into structured objects including `VersionInfo`, `ConsumersCollection`, and `QueryGroupsCollection`.

- **TcdxTools.ImportTcdx(Stream stream)**  
  Reads a TCDX stream and deserializes its contents.

- **ImportTcdx.ImportVersionInfo()**  
  Deserializes `TcdxVersionInfo.json` into a `VersionInfo` object.

- **ImportTcdx.ImportConsumers()**  
  Deserializes `Consumers.json` into a `ConsumersCollection` object.

- **ImportTcdx.ImportQueryGroups()**  
  Deserializes `QueryGroups.json` into a `QueryGroupsCollection` object.

## Format Definitions

The **TCDX format** uses structured JSON files to store data. The main components of the format are:

- `TcdxVersionInfo.json` - Stores metadata about the TCDX version and extraction tools.
- `Consumers.json` - Contains details about the consumers of the tabular model.
- `QueryGroups.json` - Captures query execution statistics and metadata.

## Dependencies

The **Dax.Tcdx** package depends on the following:
- **Dax.Tcdx**.Metadata** - Provides the necessary metadata definitions for tabular model elements.
- **Newtonsoft.Json** - Used for JSON serialization and deserialization.

### Additional Notes:
- The package is designed for **Power BI professionals, Excel analysts, and data engineers** who need structured insights into their tabular models.
- For privacy reasons, sensitive data is stored using **TcdxName** objects, allowing future anonymization features.