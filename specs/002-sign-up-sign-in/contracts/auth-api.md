# Contract: Authentication API (Mock)

**Feature**: 002-sign-up-sign-in
**Base URL**: `VITE_API_BASE_URL` (default `/api` in development)
**Format**: JSON over HTTP
**Date**: 2026-06-11

> This contract describes the mock API endpoints intercepted by MSW.
> The same contract will be fulfilled by the real backend REST API (separate project).

---

## POST /api/auth/signup

Create a new user account.

### Request

```
POST /api/auth/signup
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

| Field    | Type   | Required | Constraints                   |
|----------|--------|----------|-------------------------------|
| email    | string | Yes      | Valid email format             |
| password | string | Yes      | Minimum 8 characters          |

### Responses

**200 OK — Success**

```json
{
  "success": true,
  "token": "mock-jwt-token-abc123"
}
```

**409 Conflict — Email already registered**

```json
{
  "success": false,
  "error": "An account with this email already exists."
}
```

**422 Unprocessable Entity — Validation failure (server-side)**

```json
{
  "success": false,
  "error": "Invalid email or password."
}
```

**500 Internal Server Error — Unexpected error**

```json
{
  "success": false,
  "error": "Something went wrong. Please try again."
}
```

---

## POST /api/auth/signin

Authenticate an existing user.

### Request

```
POST /api/auth/signin
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

| Field    | Type   | Required | Constraints          |
|----------|--------|----------|----------------------|
| email    | string | Yes      | Valid email format   |
| password | string | Yes      | Non-empty            |

### Responses

**200 OK — Success**

```json
{
  "success": true,
  "token": "mock-jwt-token-abc123"
}
```

**401 Unauthorized — Invalid credentials**

```json
{
  "success": false,
  "error": "Invalid email or password."
}
```

**500 Internal Server Error — Unexpected error**

```json
{
  "success": false,
  "error": "Something went wrong. Please try again."
}
```

---

## Mock Behaviour (MSW handler rules)

| Scenario | Email | Password | Endpoint | Response |
|----------|-------|----------|----------|----------|
| New sign-up | any unregistered email | ≥ 8 chars | `/signup` | 200 success |
| Duplicate sign-up | `duplicate@example.com` | any | `/signup` | 409 conflict |
| Valid sign-in | any previously signed-up email | matching | `/signin` | 200 success |
| Wrong password | any email | non-matching | `/signin` | 401 invalid |
| Unknown email | unregistered email | any | `/signin` | 401 invalid |

> The `duplicate@example.com` address is hard-coded in the MSW handler to enable
> deterministic testing of the conflict error path without requiring state.
