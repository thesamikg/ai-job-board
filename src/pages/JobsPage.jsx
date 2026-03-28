import { JobCard, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";
import { ALL_SKILLS, CATEGORY_OPTIONS, EXPERIENCE_LEVEL_SUGGESTIONS } from "../data/jobs";

export default function JobsPage({
  jobsLoading, page, setPage, search, setSearch, filters, setFilters, filteredJobs,
  savedJobs, handleSave, openJobDetail, applyJob, setApplyJob,
  handleApplySubmit, toast, user, onSignOut, isAdmin, canPostJobs, onSelectCategory
}) {
  const bg = { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#475569" };
  const filterSectionTitleStyle = {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  };
  const filterLabelStyle = { display: "flex", gap: 10, alignItems: "center", cursor: "pointer" };
  const clearButtonStyle = {
    fontSize: 11,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    marginTop: 8,
    padding: 0,
  };

  return (
    <div style={bg}>
      <Navbar page={page} setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} onSelectCategory={onSelectCategory} />
      <div style={{ paddingTop: 80 }} className="page-content">
        <div style={{ background: "#f8fafc", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(148,163,184,0.3)" }}>
          <div className="jobs-toolbar" style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 20px 14px", display: "flex", gap: 10, flexWrap: "wrap" }}>
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
            <div style={{ position: "relative", flex: "0 0 auto" }}>
              <select className="jobs-sort" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))} style={{
                minWidth: 220,
                padding: "10px 48px 10px 14px",
                background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.5)",
                borderRadius: 10,
                color: "#475569",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}>
                <option value="newest">Newest First</option>
                <option value="salary">Salary: High to Low</option>
                <option value="remote">Remote First</option>
              </select>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  width: 10,
                  height: 10,
                  borderRight: "2px solid #64748b",
                  borderBottom: "2px solid #64748b",
                  transform: "translateY(-65%) rotate(45deg)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
        <div className="jobs-layout" style={{ display: "flex", alignItems: "flex-start", maxWidth: 1180, margin: "0 auto", padding: "24px 20px", gap: 24 }}>
          <div className="jobs-results" style={{ flex: 1, minWidth: 0 }}>
            <div className="jobs-results-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 40, marginBottom: 16 }}>
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
                <JobCard key={job.id} job={job} onClick={j => openJobDetail(j, "jobs")} onApply={j => setApplyJob(j)} />
              ))}
            </div>
          </div>
          <aside className="jobs-sidebar" style={{ width: 300, flexShrink: 0, paddingTop: 56 }}>
            <div
              className="jobs-sidebar-inner"
              style={{
                position: "sticky",
                top: 104,
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(148,163,184,0.28)",
                borderRadius: 22,
                padding: "18px 16px",
                boxShadow: "0 18px 36px rgba(15,23,42,0.08)",
                backdropFilter: "blur(20px)",
                maxHeight: "calc(100vh - 124px)",
                overflowY: "auto",
                overscrollBehavior: "contain",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 40, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(148,163,184,0.16)" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Filters</div>
                  <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 700 }}>Refine job matches</div>
                </div>
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: "", remote: false, exp: "", skills: [] }))}
                  style={{ ...clearButtonStyle, marginTop: 0, color: "#2563eb", fontWeight: 700 }}
                >
                  Clear all
                </button>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h4 style={filterSectionTitleStyle}>Categories</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {CATEGORY_OPTIONS.map((category) => (
                    <label key={category.name} style={filterLabelStyle}>
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
                {filters.category && <button onClick={() => setFilters((f) => ({ ...f, category: "" }))} style={{ ...clearButtonStyle, color: "#2563eb" }}>Clear</button>}
              </div>
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: "1px solid rgba(148,163,184,0.16)" }}>
                <h4 style={filterSectionTitleStyle}>Work Mode</h4>
                <label style={filterLabelStyle}>
                  <input type="checkbox" checked={filters.remote} onChange={e => setFilters(f => ({ ...f, remote: e.target.checked }))} style={{ accentColor: "#7c3aed" }} />
                  <span style={{ fontSize: 13, color: "#475569" }}>Remote only</span>
                </label>
              </div>
              <div style={{ marginBottom: 24, paddingTop: 20, borderTop: "1px solid rgba(148,163,184,0.16)" }}>
                <h4 style={filterSectionTitleStyle}>Experience</h4>
                {EXPERIENCE_LEVEL_SUGGESTIONS.map((experienceLevel) => (
                  <label key={experienceLevel} style={{ ...filterLabelStyle, marginBottom: 8 }}>
                    <input type="radio" name="exp" checked={filters.exp === experienceLevel} onChange={() => setFilters(f => ({ ...f, exp: experienceLevel }))} style={{ accentColor: "#7c3aed" }} />
                    <span style={{ fontSize: 13, color: "#475569" }}>{experienceLevel}</span>
                  </label>
                ))}
                {filters.exp && <button onClick={() => setFilters(f => ({ ...f, exp: "" }))} style={{ ...clearButtonStyle, color: "#7c3aed", marginTop: 4 }}>Clear</button>}
              </div>
              <div style={{ paddingTop: 20, borderTop: "1px solid rgba(148,163,184,0.16)" }}>
                <h4 style={filterSectionTitleStyle}>Skills</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexWrap: "wrap", maxHeight: "none" }}>
                  {ALL_SKILLS.map(skill => (
                    <label key={skill} style={filterLabelStyle}>
                      <input type="checkbox" checked={filters.skills.includes(skill)}
                        onChange={e => setFilters(f => ({ ...f, skills: e.target.checked ? [...f.skills, skill] : f.skills.filter(s => s !== skill) }))}
                        style={{ accentColor: "#7c3aed" }} />
                      <span style={{ fontSize: 13, color: "#475569" }}>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
