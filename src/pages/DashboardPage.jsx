import { JobCard, JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";

export default function DashboardPage({
  jobsLoading, page, setPage, jobs = [], savedJobs, handleSave, selectedJob, setSelectedJob,
  applyJob, setApplyJob, handleApplySubmit, toast, user, userRole = "job_seeker", applications = [], onSignOut, isAdmin, canPostJobs,
  onSelectCategory
}) {
  const bg = { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#475569" };
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
  const appliedJobs = seekerApplications
    .map((app) => (jobs || []).find((job) => String(job.id) === String(app.job_id)))
    .filter(Boolean);

  return (
    <div style={bg}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} onSelectCategory={onSelectCategory} />
      <div className="page-content" style={{ maxWidth: 800, margin: "0 auto", padding: "100px 24px 60px" }}>
        <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 40 }}>
          {isEmployerLike ? "Manage your posted jobs and listing status" : "Track your applications and saved jobs"}
        </p>
        <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {(isEmployerLike
            ? [["📝", postedJobs.length, "Posted Jobs"], ["✅", activeJobs.length, "Active Jobs"], ["⏸", inactiveJobs.length, "Inactive Jobs"]]
            : [["📧", seekerApplications.length, "Applied Jobs"], ["📌", savedJobs.length, "Saved Jobs"], ["🔎", "Browse", "Browse Jobs"]]
          ).map(([icon, val, label]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "'Merriweather', serif", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
        {isEmployerLike ? (
          <>
            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Posted Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : postedJobs.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "30px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 14, color: "#64748b" }}>No jobs posted yet.</div>
                <button onClick={() => setPage("addJob")} style={{ marginTop: 14, padding: "10px 20px", background: "#2563eb", border: "1px solid #1d4ed8", borderRadius: 8, color: "#ffffff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Post a Job</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {postedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={(j) => setSelectedJob(j)} onApply={(j) => setApplyJob(j)} />
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
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "30px 24px", textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: "#64748b" }}>No applications yet.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {appliedJobs.map((job) => (
                  <JobCard key={`applied-${job.id}`} job={job} onClick={(j) => setSelectedJob(j)} onApply={(j) => setApplyJob(j)} />
                ))}
              </div>
            )}

            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Saved Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : savedJobs.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>☆</div>
                <div style={{ fontSize: 14, color: "#64748b" }}>No saved jobs yet. Browse jobs and save the ones you like.</div>
                <button onClick={() => setPage("jobs")} style={{ marginTop: 16, padding: "10px 20px", background: "#2563eb", border: "1px solid #1d4ed8", borderRadius: 8, color: "#ffffff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Browse Jobs</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {jobs.filter(j => savedJobs.includes(j.id)).map(job => (
                  <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} onApply={j => setApplyJob(j)} />
                ))}
              </div>
            )}

            <h3 style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "32px 0 16px" }}>Browse Jobs</h3>
            {jobsLoading ? (
              <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(jobs || []).slice(0, 5).map(job => (
                  <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} onApply={j => setApplyJob(j)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} onApply={j => { setApplyJob(j); setSelectedJob(null); }} saved={savedJobs.includes(selectedJob.id)} onSave={handleSave} />}
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
