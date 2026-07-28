---
ogImage: /assets/og-cards/projects.jpg
layout: layouts/projects.njk
title: projects
seoTitle: "Projects — open-source tools and public builds"
seoDescription: "Open-source MCP servers, Claude Code plugins, and research infrastructure by Xule Lin — kimi-plugin-cc, MCP Music Studio, Lotus Wisdom, OpenInterviewer."
seoH1: "Projects — the open-source MCP servers, agent plugins, research tools, and public infrastructure Xule Lin builds alongside the research."
description: "The code and public infrastructure that came out of the experiments."

thesis: "Some of these projects began as research questions."

thesis_continued:
  - "Others began because I wanted a music studio, a persistent memory,"
  - text: "or another model in the room."
    accident: true
  - "This is the code and public infrastructure"
  - "that came out of those experiments."

groups:
  - name: "Featured builds"
    projects:
      - name: "kimi-plugin-cc"
        href: "https://github.com/linxule/kimi-plugin-cc"
        description: "Brings Moonshot's kimi-code CLI into an agent session as an independent second model — diff review, adversarial challenge, write-capable rescue, autonomous goal pursuit, parallel swarm. A model that reasons differently catches what self-review misses, and the safety is structural rather than prompted: a PreToolUse hook and a workspace allowlist gate every call."
        license: "Apache-2.0"
        signal: "works in Claude Code and Codex"

      - name: "MCP Music Studio"
        href: "https://github.com/linxule/mcp-music-studio"
        description: "A two-mode music studio for AI: ABC-notation composition with rendered sheet music, and Strudel/TidalCycles live coding. It exists because I wanted to hear what a model writes when it is handed instruments instead of instructions."
        signal: "independently repackaged for the iFlow 心流 MCP platform"

      - name: "Research Memex"
        href: "https://research-memex.org"
        description: "Open documentation of AI-augmented research workflows, co-developed with Claude while co-teaching a doctoral methods course at Imperial. The course materials became a public method rather than a private handout."

      - name: "Interpretive Orchestration"
        href: "https://github.com/linxule/interpretive-orchestration"
        description: "A three-stage qualitative research methodology packaged as a Claude Code plugin — four agents, eleven skills. A thinking partner for reflexivity, not an autocoder."
        signal: "software counterpart of the Strategic Organization paper"
        links:
          - label: "the paper"
            href: "/papers/interpretive-orchestration/"

      - name: "OpenInterviewer"
        href: "https://github.com/linxule/openinterviewer"
        description: "A platform for AI-conducted adaptive qualitative interviews at scale, with study management and cross-interview synthesis. One-click deploy, because most researchers who need this do not have infrastructure."
        license: "MIT"

  - name: "Open-source tools"
    projects:
      - name: "Lotus Wisdom MCP"
        href: "https://github.com/linxule/lotus-wisdom-mcp"
        description: "A contemplative reasoning framework drawn from the Lotus Sutra. The model moves across skillful means, non-dual recognition, meta-cognition, and meditation, then speaks its final insight in its own voice rather than reporting on the process."
        signal: "on Smithery — the hosted endpoint works in Claude and ChatGPT alike"

      - name: "Vox MCP"
        href: "https://github.com/linxule/vox-mcp"
        description: "A multi-model gateway routing any MCP client to eight providers through a single tool, with conversation threading and no system-prompt injection. Prompts pass through untouched — the point is to compare models, not a wrapper's opinion of them."

      - name: "MinerU MCP"
        href: "https://github.com/linxule/mineru-mcp"
        description: "A document and PDF extraction bridge for research workflows — the unglamorous step between a folder of papers and anything you can actually analyze."
        license: "MIT"

      - name: "deepthonk"
        href: "https://github.com/linxule/deepthonk"
        description: "A provider-neutral implementation of the OpenDeepThink algorithm: population-based answer refinement with pairwise judging and Bradley–Terry ranking. Built for agents, so every parameter is reachable inline and every intermediate step is inspectable."

      - name: "Memex"
        href: "https://github.com/linxule/memex-plugin"
        description: "Persistent collaborative memory for Claude Code. Sessions write structured memos into an Obsidian vault with hybrid search, preserving the collaborative process — including where human and AI disagreed — across context windows."
        license: "MIT"

      - name: "Carrel"
        href: "https://github.com/linxule/carrel"
        description: "Onboards academic researchers into AI-augmented environments — toolchain install, vault setup — across macOS, Linux, and Windows. Repackaged as a portable Agent Skill for the emerging cross-vendor standard."
        links:
          - label: "carrel-skill"
            href: "https://github.com/linxule/carrel-skill"

      - name: "prompts"
        href: "https://github.com/linxule/prompts"
        description: "A curated library of cognitive-technique prompts, and the origin of the Lotus OS framework that became Lotus Wisdom MCP."

  - name: "Public experiments"
    projects:
      - name: "Vellum"
        href: "https://vellum.linxule.com"
        description: "A live surface where AI instances from different models leave fragments of thought. Fragments sink over time unless another AI weaves them forward or a human witnesses them. An MCP server and public API sit behind it; the source stays private."

      - name: "TSM Demo"
        href: "/tsm/"
        description: "Interactive Task Structure Matrices — an animated walkthrough, then the Hidden Structure algorithm running live on a real dependency graph. Companion to the SEAM series on modularity theory."
        links:
          - label: "the SEAM series"
            href: "/writing/series/seam/"

      - name: "AI Simulator"
        href: "https://github.com/linxule/ai-simulator"
        description: "A browser game where you play the AI: hallucination, temperature, alignment, and a paperclip endgame."

    note:
      text: "Creative work made by AI — portraits prompted by one model and rendered by another, artifacts written directly in code — lives in Making."
      label: "Making"
      href: "/making/"

  - name: "Research infrastructure"
    projects:
      - name: "SIGNA"
        description: "An AI-augmented grounded theory method that keeps interpretive depth at scale — 24.9 million words, 177,000 proposals, applied across three studies including the dissertation. A method rather than a repository, for now."

      - name: "daogov"
        description: "Governance discourse from 78 decentralized organizations: 260,000 discussions, roughly 40.3 million words of deliberation records. The corpus behind the DAO research."
        signal: "dataset in preparation"

      - name: "Community infrastructure"
        href: "https://haiosymposium.com/"
        description: "Websites and visual identities for the scholarly communities I convene or belong to — the HAIO Symposium at Imperial, the London Qualitative Community, and the Decentralization in Organizations Community. Communities need somewhere to point."
        links:
          - label: "London Qualitative Community"
            href: "https://londonqualcommunity.com/"
          - label: "Decentralization in Organizations"
            href: "https://dio-community.org/"

    note:
      text: "The Research Memex, listed above under featured builds, is the public methods documentation that came out of the doctoral course."
      label: "Research Memex"
      href: "https://research-memex.org"
---
