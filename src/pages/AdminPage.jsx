import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { Toast, Badge } from "../components/ui";

const panel = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 16,
};

function statusColor(status) {
  if (status === "approved") return "#22c55e";
  if (status === "rejected") return "#ef4444";
  return "#f59e0b";
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
}) {
  const [tab, setTab] = useState("jobs");

  const pendingJobs = useMemo(() => jobs.filter((j) => j.status === "pending"), [jobs]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", color: "#475569", fontFamily: "'Manrope', sans-serif" }}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin canPostJobs />
      <div className="page-content" style={{ maxWidth: 1050, margin: "0 auto", padding: "100px 24px 60px" }}>
        <h1 style={{ margin: 0, color: "#0f172a", fontFamily: "'Space Grotesk', sans-serif" }}>Admin Dashboard</h1>
        <p style={{ marginTop: 10, marginBottom: 24 }}>Moderate jobs, remove spam, and review platform activity.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800 }}>{pendingJobs.length}</div><div>Pending Jobs</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800 }}>{jobs.length}</div><div>Total Jobs</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800 }}>{users.length}</div><div>Users</div></div>
          <div style={panel}><div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800 }}>{applications.length}</div><div>Applications</div></div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["jobs", "users", "applications"].map((name) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                background: tab === name ? "rgba(124,58,237,0.24)" : "transparent",
                color: tab === name ? "#a78bfa" : "#475569",
                cursor: "pointer",
              }}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={panel}>Loading admin data...</div>
        ) : null}

        {tab === "jobs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobs.map((job) => (
              <div key={job.id} style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#0f172a", fontWeight: 700 }}>{job.title}</div>
                    <div style={{ fontSize: 13 }}>{job.company} · {job.location}</div>
                  </div>
                  <Badge color={statusColor(job.status)}>{job.status || "approved"}</Badge>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <button onClick={() => onApprove(job.id)} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#16a34a", color: "#0f172a", cursor: "pointer" }}>Approve</button>
                  <button onClick={() => onReject(job.id)} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#dc2626", color: "#0f172a", cursor: "pointer" }}>Reject</button>
                  <button onClick={() => onDelete(job.id)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fca5a5", cursor: "pointer" }}>Delete Spam</button>
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
                <div style={{ fontSize: 12 }}>Submitted: {new Date(a.submitted_at || a.at || Date.now()).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
