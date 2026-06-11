# Quickstart: Sign-Up / Sign-In with Notes Redirect

**Feature**: 002-sign-up-sign-in
**Date**: 2026-06-11

---

## Prerequisites

- Node 20 LTS (check with `node -v`; use `.nvmrc` to switch via `nvm use`)
- npm 10+ (`npm -v`)
- Git

---

## First-Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (if not already present)
cp .env.example .env
```

`.env.example` contains:
```
VITE_API_BASE_URL=/api
```

---

## Run in Development Mode

```bash
npm run dev
```

App starts at **http://localhost:5173**

- The sign-up page is the default route (`/`).
- MSW service worker is registered automatically in development mode.
- No separate backend process is required.

---

## Validate Acceptance Scenarios

### Sign-Up (US1)

1. Open http://localhost:5173 — you should see the Sign Up form.
2. Enter `test@example.com` and `password123`, click **Sign Up**.
3. You should land on `/notes` showing **"Welcome"**.
4. Refresh — you land back on `/` (no session persistence, per spec assumptions).

**Error path**: Enter `bad-email` and click Sign Up — inline email error appears. Enter
`short` as password — inline password error appears. No navigation in either case.

### Sign-In (US2)

1. Navigate to `/signin` (or click the sign-in link from the sign-up page).
2. Enter the same credentials you used above: `test@example.com` / `password123`.
3. You should land on `/notes`.

**Error path**: Enter `wrong@example.com` / `wrongpass` — API error message
"Invalid email or password." appears below the form. No navigation.

### Toggle Forms (US3)

1. From the sign-up page, click **Already have an account? Sign in**.
2. The sign-in form appears at `/signin`.
3. Click **Don't have an account? Sign up** — returns to `/`.

---

## Run Tests

```bash
# Unit + component tests (Vitest + RTL)
npm run test

# Tests with coverage report
npm run test:coverage

# End-to-end tests (Playwright — requires dev server running)
npm run test:e2e
```

Expected: all tests green before any PR is merged.

---

## Production Build

```bash
npm run build
```

Output goes to `dist/`. Verify:
```bash
npm run preview   # serves dist/ locally at http://localhost:4173
```

---

## Docker Build (local verification)

```bash
docker build -t sign-up-sign-in-app .
docker run -p 8080:80 sign-up-sign-in-app
```

Visit **http://localhost:8080** — same sign-up flow as dev mode.

---

## Key Files

| Path | Purpose |
|------|---------|
| `src/main.tsx` | App entry point; MSW startup |
| `src/router/index.tsx` | Route definitions |
| `src/features/auth/` | Sign-up and sign-in components + hooks |
| `src/pages/NotesPage.tsx` | Placeholder notes page |
| `src/services/api/authApi.ts` | API client (fetch wrapper) |
| `src/mocks/handlers/auth.ts` | MSW request handlers |
| `.env` / `.env.example` | Environment variable template |
| `Dockerfile` | Production container definition |
| `.github/workflows/ci.yml` | CI pipeline |
| `.github/workflows/docker-publish.yml` | Docker build + ECR push |

See [data-model.md](./data-model.md) for entity definitions and
[contracts/auth-api.md](./contracts/auth-api.md) for mock API request/response shapes.
