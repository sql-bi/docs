---
layout:     page
title:      VersionInfo
published:  true
draft:      true
order:      /08
---

# VersionInfo

## Overview
The `VersionInfo` class in the TCDX object model provides metadata about the TCDX format version, the TCDX library version, and the tools used to generate the TCDX file. This class is essential for tracking the provenance and compatibility of TCDX files.

## Purpose
The primary functions of the `VersionInfo` class include:
- Tracking version information of the TCDX model and related libraries.
- Providing metadata about the software and tools used to extract TCDX data.
- Ensuring compatibility when analyzing or processing TCDX files across different environments.

By storing this versioning metadata, the `VersionInfo` class helps maintain data integrity, auditability, and troubleshooting capabilities.

---

## Public Properties
The `VersionInfo` class consists of the following key properties:

| Property              | Type       | Description       |
|-----------------------|------------|-------------------|
| `TcdxVersion`         | `string`   | The version of the TCDX model used in the file. |
| `TcdxLibVersion`      | `string`   | The version of the TCDX library used to generate the file. |
| `ExtractorLib`        | `string`   | The name of the library that extracted the information. |
| `ExtractorLibVersion` | `string`   | The version of the extractor library used. |
| `ExtractorApp`        | `string`   | The name of the application that performed the extraction (e.g., DAX Studio, Tabular Editor). |
| `ExtractorAppVersion` | `string`   | The version of the extractor application. |

### Property Details
- `TcdxVersion`  
  - Specifies the format version of the TCDX model.
  - Ensures compatibility when processing TCDX files.

- `TcdxLibVersion`  
  - Identifies the version of the TCDX library used to generate the file.
  - Helps in troubleshooting issues related to library updates.

- `ExtractorLib` & `ExtractorLibVersion`  
  - Provide details about the library used for data extraction.
  - Useful for tracking changes in extraction logic over time.

- `ExtractorApp` & `ExtractorAppVersion`  
  - Identify the application used to generate the TCDX file.
  - Possible values include:  
    - `DAX Studio` → Used for extracting query and model metadata.   - `Tabular Editor` → Used for extracting tabular model structure.
    - `Power BI Tools` → Used for extracting metadata from Power BI Service.

---

## Relationships with Other Classes
The `VersionInfo` class is typically associated with the entire TCDX file and does not have direct relationships with specific Consumers, Items, or QueryGroups.

### Class Diagram Representation
```
VersionInfo
├── TcdxVersion : string
├── TcdxLibVersion : string
├── ExtractorLib : string
├── ExtractorLibVersion : string
├── ExtractorApp : string
└── ExtractorAppVersion : string
```

---

## Conclusion
The `VersionInfo` class is a crucial part of the TCDX object model, providing essential metadata about the format version, library versions, and extraction tools used. This information is vital for auditing, troubleshooting, and ensuring compatibility across different versions of the TCDX ecosystem.

By integrating `VersionInfo` into the TCDX model, organizations can:
- Maintain version control of TCDX files.
- Ensure compatibility when processing files across different tool versions.
- Audit and troubleshoot metadata extraction processes efficiently.

This class plays a key role in the governance and lifecycle management of TCDX-based analytics and reporting solutions.
