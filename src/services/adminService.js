import { supabase, isSupabaseConfigured } from "../lib/supabase";

const LOCAL_APPLICATIONS_KEY = "ai_jobboard_applications";

function safeReadLocal(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore local storage errors.
  }
}

export function isAdminUser(email) {
  const admins = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!email) return false;
  return admins.includes(String(email).toLowerCase());
}

export async function ensureUserProfile(user) {
  if (!isSupabaseConfigured || !supabase || !user?.id) return;
  const payload = {
    id: user.id,
    email: user.email || "",
    role: isAdminUser(user.email) ? "admin" : "user",
    last_seen_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) {
    // Profile table is optional for non-admin mode.
    console.warn("Could not upsert profile:", error.message);
  }
}

export async function fetchUsersForAdmin() {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role,created_at,last_seen_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addApplication(application) {
  const row = {
    job_id: application.jobId,
    applicant_email: application.email,
    submitted_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("applications").insert(row);
    if (!error) return;
    console.warn("Could not save application to Supabase, using local backup:", error.message);
  }

  const next = [
    {
      id: application.id,
      ...row,
    },
    ...safeReadLocal(LOCAL_APPLICATIONS_KEY),
  ];
  safeWriteLocal(LOCAL_APPLICATIONS_KEY, next);
}

export async function fetchApplicationsForAdmin() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("applications")
      .select("id,job_id,applicant_email,submitted_at")
      .order("submitted_at", { ascending: false });

    if (!error) return data || [];
  }

  return safeReadLocal(LOCAL_APPLICATIONS_KEY);
}
