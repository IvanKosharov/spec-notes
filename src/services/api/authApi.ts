export interface AuthResponse {
  success: boolean
  token?: string
  error?: string
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return response.json() as Promise<AuthResponse>
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${baseUrl}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return response.json() as Promise<AuthResponse>
}
