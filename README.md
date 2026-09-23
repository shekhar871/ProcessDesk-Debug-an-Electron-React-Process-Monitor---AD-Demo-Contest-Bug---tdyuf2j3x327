# ProcessDesk

A desktop process monitor built with **Electron + React + Vite**. It lists the processes running
on your machine and lets you search, sort, inspect and stop them. The code is laid out like a real
product rather than one big file: a React renderer, renderer-side service adapters, a preload
bridge, Electron IPC handlers, and domain services on top of the OS.

## Setup

```bash
npm install
npm run dev
```

`npm run dev` starts the Vite dev server and opens the Electron window.

Other scripts: `npm test` (unit and contract tests) and `npm run lint:structure` (checks the
project layout and the renderer/main security boundary).

## Where things live

| Path | What it holds |
|---|---|
| `electron/` | Main process: IPC handlers, domain services, repositories, validators, window setup |
| `electron/preload.js` | The single bridge the renderer is allowed to talk through |
| `src/` | React renderer: components, feature hooks, service adapters, utilities |
| `docs/` | Architecture, IPC flow, data contracts, state flow, debugging playbook |
| `tests/` | Unit and contract tests |

Start with `docs/REPOSITORY_MAP.md` and `docs/ARCHITECTURE.md`; `docs/DEBUGGING_PLAYBOOK.md`
explains how to trace a behaviour across the layers.

## About this repository

This is the starter repository for a Newton School assignment. **The problem statement, the rules
and the marking are the ones shown on the Newton platform** — read them there, not here.
