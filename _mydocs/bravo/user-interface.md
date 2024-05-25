---
layout:     page
title:      User Interface
published:  true
order:      /2
---

Bravo has a user interface based on a single window that allows multiple connections.

<div class="video-container">
    <iframe src="https://player.vimeo.com/video/763673584" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

Here is a brief tour of all features:

<img src="images/general-ui-01.png" width="700">

1. Creates a **connection** to a model in Power BI, or loads a VertiPaq Analyzer file. 
2. Opens a **new connection**
3. **Operations** available on the selected connection. They are all disabled where there are no open connections. Each operation is applied to the tab that is currently active. 
4. **Collapses or expands** the operations pane.
5. Opens **documentation and help videos**.
6. Opens the **Alert pane** showing important messages like new updates available.
7. Opens the [**Options dialog box**](configuration/options.md) to specify all the settings for Bravo.
8. **Theme selection**<br> Switches between light theme, dark theme, or automatic. The default setting is automatic, which chooses between light mode and dark mode based on Windows settings.
9. **Login/logout**<br> *Login* to the Power BI service, required to connect Bravo to a dataset published on Power BI service. The first time, Bravo may request the username to locate the right endpoint for the authentication. During the sign in, a browser window appears to complete the login process. Login is not required to access local files. Bravo remembers log in credentials on following runs, just like Power BI Desktop does: use the same button to explicitly *Logout*. 

Other two common elements of the user interface appear in all the operation pages.

<img src="images/general-ui-02.png" width="300">

1. **Synchronize**<br> Synchronizes the information in Bravo with the information in Power BI Desktop. For example, if you add a measure or import a new table, you can update the information in Bravo by clicking the “Synchronize” button.
2. **Help**<br> Opens page in a browser window pointing to the documentation.

