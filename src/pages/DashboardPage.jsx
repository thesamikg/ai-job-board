import { JobCard, JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";

export default function DashboardPage({
  jobsLoading, page, setPage, jobs = [], savedJobs, emails, handleSave, selectedJob, setSelectedJob,
  applyJob, setApplyJob, handleApplySubmit, toast, user, onSignOut
}) {
  const bg = { background: "#060b18", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#94a3b8" };

  return (
    <div style={bg}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} />
      <div className="page-content" style={{ maxWidth: 800, margin: "0 auto", padding: "100px 24px 60px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 40 }}>Manage your saved jobs and preferences</p>
        <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {[["📌", savedJobs.length, "Saved Jobs"], ["📧", emails.length, "Applications"], ["🔔", "Active", "Job Alerts"]].map(([icon, val, label]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>Saved Jobs</h3>
        {jobsLoading ? (
          <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
        ) : savedJobs.length === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>☆</div>
            <div style={{ fontSize: 14, color: "#64748b" }}>No saved jobs yet. Browse jobs and save the ones you like.</div>
            <button onClick={() => setPage("jobs")} style={{ marginTop: 16, padding: "10px 20px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 8, color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Browse Jobs</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobs.filter(j => savedJobs.includes(j.id)).map(job => (
              <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} saved={true} onSave={handleSave} />
            ))}
          </div>
        )}
      </div>
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} onApply={j => { setApplyJob(j); setSelectedJob(null); }} saved={savedJobs.includes(selectedJob.id)} onSave={handleSave} />}
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
