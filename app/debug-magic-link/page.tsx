import { SupabaseDebug } from '@/components/auth/supabase-debug'

export default function DebugMagicLinkPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Magic Link Debug</h1>
        <SupabaseDebug />
      </div>
    </div>
  )
}