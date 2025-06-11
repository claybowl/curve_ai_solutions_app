import { PasswordTest } from '@/components/auth/password-test'

export default function TestPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Password Authentication Test</h1>
        <PasswordTest />
      </div>
    </div>
  )
}