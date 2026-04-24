import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use createBrowserClient from @supabase/ssr so that auth state
// (including PKCE code verifiers) is stored in cookies — accessible
// to both the browser AND server-side route handlers.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
