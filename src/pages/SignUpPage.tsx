import { useNavigate } from 'react-router-dom'
import { SignUpForm } from '../features/auth/SignUpForm'

export default function SignUpPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create account</h1>
        <SignUpForm onSuccess={() => navigate('/notes')} />
      </div>
    </div>
  )
}
