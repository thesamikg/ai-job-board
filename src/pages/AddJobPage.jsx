import { useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";
import { CATEGORIES, ALL_SKILLS } from "../data/jobs";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.6)",
  borderRadius: 10,
  color: "#0f172a",
  fontSize: 14,
  outline: "none",
};

const labelStyle = {
  fontSize: 12,
  color: "#475569",
  fontWeight: 600,
  display: "block",
  marginBottom: 8,
  letterSpacing: 0.5,
};

const defaultInputBorderColor = "rgba(148,163,184,0.6)";

function getCompanyLogo(company) {
  const words = company.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return company.slice(0, 2).toUpperCase();
}

function validateForm(form) {
  const errors = {};
  const title = form.title.trim();
  const company = form.company.trim();
  const description = form.description.trim();
  const url = form.apply_url.trim();
  const minRaw = String(form.salary_min ?? "").trim();
  const maxRaw = String(form.salary_max ?? "").trim();
  const min = Number(form.salary_min);
  const max = Number(form.salary_max);

  if (!title) errors.title = "Please enter a job title.";
  if (!company) errors.company = "Please enter a company name.";
  if (!minRaw || !maxRaw) {
    errors.salary = "Please enter both min and max salary.";
  } else if (isNaN(min) || min < 0 || isNaN(max) || max < 0 || min > max) {
    errors.salary = "Please enter a valid salary range.";
  }
  if (!description) errors.description = "Please add a job description.";
  if (!url) {
    errors.apply_url = "Please add an application URL.";
  } else if (!/^https?:\/\/.+/i.test(url) && !/^[a-z0-9.-]+\.[a-z]{2,}.+/i.test(url)) {
    errors.apply_url = "Please enter a valid application URL.";
  }

  return errors;
}

