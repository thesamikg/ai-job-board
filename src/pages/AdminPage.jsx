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

function statusColor(status) {
  if (status === "approved") return "#16a34a";
  if (status === "rejected") return "#dc2626";
  return "#d97706";
}

function formatDate(value) {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not specified" : date.toLocaleString();
}

export default function AdminPage({
  page,
  setPage,
  user,
  onSignOut,
  toast,
  jobs,
  users,
  applications,
  onApprove,
  onReject,
  onDelete,
  isLoading,
  onSelectCategory,
}) {
  const [tab, setTab] = useState("jobs");

  const pendingJobs = useMemo(() => jobs.filter((j) => j.status === "pending"), [jobs]);
  const approvedJobs = useMemo(() => jobs.filter((j) => j.status === "approved"), [jobs]);

  return (
    <div style={{ background: "linear-gradient(180deg, #eef5ff 0%, #f8fafc 260px, #f8fafc 100%)", minHeight: "100vh", color: "#475569", fontFamily: "'Source Sans 3', sans-serif" }}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin canPostJobs onSelectCategory={onSelectCategory} />
      <div className="page-content" style={{ maxWidth: 1180, margin: "0 auto", padding: "108px 24px 70px" }}>
        <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 8 }}>Operations</div>
        <h1 style={{ margin: 0, color: "#0f172a", fontFamily: "'Merriweather', serif", fontSize: "clamp(30px, 4vw, 42px)" }}>Admin Dashboard</h1>
        <p style={{ marginTop: 10, marginBottom: 28, maxWidth: 680, lineHeight: 1.65 }}>Moderate jobs, remove spam, and review platform activity.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{pendingJobs.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Pending Jobs</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{approvedJobs.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Approved Jobs</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{users.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Users</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 26, fontWeight: 900 }}>{applications.length}</div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Applications</div></div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 16, padding: 6, boxShadow: "0 10px 26px rgba(15,23,42,0.05)" }}>
          {[
            ["jobs", "Jobs"],
            ["users", "Users"],
            ["applications", "Applications"],
          ].map(([key, name]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
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

        {tab === "jobs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.length === 0 ? <div style={panel}>No jobs available.</div> : jobs.map((job) => (
              <div key={job.id} style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 240, flex: 1 }}>
                    <div style={{ color: "#0f172a", fontWeight: 900, fontSize: 18 }}>{job.title}</div>
                    <div style={{ fontSize: 13 }}>{job.company} · {job.location}</div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                      {job.category || "Uncategorized"} · Posted {formatDate(job.posted_at)}
                    </div>
                  </div>
                  <Badge color={statusColor(job.status)}>{job.status || "approved"}</Badge>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <button onClick={() => onApprove(job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "none", background: "#16a34a", color: "#ffffff", cursor: "pointer", fontWeight: 800 }}>Approve</button>
                  <button onClick={() => onReject(job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "none", background: "#dc2626", color: "#ffffff", cursor: "pointer", fontWeight: 800 }}>Reject</button>
                  <button onClick={() => onDelete(job.id)} style={{ padding: "9px 13px", borderRadius: 10, border: "1px solid rgba(220,38,38,0.32)", background: "#ffffff", color: "#dc2626", cursor: "pointer", fontWeight: 800 }}>Delete Spam</button>
                </div>
              </div>
            ))}
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
