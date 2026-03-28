import { useEffect, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";
import {
  ALL_SKILLS,
  CATEGORY_OPTIONS,
  DEFAULT_CATEGORY,
  DEFAULT_EXPERIENCE_LEVEL,
  EXPERIENCE_LEVEL_SUGGESTIONS,
  JOB_TYPE_OPTIONS,
} from "../data/jobs";
import { getCompanyInitials } from "../utils/jobHelpers";
import { extractPlainText, sanitizeRichText } from "../utils/richText";

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
const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function validateForm(form) {
  const errors = {};
  const title = form.title.trim();
  const company = form.company.trim();
  const description = extractPlainText(form.description);
  const url = form.apply_url.trim();
  const companyLogo = String(form.company_logo || "").trim();
  const minRaw = String(form.salary_min ?? "").trim();
  const maxRaw = String(form.salary_max ?? "").trim();
  const min = Number(form.salary_min);
  const max = Number(form.salary_max);

  if (!title) errors.title = "Please enter a job title.";
  if (!company) errors.company = "Please enter a company name.";
  if (!companyLogo || !/^data:image\/[a-zA-Z]+;base64,/i.test(companyLogo)) errors.company_logo = "Company logo image is required.";
  if (minRaw || maxRaw) {
    if (!minRaw || !maxRaw) {
      errors.salary = "Please enter both min and max salary, or leave both blank.";
    } else if (isNaN(min) || min < 0 || isNaN(max) || max < 0 || min > max) {
      errors.salary = "Please enter a valid salary range.";
    }
  }
  if (!description) errors.description = "Please add a job description.";
  if (!url) {
    errors.apply_url = "Please add an application URL.";
  } else if (!/^https?:\/\/.+/i.test(url) && !/^[a-z0-9.-]+\.[a-z]{2,}.+/i.test(url)) {
    errors.apply_url = "Please enter a valid application URL.";
  }

  return errors;
}

function RichTextEditor({ value, onChange, placeholder, inputRef, hasError }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
    if (inputRef && typeof inputRef === "object") {
      inputRef.current = editor;
    }
  }, [inputRef, value]);

  const syncValue = () => {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(editor.innerHTML);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    selectionRef.current = selection.getRangeAt(0);
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const runCommand = (command, commandValue = null) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    saveSelection();
    syncValue();
  };

  const addLink = () => {
    const url = window.prompt("Enter a URL", "https://");
    if (!url) return;
    runCommand("createLink", url);
  };

  const toolButtonStyle = (key, activeColor = "#2563eb") => ({
    minWidth: 34,
    height: 34,
    padding: "6px 8px",
    background: hoveredTool === key ? "rgba(37,99,235,0.08)" : "transparent",
    border: "none",
    borderRadius: 8,
    color: hoveredTool === key ? activeColor : "#64748b",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.18s ease, color 0.18s ease",
    fontFamily: "'Source Sans 3', sans-serif",
  });

  const toolbarBtn = (key, label, onPress, extraStyle = {}) => (
    <button
      key={key}
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      onMouseEnter={() => setHoveredTool(key)}
      onMouseLeave={() => setHoveredTool(null)}
      title={typeof label === "string" ? label : undefined}
      style={{ ...toolButtonStyle(key), ...extraStyle }}
    >
      {label}
    </button>
  );

  const linkIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.4 13.6L13.6 10.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.2 15.8L6.8 17.2a3.1 3.1 0 1 1-4.4-4.4l3-3a3.1 3.1 0 0 1 4.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8 8.2L17.2 6.8a3.1 3.1 0 1 1 4.4 4.4l-3 3a3.1 3.1 0 0 1-4.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="rich-editor-shell" style={{
      width: "100%",
      border: `1px solid ${hasError ? "rgba(239,68,68,0.7)" : isFocused ? "rgba(37,99,235,0.65)" : "rgba(148,163,184,0.45)"}`,
      borderRadius: 10,
      overflow: "hidden",
      background: "#ffffff",
      boxShadow: hasError
        ? "0 0 0 3px rgba(239,68,68,0.08)"
        : isFocused
          ? "0 0 0 3px rgba(37,99,235,0.08)"
          : "none",
      transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderBottom: "1px solid rgba(148,163,184,0.18)",
        background: "#f8fafc",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {toolbarBtn("bold", "B", () => runCommand("bold"), { fontSize: 15, color: hoveredTool === "bold" ? "#0f172a" : "#475569" })}
          {toolbarBtn("italic", <span style={{ fontStyle: "italic", fontSize: 15 }}>I</span>, () => runCommand("italic"), { color: hoveredTool === "italic" ? "#0f172a" : "#475569" })}
        </div>
        <div style={{ width: 1, height: 18, background: "rgba(148,163,184,0.28)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {toolbarBtn("h1", "H1", () => runCommand("formatBlock", "<h2>"), { fontSize: 12, letterSpacing: 0.2 })}
          {toolbarBtn("h2", "H2", () => runCommand("formatBlock", "<h3>"), { fontSize: 12, letterSpacing: 0.2 })}
        </div>
        <div style={{ width: 1, height: 18, background: "rgba(148,163,184,0.28)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {toolbarBtn("unordered", "• List", () => runCommand("insertUnorderedList"), { fontSize: 12, fontWeight: 600 })}
          {toolbarBtn("ordered", "1. List", () => runCommand("insertOrderedList"), { fontSize: 12, fontWeight: 600 })}
        </div>
        <div style={{ width: 1, height: 18, background: "rgba(148,163,184,0.28)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {toolbarBtn("link", linkIcon, addLink)}
        </div>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-surface"
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          saveSelection();
          syncValue();
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder={placeholder}
        style={{
          minHeight: 260,
          padding: "16px 16px 18px",
          color: "#0f172a",
          fontSize: 15,
          lineHeight: 1.7,
          outline: "none",
          whiteSpace: "pre-wrap",
          fontFamily: "'Source Sans 3', sans-serif",
          caretColor: "#2563eb",
          transition: "color 0.18s ease",
        }}
      />
    </div>
  );
}

export default function AddJobPage({ page, setPage, onAddJob, showToast, toast, user, onSignOut, isAdmin, canPostJobs, onSelectCategory }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    company_logo: "",
    company_logo_name: "",
    location: "",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    job_type: "Full-time",
    experience_level: DEFAULT_EXPERIENCE_LEVEL,
    remote: false,
    hybrid: false,
    skills: [],
    description: "",
    apply_url: "",
    category: DEFAULT_CATEGORY,
  });
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRefs = {
    title: useRef(null),
    company: useRef(null),
    company_logo: useRef(null),
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

  const updateWorkMode = (key, checked) => {
    setForm((prev) => ({
      ...prev,
      [key]: checked,
      ...(key === "remote" && checked ? { hybrid: false } : {}),
      ...(key === "hybrid" && checked ? { remote: false } : {}),
    }));
    setSubmitError("");
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) update("skills", [...form.skills, s]);
    setSkillInput("");
  };

  const removeSkill = (s) => update("skills", form.skills.filter(x => x !== s));

  const handleCompanyLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      update("company_logo", "");
      update("company_logo_name", "");
      return;
    }
    if (!String(file.type || "").startsWith("image/")) {
      update("company_logo", "");
      update("company_logo_name", "");
      e.target.value = "";
      setErrors((prev) => ({ ...prev, company_logo: "Please upload an image file." }));
      setSubmitError("Please upload an image file for the company logo.");
      showToast("Please upload an image file for the company logo.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      update("company_logo", "");
      update("company_logo_name", "");
      e.target.value = "";
      setErrors((prev) => ({ ...prev, company_logo: "Image must be 2MB or smaller." }));
      setSubmitError("Company logo image must be 2MB or smaller.");
      showToast("Company logo image must be 2MB or smaller.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      update("company_logo", dataUrl);
      update("company_logo_name", file.name);
    } catch (err) {
      setErrors((prev) => ({ ...prev, company_logo: "Could not read selected image." }));
      setSubmitError("Could not read selected image.");
      showToast(err?.message || "Could not read selected image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const urlCandidate = form.apply_url.trim();
    const minRaw = String(form.salary_min ?? "").trim();
    const maxRaw = String(form.salary_max ?? "").trim();
    const min = minRaw ? Number(form.salary_min) : null;
    const max = maxRaw ? Number(form.salary_max) : null;
    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("Fix the highlighted fields and try again.");
      showToast("Please complete the required fields.");
      if (nextErrors.title) focusField("title");
      else if (nextErrors.company) focusField("company");
      else if (nextErrors.company_logo) focusField("company_logo");
      else if (nextErrors.salary) focusField("salary_min");
      else if (nextErrors.description) focusField("description");
      else if (nextErrors.apply_url) focusField("apply_url");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      const description = sanitizeRichText(form.description);
      const location = form.location.trim() || (form.remote ? "Remote" : form.hybrid ? "Hybrid" : "On-site");
      const job = {
        id: Date.now(),
        title: form.title.trim(),
        company: form.company.trim(),
        companyLogo: form.company_logo || getCompanyInitials(form.company),
        location,
        salary_min: min,
        salary_max: max,
        currency: form.currency,
        job_type: form.job_type,
        experience_level: form.experience_level.trim() || DEFAULT_EXPERIENCE_LEVEL,
        remote: form.remote,
        hybrid: form.hybrid,
        skills: form.skills.length ? form.skills : ["Python", "AI"],
        description,
        apply_url: urlCandidate.startsWith("http") ? urlCandidate : `https://${urlCandidate}`,
        category: form.category,
        posted_at: new Date(),
        featured: false,
        status: "approved",
      };

      const result = await onAddJob(job);
      if (result?.ok === false) {
        const message = result?.error ? String(result.error) : "Could not post job. Please try again.";
        showToast(message);
        setSubmitError(message);
        return;
      }
      showToast("✓ Job posted successfully! It will appear in the Jobs list.");
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
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} onSelectCategory={onSelectCategory} />
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
            <label style={labelStyle}>COMPANY LOGO IMAGE *</label>
            <input
              ref={fieldRefs.company_logo}
              type="file"
              accept="image/*"
              onChange={handleCompanyLogoUpload}
              style={{ ...inputStyle, padding: "10px 12px", borderColor: errors.company_logo ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }}
              required
            />
            <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>Upload JPG, PNG, or WEBP (max 2MB).</div>
            {errors.company_logo && <div style={{ marginTop: 6, fontSize: 12, color: "#dc2626" }}>{errors.company_logo}</div>}
            {form.company_logo && (
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <img src={form.company_logo} alt="Company logo preview" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(148,163,184,0.4)" }} />
                <div style={{ fontSize: 12, color: "#475569" }}>{form.company_logo_name || "Logo uploaded"}</div>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>LOCATION</label>
            <input value={form.location} onChange={e => update("location", e.target.value)} placeholder="e.g. Remote, Berlin, Germany" style={inputStyle} />
          </div>

          <div className="add-job-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>MIN SALARY</label>
              <input ref={fieldRefs.salary_min} type="number" value={form.salary_min} onChange={e => update("salary_min", e.target.value)} placeholder="80000" style={{ ...inputStyle, borderColor: errors.salary ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} min={0} />
            </div>
            <div>
              <label style={labelStyle}>MAX SALARY</label>
              <input type="number" value={form.salary_max} onChange={e => update("salary_max", e.target.value)} placeholder="150000" style={{ ...inputStyle, borderColor: errors.salary ? "rgba(239,68,68,0.7)" : defaultInputBorderColor }} min={0} />
            </div>
          </div>
          <div style={{ marginTop: -12, marginBottom: 16, fontSize: 11, color: "#64748b" }}>
            Salary is optional. Leave both fields blank to hide it from the listing.
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
                {JOB_TYPE_OPTIONS.map((jobType) => (
                  <option key={jobType} value={jobType}>{jobType}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>EXPERIENCE LEVEL</label>
              <input
                list="experience-level-suggestions"
                value={form.experience_level}
                onChange={e => update("experience_level", e.target.value)}
                placeholder="e.g. Entry level (0-2 years), 5+ years"
                style={inputStyle}
              />
              <datalist id="experience-level-suggestions">
                {EXPERIENCE_LEVEL_SUGGESTIONS.map((experienceLevel) => (
                  <option key={experienceLevel} value={experienceLevel} />
                ))}
              </datalist>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ ...labelStyle, marginBottom: 10 }}>WORK MODE</div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 0 }}>
                <input type="checkbox" checked={form.remote} onChange={e => updateWorkMode("remote", e.target.checked)} style={{ accentColor: "#7c3aed" }} />
                Remote position
              </label>
              <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 0 }}>
                <input type="checkbox" checked={form.hybrid} onChange={e => updateWorkMode("hybrid", e.target.checked)} style={{ accentColor: "#2563eb" }} />
                Hybrid position
              </label>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
              Choose one work mode or leave both unchecked for on-site roles.
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>CATEGORY</label>
            <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              {CATEGORY_OPTIONS.map((category) => {
                const selected = form.category === category.name;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => update("category", category.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: selected ? `1px solid ${category.color}` : "1px solid rgba(148,163,184,0.35)",
                      background: selected ? "rgba(37,99,235,0.08)" : "#ffffff",
                      color: selected ? "#0f172a" : "#475569",
                      boxShadow: selected ? "0 8px 24px rgba(37,99,235,0.12)" : "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      fontSize: 13,
                      fontWeight: selected ? 700 : 600,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
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
            <RichTextEditor
              inputRef={fieldRefs.description}
              value={form.description}
              onChange={(nextValue) => update("description", nextValue)}
              placeholder={`Write a clear and structured job description...

• Overview of the role
• Key responsibilities
• Required skills and experience
• Preferred qualifications (optional)
• Salary, benefits, and perks
• What success looks like in this role`}
              hasError={Boolean(errors.description)}
            />
            <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
              Tip: Well-structured job descriptions attract better candidates.
            </div>
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
