import { supabase, isSupabaseConfigured } from "../lib/supabase";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function subscribeEmail(email, source = "homepage") {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Please enter a valid email");
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert(
      { email: normalizedEmail, source },
      { onConflict: "email", ignoreDuplicates: false }
    );

  if (error) {
    console.error("Error subscribing email:", error);
    throw error;
  }

  return { email: normalizedEmail };
}
