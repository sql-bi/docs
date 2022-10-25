---
layout:     page
title:      Installation
published:  true
order:      /1
---

Bravo installation provides different options.

<div class="video-container">
    <iframe src="https://player.vimeo.com/video/763673561" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

The setup programs are available in two categories:
- **Self-contained**: The self-contained portable setup options include the .NET runtime required for the installation. The presence of the .NET runtime increases the size of the setup, but it gurantees that all the required components are installed if necessary.
- **Framework-dependent**: The setup does not include the required .NET runtime. The setup is smaller, but it will fail if the required .NET runtime framework is not already installed on the target computer.

For each cateory, we have the following variations:
- **Default setup**: requires administrative rights and installs Bravo as an External Tool for Power BI Desktop.
- **User**: does not require administrative rights, but it does not install Bravo as an External Tool in Power BI Desktop.
- **Portable**: there is no setup; just extract the ZIP file content into a local folder and run Bravo straight from the executable included in that folder.

[Download and install the latest version](https://github.com/sql-bi/Bravo/releases/latest) from GitHub.