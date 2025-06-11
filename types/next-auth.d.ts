// This file is no longer needed since we switched to Supabase Auth
// Keeping it for reference but the types are now handled by Supabase

// Supabase User type extensions (if needed)
import { User } from '@supabase/supabase-js'

declare global {
  interface SupabaseUser extends User {
    user_metadata: {
      role?: string
      firstName?: string
      lastName?: string
      first_name?: string
      last_name?: string
      company?: string
      [key: string]: any
    }
    app_metadata: {
      role?: string
      [key: string]: any
    }
  }
}
