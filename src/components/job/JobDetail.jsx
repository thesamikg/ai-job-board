import { Badge, SkillTag } from "../ui";
import { timeSince, isNew, isHot, formatSalary } from "../../utils/jobHelpers";

export default function JobDetail({ job, onClose, onApply, saved, onSave }) {
  const descriptionParts = String(job?.description || "")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 900, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", border: "1px solid rgba(148,163,184,0.35)",
        borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "88vh", overflow: "auto",
        boxShadow: "0 20px 44px rgba(15,23,42,0.24)",
      }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(148,163,184,0.28)" }}>
          <div className="job-detail-header" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4))",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 800, color: "#c4b5fd",
              }}>{job.companyLogo}</div>
              <div>
                <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{job.title}</h2>
                <div style={{ fontSize: 14, color: "#475569" }}>{job.company} · {job.location}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.4)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >✕</button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {isNew(job.posted_at) && <Badge color="#22c55e">New</Badge>}
              {isHot(job) && <Badge color="#f97316">Hot</Badge>}
              {job.featured && <Badge color="#a78bfa">Featured</Badge>}
              <span style={{ fontSize: 13, color: "#64748b", display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1 }}>
                <span style={{ fontSize: 13 }}>📍</span>{job.remote ? "Remote" : "On-site"}
              </span>
              <span style={{ color: "#94a3b8", lineHeight: 1 }}>•</span>
              <span style={{ fontSize: 13, color: "#64748b", lineHeight: 1 }}>{job.job_type}</span>
              <span style={{ color: "#94a3b8", lineHeight: 1 }}>•</span>
              <span style={{ fontSize: 13, color: "#64748b", lineHeight: 1 }}>{job.experience_level} yrs exp</span>
            </div>
            <button
              onClick={() => onApply(job)}
              style={{
                minWidth: 170,
                padding: "13px 22px",
                background: "#2563eb",
                border: "1px solid #1d4ed8",
                borderRadius: 12,
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
        <div style={{ padding: "24px 20px" }}>
          <div className="job-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            {[["💰 Salary", formatSalary(job)], ["📅 Posted", timeSince(job.posted_at)], ["🏢 Company", job.company], ["🎯 Type", job.job_type]].map(([label, val]) => (
              <div key={label} style={{ background: "#f8fafc", border: "1px solid rgba(148,163,184,0.26)", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Skills Required</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {job.skills.map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>About This Role</h4>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, textAlign: "left", display: "grid", gap: 10 }}>
              {(descriptionParts.length ? descriptionParts : [job.description]).map((part, idx) => (
                <p key={idx} style={{ margin: 0 }}>{part}</p>
              ))}
            </div>
          </div>
          <div className="job-detail-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => onApply(job)} style={{
              flex: 1, padding: "14px 28px",
              background: "#2563eb",
              border: "1px solid #1d4ed8", borderRadius: 12, color: "#ffffff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Merriweather', serif", letterSpacing: 0.3,
            }}>Apply Now →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
