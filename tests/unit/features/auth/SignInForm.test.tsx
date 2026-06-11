import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../src/mocks/server'
import { SignInForm } from '../../../../src/features/auth/SignInForm'

function renderSignInForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <SignInForm onSuccess={onSuccess} />
    </MemoryRouter>
  )
}

describe('SignInForm', () => {
  it('renders email and password fields and a submit button', () => {
    renderSignInForm()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows inline error when email is empty on submit', async () => {
    renderSignInForm()
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
  })

  it('shows inline error when password is empty on submit', async () => {
    renderSignInForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/8 characters/i)).toBeInTheDocument()
  })

  it('calls onSuccess after valid credentials are accepted', async () => {
    const onSuccess = vi.fn()
    renderSignInForm(onSuccess)
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })

  it('shows API error when credentials are wrong', async () => {
    renderSignInForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
  })

  it('shows a generic error when the API call fails unexpectedly', async () => {
    server.use(
      http.post('/api/auth/signin', () => HttpResponse.error())
    )
    renderSignInForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders a link to the sign-up page', () => {
    renderSignInForm()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })
})
