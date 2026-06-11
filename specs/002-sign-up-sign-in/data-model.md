# Data Model: Sign-Up / Sign-In with Notes Redirect

**Feature**: 002-sign-up-sign-in
**Date**: 2026-06-11

---

## Entities

### UserCredentials

Represents the data a user submits on either the sign-up or sign-in form.

| Field    | Type   | Constraints                              | Notes                     |
|----------|--------|------------------------------------------|---------------------------|
| email    | string | Required; valid email format (RFC 5322)  | Lowercased before sending |
| password | string | Required; minimum 8 characters; max 128  | Never stored or logged    |

**Validation rules (client-side)**:
- `email`: non-empty, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `password`: length ≥ 8, length ≤ 128

---

### AuthResponse

Represents the response from the mock API for both sign-up and sign-in calls.

| Field   | Type             | Present when        | Notes                              |
|---------|------------------|---------------------|------------------------------------|
| success | boolean          | Always              | `true` on success, `false` on fail |
| token   | string (opaque)  | `success === true`  | Mock JWT-like string; not verified |
| error   | string           | `success === false` | User-facing error message          |

**Mock error codes** (returned in `error` field):

| Scenario               | Error message                          |
|------------------------|----------------------------------------|
| Invalid credentials    | `"Invalid email or password."`         |
| Email already exists   | `"An account with this email already exists."` |
| Unknown server error   | `"Something went wrong. Please try again."` |

---

### FormState (client-side UI state only)

Not persisted anywhere — lives in React component state only.

| Field       | Type                          | Purpose                                  |
|-------------|-------------------------------|------------------------------------------|
| email       | string                        | Controlled input value                   |
| password    | string                        | Controlled input value                   |
| errors      | `{ email?: string; password?: string }` | Inline field-level error messages |
| apiError    | string \| null                | Top-level error returned from mock API   |
| isSubmitting| boolean                       | Disables form while request is in-flight |

---

## State Transitions

```
[Idle] ──submit──▶ [Submitting] ──success──▶ [Redirect to /notes]
                         │
                         └──api error──▶ [Idle + apiError shown]
                         └──validation fail──▶ [Idle + field errors shown]
```

---

## Mock User Store (MSW handler internal)

The MSW handler maintains an in-memory array of registered users for the duration of the
browser session. It is reset on page reload.

```
mockUsers: Array<{ email: string; passwordHash: string }>
```

`passwordHash` is a trivial mock hash (not cryptographic) used only to simulate the
server checking credentials. It is never exposed in any API response.
