# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run oxlint
```

## Architecture

Single-page React 19 app (no router) for managing wedding/event guest reception. All state lives in `App.jsx`; components are purely presentational.

**Data flow:**
- `App.jsx` fetches from the backend REST API at `https://backinvitacionc.vercel.app/guests` on mount and after any mutation.
- The API returns `{ data: [...] }` where each item has `{ id, name, count, table, status, arrived }`. These are mapped to the internal shape `{ id, familyName, passes, table, status, original }` with a three-way status: `Pending` → `Confirmed` → `Arrived`.
- Status transitions are one-way: Pending→Confirmed (`PATCH { status: 'confirmed' }`), any→Arrived (`PATCH { arrived: true }`). There is no undo.
- All API calls go through `App.jsx` handlers (`handleSaveGuest`, `handleUpdateStatus`, `handleDeleteGuest`), which re-fetch the full list after writes.

**Components:**
- `GuestForm` — controlled form modal for create/edit; receives `initialData` to pre-populate for edits.
- `GuestList` — renders the filtered table; clicking a row opens a welcome modal in `App.jsx` showing the guest's assigned table.

**No state management library, no routing, no tests.** Linter is oxlint (not ESLint) with React hooks rules enforced.
