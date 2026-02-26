import { Logo, Toast } from "../components/ui";
import { JobCard, JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { CATEGORIES } from "../data/jobs";

export default function HomePage({
  jobs, jobsLoading, setPage, search, setSearch, savedJobs, handleSave, showToast,
  selectedJob, setSelectedJob, applyJob, setApplyJob, handleApplySubmit,
  emailInput, setEmailInput, subscribed, setSubscribed, toast, user, onSignOut, isAdmin, canPostJobs
}) {
  const bg = { background: "#fdf7ef", minHeight: "100vh", fontFamily: "'Manrope', sans-serif", color: "#6f6258" };

  return (
    <div style={bg}>
      <Navbar page="home" setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} />
      {/* Hero */}
      <div className="hero-padding" style={{ position: "relative", overflow: "hidden", paddingTop: 120, paddingBottom: 80 }}>
        {[["#0f766e", "-10%", "20%"], ["#d97706", "60%", "-5%"], ["#14b8a6", "30%", "60%"]].map(([c, l, t], i) => (
          <div key={i} style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${c}20, transparent 70%)`,
            left: l, top: t, animation: `blob ${5 + i}s ease-in-out infinite`, filter: "blur(40px)",
            animationDelay: `${i * 1.5}s`
          }} />
        ))}
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 24px", animation: "fadeIn 0.8s ease forwards" }}>
            <div style={{ background: "#fffaf3", border: "1px solid rgba(180,147,118,0.45)", borderRadius: 20, padding: "30px 28px", textAlign: "center" }}>
              <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
            background: "rgba(15,118,110,0.12)", border: "1px solid rgba(15,118,110,0.3)",
            borderRadius: 99, padding: "6px 16px"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f766e", display: "inline-block", boxShadow: "0 0 8px #0f766e55" }} />
            <span style={{ fontSize: 12, color: "#0f766e", fontWeight: 600 }}>{(jobs || []).length} roles live now</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, color: "#2f241f", lineHeight: 1.1, marginBottom: 16, letterSpacing: -1 }}>
            Find the Best<br />
            <span style={{ background: "linear-gradient(135deg, #0f766e, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI & Robotics Jobs</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#6f6258", maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.7 }}>
            The premier job board for AI Engineers, ML Scientists, Robotics Engineers, and LLM specialists worldwide.
          </p>
          <div className="search-stack" style={{
            display: "flex", gap: 8, background: "#fff",
            border: "1px solid rgba(180,147,118,0.45)", borderRadius: 14, padding: 8,
            maxWidth: 600, margin: "0 auto 48px", flexWrap: "wrap",
          }}>
            <input value={search.title} onChange={e => setSearch(s => ({ ...s, title: e.target.value }))}
              placeholder="Job title, company, skill…" style={{
                flex: 1, minWidth: 160, padding: "10px 14px", background: "transparent",
                border: "none", color: "#2f241f", fontSize: 14, outline: "none"
              }} />
            <div className="search-divider" style={{ width: 1, background: "rgba(180,147,118,0.4)", margin: "4px 0" }} />
            <input value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
              placeholder="Location or Remote" style={{
                flex: 1, minWidth: 140, padding: "10px 14px", background: "transparent",
                border: "none", color: "#2f241f", fontSize: 14, outline: "none"
              }} />
            <button onClick={() => setPage("jobs")} style={{
              padding: "10px 24px", background: "linear-gradient(135deg, #0f766e, #0ea5a0)",
              border: "1px solid rgba(15,118,110,0.7)", borderRadius: 8, color: "#ffffff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", whiteSpace: "nowrap"
            }}>Browse Jobs</button>
          </div>
          <div style={{ fontSize: 12, color: "#9b8b7d", marginBottom: 0 }}>
            Popular: <span style={{ color: "#0f766e", cursor: "pointer" }}>LLM Engineer</span> · <span style={{ color: "#0f766e", cursor: "pointer" }}>ML Research</span> · <span style={{ color: "#0f766e", cursor: "pointer" }}>Computer Vision</span> · <span style={{ color: "#0f766e", cursor: "pointer" }}>Robotics</span>
          </div>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="section-padding" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: "#2f241f", textAlign: "center", marginBottom: 16 }}>Browse by Category</h2>
        <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.name} onClick={() => setPage("jobs")} style={{
              background: "#fff", border: "1px solid rgba(180,147,118,0.35)",
              borderRadius: 10, padding: "10px 8px", textAlign: "center", cursor: "pointer",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "60"; e.currentTarget.style.background = cat.color + "10"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(180,147,118,0.35)"; e.currentTarget.style.background = "#fff"; }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2f241f", marginBottom: 2 }}>{cat.name}</div>
              <div style={{ fontSize: 10, color: cat.color, fontWeight: 600 }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Jobs */}
      <div className="section-padding page-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: "#2f241f" }}>Jobs Available Now</h2>
          <button onClick={() => setPage("jobs")} style={{ background: "#fff", border: "1px solid rgba(180,147,118,0.45)", borderRadius: 8, padding: "7px 14px", color: "#6f6258", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>View all →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jobsLoading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
          ) : (
            (jobs || []).slice(0, 8).map(job => (
              <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} saved={savedJobs.includes(job.id)} onSave={handleSave} />
            ))
          )}
        </div>
      </div>

      {/* Why choose */}
      <div style={{ background: "rgba(15,118,110,0.06)", borderTop: "1px solid rgba(15,118,110,0.15)", borderBottom: "1px solid rgba(15,118,110,0.15)", padding: "64px 24px", marginBottom: 80 }}>
        <div className="section-padding" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: "#2f241f", textAlign: "center", marginBottom: 48 }}>Why NeuralHire?</h2>
          <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[["⚡", "AI-First", "Built exclusively for AI, ML, and Robotics professionals. No noise."],
            ["🎯", "Curated Roles", "Every listing is reviewed for quality, accuracy, and salary transparency."],
            ["🔔", "Smart Alerts", "Get notified about roles matching your skills and preferences."],
            ["🌍", "Global Reach", "Discover high-quality AI roles across every region, including remote-first teams."]].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: "#2f241f", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#6f6258", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email subscribe */}
      <div className="section-padding" style={{ maxWidth: 520, margin: "0 auto 80px", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: "#2f241f", marginBottom: 12 }}>Stay ahead of the curve</h2>
        <p style={{ fontSize: 14, color: "#6f6258", marginBottom: 24, lineHeight: 1.7 }}>Get weekly AI job alerts, salary reports, and hiring trends delivered to your inbox.</p>
        {!subscribed ? (
          <div className="search-stack" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={emailInput} onChange={e => setEmailInput(e.target.value)}
              placeholder="your@email.com" style={{
                flex: 1, padding: "12px 16px", background: "#fff",
                border: "1px solid rgba(180,147,118,0.45)", borderRadius: 10, color: "#2f241f", fontSize: 14, outline: "none"
              }} />
            <button onClick={() => { if (emailInput.includes("@")) { setSubscribed(true); showToast("✓ You're subscribed!"); } }} style={{
              padding: "12px 20px", background: "linear-gradient(135deg, #0f766e, #0ea5a0)",
              border: "1px solid rgba(15,118,110,0.7)", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, cursor: "pointer"
            }}>Subscribe</button>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600 }}>✓ You're on the list!</div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-responsive" style={{ borderTop: "1px solid rgba(180,147,118,0.35)", padding: "32px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <Logo />
        <div style={{ fontSize: 12, color: "#9b8b7d" }}>© 2025 NeuralHire · Built for the AI generation</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#9b8b7d", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>

      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} onApply={j => { setApplyJob(j); setSelectedJob(null); }} saved={savedJobs.includes(selectedJob.id)} onSave={handleSave} />}
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
