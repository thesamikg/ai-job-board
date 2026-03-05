import { supabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Sign in with email and password
 */
export async function signInWithPassword(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign up with email and password
 */
export async function signUpWithPassword(email, password, role = "job_seeker", companyName = "") {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        company_name: companyName || "",
      },
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) throw error;
  return data;
}

/**
 * Get current session / user
 */
export async function getSession() {
  if (!isSupabaseConfigured || !supabase) return { data: { session: null } };
  return supabase.auth.getSession();
}

/**
 * Best-effort registration lookup by email (via profiles table).
 * Returns true/false when known, null when unknown (e.g. RLS blocked).
 */
export async function isEmailRegistered(email) {
  if (!isSupabaseConfigured || !supabase || !email) return null;
  const normalized = String(email).trim().toLowerCase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", normalized)
    .limit(1);
  if (error) return null;
  return Array.isArray(data) && data.length > 0;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
