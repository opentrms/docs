---
id: workbench-overview
title: Workbench architecture overview
description: How the TRMS Agent Workbench frontend is structured and how its shell, surface registry, and chat-driven workspace fit together.
---

<div className="eyebrow">Frontend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Workbench architecture overview

The TRMS Agent Workbench lives in the separate `opentrms-workbench` repository.
It is a Vite + React + TypeScript single-page app that combines:

- a scope-gated left navigation
- a tile-based multi-panel workspace
- an AI chat pane that can open and update UI surfaces

The workbench is the operator-facing frontend for `opentrms`, not a separate
business system. Its job is to orchestrate backend APIs into a workstation UI.

## Stack and runtime model

The current frontend stack is:

- Vite 5
- React 18
- TypeScript in strict mode
- TanStack Router, Query, and Table
- Zustand for client-side shell state
- shadcn/ui and Tailwind
- React Hook Form + Zod
- Framer Motion
- `react-grid-layout`
- Playwright, Vitest, MSW, and axe-core

At runtime, `App.tsx` wires the shell in this order:

1. `AuthProvider`
2. `TokenBridge`
3. `SystemDateBootstrap`
4. `Shell`

That ordering matters. The auth layer owns the token, the API client consumes
it, the system-date bootstrap hydrates business-date context, and only then does
the main workspace mount.

## The shell

`Shell.tsx` is the top-level workstation layout. It composes:

- `TopBar`
- `LeftNav`
- `Workspace`
- `ChatPane` or `MobileChatDrawer`
- `ActivityStrip`
- `CommandPalette`
- layout/template dialogs

Desktop layouts can dock chat on the right or footer. Mobile switches to a
stacked workspace model and a bottom drawer chat experience.

The shell also owns:

- autosave recovery for the previous workspace session
- global shortcuts
- left-nav mobile drawer state
- chat focus and maximize-panel actions

## Registry-driven surfaces

The workbench does not hardcode each screen into the router. Instead it uses:

- `src/app/navConfig.ts` for left-nav grouping and scope requirements
- `src/screens/registry.ts` for surface metadata and lazy-loaded components

Each surface declares:

- its kind: `form`, `report`, `detail`, or `mixed`
- required scopes
- i18n namespace
- default tile layout
- optional breadcrumb or "ask AI" support

That registry pattern is what lets the agent open a surface by key, the command
palette browse the same catalog, and the workspace render it without a route per
screen.

## Workspace behavior

`Workspace.tsx` renders non-detached panels in a grid layout on desktop and a
mobile stack on smaller screens. The same panel model supports:

- drag and resize
- detach to a separate window
- restore from detached state
- saved layouts and templates
- payload patching after a surface is already open

Detached panels use a `BroadcastChannel` bridge so state stays synchronized with
the main shell.

## Scope-gated navigation

The left nav is not just a menu; it is an entitlement filter over the surface
catalog. A nav item only appears when the current user has the scopes required
for that surface.

This is especially visible in the access-administration section:

- `users:admin` reveals the User Access Workbook
- `entitlements:admin` reveals the Access Policy Console
- users without either scope do not see that section at all

The UI therefore reflects what the token can do before the user even clicks.

## Chat is part of the workspace contract

The AI pane is not bolted on after the fact. It participates in the same panel
model as direct navigation:

- the agent can open a surface with a `ui_action`
- payloads can prefill forms or filters
- the workspace treats chat-opened and nav-opened panels the same way

That is why most surfaces are tested through both the chat path and the direct
nav path.

## Related reading

- [Workbench feature guides](/frontend/feature-guides)
- [Workbench backend integration](/frontend/backend-integration)
- [Workbench Playwright coverage](/frontend/e2e-playwright)
