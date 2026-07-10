import { JobCard, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";

export default function DashboardPage({
  jobsLoading, page, setPage, jobs = [], savedJobs, handleSave, openJobDetail,
  applyJob, setApplyJob, handleApplySubmit, toast, user, userRole = "job_seeker", applications = [], onSignOut, isAdmin, canPostJobs,
  onSelectCategory
}) {
  const bg = { background: "linear-gradient(180deg, #eef5ff 0%, #f8fafc 260px, #f8fafc 100%)", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#475569" };
  const isEmployerLike = userRole === "employer";
  const postedJobs = (jobs || []).filter((job) => {
    const owner = String(job?.posted_by || "");
    return owner && (owner === String(user?.id || "") || owner.toLowerCase() === String(user?.email || "").toLowerCase());
  });
  const activeJobs = postedJobs.filter((job) => job.status === "approved");
  const inactiveJobs = postedJobs.filter((job) => job.status !== "approved");
  const seekerApplications = (applications || []).filter((item) => {
    const userId = String(user?.id || "");
    const appId = String(item?.applicant_id || "");
    const email = String(item?.applicant_email || "").toLowerCase();
    const userEmail = String(user?.email || "").toLowerCase();
    return (userId && appId === userId) || (email && userEmail && email === userEmail);
  });
  const appliedJobIds = new Set(seekerApplications.map((app) => String(app.job_id || "")).filter(Boolean));
  const appliedJobs = (jobs || []).filter((job) => appliedJobIds.has(String(job.id)));

  return (
    <div style={bg}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} onSelectCategory={onSelectCategory} />
      <div className="page-content" style={{ maxWidth: 900, margin: "0 auto", padding: "108px 24px 70px" }}>
        <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 8 }}>
          {isEmployerLike ? "Employer workspace" : "Candidate workspace"}
        </div>
        <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 40 }}>
          {isEmployerLike ? "Manage your posted jobs and listing status" : "Track your applications and saved jobs"}
        </p>
        <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {(isEmployerLike
            ? [["📝", postedJobs.length, "Posted Jobs"], ["✅", activeJobs.length, "Active Jobs"], ["⏸", inactiveJobs.length, "Inactive Jobs"]]
            : [["📧", seekerApplications.length, "Applied Jobs"], ["📌", savedJobs.length, "Saved Jobs"], ["🔎", "Browse", "Browse Jobs"]]
          ).map(([icon, val, label]) => (
            <div key={label} style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 18, padding: "22px 24px", boxShadow: "0 14px 34px rgba(15,23,42,0.07)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.12)" }}>{icon}</div>
              <div style={{ fontFamily: "'Merriweather', serif", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{label}</div>
            </div>
          ))}
        </div>
        {isEmployerLike ? (
          <>
            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Posted Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : postedJobs.length === 0 ? (
              <div style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 18, padding: "34px 24px", textAlign: "center", boxShadow: "0 14px 34px rgba(15,23,42,0.07)" }}>
                <div style={{ fontSize: 14, color: "#64748b" }}>No jobs posted yet.</div>
                <button onClick={() => setPage("addJob")} style={{ marginTop: 14, padding: "10px 20px", background: "#2563eb", border: "1px solid #1d4ed8", borderRadius: 8, color: "#ffffff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Post a Job</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {postedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={(j) => openJobDetail(j, "dashboard")} onApply={(j) => setApplyJob(j)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Applied Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : appliedJobs.length === 0 ? (
              <div style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 18, padding: "34px 24px", textAlign: "center", marginBottom: 24, boxShadow: "0 14px 34px rgba(15,23,42,0.07)" }}>
                <div style={{ fontSize: 14, color: "#64748b" }}>No applications yet.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {appliedJobs.map((job) => (
                  <JobCard key={`applied-${job.id}`} job={job} onClick={(j) => openJobDetail(j, "dashboard")} onApply={(j) => setApplyJob(j)} />
                ))}
              </div>
            )}

            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Saved Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : savedJobs.length === 0 ? (
              <div style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 18, padding: "48px 24px", textAlign: "center", boxShadow: "0 14px 34px rgba(15,23,42,0.07)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>☆</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>No saved jobs yet. Browse jobs and save the ones you like.</div>
                <button onClick={() => setPage("jobs")} style={{ marginTop: 16, padding: "10px 20px", background: "#2563eb", border: "1px solid #1d4ed8", borderRadius: 8, color: "#ffffff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Browse Jobs</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {jobs.filter(j => savedJobs.includes(j.id)).map(job => (
                  <JobCard key={job.id} job={job} onClick={j => openJobDetail(j, "dashboard")} onApply={j => setApplyJob(j)} />
                ))}
              </div>
            )}

            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "32px 0 16px" }}>Browse Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(jobs || []).slice(0, 5).map(job => (
                  <JobCard key={job.id} job={job} onClick={j => openJobDetail(j, "dashboard")} onApply={j => setApplyJob(j)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
