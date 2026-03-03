import { supabase, isSupabaseConfigured } from "../lib/supabase";

const LOCAL_APPLICATIONS_KEY = "ai_jobboard_applications";
const LOCAL_USER_ROLES_KEY = "ai_jobboard_user_roles";

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

function readRoleMap() {
  try {
    const raw = localStorage.getItem(LOCAL_USER_ROLES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getCachedRole(userId, email) {
  const map = readRoleMap();
  const byId = userId ? map[String(userId)] : null;
  if (byId) return normalizeRole(byId);
  const key = String(email || "").toLowerCase();
  const byEmail = key ? map[key] : null;
  return normalizeRole(byEmail);
}

export function cacheUserRole(userId, email, role) {
  const normalized = normalizeRole(role);
  const map = readRoleMap();
  if (userId) map[String(userId)] = normalized;
  const emailKey = String(email || "").toLowerCase();
  if (emailKey) map[emailKey] = normalized;
  safeWriteLocal(LOCAL_USER_ROLES_KEY, map);
}

export function isAdminUser(email) {
  const admins = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!email) return false;
  return admins.includes(String(email).toLowerCase());
}

export function normalizeRole(role) {
  if (role === "employer") return "employer";
  if (role === "admin") return "admin";
  return "job_seeker";
}

export async function ensureUserProfile(user, selectedRole = "job_seeker") {
  if (!isSupabaseConfigured || !supabase || !user?.id) return;
  const preferredRole = isAdminUser(user.email) ? "admin" : normalizeRole(selectedRole);
  let role = preferredRole;

  // Never downgrade an existing employer/admin profile to job_seeker due temporary lookup issues.
  if (preferredRole === "job_seeker") {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = normalizeRole(existingProfile?.role || preferredRole);
  }
  cacheUserRole(user.id, user.email, role);
  const payload = {
    id: user.id,
    email: user.email || "",
    role,
    last_seen_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) {
    // Profile table is optional for non-admin mode.
    console.warn("Could not upsert profile:", error.message);
  }
}

export async function fetchUserRole(userId, email, fallbackRole = "job_seeker") {
  if (isAdminUser(email)) return "admin";
  if (!isSupabaseConfigured || !supabase || !userId) {
    return normalizeRole(fallbackRole || getCachedRole(userId, email));
  }
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (error || !data?.role) {
    return normalizeRole(fallbackRole || getCachedRole(userId, email));
  }
  const role = normalizeRole(data.role);
  cacheUserRole(userId, email, role);
  return role;
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
    applicant_id: application.userId || null,
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

export async function fetchApplicationsForUser(userId, email) {
  if (isSupabaseConfigured && supabase) {
    // Preferred path: scoped by user id
    if (userId) {
      const byId = await supabase
        .from("applications")
        .select("id,job_id,applicant_id,applicant_email,submitted_at")
        .eq("applicant_id", userId)
        .order("submitted_at", { ascending: false });
      if (!byId.error) return byId.data || [];
    }

    // Backward-compatible path: older schemas may not have applicant_id
    if (email) {
      const byEmail = await supabase
        .from("applications")
        .select("id,job_id,applicant_email,submitted_at")
        .eq("applicant_email", email)
        .order("submitted_at", { ascending: false });
      if (!byEmail.error) return byEmail.data || [];
    }
  }

  const normalizedEmail = String(email || "").toLowerCase();
  return safeReadLocal(LOCAL_APPLICATIONS_KEY).filter((item) => {
    const byId = userId && String(item?.applicant_id || "") === String(userId);
    const byEmail =
      normalizedEmail && String(item?.applicant_email || "").toLowerCase() === normalizedEmail;
    return Boolean(byId || byEmail);
  });
}
