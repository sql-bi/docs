---
layout:     page
title:      Format DAX
published:  true
order:      /2
---

Bravo can format the DAX measures of a Power BI model.

<img src="../images/format-dax-01.png" width="700">

1. **Search Measure**<br> Filters measures by writing a partial name in the  textbox.
2. **Current**<br> Shows the current DAX expressions of the selected measure.
3. **Formatted (Preview)**<br> hows the preview of the formatted measure.
4. **Panes position**<br> Changes position of current and preview panes. The button switches between overlapped panes, vertical side-by-side, and horizontal side-by-side.

When the *Formatted (Preview)* pane is visible, the DAX code must be sent to the [DAX Formatter](https://daxformatter.com) service to be formatted.

The preview requires a manual action because the DAX Formatter service must receive the DAX code. The DAX Formatter service does not store any received DAX code, but users must be aware that they are using a free online service provided by SQLBI.

<img src="../images/format-dax-02.png" width="700">

1. **Preview**<br> Sends only the DAX measure displayed in the *Current* pane to the DAX Formatter service, and then displays the formatted code.
2. **Preview All Measures**<br> Sends all the measures of the model to the DAX Formatter service. The preview is then automatically displayed for any other measure selected for the current model without requiring a confirmation for each measure.
3. **Automatic preview**<br> By enabling the Automatic preview setting, the preview is automatically enabled for all the measures of any model. The choice can be reverted in the [Options](../configuration/options.md) dialog box.

When the previes is enabled, the measures that are not formatted are highlighted in the list of the measures.
Bravo writes in the Power BI the formatted version only of the selected measures.

<img src="../images/format-dax-03.png" width="700">

1. **Show unformatted measures**<br> Filters only the measures that are not formatted. This filter only works with measures that have the preview enabled. The same filter also includes measures that cannot be formatted because of a syntax error. The code of the measure cannot be modified in Bravo, the *Current* and *Formatted (Preview)* panes are read-only.
2. **Select/unselect all the measures**<br> Chooses the measures that Bravo writes in Power BI when the user clicks *Format Selected*.
3. **Select/unselect the measure**<br> Toggles the selection of the measure in the corresponding line. 
4. **Whitespaces**<br> Shows/hides a placeholder to identify whitespaces in the code.
5. **Auto word-wrap**<br> Shows the content of a long line within the visible code pane, splitting the code into multiple lines if necessary. When this happens, the line number at the left of the code clarifies the actual lines in the measure. Without Auto word-wrap, the horizontal scrollbar can show the remaining part of the line that is not visible in the code pane.
6. **Zoom**<br> Changes the font size of the code pane.
7. **Refresh preview**<br> Updates the formatted preview of a measure by invoking the DAX Formatter service. 
8. **Format online with DAX Formatter**<br> Shows the formatted measure in a browser window using the DAX Formatter website. From that page, the formatted measure can be copied to the clipboard or saved into a file.
9. **Format Selected**<br> Writes a formatted version of the selected measure in the Power BI model.

>**IMPORTANT**: create a backup of the PBIX file before using Bravo, because it is not possible to “undo” the Format DAX operation!
