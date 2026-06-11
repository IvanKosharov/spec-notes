# Research: Sign-Up / Sign-In with Notes Redirect

**Feature**: 002-sign-up-sign-in
**Date**: 2026-06-11

---

## Decision 1: Routing Library

**Decision**: React Router DOM v6 (`react-router-dom@6`)

**Rationale**: Industry-standard router for React SPAs. v6 ships `createBrowserRouter` (data
router API) and nested routes. Supports `<Navigate>` for programmatic redirect after auth.
Well-supported in Vite + React 19 projects.

**Alternatives considered**:
- TanStack Router v1 — type-safe but adds complexity not warranted for a 3-page app
- Wouter — lightweight but less ecosystem support; not worth the lock-in trade-off

---

## Decision 2: Form Management

**Decision**: Controlled React components with plain `useState` + HTML5 constraint validation
supplemented by custom rules in submit handler.

**Rationale**: The form has exactly 2 fields (email, password). React Hook Form is appropriate
for large forms but introduces extra dependency weight for this scope. Plain controlled components
are easier to test with React Testing Library and produce less boilerplate.

**Alternatives considered**:
- React Hook Form — appropriate for 5+ fields; overkill here
- Formik — largely superseded; adds bundle weight

---

## Decision 3: HTTP Client

**Decision**: Native `fetch` wrapped in typed async functions in `src/services/api/authApi.ts`

**Rationale**: Zero-dependency. Fully typed via TypeScript interfaces. Works transparently with
MSW interception. No configuration overhead. Meets Constitution Principle IV (API Contract
Isolation) without adding `axios` to the bundle.

**Alternatives considered**:
- Axios — adds ~14 kB; no meaningful benefit over fetch for simple JSON REST calls
- TanStack Query — appropriate for cache-heavy data fetching; not needed for auth calls

---

## Decision 4: Mock API Strategy

**Decision**: Mock Service Worker v2 (MSW) — browser service worker in dev mode

**Rationale**: MSW intercepts fetch calls at the network level, which means:
- Application code is identical in dev and production (no `if (mock)` branches)
- Vitest tests use `msw/node` server with the same handlers
- No separate mock server process required (`npm run dev` is a single command)

**Alternatives considered**:
- JSON Server — requires a second terminal process; complicates Docker
- Hard-coded stubs in service layer — violates Principle IV (no mock logic in API client)

---

## Decision 5: Styling Approach

**Decision**: Tailwind CSS v3 utility classes + `clsx` for conditional class composition

**Rationale**: Matches Constitution Section II (Technology Stack). `clsx` (< 1 kB) provides a
clean API for conditional classes in form error states and button loading states without
template-literal gymnastics.

**Alternatives considered**:
- `tailwind-merge` — adds deduplication logic not needed for this feature's scope

---

## Decision 6: Test Stack

**Decision**: Vitest + React Testing Library + MSW (node adapter) + Playwright (E2E)

**Rationale**: Vitest integrates natively with Vite config (shared transforms, aliases). RTL
encourages user-behaviour-centric tests. MSW node adapter shares the same handler definitions
used in the browser — single source of truth. Playwright covers the P1 E2E acceptance scenarios.

**Alternatives considered**:
- Jest — requires separate Babel/esbuild transform config; worse Vite integration
- Cypress — heavier than Playwright for a 3-page app

---

## Decision 7: Node / React Versions

**Decision**: Node 20 LTS (pinned in `.nvmrc`), React 19 + Vite 5

**Rationale**: React 19 is stable and specified in the constitution. Vite 5 fully supports
React 19 via `@vitejs/plugin-react`. Node 20 LTS is the GitHub Actions `ubuntu-latest` default.

---

## Resolved Clarifications

All spec items were unambiguous. No NEEDS CLARIFICATION markers were present. The mock-only
scope (no real backend) and no auth-guard requirement were confirmed by the spec assumptions.
