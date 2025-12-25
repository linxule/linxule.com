---
layout: layouts/writing.njk
series: "Archive"
title: "Tools for Writing in Markdown"
date: 2020-09-30
excerpt: "Markdown Editors, Add-ons for Capture and Reference"
tags:
  - markdown
  - tools
  - obsidian
  - zotero
---

# Compare Markdown Editors (offline)

| Features | [Obsidian.md](https://obsidian.md/) | [Zettlr](https://www.zettlr.com/) | [Bear Note](https://bear.app/) | [Typora](https://typora.io/) |
| --- | --- | --- | --- | --- |
| Best Use Cases | Personal knowledge base, reading notes | Long-form academic writing, create and edit tables | Meeting notes, capture web information, quick notes | Blog post, create and edit table |
| \[\[Wikilinks\]\] | Yes | Yes | Yes | No |
| Auto \[\[Backlinks\]\] | Yes | Possible with [note-link-janitor](https://github.com/andymatuschak/note-link-janitor) | Possible with note-link-janitor | N/A |
| Zettelkasten(yyyyMMddHHmmss) | Yes | Yes | No | No |
| Network Graphs | Yes | No | No | No |
| CWYW(Zotero+Better BibTex) | Possible with [zotpick.applescript](https://github.com/davepwsmith/zotpick-applescript) | Yes (also **click to open PDFs**) | Possible with zotpick.applescript | Possible with zotpick.applescript |
| Platforms | macOS, Windows, Linux | macOS, Windows, Linux | macOS, iOS, iPadOS | macOS, Windows, Linux |
| Rendering (PDFs, docx, slides...) | Possible with [Marked 2 App](https://marked2app.com/) | Yes | Yes | Yes |
| Other notable features | Web-publishing, Custom CSS | Readability scores, Pomodoro timer | Fast syncing via iCloud | Integration with GitHub Desktop |

# Information Capture Tools

## [Roam-Highlighter - Chrome Extension](https://github.com/GitMurf/roam-highlighter#how-to-use-the-highlighter)

- Great for taking notes on webpages and copy highlights in MD
- Output formatted for Roam or Obsidian

## [Mdnotes - Zotero Add-on](https://github.com/argenos/zotero-mdnotes)

- Export Zotero item metadata file and notes to **markdown**
- Create a file for own notes; batch export all of the above
- Adds `# cite key-zotero` as the first header (same as file name)
- Changes `Cite key: autio2018` to `Cite key/Notes: [[autio2018]]` to force the connection with available notes

Sample output:

```markdown
# autio2018-zotero

# Digital affordances, spatial affordances, and the genesis of entrepreneurial ecosystems

## Metadata

* Type: [[Article]]
* Authors: [[Erkko Autio]], [[Satish Nambisan]], [[Llewellyn D. W. Thomas]], [[Mike Wright]]
* Date: [[03/2018]]
* Publication: [[Strategic Entrepreneurship Journal]]
* DOI: [10/gc6dk2](10/gc6dk2)
* Cite key/Notes: [[autio2018]]
* Topics: [[Ecosystem]], [[Innovation Ecosystem]], [[Entrepreneurial Ecosystem]]
```

## [Zotero to Roam Export](https://github.com/melat0nin/zotero-roam-export)

> Zotero exports single or multiple items, as well as collections to Roam's **JSON** format

### (macOS) Keyboard Shortcuts and System Services

- [The Markdown Service Tools](https://brettterpstra.com/projects/markdown-service-tools/) by brettterpstra are a collection of OS X Services designed to make writing Markdown text easier.
- [PopClip Extensions](https://brettterpstra.com/projects/bretts-popclip-extensions/) by brettterpstra
