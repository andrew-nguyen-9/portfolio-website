# Documentation

This folder is the navigation hub for the project. It's written for two readers:
**Andrew** (planning, decisions) and **a fresh Claude session** (orient fast, then
go execute). If you're a new session, read [`/CLAUDE.md`](../CLAUDE.md) first, then
the file that matches your task below.

## Process docs (how we work)

| Doc | Read it when |
|-----|--------------|
| [`WORKFLOW.md`](WORKFLOW.md) | Before starting any phase or segment. The branching + QA + review + merge ritual. |
| [`VERSIONING.md`](VERSIONING.md) | When you need to name a branch, tag, or version. The `v[p].[s].[t]` scheme. |
| [`DESIGN-GUIDELINES.md`](DESIGN-GUIDELINES.md) | Before touching UI, copy, color, type, or motion. The design system + voice. |

## Setup / ops docs

| Doc | Read it when |
|-----|--------------|
| [`CONTACT-EMAIL.md`](CONTACT-EMAIL.md) | Setting up the contact form's Resend email (env vars + domain verification). |
| [`DNS-CAA.md`](DNS-CAA.md) | Adding the CAA / certificate-authority DNS records in Cloudflare. |

## Phases (what we're building)

Each phase has its own folder under [`phases/`](phases). A phase folder holds its
plan, design research, and (once complete) its archived summary + brainstorm.

| Phase | Status | Folder |
|-------|--------|--------|
| **v1.0.0** | ✅ Released (frozen) | [`phases/v1.0.0/`](phases/v1.0.0/ARCHIVE.md) |
| **v2.0.0** | ✅ Released | [`phases/v2.0.0/`](phases/v2.0.0/ARCHIVE.md) |

## Brainstorming (what might come next)

| Doc | What it holds |
|-----|---------------|
| [`brainstorming/v3-ideas.md`](brainstorming/v3-ideas.md) | Seed ideas for v3 — features, fixes, directions. |

## Conventions for this folder

- **One source of truth per concept.** Don't duplicate the workflow into a phase
  plan; link to it.
- **Phase docs are append-only during a phase, archived at the end.** When a phase
  closes, its working notes are consolidated into `phases/v{p}.0.0/ARCHIVE.md` and
  any leftover ideas graduate into the next `brainstorming/` file.
- **Keep the index honest.** If you add a doc, add a row here.
