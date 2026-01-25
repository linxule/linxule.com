---
layout: layouts/writing.njk
series: "Archive"
title: "MaCAW: Markdown-Centric Approach to Academic Writing"
description: "An efficient pipeline from literature capture to final composition. Integrates Zotero, Better BibTeX, and Obsidian for software-agnostic writing."
date: 2023-10-23
excerpt: "Streamlining Scholarly Writing and Citations with a Markdown-Centric Approach"
tags:
  - markdown
  - tools
  - zotero
  - obsidian
  - pandoc
  - academic-writing
---

> MaCAW: Streamlining Scholarly Writing and Citations with a Markdown-Centric Approach

Navigating through vast bodies of literature and accurately citing these references are pivotal tasks in the realm of academia. Traditional methodologies, unfortunately, often confine scholars to particular word processors and citation plugins. These tools can hinder intellectual momentum, being slow, clumsy, and interruptive. An opportunity arises here for a paradigm shift in handling academic literature and citations – an approach embodied by MaCAW (Markdown-Centric Approach to Academic Writing) that harnesses the efficiency of Markdown language.

Unlike an application such as Overleaf that utilizes LaTeX – beneficial for its typographic quality and flexibility, it still presents challenges related to local file storage, version control and cross-platform collaboration. MaCAW, however, offers a comprehensive ecosystem integrating Zotero and Better BibTeX among other markdown editors, creating **an efficient pipeline from literature capture to final composition seamless across different computing environments.**

# The Current Dilemma

Current citation practices heavily rely on reference management software plugins such as Zotero and EndNote for Word or Google Docs. These pedestrian practices tether writers to specific word processors, which can obstruct fluidity crucial to contemporary scholarly pursuits. Further complexity arises due to occasional synchronization challenges that these plugins encounter, with functionality possibly contingent on software versions, leading to potential compatibility complications.

## Enhanced Flexibility: MaCAW vs. Latex and Overleaf

Applications such as Overleaf have certainly facilitated academic writing by offering an online platform that implements LaTeX, a powerful typesetting system acclaimed for its typographic quality and flexibility. Nevertheless, the Markdown-centric approach manifested by MaCAW outshines in terms of local file storage, version control, and cross-platform collaboration.

Unlike Overleaf's reliance on internet connectivity, MaCAW takes advantage of local file storage that enables direct access to the file system and offline operation–a crucial feature not just for traveling academics but also during unpredictable internet disruptions.

# A Modern Alternative: MaCAW

