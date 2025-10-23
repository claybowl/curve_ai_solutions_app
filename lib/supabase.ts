// This file re-exports the client-side Supabase functions for backward compatibility
// Use lib/supabase-client.ts or lib/supabase-server.ts directly for clarity

export {
  supabase,
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
  signOut,
  getCurrentUser,
  getSession,
  resetPassword,
  getUserProfile
} from './supabase-client'

export type { UserMetadata } from './supabase-client'
