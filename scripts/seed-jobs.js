/**
 * Seed script to insert sample jobs into Supabase.
 * Run with: node scripts/seed-jobs.js
 * Requires: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { SAMPLE_JOBS } from "../src/data/jobs.js";

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const isPlaceholder = (value) =>
  !value || value.includes("your-project-ref") || value.includes("your-anon-key");

if (isPlaceholder(url) || isPlaceholder(key)) {
  console.error("Missing real VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY values in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

function getCompanyLogo(company) {
  const words = company.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return company.slice(0, 2).toUpperCase();
}

const rows = SAMPLE_JOBS.map((j) => ({
  title: j.title,
  company: j.company,
  company_logo: j.companyLogo || getCompanyLogo(j.company),
  location: j.location || "Remote",
  salary_min: j.salary_min ?? 0,
  salary_max: j.salary_max ?? 0,
  currency: j.currency || "USD",
  job_type: j.job_type || "Full-time",
  experience_level: j.experience_level || "2-5",
  remote: Boolean(j.remote),
  skills: j.skills || [],
  description: j.description || "",
  apply_url: j.apply_url || "",
  posted_at: j.posted_at instanceof Date ? j.posted_at.toISOString() : new Date().toISOString(),
  featured: Boolean(j.featured),
  category: j.category || "AI Engineering",
}));

const { data, error } = await supabase.from("jobs").insert(rows).select("id");

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`✓ Seeded ${data.length} jobs into Supabase`);
