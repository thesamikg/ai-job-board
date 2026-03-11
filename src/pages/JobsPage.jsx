import { JobCard, JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";
import { ALL_SKILLS, CATEGORIES } from "../data/jobs";

export default function JobsPage({
  jobsLoading, page, setPage, search, setSearch, filters, setFilters, filteredJobs,
  savedJobs, handleSave, selectedJob, setSelectedJob, applyJob, setApplyJob,
  handleApplySubmit, toast, user, onSignOut, isAdmin, canPostJobs, onSelectCategory
}) {
  const bg = { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#475569" };

  return (
    <div style={bg}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} onSelectCategory={onSelectCategory} />
      <div style={{ paddingTop: 80 }} className="page-content">
        <div style={{ background: "#f8fafc", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(148,163,184,0.3)" }}>
          <div className="jobs-toolbar" style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 20px 14px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input value={search.title} onChange={e => setSearch(s => ({ ...s, title: e.target.value }))}
              placeholder="Search roles, companies, skills…" style={{
                flex: "2 1 200px", padding: "10px 16px", background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.45)", borderRadius: 10, color: "#0f172a", fontSize: 14, outline: "none"
              }} />
            <input value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
              placeholder="Location…" style={{
                flex: "1 1 140px", padding: "10px 16px", background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.45)", borderRadius: 10, color: "#0f172a", fontSize: 14, outline: "none"
              }} />
            <select className="jobs-sort" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))} style={{
              padding: "10px 14px", background: "#ffffff", border: "1px solid rgba(148,163,184,0.5)",
              borderRadius: 10, color: "#475569", fontSize: 13, outline: "none", cursor: "pointer"
            }}>
              <option value="newest">Newest First</option>
              <option value="salary">Salary: High to Low</option>
              <option value="remote">Remote First</option>
            </select>
          </div>
        </div>
        <div className="jobs-layout" style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "24px 20px", gap: 24 }}>
          <div className="jobs-sidebar" style={{ width: 220, flexShrink: 0 }}>
            <div className="jobs-sidebar-inner" style={{ position: "sticky", top: 120 }}>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Categories</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CATEGORIES.filter((category) => category.name !== "Remote" && category.name !== "Global").map((category) => (
                    <label key={category.name} style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.name}
                        onChange={() => setFilters((f) => ({ ...f, category: category.name }))}
                        style={{ accentColor: "#2563eb" }}
                      />
                      <span style={{ fontSize: 13, color: "#475569" }}>{category.icon} {category.name}</span>
                    </label>
                  ))}
                </div>
                {filters.category && <button onClick={() => setFilters((f) => ({ ...f, category: "" }))} style={{ fontSize: 11, color: "#2563eb", background: "transparent", border: "none", cursor: "pointer", marginTop: 8 }}>Clear</button>}
              </div>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Work Mode</h4>
                <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={filters.remote} onChange={e => setFilters(f => ({ ...f, remote: e.target.checked }))} style={{ accentColor: "#7c3aed" }} />
                  <span style={{ fontSize: 13, color: "#475569" }}>Remote only</span>
                </label>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Experience</h4>
                {[["0-2", "0–2 yrs"], ["2-5", "2–5 yrs"], ["5+", "5+ yrs"]].map(([val, label]) => (
                  <label key={val} style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", marginBottom: 8 }}>
                    <input type="radio" name="exp" checked={filters.exp === val} onChange={() => setFilters(f => ({ ...f, exp: val }))} style={{ accentColor: "#7c3aed" }} />
                    <span style={{ fontSize: 13, color: "#475569" }}>{label}</span>
                  </label>
                ))}
                {filters.exp && <button onClick={() => setFilters(f => ({ ...f, exp: "" }))} style={{ fontSize: 11, color: "#7c3aed", background: "transparent", border: "none", cursor: "pointer", marginTop: 4 }}>Clear</button>}
              </div>
              <div>
                <h4 style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Skills</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexWrap: "wrap", maxHeight: "none" }}>
                  {ALL_SKILLS.map(skill => (
                    <label key={skill} style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={filters.skills.includes(skill)}
                        onChange={e => setFilters(f => ({ ...f, skills: e.target.checked ? [...f.skills, skill] : f.skills.filter(s => s !== skill) }))}
                        style={{ accentColor: "#7c3aed" }} />
                      <span style={{ fontSize: 13, color: "#475569" }}>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="jobs-results-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}><span style={{ color: "#1e293b", fontWeight: 700 }}>{filteredJobs.length}</span> jobs found</span>
              {filters.category ? (
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: "" }))}
                  style={{
                    background: "rgba(37,99,235,0.08)",
                    border: "1px solid rgba(37,99,235,0.25)",
                    borderRadius: 999,
                    padding: "7px 12px",
                    color: "#1d4ed8",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {filters.category} ×
                </button>
              ) : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {jobsLoading ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                  <div style={{ fontSize: 16, color: "#64748b" }}>Loading jobs…</div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                  <div style={{ fontSize: 16, color: "#64748b" }}>No jobs match your filters</div>
                </div>
              ) : filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} onApply={j => setApplyJob(j)} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} onApply={j => { setApplyJob(j); setSelectedJob(null); }} saved={savedJobs.includes(selectedJob.id)} onSave={handleSave} />}
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
