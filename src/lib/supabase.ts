import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// `null` quand les variables VITE_ ne sont pas configurées (ex: preview sans env).
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

/** Lance une erreur claire si Supabase n'est pas configuré (évite les `!` dispersés). */
export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error("Supabase n'est pas configuré.")
  return supabase
}
