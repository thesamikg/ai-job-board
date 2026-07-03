import { createClient } from "@supabase/supabase-js";

const REQUIRED_FIELDS = ["title", "company", "location", "description", "application_url"];

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function cleanString(value) {
  return String(value || "").trim();
}

function plainTextFromHtml(value) {
  return cleanString(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeUrl(value) {
  const trimmed = cleanString(value);
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function validateJob(body) {
  const errors = {};
  const applicationUrl = normalizeUrl(body.application_url || body.apply_url);
  const descriptionText = plainTextFromHtml(body.description);

  for (const field of REQUIRED_FIELDS) {
    if (field === "application_url") {
      if (!applicationUrl) errors.application_url = "Application URL is required.";
      continue;
    }
    if (field === "description") {
      if (!descriptionText) errors.description = "Description is required.";
      continue;
    }
    if (!cleanString(body[field])) {
      errors[field] = `${field.replace("_", " ")} is required.`;
    }
  }

  if (applicationUrl && !isValidUrl(applicationUrl)) {
    errors.application_url = "Application URL must be a valid URL.";
  }

  const salaryMin = parseOptionalNumber(body.salary_min);
  const salaryMax = parseOptionalNumber(body.salary_max);
  const hasSalaryMin = body.salary_min !== null && body.salary_min !== undefined && body.salary_min !== "";
  const hasSalaryMax = body.salary_max !== null && body.salary_max !== undefined && body.salary_max !== "";

  if (hasSalaryMin !== hasSalaryMax) {
    errors.salary = "Enter both min and max salary, or leave both blank.";
  } else if (hasSalaryMin && (salaryMin === null || salaryMax === null || salaryMin > salaryMax)) {
    errors.salary = "Salary range is invalid.";
  }

  return {
    applicationUrl,
    errors,
    salaryMin,
    salaryMax,
  };
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method not allowed." });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json(res, 500, { ok: false, error: "Job submission service is not configured." });
  }

  let body = req.body && typeof req.body === "object" ? req.body : {};
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      return json(res, 400, { ok: false, error: "Invalid JSON body." });
    }
  }
  const { applicationUrl, errors, salaryMin, salaryMax } = validateJob(body);

  if (Object.keys(errors).length > 0) {
    return json(res, 400, { ok: false, error: "Please fix the highlighted fields.", errors });
  }

  const row = {
    title: cleanString(body.title),
    company: cleanString(body.company),
    company_logo: cleanString(body.company_logo),
    location: cleanString(body.location),
    salary_min: salaryMin,
    salary_max: salaryMax,
    currency: cleanString(body.currency) || "USD",
    job_type: cleanString(body.job_type) || "Full-time",
    experience_level: cleanString(body.experience_level) || "2+ years",
    remote: Boolean(body.remote),
    hybrid: Boolean(body.hybrid),
    skills: Array.isArray(body.skills) ? body.skills.map(cleanString).filter(Boolean) : [],
    description: cleanString(body.description),
    apply_url: applicationUrl,
    featured: false,
    category: cleanString(body.category) || "AI Engineering",
    status: "pending",
    posted_by: null,
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert(row)
    .select("id,status")
    .single();

  if (error) {
    console.error("Job submission failed:", error);
    return json(res, 500, { ok: false, error: "Could not submit job. Please try again." });
  }

  return json(res, 201, {
    ok: true,
    job: {
      id: data.id,
      status: data.status || "pending",
    },
  });
}
