import { createClient } from '@supabase/supabase-js';

// Use NEXT_PUBLIC_* env vars for the browser. These are replaced at build time.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Do not call createClient during module evaluation unless we are in the browser
// and both url and anonKey are present. This prevents runtime errors on the server
// when NEXT_PUBLIC vars are not provided.
let supabaseBrowser: ReturnType<typeof createClient> | null = null;
if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getBrowserSupabaseClient() {
  return supabaseBrowser;
}

export function getBrowserSupabaseConfig() {
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export default getBrowserSupabaseClient;
