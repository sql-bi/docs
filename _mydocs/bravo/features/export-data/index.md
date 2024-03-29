---
layout:     page
title:      Export Data
published:  true
order:      /4
---
Bravo can export the data of one or more tables to multiple CSV files in the same folder or into a single Excel file with one worksheet for each table.

<div class="video-container">
    <iframe src="https://player.vimeo.com/video/763681111" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
</div>

<img src="images/export-data-01.png" width="700" class="naked">

1. **Select/unselect all**<br> Toggles the selection of the tables to export.
2. **Select individual tables**<br> Select or unselect the table to export in the corresponding line.
3. **Export as**<br> Chooses the export format:
    - *Excel Spreadsheet*: one worksheet for every exported table in a single Excel file. There is a limit of one million rows per worksheet. Tables with more than one million rows are highlighted with a warning icon. The CSV format can export the full content of larger tables.
    - *CSV Files*: one comma-separated-value file (CSV) for every exported table in a specified folder.
4. **Export Summary**<br> Activates the Export Summary option for Excel files, which creates an additional worksheet with the summary of exported tables.
5. **Total selection to export**<br> Displays the *number of selected tables* to export, alongside with their *total number of rows and size*.
6. **Export Selected**<br> Exports the selected files,  

The CSV export format shows different format options:

<img src="images/export-data-02.png" width="700">

1. **Search Table**<br> Filters the tables containing the text specified in the textbox. Selected tables are exported even though they are not listed because of a filter.
2. **Total selection to export**<br> Displays the **number of selected tables** to export, alongside with their number of rows and size, regardless of their visibility in the above list.
3. **Export as CSV options**<br> Shows the options to export CSV files:
    - *Encoding*: Specifies the encoding format:
        - *UTF-8* is usually more compact and the preferred choice.
        - *UTF-16* is available to solve compatibility issues if other programs cannot open the files exported by Bravo.
    - *Fields Delimiter*: Specifies the delimiter character for the CSV file. The comma (,) is the standard, but different cultures may use different delimiters:
        - *Automatic*: Uses the default list separator defined by the Windows settings.
        - *Comma*: Standard field delimiter (,).
        - *Semicolon*: Semicolon field delimiter (;).
        - *Tab*: Tab field delimiter. This choice export data in a tab-separated-value format, also known as TSV.
        - *Other*: Specifies a custom field delimiter.
    - *Enclose Strings in Quotes*: Ensures that every string is enclosed in double quotes.
    - *Save in a Subfolder*: Creates a subfolder with the name of the model. All the CSV files are saved in that subfolder, otherwise the files are created in the folder selected when the user clicks the Export Selected button.
    
>The Export Data feature in Bravo does not provide filters over rows and columns. [DAX Studio](https://daxstudio.org) has more advanced features to export a selection of rows or columns: [Query Builder](https://daxstudio.org/docs/features/query-builder/) and [Export Data](https://daxstudio.org/docs/features/export-data/)
