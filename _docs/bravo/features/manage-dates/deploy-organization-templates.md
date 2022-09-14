---
layout:     page
title:      Deploy Organization Template
published:  true
order:      /2
---

A customized date template can be distributed as an Organization Template by using a [group policy in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/manage-group-policy) or in [Windows Active Directory](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831791(v=ws.11)). 

The [template package file](./customize-date-template.md#template-workspace-and-package) must be copied in a location that is accessible to all the client devices. The [CustomTemplatesOrganizationRepositoryPath]() registry setting specifies the folder containing all the Organization template package files.
