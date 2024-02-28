---
layout:     page
title:      Deploy Organization Template
published:  true
order:      /3
---

A customized date template can be distributed as an Organization Template by using a [group policy in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/manage-group-policy) or to [Windows Active Directory](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831791(v=ws.11))

The [template package file](customize-date-template.md#template-workspace-and-package) must be copied to a location that is accessible to all the client devices. The [CustomTemplatesOrganizationRepositoryPath]() registry setting specifies the folder containing all the Organization template package files.

You can create the settings in the Group Policy by using the [ADMX group policy files on Github](https://github.com/sql-bi/Bravo/tree/main/src/Infrastructure/Security/Policies/ADMX). You can find instructions about how to use ADMX files here:
  - **Windows Active Directory**: [Create and manage Central Store - Windows Client](https://learn.microsoft.com/en-US/troubleshoot/windows-client/group-policy/create-and-manage-central-store)
  - **Azure Active Directory / Microsoft Entra**: [Import custom and third party partner ADMX templates in Microsoft Intune](https://learn.microsoft.com/en-us/mem/intune/configuration/administrative-templates-import-custom)

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/2n0PKsmToqE?enablejsapi=1&modestbranding=1&rel=0&widget_referrer=embed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

