import { describe, it, expect } from 'vitest'
import { signUp, signIn } from '../../../src/services/api/authApi'

describe('authApi.signUp', () => {
  it('returns success response for a new email', async () => {
    const result = await signUp('newuser@example.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.token).toBe('mock-jwt-token-abc123')
  })

  it('returns error response for a duplicate email', async () => {
    const result = await signUp('duplicate@example.com', 'password123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('An account with this email already exists.')
  })
})

describe('authApi.signIn', () => {
  it('returns success response for valid credentials', async () => {
    const result = await signIn('user@example.com', 'password123')
    expect(result.success).toBe(true)
    expect(result.token).toBe('mock-jwt-token-abc123')
  })

  it('returns error response for wrong credentials (wrong@example.com)', async () => {
    const result = await signIn('wrong@example.com', 'anypassword')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid email or password.')
  })
})
