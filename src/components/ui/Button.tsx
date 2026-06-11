interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  isLoading?: boolean
  children: React.ReactNode
  'data-testid'?: string
}

export function Button({
  type = 'button',
  disabled,
  isLoading,
  children,
  'data-testid': testId,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      data-testid={testId}
      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Loading…' : children}
    </button>
  )
}
