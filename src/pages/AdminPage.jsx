import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Toast, Badge } from "../components/ui";

const panel = {
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.22)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 14px 34px rgba(15,23,42,0.07)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(148,163,184,0.34)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13,
  color: "#0f172a",
  background: "#ffffff",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 12,
  color: "#64748b",
  fontWeight: 700,
};

function statusColor(status) {
  if (status === "published") return "#16a34a";
  if (status === "rejected") return "#dc2626";
  if (status === "expired") return "#64748b";
  return "#d97706";
}

function getInitialTab() {
  const path = typeof window === "undefined" ? "" : window.location.pathname;
  if (path === "/admin/jobs/import-logs") return "logs";
  if (path === "/admin/jobs/pending") return "pending";
  return "pending";
}

function formatDate(value) {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not specified" : date.toLocaleString();
}

function EditJobForm({ job, onCancel, onSave }) {
  const [form, setForm] = useState({
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    category: job.category || "",
    description: job.description || "",
    short_summary: job.short_summary || "",
    apply_url: job.apply_url || "",
    skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
    job_type: job.job_type || "Full-time",
    experience_level: job.experience_level || "2+ years",
    remote_type: job.remote_type || "onsite",
  });
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const result = await onSave(job.id, form);
    setSaving(false);
    if (result?.ok) onCancel();
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 14, display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <label style={labelStyle}>Title<input style={inputStyle} value={form.title} onChange={(e) => update("title", e.target.value)} /></label>
        <label style={labelStyle}>Company<input style={inputStyle} value={form.company} onChange={(e) => update("company", e.target.value)} /></label>
        <label style={labelStyle}>Location<input style={inputStyle} value={form.location} onChange={(e) => update("location", e.target.value)} /></label>
        <label style={labelStyle}>Category<input style={inputStyle} value={form.category} onChange={(e) => update("category", e.target.value)} /></label>
        <label style={labelStyle}>Job Type<input style={inputStyle} value={form.job_type} onChange={(e) => update("job_type", e.target.value)} /></label>
        <label style={labelStyle}>Experience<input style={inputStyle} value={form.experience_level} onChange={(e) => update("experience_level", e.target.value)} /></label>
        <label style={labelStyle}>Remote Type
          <select style={inputStyle} value={form.remote_type} onChange={(e) => update("remote_type", e.target.value)}>
            <option value="onsite">onsite</option>
            <option value="hybrid">hybrid</option>
            <option value="remote">remote</option>
          </select>
        </label>
        <label style={labelStyle}>Apply URL<input style={inputStyle} value={form.apply_url} onChange={(e) => update("apply_url", e.target.value)} /></label>
      </div>
      <label style={labelStyle}>Skills<input style={inputStyle} value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Python, ROS, Computer Vision" /></label>
      <label style={labelStyle}>Short Summary<textarea style={{ ...inputStyle, minHeight: 70 }} value={form.short_summary} onChange={(e) => update("short_summary", e.target.value)} /></label>
      <label style={labelStyle}>Description<textarea style={{ ...inputStyle, minHeight: 150 }} value={form.description} onChange={(e) => update("description", e.target.value)} /></label>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={saving} type="submit" style={{ padding: "9px 12px", borderRadius: 8, border: "none", background: "#2563eb", color: "#ffffff", cursor: "pointer", fontWeight: 700 }}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.45)", background: "#ffffff", color: "#475569", cursor: "pointer", fontWeight: 700 }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminPage({
  page,
  setPage,
  user,
  onSignOut,
  toast,
  jobs,
  users,
  importLogs,
  applications,
  onApprove,
  onReject,
  onUpdateJob,
  onDelete,
  isLoading,
  onSelectCategory,
}) {
  const [tab, setTab] = useState(getInitialTab);
  const [editingJobId, setEditingJobId] = useState(null);

  const pendingJobs = useMemo(() => jobs.filter((j) => j.status === "pending_review"), [jobs]);
  const publishedJobs = useMemo(() => jobs.filter((j) => j.status === "published"), [jobs]);

  const chooseTab = (nextTab) => {
    setTab(nextTab);
    if (nextTab === "pending") {
      window.history.pushState({ page: "admin" }, "", "/admin/jobs/pending");
    } else if (nextTab === "logs") {
      window.history.pushState({ page: "admin" }, "", "/admin/jobs/import-logs");
    } else {
      window.history.pushState({ page: "admin" }, "", "/admin");
    }
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #eef5ff 0%, #f8fafc 260px, #f8fafc 100%)", minHeight: "100vh", color: "#475569", fontFamily: "'Source Sans 3', sans-serif" }}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin canPostJobs onSelectCategory={onSelectCategory} />
      <div className="page-content" style={{ maxWidth: 1180, margin: "0 auto", padding: "108px 24px 70px" }}>
        <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 8 }}>Operations</div>
        <h1 style={{ margin: 0, color: "#0f172a", fontFamily: "'Merriweather', serif", fontSize: "clamp(30px, 4vw, 42px)" }}>Admin Dashboard</h1>
        <p style={{ marginTop: 10, marginBottom: 28, maxWidth: 680, lineHeight: 1.65 }}>Review imported jobs before they appear on AIRoboticsJob.com.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{pendingJobs.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Pending Review</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{publishedJobs.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Published Jobs</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{users.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Users</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{importLogs.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Import Runs</div></div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 16, padding: 6, boxShadow: "0 10px 26px rgba(15,23,42,0.05)" }}>
          {[
            ["pending", "Pending Jobs"],
            ["logs", "Import Logs"],
            ["all", "All Jobs"],
            ["users", "Users"],
            ["applications", "Applications"],
          ].map(([key, name]) => (
            <button
              key={key}
              onClick={() => chooseTab(key)}
              style={{
                padding: "8px 14px",
                borderRadius: 12,
                border: tab === key ? "1px solid rgba(37,99,235,0.45)" : "1px solid transparent",
                background: tab === key ? "linear-gradient(135deg, #1d4ed8, #2563eb)" : "transparent",
                color: tab === key ? "#ffffff" : "#475569",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {isLoading ? <div style={panel}>Loading admin data...</div> : null}

        {(tab === "pending" || tab === "all") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(tab === "pending" ? pendingJobs : jobs).length === 0 ? (
              <div style={panel}>No jobs in this view.</div>
            ) : (tab === "pending" ? pendingJobs : jobs).map((job) => (
              <div key={job.id} style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 240, flex: 1 }}>
                    <div style={{ color: "#0f172a", fontWeight: 900, fontSize: 18 }}>{job.title}</div>
                    <div style={{ fontSize: 13 }}>{job.company} · {job.location}</div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                      {job.source_name || "Manual"} · {job.category || "Uncategorized"} · Posted {formatDate(job.posted_at)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge color={statusColor(job.status)}>{job.status || "pending_review"}</Badge>
                    {job.relevance_score !== null ? <Badge color="#2563eb">{job.relevance_score}/100</Badge> : null}
                  </div>
                </div>
                {job.short_summary ? <p style={{ margin: "12px 0 0", color: "#334155" }}>{job.short_summary}</p> : null}
                {Array.isArray(job.skills) && job.skills.length > 0 ? (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                    {job.skills.map((skill) => (
                      <span key={skill} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 999, background: "#eff6ff", color: "#1d4ed8", fontWeight: 700 }}>{skill}</span>
                    ))}
                  </div>
                ) : null}
                {job.apply_url ? (
                  <a href={job.apply_url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, color: "#2563eb", fontSize: 13, fontWeight: 700 }}>
                    Apply URL
                  </a>
                ) : null}
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <button onClick={() => onApprove(job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "none", background: "#16a34a", color: "#ffffff", cursor: "pointer", fontWeight: 800 }}>Approve</button>
                  <button onClick={() => onReject(job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "none", background: "#dc2626", color: "#ffffff", cursor: "pointer", fontWeight: 800 }}>Reject</button>
                  <button onClick={() => setEditingJobId(editingJobId === job.id ? null : job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "1px solid rgba(148,163,184,0.34)", background: "#ffffff", color: "#0f172a", cursor: "pointer", fontWeight: 800 }}>Edit</button>
                  <button onClick={() => onDelete(job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "1px solid rgba(220,38,38,0.32)", background: "#ffffff", color: "#dc2626", cursor: "pointer", fontWeight: 800 }}>Delete</button>
                </div>
                {editingJobId === job.id ? (
                  <EditJobForm job={job} onSave={onUpdateJob} onCancel={() => setEditingJobId(null)} />
                ) : null}
              </div>
            ))}
          </div>
        )}

        {tab === "logs" && (
          <div style={{ overflowX: "auto", ...panel }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#64748b", fontSize: 12 }}>
                  {["Date", "Source", "Fetched", "Relevant", "Inserted", "Duplicates", "Rejected", "Error"].map((heading) => (
                    <th key={heading} style={{ padding: "0 10px 10px 0", borderBottom: "1px solid rgba(148,163,184,0.24)" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importLogs.length === 0 ? (
                  <tr><td colSpan="8" style={{ padding: "16px 0" }}>No import logs yet.</td></tr>
                ) : importLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.16)" }}>
                    <td style={{ padding: "10px 10px 10px 0", whiteSpace: "nowrap" }}>{formatDate(log.created_at)}</td>
                    <td style={{ padding: "10px 10px 10px 0" }}>{log.source_name}</td>
                    <td style={{ padding: "10px 10px 10px 0" }}>{log.total_fetched}</td>
                    <td style={{ padding: "10px 10px 10px 0" }}>{log.total_relevant}</td>
                    <td style={{ padding: "10px 10px 10px 0" }}>{log.total_inserted}</td>
                    <td style={{ padding: "10px 10px 10px 0" }}>{log.total_duplicates}</td>
                    <td style={{ padding: "10px 10px 10px 0" }}>{log.total_rejected}</td>
                    <td style={{ padding: "10px 10px 10px 0", color: log.error_message ? "#dc2626" : "#64748b" }}>{log.error_message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.length === 0 ? <div style={panel}>No users available. Run migration and sign in users to populate profiles.</div> : users.map((u) => (
              <div key={u.id} style={panel}>
                <div style={{ color: "#0f172a", fontWeight: 700 }}>{u.email || "Unknown user"}</div>
                <div style={{ fontSize: 13 }}>Role: {u.role || "user"}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "applications" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {applications.length === 0 ? <div style={panel}>No applications yet.</div> : applications.map((a, idx) => (
              <div key={a.id || idx} style={panel}>
                <div style={{ color: "#0f172a", fontWeight: 700 }}>{a.applicant_email || a.email}</div>
                <div style={{ fontSize: 13 }}>Job ID: {a.job_id || a.jobId}</div>
                <div style={{ fontSize: 12 }}>Submitted: {formatDate(a.submitted_at || a.at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
