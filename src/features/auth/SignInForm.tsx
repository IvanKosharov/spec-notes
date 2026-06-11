import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useSignIn } from './useSignIn'

interface SignInFormProps {
  onSuccess: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { state, setEmail, setPassword, handleSubmit } = useSignIn(onSuccess)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        id="email"
        label="Email"
        type="email"
        value={state.email}
        onChange={(e) => setEmail(e.target.value)}
        error={state.errors.email}
        data-testid="email-input"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={state.password}
        onChange={(e) => setPassword(e.target.value)}
        error={state.errors.password}
        data-testid="password-input"
      />
      {state.apiError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {state.apiError}
        </p>
      )}
      <Button
        type="submit"
        isLoading={state.isSubmitting}
        disabled={state.isSubmitting}
        data-testid="submit-button"
      >
        Sign In
      </Button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