export default function AddJobPage({ page, setPage, onAddJob, showToast, toast, user, onSignOut, isAdmin, canPostJobs }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    job_type: "Full-time",
    experience_level: "2-5",
    remote: false,
    skills: [],
    description: "",
    apply_url: "",
    category: "AI Engineering",
  });
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRefs = {
    title: useRef(null),
    company: useRef(null),
    salary_min: useRef(null),
    description: useRef(null),
    apply_url: useRef(null),
  };

  const focusField = (name) => {
    const ref = fieldRefs[name];
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current.focus();
  };

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSubmitError("");
    setErrors((prev) => {
      if (!prev[key] && !(key === "salary_min" && prev.salary) && !(key === "salary_max" && prev.salary)) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      if (key === "salary_min" || key === "salary_max") delete next.salary;
      return next;
    });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) update("skills", [...form.skills, s]);
    setSkillInput("");
  };

  const removeSkill = (s) => update("skills", form.skills.filter(x => x !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const urlCandidate = form.apply_url.trim();
    const min = Number(form.salary_min);
    const max = Number(form.salary_max);
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("Fix the highlighted fields and try again.");
      showToast("Please complete the required fields.");
      if (nextErrors.title) focusField("title");
      else if (nextErrors.company) focusField("company");
      else if (nextErrors.salary) focusField("salary_min");
      else if (nextErrors.description) focusField("description");
      else if (nextErrors.apply_url) focusField("apply_url");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      const job = {
        id: Date.now(),
        title: form.title.trim(),
        company: form.company.trim(),
        companyLogo: getCompanyLogo(form.company),
        location: form.location.trim() || "Remote",
        salary_min: min,
        salary_max: max,
        currency: form.currency,
        job_type: form.job_type,
        experience_level: form.experience_level,
        remote: form.remote,
        skills: form.skills.length ? form.skills : ["Python", "AI"],
        description: form.description.trim(),
        apply_url: urlCandidate.startsWith("http") ? urlCandidate : `https://${urlCandidate}`,
        category: form.category,
        posted_at: new Date(),
        featured: false,
        status: "approved",
      };

      const result = await onAddJob(job);
      if (result?.ok === false) {
        showToast("You do not have permission to post jobs.");
        setSubmitError("You do not have permission to post jobs.");
        return;
      }
      if (result?.persisted === "supabase") {
        showToast("✓ Job posted successfully! It will appear in the Jobs list.");
      } else {
        showToast("Saved locally. It will persist on this browser after refresh.");
      }
      setPage("jobs");
    } catch (err) {
      const message = err?.message || "Could not post job. Please try again.";
      setSubmitError(message);
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bg = { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#475569" };

  return (
    <div style={bg}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} />
      <div className="page-content" style={{ paddingTop: 80, maxWidth: 640, margin: "0 auto", padding: "80px 24px 48px" }}>
        <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
          Post a New Job
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>
          Share your AI & robotics role with thousands of qualified candidates.
        </p>

        <form noValidate onSubmit={handleSubmit} style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.35)", borderRadius: 20, padding: "24px 20px", backdropFilter: "blur(20px)" }}>
          {submitError && (
            <div style={{ marginBottom: 20, padding: "12px 14px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#b91c1c", fontSize: 13, fontWeight: 600 }}>
              {submitError}
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>JOB TITLE *</label>
            <input ref={fieldRefs.title} value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Senior LLM Engineer" style={{ ...inputStyle, borderColor: errors.title ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} required />
            {errors.title && <div style={{ marginTop: 6, fontSize: 12, color: "#dc2626" }}>{errors.title}</div>}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>COMPANY *</label>
            <input ref={fieldRefs.company} value={form.company} onChange={e => update("company", e.target.value)} placeholder="e.g. DeepMind" style={{ ...inputStyle, borderColor: errors.company ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} required />
            {errors.company && <div style={{ marginTop: 6, fontSize: 12, color: "#dc2626" }}>{errors.company}</div>}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>LOCATION</label>
            <input value={form.location} onChange={e => update("location", e.target.value)} placeholder="e.g. Remote, Berlin, Germany" style={inputStyle} />
          </div>

          <div className="add-job-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>MIN SALARY *</label>
              <input ref={fieldRefs.salary_min} type="number" value={form.salary_min} onChange={e => update("salary_min", e.target.value)} placeholder="80000" style={{ ...inputStyle, borderColor: errors.salary ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} min={0} required />
            </div>
            <div>
              <label style={labelStyle}>MAX SALARY *</label>
              <input type="number" value={form.salary_max} onChange={e => update("salary_max", e.target.value)} placeholder="150000" style={{ ...inputStyle, borderColor: errors.salary ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} min={0} required />
            </div>
          </div>
          {errors.salary && <div style={{ marginTop: -12, marginBottom: 16, fontSize: 12, color: "#dc2626" }}>{errors.salary}</div>}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>CURRENCY</label>
            <select value={form.currency} onChange={e => update("currency", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <div className="add-job-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>JOB TYPE</label>
              <select value={form.job_type} onChange={e => update("job_type", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>EXPERIENCE LEVEL</label>
              <select value={form.experience_level} onChange={e => update("experience_level", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="0-2">0–2 yrs</option>
                <option value="2-5">2–5 yrs</option>
                <option value="5+">5+ yrs</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={form.remote} onChange={e => update("remote", e.target.checked)} style={{ accentColor: "#7c3aed" }} />
              Remote position
            </label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>CATEGORY</label>
            <select value={form.category} onChange={e => update("category", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>SKILLS (add from list or type custom)</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {ALL_SKILLS.slice(0, 6).map(skill => (
                <button key={skill} type="button" onClick={() => form.skills.includes(skill) ? removeSkill(skill) : update("skills", [...form.skills, skill])}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    background: form.skills.includes(skill) ? "rgba(124,58,237,0.12)" : "#ffffff",
                    border: form.skills.includes(skill) ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(148,163,184,0.45)",
                    color: form.skills.includes(skill) ? "#a78bfa" : "#475569",
                  }}>
                  {skill}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type skill and press Enter" style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={addSkill} style={{ padding: "12px 20px", background: "#ffffff", border: "1px solid rgba(148,163,184,0.55)", borderRadius: 10, color: "#475569", fontSize: 13, cursor: "pointer" }}>
                Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {form.skills.map(s => (
                  <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(124,58,237,0.15)", borderRadius: 8, fontSize: 12, color: "#a78bfa" }}>
                    {s} <button type="button" onClick={() => removeSkill(s)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>DESCRIPTION *</label>
            <textarea ref={fieldRefs.description} value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." rows={5} style={{ ...inputStyle, resize: "vertical", minHeight: 120, borderColor: errors.description ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} required />
            {errors.description && <div style={{ marginTop: 6, fontSize: 12, color: "#dc2626" }}>{errors.description}</div>}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>APPLICATION URL *</label>
            <input ref={fieldRefs.apply_url} value={form.apply_url} onChange={e => update("apply_url", e.target.value)} placeholder="https://company.com/careers or company.com/apply" style={{ ...inputStyle, borderColor: errors.apply_url ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} required />
            {errors.apply_url && <div style={{ marginTop: 6, fontSize: 12, color: "#dc2626" }}>{errors.apply_url}</div>}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.75 : 1, fontFamily: "'Merriweather', serif" }}>
              {isSubmitting ? "Posting..." : "Post Job"}
            </button>
            <button type="button" onClick={() => setPage("jobs")} style={{ padding: "14px 24px", background: "transparent", border: "1px solid rgba(148,163,184,0.5)", borderRadius: 10, color: "#64748b", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
