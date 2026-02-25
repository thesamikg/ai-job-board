import { supabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Convert DB row (snake_case) to app format (camelCase)
 */
function toJob(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    companyLogo: row.company_logo || "",
    location: row.location || "Remote",
    salary_min: row.salary_min ?? 0,
    salary_max: row.salary_max ?? 0,
    currency: row.currency || "USD",
    job_type: row.job_type || "Full-time",
    experience_level: row.experience_level || "2-5",
    remote: Boolean(row.remote),
    skills: Array.isArray(row.skills) ? row.skills : (row.skills ? JSON.parse(row.skills || "[]") : []),
    description: row.description || "",
    apply_url: row.apply_url || "",
    posted_at: row.posted_at ? new Date(row.posted_at) : new Date(),
    featured: Boolean(row.featured),
    category: row.category || "AI Engineering",
  };
}

/**
 * Convert app job format to DB row (snake_case)
 */
function toRow(job) {
  return {
    title: job.title,
    company: job.company,
    company_logo: job.companyLogo || "",
    location: job.location || "Remote",
    salary_min: job.salary_min ?? 0,
    salary_max: job.salary_max ?? 0,
    currency: job.currency || "USD",
    job_type: job.job_type || "Full-time",
    experience_level: job.experience_level || "2-5",
    remote: Boolean(job.remote),
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "",
    apply_url: job.apply_url || "",
    featured: Boolean(job.featured),
    category: job.category || "AI Engineering",
  };
}

/**
 * Fetch all jobs from Supabase
 */
export async function fetchJobs() {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }

  return (data || []).map(toJob);
}

/**
 * Insert a new job into Supabase
 */
export async function addJob(job) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const row = toRow(job);
  // posted_at is set by DB default; we can override with job.posted_at
  if (job.posted_at) {
    row.posted_at = job.posted_at.toISOString();
  }

  const { data, error } = await supabase.from("jobs").insert(row).select("id").single();

  if (error) {
    console.error("Error adding job:", error);
    throw error;
  }

  return { ...job, id: data.id };
}
