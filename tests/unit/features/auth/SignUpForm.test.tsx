import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../src/mocks/server'
import { SignUpForm } from '../../../../src/features/auth/SignUpForm'

function renderSignUpForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <SignUpForm onSuccess={onSuccess} />
    </MemoryRouter>
  )
}

describe('SignUpForm', () => {
  it('renders email and password fields and a submit button', () => {
    renderSignUpForm()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows inline error when email format is invalid', async () => {
    renderSignUpForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'notanemail')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
  })

  it('shows inline error when password is too short', async () => {
    renderSignUpForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText(/8 characters/i)).toBeInTheDocument()
  })

  it('calls onSuccess after a successful sign-up', async () => {
    const onSuccess = vi.fn()
    renderSignUpForm(onSuccess)
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })

  it('shows API error message when sign-up returns a conflict', async () => {
    renderSignUpForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'duplicate@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(
      await screen.findByText(/account with this email already exists/i)
    ).toBeInTheDocument()
  })

  it('shows a generic error when the API call fails unexpectedly', async () => {
    server.use(
      http.post('/api/auth/signup', () => HttpResponse.error())
    )
    renderSignUpForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders a link to the sign-in page', () => {
    renderSignUpForm()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })
})
