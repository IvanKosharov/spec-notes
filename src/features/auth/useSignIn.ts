import { useState } from 'react'
import { signIn } from '../../services/api/authApi'

interface FormErrors {
  email?: string
  password?: string
}

export interface SignInState {
  email: string
  password: string
  errors: FormErrors
  apiError: string | null
  isSubmitting: boolean
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }
  return errors
}

export function useSignIn(onSuccess: () => void) {
  const [state, setState] = useState<SignInState>({
    email: '',
    password: '',
    errors: {},
    apiError: null,
    isSubmitting: false,
  })

  const setEmail = (email: string) =>
    setState((s) => ({ ...s, email, errors: { ...s.errors, email: undefined } }))

  const setPassword = (password: string) =>
    setState((s) => ({ ...s, password, errors: { ...s.errors, password: undefined } }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate(state.email, state.password)
    if (Object.keys(errors).length > 0) {
      setState((s) => ({ ...s, errors }))
      return
    }
    setState((s) => ({ ...s, isSubmitting: true, apiError: null }))
    try {
      const result = await signIn(state.email, state.password)
      if (result.success) {
        onSuccess()
      } else {
        setState((s) => ({
          ...s,
          isSubmitting: false,
          apiError: result.error ?? 'Sign in failed.',
        }))
      }
    } catch {
      setState((s) => ({
        ...s,
        isSubmitting: false,
        apiError: 'Something went wrong. Please try again.',
      }))
    }
  }

  return { state, setEmail, setPassword, handleSubmit }
}
