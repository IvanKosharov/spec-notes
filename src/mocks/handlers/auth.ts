import { http, HttpResponse } from 'msw'

interface Credentials {
  email: string
  password: string
}

export const authHandlers = [
  http.post('/api/auth/signup', async ({ request }) => {
    const { email } = (await request.json()) as Credentials
    if (email === 'duplicate@example.com') {
      return HttpResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }
    return HttpResponse.json({ success: true, token: 'mock-jwt-token-abc123' })
  }),

  http.post('/api/auth/signin', async ({ request }) => {
    const { email } = (await request.json()) as Credentials
    if (email === 'wrong@example.com') {
      return HttpResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }
    return HttpResponse.json({ success: true, token: 'mock-jwt-token-abc123' })
  }),
]
