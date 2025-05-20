// Compatibility layer for next-auth/next imports
import { authOptions } from "@/lib/auth"

// Stub implementation of getServerSession
export async function getServerSession() {
  console.warn("getServerSession is stubbed - use Supabase Auth directly instead")
  return null
}