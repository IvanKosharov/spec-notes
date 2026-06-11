---
description: "Task list for Sign-Up / Sign-In with Notes Redirect"
---

# Tasks: Sign-Up / Sign-In with Notes Redirect

**Input**: Design documents from `/specs/002-sign-up-sign-in/`

**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/auth-api.md ✅

**Tests**: Included — Constitution Principle III (Test-First) is NON-NEGOTIABLE; tests MUST
be written RED before any implementation code is added.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1 = sign-up, US2 = sign-in, US3 = form toggle)
- File paths are relative to the repository root

---

## Phase 1: Project Initialization

**Purpose**: Scaffold the Vite + React 19 + TypeScript project and configure all tooling.
No application code in this phase — only project skeleton and config files.

- [x] T001 Scaffold Vite + React 19 TypeScript project in repository root using `npm create vite@latest . --template react-ts` (creates package.json, vite.config.ts, tsconfig.json, src/main.tsx, src/App.tsx)
- [x] T002 Install runtime dependencies: `react-router-dom clsx msw tailwindcss postcss autoprefixer` in package.json
- [x] T003 [P] Install dev dependencies: `vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks prettier` in package.json
- [x] T004 Initialize and configure Tailwind CSS: run `npx tailwindcss init -p`, update tailwind.config.ts content paths, add Tailwind directives to src/index.css
- [x] T005 Configure TypeScript strict mode in tsconfig.json (`strict: true`, `target: "ES2022"`, `lib: ["ES2022","DOM","DOM.Iterable"]`) and tsconfig.node.json
- [x] T006 Configure Vite and Vitest in vite.config.ts (add `test: { environment: "jsdom", globals: true, setupFiles: ["./tests/setup.ts"], coverage: { provider: "v8" } }`)
- [x] T007 [P] Configure ESLint in eslint.config.js (typescript-eslint + react-hooks rules) and Prettier in .prettierrc
- [x] T008 [P] Create .nvmrc (content: `20`), .env.example (content: `VITE_API_BASE_URL=/api`), update .gitignore to exclude dist/, .env

