---
layout:     page-no-nav
title:      Markdown Editing
published:  true
date:       2021-12-20
modified:   2021-12-23
sitemap:    false
draft:      "no"
---

Markdown documents (file extension ***.md***) are simple text files with additional special syntax that you can use to style your content, embed images, or create links. 

These documents are interpreted, this means that **what you write is not exactly what will appear** on the website, for this reason, it is recommended to use the VSCode preview pane to see the final result while editing.

### Header

Every file must contain a header in the following format (note that the ***\-\-\-*** lines are required):

    ---
    layout:         page
    title:          Document title
    menu_title:     Menu title
    published:      true
    draft:          false
    date:           2021-11-15
    modified:   	2021-11-21
    order:          /1/2/document-title
    toc:            false
    version:        2.0
    available:      Availability note
    internal:       Internal reference
    ---

- **layout:** always set the value ***page***.
- **title:** set the title of the document.
- **menu_title:** (optional) set a title for the navigation menu if you want to make it different from the main title.
- **published:** set ***true*** to display the document on the website 
- **draft:** (optional) set ***true*** to show a notice that the document is not completed (note that this notice appears automatically if the document is empty or if it contains &lt;todo&gt;&lt;/todo&gt; tag. Set ***"no"*** to never show the notice.
- **date:** set the creation date of the document.
- **modified:** set the date of the last modification of the document.
- **order:** set a string to be used to sort the document in the navigation menu - check existing files to know how sorting works. In general, if the page is the child of a node, it is necessary to insert the order attribute of the parent node plus a slash ***/*** and a number (if you want to give a static position) or a sanitized version of the title (without spaces and special characters - if you want to use alphabetical sorting).
- **toc:** (optional) set ***false*** to hide the automatic table of contents.
- **version:** (optional) used only with visual options - set the version of the visual when the option was introduced.
- **available:** (optional) used only with visual options - set the mode(s) in which the option is available. Setting this attribute will display an indicator under the document title. You can manually place this information in a different location using the [Available Badge](#available-badge).
- **internal:** (optional) used to define some internal reference, useful for maintenance - not displayed on the website.

### Body

Here is a common list of elements you may want to use in your documents. For the full syntax, check out this [external guide](https://www.markdownguide.org/basic-syntax/)

#### Title

Use titles to separate sections of the document. The table of content is automatically created using the structure you define with titles.

> Note that **Title 1** is used as the main title of the document - don't use it.

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>## Title 2</pre>
        </td>
        <td>
            <h2 class="no_toc">Title 2</h2>
        </td>
    </tr>
    <tr>
        <td>
            <pre>### Title 3</pre>
        </td>
        <td>
            <h3 class="no_toc">Title 3</h3>
        </td>
    </tr>
    <tr>
        <td>
            <pre>#### Title 4</pre>
        </td>
        <td>
            <h4 class="no_toc">Title 4</h4>
        </td>
    </tr>
    <tr>
        <td>
            <pre>##### Title 5</pre>
        </td>
        <td>
            <h5 class="no_toc">Title 5</h5>
        </td>
    </tr>
    <tr>
        <td>
            <pre>###### Title 6</pre>
        </td>
        <td>
            <h6 class="no_toc">Title 6</h6>
        </td>
    </tr>
</table>


#### Paragraph

Define paragraphs by inserting a blank line between them.

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>This line is in paragraph 1.

This line is in paragraph 2.</pre>
        </td>
        <td>
            <p>This line is in paragraph 1.</p>
            <p>This line is in paragraph 2.</p>
        </td>
    </tr>
</table>

#### Carriage Return

Put at least two spaces after the end of a line and a carriage return, otherwise the carriage return alone will be ignored.

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>This line is in line 1.  (two spaces here)
This line is in line 2.</pre>
        </td>
        <td>
            This line is in line 1.<br>
            This line is in line 2.
        </td>
    </tr>
</table>

#### Bold


<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>This text is **bold**.</pre>
        </td>
        <td>
            This text is <strong>bold</strong>.
        </td>
    </tr>
</table>

#### Italic

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>This text is *italic*.</pre>
        </td>
        <td>
            This text is <em>italic</em>.
        </td>
    </tr>
</table>

#### Bold Italic

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>This text is ***bold italic***.</pre>
        </td>
        <td>
            This text is <strong><em>bold italic</em></strong>.
        </td>
    </tr>
</table>


#### Unordered List
<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
<pre>
- Item A
- Item B
- Item C
</pre>
        </td>
        <td>
            <ul>
                <li>Item A</li>
                <li>Item B</li>
                <li>Item C</li>
            </ul>
        </td>
    </tr>
</table>

#### Ordered List

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
<pre>
1. Item 1
2. Item 2
3. Item 3
</pre>
        </td>
        <td>
            <ol>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ol>
        </td>
    </tr>
</table>


#### Notice

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>> Use this syntax to write a notice.</pre>
        </td>
        <td>
            <blockquote><p>
                Use this syntax to write a notice.
            </p></blockquote>
        </td>
    </tr>
</table>

#### Code

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>`Use this syntax to write a block of code.`</pre>
        </td>
        <td>
            <code>Use this syntax to write a block of code.</code>
        </td>
    </tr>
</table>

#### Line

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>---</pre>
        </td>
        <td>
            <hr>
        </td>
    </tr>
</table>


#### Link

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>[This website](https://www.sqlbi.com/)</pre>
        </td>
        <td>
            <a href="https://www.sqlbi.com/">This website</a>
        </td>
    </tr>
</table>

The URL of the links can be:

- **Absolute URL**  
    When you need to link a page external to the repo. For instance:

    `[SQLBI website](https://www.sqlbi.com/)`

- **Relative URL**  
    When you need to link a page of the repo. 

    - If the page to link is in the same folder as the document, simply use the file name as the URL.  
        For example, ***smart-filter-pro/changelog.md*** contains the following link to ***smart-filter-pro/about.md***:

        `[About](about.md)`

    - If the page belongs to a different folder, you need to go up one level and include the new folder name in the URL.  
        For example, ***smart-filter-pro/changelog.md*** contains the following link to ***general/licensing.md***:

        `[Licensing](../general/licensing.md)`

- **Anchor**  
    Markdown automatically generates anchors for each title/heading you place in a document.
    An anchor is a way to identify a location in a document.  
    Every anchor has an ID equal to a sanitized version of the title it refers to.  
    For example, a title like this:

    `## Check for updates`

    has an anchor with this ID:

    `check-for-updates`

    Sanitizing the title means that spaces are replaced with dashes ***-*** and all special characters (such as & , ; :) are removed.

    You can create links to anchors by adding a # plus the anchor ID to the URL.  
    For example, ***smart-filter-pro/changelog.md*** contains this link to the Price section of ***general/licensing.md***:
	
    `[Licensing](../general/licensing.md#price)`

    If the link needs to point to an anchor on the same document, you can simply write # plus the anchor ID. 
    For instance:

    `[See "Check for updates" below](#check-for-updates)`

#### Image

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>&#60;img src="images/okviz.png" width="100"&#62;</pre>
        </td>
        <td>
            <img src="assets/images/markdown-editing/okviz.png" width="100">
        </td>
    </tr>
</table>

You are not allowed to embed images in Markdown documents like in Word, but they must be referenced from another location. This means that you need to place image files in a separate folder to use them in a document.

Always create a folder called images in the parent folder of the document you are working on (if it doesn't exist) and put all the images in it. For example, the images of ***smart-filter-pro/about.md*** must be placed in the folder ***_docs/smart-filter-pro/images/***.

> Set a reasonable number of pixels in the ***width*** attribute of the &lt;img&gt; tag (see the [Best Practices](best-practices)).

#### Available Badge

Sometimes it is necessary to display the availability limits of a feature described by the document. You can do this by adding the ***available*** attribute in the [document header](#header) or, if you need to put this information in a different position on the page, you can use this syntax anywhere in the text:

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
            <pre>&#60;div class="badge availability"&#62;Dropdown mode&#60;/div&#62;</pre>
        </td>
        <td>
            <div class="badge availability">Dropdown mode</div>
        </td>
    </tr>
</table>


#### TODO Badge

You can add some placeholders and notes in unfinished documents, to keep track of the content to be edited or the tasks to be performed. You can also define an assignment attribute with the contributor's name.

<table>
    <tr>
        <th>Markdown</th>
        <th>Rendered Output</th>
    </tr>
    <tr>
        <td>
<pre>
&#60;todo&#62;Take a screenshot&#60;/todo&#62;

&#60;todo assign="marco"&#62;TODO&#60;/todo&#62;
</pre>
        </td>
        <td>
            <todo>Take a screenshot</todo><br>
            <todo assign="marco">TODO</todo>
        </td>
    </tr>
</table>

> TODOs are not displayed on the website by default, please contact the administrator to learn how to enable them.
