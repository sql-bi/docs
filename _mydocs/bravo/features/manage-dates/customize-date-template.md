---
layout:     page
title:      Customize Date Templates
published:  true
order:      /1
---

The [Templates](../../configuration/options.md#templates) page can add, delete, and modify user date templates for Bravo.

<div class="video-container">
    <iframe src="https://player.vimeo.com/video/763684375" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>


A **template workspace** is an entire folder hierarchy identified by a file with the extension *.code-workspace*.

A **template package** is a single JSON file that contains a user template (extension *.package.json*). In terms of consumption, for a Bravo user a template is a template package. In order to customize a template, it is necessary to create a template workspace. A template package is obtained by combining the content of several JSON files included in a template workspace.

Bravo creates a new template by copying all the original template files of one of the predefined templates. In order to modify an organization or user template, the corresponding template workspace must be provided by the template author. The template package cannot generate a corresponding template workspace.

The JSON files included in the template workspace can be editing using any text editor. However, Bravo is integrated with [Visual Studio Code](https://code.visualstudio.com/) and the [Bravo Template Editor](template-editor.md) extension. 

In order to edit a template, Bravo opens the template workspace in Visual Studio Code. The workspace includes several files, but only two folders are relevant to customize a Date template:
- The **src** folder contains the source files of the Date template. The content of these files is described in the [Dax Template](../../../dax-template/index.md) documentation.

- The **dist** folder contains a single template package file. This is the Date template file that can be provided to a Bravo user in order to consume the template.

The entire template workspace folder must be copied in order to edit a template on a different computer. When Bravo opens a template package, if the file is in the *dist* folder of a template workspace, then Bravo shows the button to edit the template.