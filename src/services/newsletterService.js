import { supabase, isSupabaseConfigured } from "../lib/supabase";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isDuplicateSubscriberError(error) {
  const message = String(error?.message || "").toLowerCase();
  return error?.code === "23505" || message.includes("duplicate key") || message.includes("already exists");
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
    .insert({ email: normalizedEmail, source });

  if (error) {
    if (isDuplicateSubscriberError(error)) {
      return { email: normalizedEmail, alreadySubscribed: true };
    }
    console.error("Error subscribing email:", error);
    throw error;
  }

  return { email: normalizedEmail, alreadySubscribed: false };
}
