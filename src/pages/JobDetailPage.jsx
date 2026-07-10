import { Logo, Toast } from "../components/ui";
import { JobDetail, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";

function getBackLabel(returnPage) {
  if (returnPage === "dashboard") return "Back to Dashboard";
  if (returnPage === "home") return "Back to Home";
  return "Back to Jobs";
}

export default function JobDetailPage({
  page,
  setPage,
  job,
  returnPage = "jobs",
  onBack,
  applyJob,
  setApplyJob,
  handleApplySubmit,
  emailInput,
  setEmailInput,
  subscribed,
  subscribeLoading,
  onSubscribe,
  toast,
  user,
  onSignOut,
  isAdmin,
  canPostJobs,
  onSelectCategory,
}) {
  const bg = {
    background: "linear-gradient(180deg, #eef5ff 0%, #f8fafc 22%, #ffffff 100%)",
    minHeight: "100vh",
    fontFamily: "'Source Sans 3', sans-serif",
    color: "#334155",
  };

  return (
    <div style={bg}>
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        onSignOut={onSignOut}
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={onSelectCategory}
      />
      <div className="page-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "112px 24px 84px" }}>
        <div style={{ marginBottom: 30, maxWidth: 760 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "#2563eb", marginBottom: 8 }}>
            Job Detail
          </div>
          <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Explore the role before you apply
          </h1>
        </div>
        <JobDetail job={job} onBack={onBack} backLabel={getBackLabel(returnPage)} onApply={j => setApplyJob(j)} />
      </div>

      <div className="why-section" style={{ background: "#2f68e8", borderTop: "1px solid rgba(37,99,235,0.2)", borderBottom: "1px solid rgba(37,99,235,0.2)", padding: "92px 24px 98px", marginBottom: 80 }}>
        <div className="section-padding" style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 className="why-heading" style={{ fontFamily: "'Merriweather', serif", fontSize: 28, fontWeight: 700, color: "#ffffff", textAlign: "center", marginBottom: 46 }}>Why AIRoboticsjob?</h2>
          <div className="why-card-grid grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 20 }}>
            {[["⚡", "AI-First", "Built exclusively for AI, ML, and Robotics professionals. No noise."],
            ["🎯", "Fresh Roles", "New listings go live immediately so candidates can find them right away."],
            ["🔔", "Smart Alerts", "Get notified about roles matching your skills and preferences."],
            ["🌍", "Global Reach", "Discover high-quality AI roles across every region, including remote-first teams."]].map(([icon, title, desc]) => (
              <div className="why-card" key={title} style={{ textAlign: "left", background: "#ffffff", border: "1px solid rgba(255,255,255,0.42)", borderRadius: 16, padding: "24px 22px 28px", boxShadow: "0 18px 42px rgba(15,23,42,0.16)" }}>
                <div className="why-card-icon" style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.14)" }}>{icon}</div>
                <div className="why-card-title" style={{ fontFamily: "'Merriweather', serif", fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{title}</div>
                <div className="why-card-desc" style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      <div className="footer-responsive" style={{ borderTop: "1px solid rgba(148,163,184,0.22)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "#ffffff" }}>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <Logo />
        </div>
        <div style={{ flex: "1 1 0", minWidth: 0, fontSize: 12, color: "#64748b", textAlign: "center" }}>
          © 2026 AIRoboticsjob · Built for AI and robotics hiring
        </div>
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: "flex-end", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((label) => (
            <span key={label} style={{ fontSize: 12, color: "#64748b", cursor: "pointer", whiteSpace: "nowrap" }}>{label}</span>
          ))}
        </div>
      </div>

      {applyJob && <EmailModal job={applyJob} onClose={() => setApplyJob(null)} onSubmit={handleApplySubmit} />}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
