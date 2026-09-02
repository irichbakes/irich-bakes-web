import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Stateless public Supabase client for static data fetching.
 * Does NOT access `cookies()`, allowing Next.js to statically generate and cache pages/data.
 */
export function createPublicClient() {
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!
  );
}
