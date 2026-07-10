import { useState } from "react";
import { Logo, Toast, Badge, SkillTag } from "../components/ui";
import { JobCard, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import {
  timeSince,
  isNew,
  isHot,
  formatExperienceLevel,
  formatSalary,
  getCompanyInitials,
  getWorkModeLabel,
  hasSalaryRange,
  isCompanyLogoImage,
} from "../utils/jobHelpers";

function HeroPreviewCard({ job, onClick, onApply }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const companyLogo = String(job?.companyLogo || "").trim();
  const useLogoImage = isCompanyLogoImage(companyLogo) && !logoFailed;
  const companyInitials = getCompanyInitials(job?.company, companyLogo);
  const showSalary = hasSalaryRange(job);

  return (
    <div
      onClick={() => onClick(job)}
      style={{
        background: "#ffffff",
        border: "1px solid rgba(148,163,184,0.24)",
        borderRadius: 16,
        padding: "18px 18px 14px",
        cursor: "pointer",
        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          flexShrink: 0,
          background: "#020617",
          border: "1px solid rgba(148,163,184,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 900,
          overflow: "hidden",
        }}>
          {useLogoImage ? (
            <img
              src={companyLogo}
              alt={`${job.company} logo`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            companyInitials
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Merriweather', serif", fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.25, marginBottom: 6 }}>
                {job.title}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {isNew(job.posted_at) && <Badge color="#22c55e">New</Badge>}
                {isHot(job) && <Badge color="#f97316">Hot</Badge>}
                {job.category && <Badge color="#475569">{job.category}</Badge>}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {showSalary && <div style={{ fontSize: 12, fontWeight: 800, color: "#2563eb", marginBottom: 4 }}>{formatSalary(job)}</div>}
              <div style={{ fontSize: 11, color: "#64748b" }}>{timeSince(job.posted_at)}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 700, marginBottom: 10 }}>
            {job.company} · {job.location}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {(job.skills || []).slice(0, 4).map((skill) => <SkillTag key={skill} skill={skill} />)}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(148,163,184,0.18)", paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 11, color: "#64748b" }}>
          <span>📍 {getWorkModeLabel(job)}</span>
          <span>·</span>
          <span>{job.job_type}</span>
          <span>·</span>
          <span>{formatExperienceLevel(job.experience_level)}</span>
        </div>
        <button
          onClick={(event) => {
            event.stopPropagation();
            if (onApply) onApply(job);
          }}
          style={{
            background: "#ffffff",
            border: "1px solid rgba(37,99,235,0.28)",
            borderRadius: 999,
            color: "#2563eb",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 800,
            padding: "7px 14px",
            flexShrink: 0,
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default function HomePage({
  jobs, heroJobs = jobs, jobsLoading, setPage, search, setSearch, savedJobs, handleSave, showToast,
  openJobDetail, applyJob, setApplyJob, handleApplySubmit,
  emailInput, setEmailInput, subscribed, setSubscribed, subscribeLoading, onSubscribe, toast, user, onSignOut, isAdmin, canPostJobs, onSelectCategory
}) {
  const bg = { background: "#f8fafc", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", color: "#334155" };
  const heroPreviewJobs = (heroJobs || []).length > 0 ? heroJobs : jobs;
  const availableJobs = (jobs || []).length > 2 ? jobs.slice(2, 8) : (jobs || []).slice(0, 8);

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
          paddingBottom: 48,
          backgroundImage: "linear-gradient(90deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.88) 38%, rgba(15,23,42,0.5) 68%, rgba(15,23,42,0.12) 100%), url('/images/hero-ai-robotics-lab.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid rgba(37,99,235,0.18)",
        }}
      >
        <div className="home-hero-shell" style={{ position: "relative", maxWidth: 1080, margin: "0 auto", padding: "0 24px", animation: "fadeIn 0.8s ease forwards" }}>
          <div className="home-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 0.74fr)", gap: 44, alignItems: "center", minHeight: 500 }}>
            <div className="home-hero-copy" style={{ maxWidth: 610, padding: "34px 0 12px", textAlign: "left" }}>
              <div className="home-role-pill" style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
            background: "rgba(37,99,235,0.18)", border: "1px solid rgba(96,165,250,0.34)",
            borderRadius: 99, padding: "7px 16px", backdropFilter: "blur(14px)"
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", display: "inline-block", boxShadow: "0 0 14px #60a5faaa" }} />
            <span style={{ fontSize: 12, color: "#dbeafe", fontWeight: 800 }}>{(heroPreviewJobs || []).length} roles live now</span>
          </div>
          <h1 className="home-hero-title" style={{ fontFamily: "'Merriweather', serif", fontSize: "clamp(42px, 5.4vw, 64px)", fontWeight: 700, color: "#ffffff", lineHeight: 1.04, marginBottom: 18, textShadow: "0 18px 40px rgba(0,0,0,0.32)" }}>
            Find the Best<br />
            <span style={{ background: "linear-gradient(135deg, #93c5fd, #ffffff 45%, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI & Robotics Jobs</span>
          </h1>
          <p className="home-hero-subtitle" style={{ fontSize: "clamp(16px, 1.8vw, 19px)", color: "#cbd5e1", maxWidth: 590, margin: "0 0 24px", lineHeight: 1.7 }}>
            The premier job board for AI Engineers, ML Scientists, Robotics Engineers, and LLM specialists worldwide.
          </p>
          <div className="search-stack home-search-stack" style={{
            display: "flex", gap: 8, background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(255,255,255,0.32)", borderRadius: 18, padding: 8,
            maxWidth: 620, margin: "0 0 14px", flexWrap: "wrap",
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
            </div>
            <div className="home-hero-preview" style={{
              alignSelf: "center",
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.42)",
              borderRadius: 24,
              padding: 18,
              boxShadow: "0 28px 70px rgba(2,6,23,0.34)",
              backdropFilter: "blur(18px)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "2px 4px" }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#1d4ed8" }}>Featured roles</span>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Updated live</span>
              </div>
              <div className="home-jobs-preview" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(heroPreviewJobs || []).slice(0, 2).map(job => (
                  <HeroPreviewCard key={job.id} job={job} onClick={j => openJobDetail(j, "home")} onApply={j => setApplyJob(j)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="section-padding page-content home-jobs-section" style={{ maxWidth: 900, margin: "0 auto", padding: "56px 24px 92px" }}>
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
            availableJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={j => openJobDetail(j, "home")} onApply={j => setApplyJob(j)} />
            ))
          )}
        </div>
      </div>

      {/* Why choose */}
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

      {/* Email subscribe */}
      <div className="section-padding" style={{ maxWidth: 560, margin: "0 auto 86px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ background: "#ffffff", border: "1px solid rgba(148,163,184,0.22)", borderRadius: 22, padding: "36px 28px", boxShadow: "0 22px 58px rgba(15,23,42,0.1)" }}>
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
