import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  DEFAULT_CATEGORY,
  DEFAULT_EXPERIENCE_LEVEL,
  normalizeExperienceLevel,
  normalizeJobCategory,
} from "../data/jobs";

/**
 * Convert DB row (snake_case) to app format (camelCase)
 */
function toJob(row) {
  if (!row) return null;
  let skills = [];
  if (Array.isArray(row.skills)) {
    skills = row.skills;
  } else if (row.skills) {
    try {
      const parsedSkills = JSON.parse(row.skills);
      skills = Array.isArray(parsedSkills) ? parsedSkills : [];
    } catch {
      skills = [];
    }
  }

  const postedAt = row.posted_at ? new Date(row.posted_at) : new Date();
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    companyLogo: row.company_logo || "",
    location: row.location || "Remote",
    salary_min: row.salary_min ?? null,
    salary_max: row.salary_max ?? null,
    currency: row.currency || "USD",
    job_type: row.job_type || "Full-time",
    experience_level: normalizeExperienceLevel(row.experience_level) || DEFAULT_EXPERIENCE_LEVEL,
    remote: Boolean(row.remote),
    hybrid: Boolean(row.hybrid),
    skills,
    description: row.description || "",
    apply_url: row.apply_url || "",
    posted_at: Number.isNaN(postedAt.getTime()) ? new Date() : postedAt,
    featured: Boolean(row.featured),
    category: normalizeJobCategory(row.category) || DEFAULT_CATEGORY,
    status: row.status || "approved",
    posted_by: row.posted_by || null,
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
    salary_min: job.salary_min ?? null,
    salary_max: job.salary_max ?? null,
    currency: job.currency || "USD",
    job_type: job.job_type || "Full-time",
    experience_level: normalizeExperienceLevel(job.experience_level) || DEFAULT_EXPERIENCE_LEVEL,
    remote: Boolean(job.remote),
    hybrid: Boolean(job.hybrid),
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description || "",
    apply_url: job.apply_url || "",
    featured: Boolean(job.featured),
    category: normalizeJobCategory(job.category) || DEFAULT_CATEGORY,
    status: job.status || "pending",
    posted_by: job.posted_by || null,
  };
}

/**
 * Fetch jobs from Supabase
 */
export async function fetchJobs(options = {}) {
  const { includeAll = false } = options;
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

  const jobs = (data || []).map(toJob).filter(Boolean);
  if (includeAll) return jobs;
  return jobs.filter((job) => job.status !== "pending" && job.status !== "rejected");
}

/**
 * Submit a new job through the server API.
 */
export async function addJob(job) {
  const row = toRow(job);
  if (job.posted_at) {
    const postedAt = new Date(job.posted_at);
    if (!Number.isNaN(postedAt.getTime())) {
      row.posted_at = postedAt.toISOString();
    }
  }

  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...row,
      application_url: row.apply_url,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error || "Could not submit job.");
  }

  return { ...job, id: payload.job?.id, status: payload.job?.status || "pending" };
}

export async function updateJobStatus(jobId, status) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const { error } = await supabase.from("jobs").update({ status }).eq("id", jobId);
  if (error) throw error;
}

export async function deleteJob(jobId) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) throw error;
}