**Add npm scripts** to package.json:
- [x] T009 Add scripts to package.json: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:coverage`, `test:e2e`

**Checkpoint**: `npm run dev` starts a blank React app; `npm run test` runs (no tests yet)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on — MSW mock layer, API client,
router, shared UI components, and app entry point. No user story work begins until complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T010 Initialize MSW service worker in public/ (`npx msw init public/ --save`) and create tests/setup.ts with `afterEach(() => server.resetHandlers())` and vitest globals
- [x] T011 Create MSW auth request handlers in src/mocks/handlers/auth.ts — POST /api/auth/signup (200 success, 409 duplicate@example.com) and POST /api/auth/signin (200 success, 401 wrong credentials) per contracts/auth-api.md
- [x] T012 Create MSW browser export in src/mocks/browser.ts (`setupWorker(...handlers)`)
- [x] T013 Create MSW node server export in src/mocks/server.ts (`setupServer(...handlers)`) for use in Vitest
- [x] T014 Create typed API client in src/services/api/authApi.ts — `signUp(email, password): Promise<AuthResponse>` and `signIn(email, password): Promise<AuthResponse>` using `fetch` and `VITE_API_BASE_URL`; define `AuthResponse` interface in same file
- [x] T015 Create React Router in src/router/index.tsx using `createBrowserRouter` with three routes: `/` → SignUpPage, `/signin` → SignInPage, `/notes` → NotesPage
- [x] T016 [P] Create placeholder NotesPage in src/pages/NotesPage.tsx (renders a heading "Welcome" — no auth guard, per spec assumption)
- [x] T017 [P] Create reusable Input component in src/components/ui/Input.tsx (props: `id`, `label`, `type`, `value`, `onChange`, `error?: string`; shows error message when present)
- [x] T018 [P] Create reusable Button component in src/components/ui/Button.tsx (props: `type`, `disabled`, `isLoading`, `children`; shows spinner text when loading)
- [x] T019 Update src/main.tsx to start MSW browser worker in dev mode (`import.meta.env.DEV`) before mounting, and wrap app with `RouterProvider` from src/router/index.tsx; delete default src/App.tsx

**Checkpoint**: Foundation ready — `npm run dev` shows the app skeleton; router is wired;
MSW starts in dev console. User story implementation can now begin.

---

## Phase 3: User Story 1 — New User Signs Up (Priority: P1) 🎯 MVP

**Goal**: A new visitor can submit email + password, have it validated, call the mock API,
and be redirected to /notes on success.

**Independent Test**: Run the app, fill in a new email + password on /, click Sign Up,
confirm /notes shows "Welcome". No other user story required.

### Tests for User Story 1 ⚠️ Write FIRST — confirm RED before implementing

> **Constitution Principle III: Tests MUST fail before implementation code is written**

- [x] T020 [P] [US1] Write failing SignUpForm component tests in tests/unit/features/auth/SignUpForm.test.tsx — cover: valid submission calls signUp and navigates to /notes; invalid email shows inline error; password < 8 chars shows inline error; API conflict error shows form-level message; submit button disabled while submitting
- [x] T021 [P] [US1] Write failing authApi.signUp unit tests in tests/unit/services/authApi.test.ts — cover: success response returns `{ success: true, token }`, conflict returns `{ success: false, error }` (use MSW node server)

### Implementation for User Story 1

- [x] T022 [US1] Implement useSignUp hook in src/features/auth/useSignUp.ts — manages `FormState` (email, password, errors, apiError, isSubmitting), validates fields on submit, calls `authApi.signUp`, navigates to `/notes` on success via `useNavigate`
- [x] T023 [US1] Implement SignUpForm component in src/features/auth/SignUpForm.tsx — uses `useSignUp` hook, renders `Input` (email, password) and `Button` (submit), displays field errors and API error, link placeholder for US3
- [x] T024 [US1] Implement SignUpPage in src/pages/SignUpPage.tsx — page layout (centered card) wrapping `SignUpForm`
- [x] T025 [US1] Write and confirm passing Playwright E2E test for sign-up flow in tests/e2e/auth.spec.ts — covers: successful sign-up redirects to /notes; invalid email stays on page; wrong-length password stays on page

**Checkpoint**: At this point, User Story 1 is fully functional. Run `npm run test` and
`npm run test:e2e` — all US1 tests GREEN. Navigate to http://localhost:5173 and complete sign-up manually.

---

## Phase 4: User Story 2 — Existing User Signs In (Priority: P1)

**Goal**: A returning user can enter credentials on /signin, call the mock API, and be
redirected to /notes. Invalid credentials show an error.

**Independent Test**: Navigate to /signin (or use the mock credential after a sign-up),
submit valid credentials, confirm /notes shows "Welcome".

### Tests for User Story 2 ⚠️ Write FIRST — confirm RED before implementing

- [x] T026 [P] [US2] Write failing SignInForm component tests in tests/unit/features/auth/SignInForm.test.tsx — cover: valid credentials submits and navigates to /notes; empty email shows error; empty password shows error; wrong credentials shows API error message
- [x] T027 [P] [US2] Write failing authApi.signIn unit tests in tests/unit/services/authApi.test.ts (extend existing file) — cover: success returns `{ success: true, token }`, 401 returns `{ success: false, error: "Invalid email or password." }`

### Implementation for User Story 2

- [x] T028 [US2] Implement useSignIn hook in src/features/auth/useSignIn.ts — same pattern as useSignUp: validates fields, calls `authApi.signIn`, navigates to `/notes` on success
- [x] T029 [US2] Implement SignInForm component in src/features/auth/SignInForm.tsx — renders email + password inputs with `Input` and `Button` components, shows errors, link placeholder for US3
- [x] T030 [US2] Implement SignInPage in src/pages/SignInPage.tsx — page layout wrapping `SignInForm`
- [x] T031 [US2] Extend tests/e2e/auth.spec.ts with sign-in E2E scenario — covers: valid credentials redirects to /notes; wrong credentials stays on /signin with error message

**Checkpoint**: User Stories 1 AND 2 are independently functional. Run all tests — GREEN.

---

## Phase 5: User Story 3 — Navigation Between Forms (Priority: P2)

**Goal**: A user on either form can switch to the other form via a visible link.

**Independent Test**: From /, click "Already have an account? Sign in" and confirm /signin
loads. From /signin, click "Don't have an account? Sign up" and confirm / loads.

### Tests for User Story 3 ⚠️ Write FIRST — confirm RED before implementing

- [x] T032 [P] [US3] Write failing navigation link tests — extend tests/unit/features/auth/SignUpForm.test.tsx (link renders and navigates to /signin) and tests/unit/features/auth/SignInForm.test.tsx (link renders and navigates to /)

### Implementation for User Story 3

- [x] T033 [US3] Add "Already have an account? Sign in" `<Link to="/signin">` to src/features/auth/SignUpForm.tsx (replaces placeholder added in T023)
- [x] T034 [US3] Add "Don't have an account? Sign up" `<Link to="/">` to src/features/auth/SignInForm.tsx (replaces placeholder added in T029)

**Checkpoint**: All three user stories independently functional. Full test suite GREEN.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Containerisation, CI/CD pipeline, and final validation.

- [x] T035 [P] Create Dockerfile with multi-stage build in Dockerfile (stage 1: `node:20-alpine` builds `dist/`; stage 2: `nginx:alpine` copies dist and nginx.conf)
- [x] T036 [P] Create nginx.conf for SPA routing in nginx.conf — `try_files $uri $uri/ /index.html` so React Router handles all paths
- [x] T037 Create GitHub Actions CI workflow in .github/workflows/ci.yml — triggers on PR and push to main; steps: checkout, node 20, npm ci, eslint, tsc --noEmit, vitest run, vite build
- [x] T038 Create GitHub Actions Docker publish workflow in .github/workflows/docker-publish.yml — triggers after ci.yml on main; steps: AWS OIDC auth, ECR login, docker build + push (tags: git SHA + latest), ECS update-service
- [x] T039 [P] Create .aws/task-definition.json skeleton with placeholder values for task family, container name, ECR image URI, CPU, memory, and environment variables (VITE_API_BASE_URL)
- [x] T040 Run full validation: `npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build`, `npm run test:e2e` — all must pass with zero errors
- [x] T041 Validate quickstart.md steps manually against the running app at http://localhost:5173 and confirm all acceptance scenarios in quickstart.md pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Requires Phase 1 complete — **BLOCKS all user stories**
- **Phase 3 (US1 sign-up)**: Requires Phase 2 — no dependency on US2 or US3
- **Phase 4 (US2 sign-in)**: Requires Phase 2 — no dependency on US1 or US3
- **Phase 5 (US3 toggle)**: Requires Phase 3 AND Phase 4 (adds links to both forms)
- **Phase 6 (Polish)**: Requires all user story phases complete

### User Story Dependencies

- **US1 (sign-up)**: Independent after Phase 2
- **US2 (sign-in)**: Independent after Phase 2 — can run in parallel with US1
- **US3 (form toggle)**: Requires US1 and US2 (modifies both forms)

### Within Each User Story

1. Write tests → confirm RED
2. Implement → make tests GREEN
3. E2E test → confirm acceptance scenario
4. Checkpoint validation

### Parallel Opportunities

- T002 and T003: install in parallel (both npm install calls)
- T007 and T008: config files, no interdependencies
- T016, T017, T018: NotesPage, Input, Button — different files, parallel
- T020 and T021: US1 tests — different test files, parallel
- T026 and T027: US2 tests — different test files, parallel
- T035 and T036: Dockerfile and nginx.conf — parallel
- US1 and US2 implementation phases — can run in parallel after Phase 2

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational) — CRITICAL, blocks all stories
3. Complete Phase 3 (US1 — sign-up)
4. **STOP and VALIDATE**: `npm run test`, sign up manually, confirm /notes
5. Ship or demo the sign-up-only MVP

### Incremental Delivery

1. Phase 1 + 2 → app skeleton + mock API ready
2. Phase 3 (US1) → sign-up works → demo/test independently
3. Phase 4 (US2) → sign-in works → demo/test independently
4. Phase 5 (US3) → form toggle → demo/test
5. Phase 6 → Docker + CI/CD → deploy-ready

### Parallel Team Strategy

With two developers after Phase 2 completes:
- Developer A: Phase 3 (US1 — sign-up)
- Developer B: Phase 4 (US2 — sign-in)
- Merge before Phase 5 (US3 needs both forms)

---

## Notes

- [P] tasks = different files, no interdependencies — safe to run concurrently
- [USn] label maps each task to a specific user story for traceability
- Tests MUST be written and confirmed FAILING before any implementation task in the same story
- MSW handlers are the single source of truth for mock API behaviour in both dev and tests
- MSW MUST be conditionally started (`import.meta.env.DEV`) — never active in production build
- `VITE_API_BASE_URL` is the only environment variable; set in .env for local dev
- All TypeScript files MUST compile with `tsc --noEmit` cleanly before a phase is considered done
