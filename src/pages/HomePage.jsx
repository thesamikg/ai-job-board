import { Logo, Toast } from "../components/ui";
import { JobCard, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";

export default function HomePage({
  jobs, jobsLoading, setPage, search, setSearch, savedJobs, handleSave, showToast,
  openJobDetail, applyJob, setApplyJob, handleApplySubmit,
  emailInput, setEmailInput, subscribed, setSubscribed, subscribeLoading, onSubscribe, toast, user, onSignOut, isAdmin, canPostJobs, onSelectCategory
}) {
  const bg = { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#334155" };

  return (
    <div style={bg}>
      <Navbar page="home" setPage={setPage} user={user} onSignOut={onSignOut} isAdmin={isAdmin} canPostJobs={canPostJobs} onSelectCategory={onSelectCategory} />
      {/* Hero */}
      <div
        className="hero-padding"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: 96,
          paddingBottom: 36,
          backgroundImage: "linear-gradient(90deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.88) 38%, rgba(15,23,42,0.5) 68%, rgba(15,23,42,0.12) 100%), url('/images/hero-ai-robotics-lab.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid rgba(37,99,235,0.18)",
        }}
      >
        <div className="home-hero-shell" style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 24px", animation: "fadeIn 0.8s ease forwards" }}>
          <div className="home-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.75fr)", gap: 36, alignItems: "end", minHeight: 430 }}>
            <div className="home-hero-copy" style={{ maxWidth: 660, padding: "28px 0 12px", textAlign: "left" }}>
              <div className="home-role-pill" style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
            background: "rgba(37,99,235,0.18)", border: "1px solid rgba(96,165,250,0.34)",
            borderRadius: 99, padding: "7px 16px", backdropFilter: "blur(14px)"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", display: "inline-block", boxShadow: "0 0 14px #60a5faaa" }} />
            <span style={{ fontSize: 12, color: "#dbeafe", fontWeight: 800 }}>{(jobs || []).length} roles live now</span>
          </div>
          <h1 className="home-hero-title" style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(38px, 5.2vw, 60px)", fontWeight: 700, color: "#ffffff", lineHeight: 1.08, marginBottom: 16, textShadow: "0 18px 40px rgba(0,0,0,0.32)" }}>
            Find the Best<br />
            <span style={{ background: "linear-gradient(135deg, #93c5fd, #ffffff 45%, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI & Robotics Jobs</span>
          </h1>
          <p className="home-hero-subtitle" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#cbd5e1", maxWidth: 610, margin: "0 0 24px", lineHeight: 1.65 }}>
            The premier job board for AI Engineers, ML Scientists, Robotics Engineers, and LLM specialists worldwide.
          </p>
          <div className="search-stack home-search-stack" style={{
            display: "flex", gap: 8, background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(255,255,255,0.32)", borderRadius: 18, padding: 8,
            maxWidth: 720, margin: "0 0 14px", flexWrap: "wrap",
            boxShadow: "0 24px 60px rgba(2,6,23,0.35)",
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
            <button className="primary-cta" onClick={() => setPage("jobs")} style={{
              padding: "12px 28px", background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              border: "1px solid rgba(147,197,253,0.45)", borderRadius: 12, color: "#ffffff", fontSize: 14, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap",
              boxShadow: "0 12px 26px rgba(37,99,235,0.28)",
            }}>Browse Jobs</button>
          </div>
          <div className="home-popular-links" style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 20 }}>
            Popular: <span style={{ color: "#93c5fd", cursor: "pointer", fontWeight: 700 }}>LLM Engineer</span> · <span style={{ color: "#93c5fd", cursor: "pointer", fontWeight: 700 }}>ML Research</span> · <span style={{ color: "#93c5fd", cursor: "pointer", fontWeight: 700 }}>Computer Vision</span> · <span style={{ color: "#93c5fd", cursor: "pointer", fontWeight: 700 }}>Robotics</span>
          </div>
          <a href="https://www.uneed.best/tool/airobotics-job" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginBottom: 12 }}>
            <img src="https://www.uneed.best/POTD2A.png" style={{ display: "block", width: 250, maxWidth: "100%", height: "auto" }} alt="Uneed POTD2 Badge" />
          </a>
            </div>
            <div className="home-hero-preview" style={{
              alignSelf: "end",
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(255,255,255,0.42)",
              borderRadius: 24,
              padding: 14,
              boxShadow: "0 28px 70px rgba(2,6,23,0.34)",
              backdropFilter: "blur(18px)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "2px 4px" }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#1d4ed8" }}>Featured roles</span>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Updated live</span>
              </div>
              <div className="home-jobs-preview" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(jobs || []).slice(0, 2).map(job => (
                  <JobCard key={job.id} job={job} onClick={j => openJobDetail(j, "home")} onApply={j => setApplyJob(j)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="section-padding page-content home-jobs-section" style={{ maxWidth: 980, margin: "0 auto", padding: "54px 24px 86px" }}>
        <div className="home-jobs-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 6 }}>Curated opportunities</div>
            <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 26, fontWeight: 700, color: "#0f172a" }}>Jobs Available Now</h2>
          </div>
          <button onClick={() => setPage("jobs")} style={{ background: "#fff", border: "1px solid rgba(148,163,184,0.34)", borderRadius: 999, padding: "9px 16px", color: "#334155", cursor: "pointer", fontSize: 13, fontWeight: 800, boxShadow: "0 8px 20px rgba(15,23,42,0.06)" }}>View all →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jobsLoading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b", fontSize: 14 }}>Loading jobs…</div>
          ) : (
            (jobs || []).slice(2, 8).map(job => (
              <JobCard key={job.id} job={job} onClick={j => openJobDetail(j, "home")} onApply={j => setApplyJob(j)} />
            ))
          )}
        </div>
      </div>

      {/* Why choose */}
      <div style={{ background: "linear-gradient(180deg, #ffffff, #eef5ff)", borderTop: "1px solid rgba(37,99,235,0.12)", borderBottom: "1px solid rgba(37,99,235,0.12)", padding: "74px 24px", marginBottom: 80 }}>
        <div className="section-padding" style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 26, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 44 }}>Why AIRoboticsjob?</h2>
          <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18 }}>
            {[["⚡", "AI-First", "Built exclusively for AI, ML, and Robotics professionals. No noise."],
            ["🎯", "Fresh Roles", "New listings go live immediately so candidates can find them right away."],
            ["🔔", "Smart Alerts", "Get notified about roles matching your skills and preferences."],
            ["🌍", "Global Reach", "Discover high-quality AI roles across every region, including remote-first teams."]].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: "left", background: "rgba(255,255,255,0.86)", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 18, padding: "22px 20px", boxShadow: "0 14px 34px rgba(15,23,42,0.07)" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, marginBottom: 16, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.14)" }}>{icon}</div>
                <div style={{ fontFamily: "'Merriweather', serif", fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email subscribe */}
      <div className="section-padding" style={{ maxWidth: 600, margin: "0 auto 80px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 24, padding: "34px 28px", boxShadow: "0 18px 42px rgba(15,23,42,0.08)" }}>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Stay ahead of the curve</h2>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 24, lineHeight: 1.7 }}>Get weekly AI job alerts, salary reports, and hiring trends delivered to your inbox.</p>
        {!subscribed ? (
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            onSubmit={(e) => {
              e.preventDefault();
              onSubscribe();
            }}
            className="search-stack"
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <input value={emailInput} onChange={e => setEmailInput(e.target.value)}
              type="email"
              name="email"
              required
              placeholder="your@email.com" style={{
                flex: 1, padding: "12px 16px", background: "#fff",
                border: "1px solid rgba(148,163,184,0.4)", borderRadius: 10, color: "#0f172a", fontSize: 14, outline: "none"
              }} />
            <button type="submit" disabled={subscribeLoading} style={{
              padding: "12px 20px", background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              border: "1px solid rgba(29,78,216,0.7)", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 700, cursor: subscribeLoading ? "not-allowed" : "pointer",
              opacity: subscribeLoading ? 0.75 : 1
            }}>{subscribeLoading ? "Saving..." : "Subscribe"}</button>
          </form>
        ) : (
          <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600 }}>✓ You're on the list!</div>
        )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer-responsive" style={{ borderTop: "1px solid rgba(148,163,184,0.22)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "#ffffff" }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <Logo />
        </div>
        <div style={{ flex: "1 1 0", minWidth: 0, fontSize: 12, color: "#64748b", textAlign: "center" }}>© 2026 AIRoboticsjob · Built for AI and robotics hiring</div>
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: "flex-end", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#64748b", cursor: "pointer", whiteSpace: "nowrap" }}>{l}</span>
          ))}
        </div>
      </div>

      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
