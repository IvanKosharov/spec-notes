<!--
SYNC IMPACT REPORT
==================
Version change: N/A (template) → 1.0.0 (initial creation)

Modified principles: none (initial constitution)

Added sections:
  - Core Principles (5 principles)
  - Technology Stack & Tooling
  - CI/CD & Deployment Pipeline
  - Governance

Templates requiring updates:
  - .specify/templates/plan-template.md     ✅ aligned — Constitution Check gate already present
  - .specify/templates/spec-template.md     ✅ aligned — user stories, requirements, success criteria match
  - .specify/templates/tasks-template.md    ✅ aligned — test-first phased structure matches Principle III

Deferred TODOs: none
-->

# React SPA Constitution

## Core Principles

### I. TypeScript-First (NON-NEGOTIABLE)

All source files MUST be TypeScript (`.ts` / `.tsx`). The `any` type is PROHIBITED; use
`unknown` with type guards where strict inference is insufficient. `tsconfig.json` MUST
enable `strict: true`. Third-party library types MUST be declared via `@types/*` packages
or local `.d.ts` shims — never suppressed with `// @ts-ignore` without an approved
workaround comment explaining the upstream constraint.

**Rationale**: TypeScript strict mode catches the class of runtime errors that are most
expensive to debug in a containerised SPA with an external API dependency. Type safety is
the first line of defence against backend contract drift.

### II. Component Architecture — Functional & Composable (NON-NEGOTIABLE)

React components MUST be functional (hooks only); class components are PROHIBITED. Each
component MUST have a single, clear responsibility and accept typed props via a named
TypeScript interface. Shared UI primitives MUST live in `src/components/ui/`; page-level
compositions in `src/pages/`; feature logic in `src/features/`. Components MUST NOT
contain direct API calls — all data fetching MUST go through the service layer (see
Principle IV).

**Rationale**: React 19 concurrent features and the forthcoming React Compiler are designed
around the functional model. Class components opt out of these optimisations and increase
onboarding friction.

### III. Test-First (NON-NEGOTIABLE)

Tests MUST be written and confirmed RED before implementation code is added (strict TDD).
Unit and component tests use Vitest + React Testing Library. A coverage gate is enforced
in CI — PRs that regress coverage on touched paths MUST NOT be merged. Integration tests
that exercise the full component → service → API mock boundary MUST exist for every
user-facing journey defined in the feature spec. End-to-end tests (Playwright) are
REQUIRED for critical user flows defined as P1 in the spec.

**Rationale**: Tests written after the fact converge on the implementation rather than the
requirement, producing low-value assertions that miss edge cases and contract violations.

### IV. API Contract Isolation

All HTTP interactions with the REST backend MUST go through a dedicated API client layer
(`src/services/api/`). Components and hooks MUST consume typed response interfaces —
never raw `fetch` or `axios` calls in component files. The base URL MUST be injected from
an environment variable (`VITE_API_BASE_URL`). Mock Service Worker (MSW) MUST be used
in all automated tests to intercept API calls; no live backend requests are permitted
in CI.

**Rationale**: The REST backend lives in a separate project and deployment boundary. An
isolated service layer makes contract changes visible at the TypeScript type layer, enables
independent frontend CI without a running backend, and decouples the two release cycles.

### V. Containerisation & CI/CD Gate (NON-NEGOTIABLE)

The Docker image is the ONLY deployable artifact. Manual deployment to AWS ECS is
PROHIBITED outside of the GitHub Actions pipeline. Every push to `main` MUST trigger
the full pipeline: lint → typecheck → test suite → Docker build & push to AWS ECR →
ECS service update. Environment-specific configuration MUST be injected at container
runtime via ECS task-definition environment variables — never baked into the image.
AWS credentials MUST be provided via OIDC; no static IAM access keys in repository
secrets.

**Rationale**: A single, auditable pipeline eliminates environment drift and ensures every
production image is traceable to a passing CI run on a verified commit SHA.

## Technology Stack & Tooling

- **Framework**: React 19 with Vite as the build tool (no Create React App, no Next.js)
- **Language**: TypeScript, strict mode, target `ES2022`
- **Styling**: Tailwind CSS — utility classes only. No hand-authored CSS files except
  global base styles in `src/index.css`. Component-level style composition MUST use
  `clsx` or the project's `cn()` utility helper.
- **Testing**: Vitest (unit/component), React Testing Library, MSW (API mocking),
  Playwright (E2E for P1 flows)
- **Package manager**: `npm`; `package-lock.json` MUST be committed. Node version MUST
  be pinned in `.nvmrc`.
- **Linting & formatting**: ESLint with `@typescript-eslint` and React plugin rules;
  Prettier for formatting. Both enforced as CI checks on every PR.
- **Environment variables**: `VITE_*` prefix for all client-visible configuration.
  Secrets (API keys, AWS credentials) MUST NOT appear in `VITE_*` variables or be
  committed to the repository in any form.

## CI/CD & Deployment Pipeline

All automation MUST be implemented as GitHub Actions workflows under `.github/workflows/`:

- **`ci.yml`** — triggered on every PR and every push to `main`:
  ESLint → TypeScript typecheck → Vitest suite → Vite production build
- **`docker-publish.yml`** — triggered after `ci.yml` succeeds on `main`:
  Docker build → push to AWS ECR (tagged with Git SHA and `latest`) → ECS service
  update using the new image digest
- ECS task definitions MUST be version-controlled as JSON in `.aws/task-definition.json`
  and updated programmatically by the pipeline, not via the AWS console.
- Rollback MUST be performed by re-deploying a previous ECR image tag through the
  pipeline. Out-of-band ECS console changes are PROHIBITED.
- Branch protection on `main` MUST require all `ci.yml` checks to pass before merge.

## Governance

This Constitution supersedes all other practices within this project. Any deviation from
a **NON-NEGOTIABLE** principle requires explicit written justification in the PR
description and MUST be approved by the project maintainer before the PR is merged.

**Amendment procedure**: Open a PR that edits this file, specifies the version bump type
(MAJOR / MINOR / PATCH per the policy below), lists every changed principle, and
documents the migration plan for affected in-progress features. The amendment takes
effect when the PR is merged to `main`.

**Versioning policy**:
- MAJOR — principle removed, renamed, or fundamentally redefined (backward-incompatible
  governance change)
- MINOR — new principle or new section added, or materially expanded guidance
- PATCH — clarification, wording improvement, or non-semantic refinement

**Compliance review**: The Constitution Check section of every `plan.md` MUST verify
all five principles before Phase 0 research begins and again after Phase 1 design.
PRs that skip the Constitution Check gate MUST NOT be merged.

All PRs MUST pass the GitHub Actions `ci.yml` workflow checks before merge. No exceptions.

**Version**: 1.0.0 | **Ratified**: 2026-06-11 | **Last Amended**: 2026-06-11
