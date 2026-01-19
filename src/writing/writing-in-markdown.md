---
layout: layouts/writing.njk
series: "Archive"
title: "Writing in Markdown"
description: "Cite-while-you-write with Zotero and export via Marked 2. CSS templates for AMJ, Chicago style, and academic CVs included."
date: 2020-09-30
excerpt: "Cite-while-you-write, Bibliography, Document Layouts"
tags:
  - markdown
  - writing
  - zotero
  - tools
---

# Cite-while-you-write (CWYW) with Zotero

Cite-while-you-write (CWYW) is the important step in academic writing. A good setup can make writing with Markdown and formatting with Marked 2 app much more rewarding.

Steps:
- Write with [Zettlr](https://www.zettlr.com/)
- Write with other editors (macOS)
  - [Zotpick.applescript by davepwsmith](https://davepwsmith.github.io/academic-scrivener-howto/)
  - [ZotHero via Alfred](https://github.com/deanishe/zothero)

# Export with Marked 2 app

To share my writing with others, I use [Marked 2 app](https://marked2app.com/) (macOS) to convert the Markdown files into other formats, such as PDF or DOCX.

**TL;DR:**

1. Configure Marked 2 to process citation in markdown files (.csl)

   Marked 2 App -> Preferences -> Advanced
   Set Path to:
   ```
   /usr/local/bin/pandoc
   ```
   Set Args to:
   ```
   -f markdown+smart -t html5 --filter=/usr/local/bin/pandoc-citeproc --bibliography ~/Zotero/Library.bib --csl ~/Documents/Zotero/Pandoc/CSL/amj.csl
   ```
2. Preview/drag&drop markdown files in Marked 2 app
3. Choose the styles for the document (.css)
4. Export to PDF, DOCX, or HTML

## Configure Marked 2 App

You need:

- Zotero with BetterBibTex
- Pandoc and pandoc-citeproc
- [Citation Style Language (CSL)](https://citationstyles.org/) file for the reference style of your choice. Preview and download at the [Zotero Style Repository](https://www.zotero.org/styles).

## Select Document Style

- Marked 2 converts a Markdown file into HTML document file, which in turn gets formatted according to a chosen CSS template
- [CSS](https://www.w3schools.com/css/default.asp) is a language that describes the style of an HTML document

**Choose the Right Style:**

- Marked 2 has a [Style Gallery](https://marked2app.com/styles/#). I have contributed a template ([Chicago Academic](https://marked2app.com/styles/preview#Chicago%20Academic)) based on the Chicago Manual of Style.
- Additional CSS templates I created for academic writing:
  - **Chicago Academic.css**: based on [The Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html)
  - **AMJ Academic.css**: based on the [Academy of Management Journal Style Guide](http://aom.org/publications/amj/styleguide/)
  - **Academic CV.css**: suitable for both academic and industry CVs
  - **Academic Review.css**: based on [Academy of Management's Reviewer Guidelines](http://aom.org/annualmeeting/reviewerguidelines/)

## Print and Share

- **To PDF**: Marked 2 supports direct export to PDF format; alternatively, export to HTML format and print from your browser
- **To DOCX**: export to HTML format and open/save to DOCX format in Microsoft Word

## Issues and Limitations with Marked 2

Marked 2 app has issues with exporting files into Word documents. The formats defined by CSL files can be lost.

- **Solution 1**: Export to HTML files, then open with Word
- **Solution 2**: Use [DocDown](https://raphaelkabo.com/blog/posts/introducing-docdown/) by Ralph Kabo

# DocDown: Alternatives to Marked 2

- [Download via GitHub](https://github.com/lowercasename/docdown)
- "Takes Markdown files, filters them through a Zotero bibliography file, a CSL file, and a reference .docx file, and exports a Word document with embedded citations and styles."
- [About DocDown](https://raphaelkabo.com/blog/introducing-docdown/)
- [Set your own workflow from markdown to docx](https://raphaelkabo.com/blog/markdown-to-word/)
