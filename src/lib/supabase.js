import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isPlaceholder = (value) =>
  !value || value.includes("your-project-ref") || value.includes("your-anon-key");
export const isSupabaseConfigured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase not configured. Add real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values in .env"
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