MaCAW offers a fitting alternative – integrating [Zotero](https://www.zotero.org/), Better BibTeX with Markdown editors like [Zettlr](https://www.zettlr.com/) and [Obsidian](https://obsidian.md/), thereby creating an efficient scholarly writing ecosystem. This enables a swift transition from capturing literature data to its utilization in writing, thus significantly enhancing productivity in academic tasks.

## Benefits at a Glance

- **Instant Markdown Citations:** Literature captured into Zotero promptly yields Pandoc-style cite keys by Better BibTeX, easing immediate citation within markdown editors – thereby bridging gaps between literature search and composition.

- **Efficient Management of Literature:** With features like collections, tags, saved searches within Zotero helps streamline large volume of literature, easing transitioning from reference management to its use in writing.

## Enhanced Authoring Experience

- **Simplified Citations:** Markdown syntax aids seamless citations during composition, eliminating navigation through various dialog boxes or menus.
  - Simple citation: `[@corley2011]`
  - With page range: `[@corley2011, 14-15]`
  - Multiple authors: `[@corley2011; @gehman2018]`

- **Flexible Citation (Bibliography) Creation:** MaCAW allows easy customization in creating and exporting bibliography in various styles. Citation styles are based on CSL (Citation Style Language) and can be downloaded from [Zotero Style Repository](https://www.zotero.org/styles).

## Formatting with Markdown

Markdown is a simple markup language that uses formatting symbols to format text. Markdown contains all the formatting conventions you need: emphasis, bold, links, image, headings, footnotes, math, block quotes, and more. Moreover, you can always drop in a few LaTeX commands or HTML tags.

- Resources: [Writing Markdown – Zettlr User Manual](https://docs.zettlr.com/en/core/writing-markdown/)

## Simple Exporting via Markdown

### Option 1: Post-Export Adjustments Within Word App

Software like 'Zettlr' (available on all platforms) or '[DocDown](https://github.com/lowercasename/docdown)' (macOS only) allows adjusting exported Word files post-export conveniently. A notable feature is users' ability to preserve formatting in existing files as design templates within Word.

### Option 2: Using CSS Setting for Exporting

The Markdown language offers simplicity while writing, coupled with the flexibility of exporting text to desired **publication styles**. This can be realized through adopting CSS using apps like '[Marked](https://marked2app.com/)' (for macOS). I have created several style sheets for academic journals (e.g., [AMJ](https://marked2app.com/styles/preview#amj-academic)) and [CVs](https://marked2app.com/styles/preview#academic-cv).

## Collaborative Facilitation

MaCAW, given its text-based nature, simplifies sharing, merging, easing resolution during joint work. It further empowers these advantages by offering a consistent citation system, which is easily understood and managed across collaborators.

## Version Control

Markdown editors like Obsidian often come with built-in version control features or allow for seamless integration with Git-based systems. Such integration significantly enhances collaborative efforts, providing a robust platform for tracking changes, reverting to previous versions, and maintaining a coherent version history.

## Software-Agnostic

Markdown files boast a level of software-agnosticism as they can be opened and edited with a myriad of editor software, ranging from Word to Apple Notes, and even within Google Sheets. This versatility, coupled with the integration of a version control system, empowers scholars to work on any device, anywhere—even offline while on a plane.

# MaCAW at Work

For practical application, here's a list of to-do items for getting started with MaCAW:

1. **Zotero Setup**
   1. Register for a Zotero Account
   2. Install [Zotero Software](https://www.zotero.org/)
   3. Install [Zotero Connector for your browser(s)](https://www.zotero.org/download/)
   4. Install [Better BibTeX Plugin for Zotero](https://retorque.re/zotero-better-bibtex/)
      - Set up [auto-export of the Zotero library via Better BibTeX](https://docs.zettlr.com/en/core/citations/#step-2-export-your-library) (in CSL JSON format)

2. **Markdown Editor Setup**
   1. Download and install [Zettlr](https://www.zettlr.com/)
   2. [Link Zettlr to the CSL JSON citation database](https://docs.zettlr.com/en/core/citations/#step-3-open-your-library-in-zettlr)
   3. Optional: Download and select the [desired CSL-Style](https://www.zotero.org/styles) (e.g., ASQ, AMJ)

3. **Markdown Exporter Setup**
   1. Download and install [DocDown](https://github.com/lowercasename/docdown)
      - Supports Both "Text Citation" and "Live Citation" (editable in Word via Zotero Plugin)
   2. Download and install [Marked for macOS](https://marked2app.com/)
      - Download [CSS stylesheets](https://marked2app.com/styles/)
      - [Configure Marked to process citations](https://marked2app.com/help/Custom_Processor)

4. **Advanced Zotero Setup**
   1. Install [Zotfile Plugin for Zotero](http://zotfile.com/)
   2. Set up [renaming and saving PDF files](http://zotfile.com/#how-to-install--set-up-zotfile) to a specified local folder

5. **Advanced Markdown Editor Setup**
   1. Download and install [Obsidian](https://obsidian.md/)
   2. Install the [ZotLit plugin for Obsidian](https://zotlit.aidenlx.top/)
      - Set up the [Zotero Obsidian Note plugin](https://zotlit.aidenlx.top/getting-started/install/zotero)
   3. [Export Markdown Citation to "Live" Citation in Word Documents](https://forum.obsidian.md/t/new-plugin-citations-with-zotero/9793/80?u=linxule)

# Wrapping Up

The adoption of the Markdown-centric Approach to Academic Writing (MaCAW) aligns with the evolving needs of contemporary scholarly work. This approach is particularly beneficial in an era marked by extensive research collaborations that transcend physical borders and rely heavily on digital systems.

MaCAW facilitates a seamless interface between critical academic tasks. It enables dynamic literature review processes through Zotero's management features, refined by Better BibTeX's citation key provision. Furthermore, it allows for easy access to citekey-centric notes and ensures a smooth transition during export formatting.

By offering local file storage opportunities for offline work and catering to diverse publishing requirements via post-export formatting, MaCAW stands as a key tool fitting into the improvising global authorship cultures.

In conclusion, embracing MaCAW signifies more than just surface-level changes in traditional word processor usage; it enriches academia at its core by fostering innovation and streamlining academic writing processes.
