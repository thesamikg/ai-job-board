import { Logo, Toast } from "../components/ui";
import { JobCard, JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { CATEGORIES } from "../data/jobs";

export default function HomePage({
  jobs, jobsLoading, setPage, search, setSearch, savedJobs, handleSave, showToast,
  selectedJob, setSelectedJob, applyJob, setApplyJob, handleApplySubmit,
  emailInput, setEmailInput, subscribed, setSubscribed, toast, user, onSignOut, isAdmin, canPostJobs
}) {
  const bg = { background: "#ffffff", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#334155" };

  return (
    <div style={bg}>
      <Navbar page="home" setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} />
      {/* Hero */}
      <div className="hero-padding" style={{ position: "relative", overflow: "hidden", paddingTop: 92, paddingBottom: 24, background: "#eaf3ff" }}>
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 24px", animation: "fadeIn 0.8s ease forwards" }}>
            <div style={{ padding: "12px 8px", textAlign: "center" }}>
              <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
            background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.35)",
            borderRadius: 99, padding: "6px 16px"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", display: "inline-block", boxShadow: "0 0 8px #2563eb55" }} />
            <span style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>{(jobs || []).length} roles live now</span>
          </div>
          <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, color: "#0f172a", lineHeight: 1.15, marginBottom: 16 }}>
            Find the Best<br />
            <span style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI & Robotics Jobs</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#475569", maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.6 }}>
            The premier job board for AI Engineers, ML Scientists, Robotics Engineers, and LLM specialists worldwide.
          </p>
          <div className="search-stack" style={{
            display: "flex", gap: 8, background: "#ffffff",
            border: "1px solid rgba(148,163,184,0.35)", borderRadius: 14, padding: 8,
            maxWidth: 600, margin: "0 auto 14px", flexWrap: "wrap",
          }}>
            <input value={search.title} onChange={e => setSearch(s => ({ ...s, title: e.target.value }))}
              placeholder="Job title, company, skill…" style={{
                flex: 1, minWidth: 160, padding: "10px 14px", background: "transparent",
                border: "none", color: "#0f172a", fontSize: 14, outline: "none"
              }} />
            <div className="search-divider" style={{ width: 1, background: "rgba(148,163,184,0.4)", margin: "4px 0" }} />
            <input value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
              placeholder="Location or Remote" style={{
                flex: 1, minWidth: 140, padding: "10px 14px", background: "transparent",
                border: "none", color: "#0f172a", fontSize: 14, outline: "none"
              }} />
            <button onClick={() => setPage("jobs")} style={{
              padding: "10px 24px", background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              border: "1px solid rgba(29,78,216,0.7)", borderRadius: 8, color: "#ffffff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap"
            }}>Browse Jobs</button>
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
            Popular: <span style={{ color: "#1d4ed8", cursor: "pointer" }}>LLM Engineer</span> · <span style={{ color: "#1d4ed8", cursor: "pointer" }}>ML Research</span> · <span style={{ color: "#1d4ed8", cursor: "pointer" }}>Computer Vision</span> · <span style={{ color: "#1d4ed8", cursor: "pointer" }}>Robotics</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 900, margin: "0 auto" }}>
            {(jobs || []).slice(0, 2).map(job => (
              <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} saved={savedJobs.includes(job.id)} onSave={handleSave} />
            ))}
          </div>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="section-padding" style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 24px 48px" }}>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 18, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 16 }}>Browse by Category</h2>
        <div className="categories-grid" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {CATEGORIES.map(cat => (
            <div key={cat.name} onClick={() => setPage("jobs")} style={{
              background: "#fff", border: "1px dashed rgba(148,163,184,0.45)",
              borderRadius: 16, padding: "10px 16px", textAlign: "center", cursor: "pointer",
              transition: "all 0.2s",
              minWidth: 150,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "60"; e.currentTarget.style.background = cat.color + "10"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(148,163,184,0.45)"; e.currentTarget.style.background = "#fff"; }}
            >
              <div style={{ fontSize: 16, marginBottom: 3 }}>{cat.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 1 }}>{cat.name}</div>
              <div style={{ fontSize: 11, color: cat.color, fontWeight: 700 }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Jobs */}
      <div className="section-padding page-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Jobs Available Now</h2>
          <button onClick={() => setPage("jobs")} style={{ background: "#fff", border: "1px solid rgba(148,163,184,0.4)", borderRadius: 8, padding: "7px 14px", color: "#334155", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>View all →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jobsLoading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
          ) : (
            (jobs || []).slice(2, 8).map(job => (
              <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} saved={savedJobs.includes(job.id)} onSave={handleSave} />
            ))
          )}
        </div>
      </div>

      {/* Why choose */}
      <div style={{ background: "rgba(37,99,235,0.05)", borderTop: "1px solid rgba(37,99,235,0.14)", borderBottom: "1px solid rgba(37,99,235,0.14)", padding: "64px 24px", marginBottom: 80 }}>
        <div className="section-padding" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>Why NeuralHire?</h2>
          <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[["⚡", "AI-First", "Built exclusively for AI, ML, and Robotics professionals. No noise."],
            ["🎯", "Curated Roles", "Every listing is reviewed for quality, accuracy, and salary transparency."],
            ["🔔", "Smart Alerts", "Get notified about roles matching your skills and preferences."],
            ["🌍", "Global Reach", "Discover high-quality AI roles across every region, including remote-first teams."]].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: "'Merriweather', serif", fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email subscribe */}
      <div className="section-padding" style={{ maxWidth: 520, margin: "0 auto 80px", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Stay ahead of the curve</h2>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 24, lineHeight: 1.7 }}>Get weekly AI job alerts, salary reports, and hiring trends delivered to your inbox.</p>
        {!subscribed ? (
          <div className="search-stack" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={emailInput} onChange={e => setEmailInput(e.target.value)}
              placeholder="your@email.com" style={{
                flex: 1, padding: "12px 16px", background: "#fff",
                border: "1px solid rgba(148,163,184,0.4)", borderRadius: 10, color: "#0f172a", fontSize: 14, outline: "none"
              }} />
            <button onClick={() => { if (emailInput.includes("@")) { setSubscribed(true); showToast("✓ You're subscribed!"); } }} style={{
              padding: "12px 20px", background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              border: "1px solid rgba(29,78,216,0.7)", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, cursor: "pointer"
            }}>Subscribe</button>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600 }}>✓ You're on the list!</div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-responsive" style={{ borderTop: "1px solid rgba(148,163,184,0.3)", padding: "32px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <Logo />
        <div style={{ fontSize: 12, color: "#64748b" }}>© 2025 NeuralHire · Built for the AI generation</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>

      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} onApply={j => { setApplyJob(j); setSelectedJob(null); }} saved={savedJobs.includes(selectedJob.id)} onSave={handleSave} />}
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
