import { Logo, Toast } from "../components/ui";
import { JobCard, JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { CATEGORIES } from "../data/jobs";

export default function HomePage({
  jobs, jobsLoading, setPage, search, setSearch, savedJobs, handleSave, showToast,
  selectedJob, setSelectedJob, applyJob, setApplyJob, handleApplySubmit,
  emailInput, setEmailInput, subscribed, setSubscribed, toast, user
}) {
  const bg = { background: "#060b18", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#94a3b8" };

  return (
    <div style={bg}>
      <Navbar page="home" setPage={setPage} user={user} />
      {/* Hero */}
      <div className="hero-padding" style={{ position: "relative", overflow: "hidden", paddingTop: 120, paddingBottom: 80, textAlign: "center" }}>
        {[["#7c3aed", "-10%", "20%"], ["#2563eb", "60%", "-5%"], ["#0ea5e9", "30%", "60%"]].map(([c, l, t], i) => (
          <div key={i} style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${c}20, transparent 70%)`,
            left: l, top: t, animation: `blob ${5 + i}s ease-in-out infinite`, filter: "blur(40px)",
            animationDelay: `${i * 1.5}s`
          }} />
        ))}
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "0 24px", animation: "fadeIn 0.8s ease forwards" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 99, padding: "6px 16px"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>1,247 AI roles live now</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#f1f5f9", lineHeight: 1.1, marginBottom: 20, letterSpacing: -2 }}>
            Find the Best<br />
            <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI & Robotics Jobs</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#64748b", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            The premier job board for AI Engineers, ML Scientists, Robotics Engineers, and LLM specialists in India and globally.
          </p>
          <div className="search-stack" style={{
            display: "flex", gap: 8, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 8,
            maxWidth: 600, margin: "0 auto 48px", flexWrap: "wrap",
          }}>
            <input value={search.title} onChange={e => setSearch(s => ({ ...s, title: e.target.value }))}
              placeholder="Job title, company, skill…" style={{
                flex: 1, minWidth: 160, padding: "10px 14px", background: "transparent",
                border: "none", color: "#f1f5f9", fontSize: 14, outline: "none"
              }} />
            <div className="search-divider" style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
            <input value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
              placeholder="Location or Remote" style={{
                flex: 1, minWidth: 140, padding: "10px 14px", background: "transparent",
                border: "none", color: "#f1f5f9", fontSize: 14, outline: "none"
              }} />
            <button onClick={() => setPage("jobs")} style={{
              padding: "10px 24px", background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap"
            }}>Browse Jobs</button>
          </div>
          <div style={{ fontSize: 12, color: "#334155", marginBottom: 0 }}>
            Popular: <span style={{ color: "#7c3aed", cursor: "pointer" }}>LLM Engineer</span> · <span style={{ color: "#7c3aed", cursor: "pointer" }}>ML Research</span> · <span style={{ color: "#7c3aed", cursor: "pointer" }}>Computer Vision</span> · <span style={{ color: "#7c3aed", cursor: "pointer" }}>Robotics</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="section-padding" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#e2e8f0", textAlign: "center", marginBottom: 32 }}>Browse by Category</h2>
        <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.name} onClick={() => setPage("jobs")} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "20px 16px", textAlign: "center", cursor: "pointer",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "60"; e.currentTarget.style.background = cat.color + "10"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>{cat.count} jobs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="section-padding page-content" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#e2e8f0" }}>Featured Roles</h2>
          <button onClick={() => setPage("jobs")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 14px", color: "#64748b", cursor: "pointer", fontSize: 13 }}>View all →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jobsLoading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
          ) : (
            (jobs || []).filter(j => j.featured).slice(0, 4).map(job => (
              <JobCard key={job.id} job={job} onClick={j => setSelectedJob(j)} saved={savedJobs.includes(job.id)} onSave={handleSave} />
            ))
          )}
        </div>
      </div>

      {/* Why choose */}
      <div style={{ background: "rgba(124,58,237,0.05)", borderTop: "1px solid rgba(124,58,237,0.1)", borderBottom: "1px solid rgba(124,58,237,0.1)", padding: "64px 24px", marginBottom: 80 }}>
        <div className="section-padding" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#e2e8f0", textAlign: "center", marginBottom: 48 }}>Why NeuralHire?</h2>
          <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[["⚡", "AI-First", "Built exclusively for AI, ML, and Robotics professionals. No noise."],
            ["🎯", "Curated Roles", "Every listing is reviewed for quality, accuracy, and salary transparency."],
            ["🔔", "Smart Alerts", "Get notified about roles matching your skills and preferences."],
            ["🇮🇳", "India + Global", "Best AI jobs in India plus remote-first global opportunities."]].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email subscribe */}
      <div className="section-padding" style={{ maxWidth: 520, margin: "0 auto 80px", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#e2e8f0", marginBottom: 12 }}>Stay ahead of the curve</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.7 }}>Get weekly AI job alerts, salary reports, and hiring trends delivered to your inbox.</p>
        {!subscribed ? (
          <div className="search-stack" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={emailInput} onChange={e => setEmailInput(e.target.value)}
              placeholder="your@email.com" style={{
                flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none"
              }} />
            <button onClick={() => { if (emailInput.includes("@")) { setSubscribed(true); showToast("✓ You're subscribed!"); } }} style={{
              padding: "12px 20px", background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer"
            }}>Subscribe</button>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600 }}>✓ You're on the list!</div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-responsive" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <Logo />
        <div style={{ fontSize: 12, color: "#334155" }}>© 2025 NeuralHire · Built for the AI generation</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#334155", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>

      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} onApply={j => { setApplyJob(j); setSelectedJob(null); }} saved={savedJobs.includes(selectedJob.id)} onSave={handleSave} />}
      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
