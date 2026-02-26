import { Badge, SkillTag } from "../ui";
import { timeSince, isNew, isHot, formatSalary } from "../../utils/jobHelpers";

export default function JobDetail({ job, onClose, onApply, saved, onSave }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 900, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "88vh", overflow: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
      }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="job-detail-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "flex-start", gap: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4))",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 800, color: "#c4b5fd",
              }}>{job.companyLogo}</div>
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{job.title}</h2>
                <div style={{ fontSize: 14, color: "#475569" }}>{job.company} · {job.location}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", color: "#64748b", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isNew(job.posted_at) && <Badge color="#22c55e">New</Badge>}
            {isHot(job) && <Badge color="#f97316">Hot</Badge>}
            {job.featured && <Badge color="#a78bfa">Featured</Badge>}
            <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>📍 {job.remote ? "Remote" : "On-site"}</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>· {job.job_type} · {job.experience_level} yrs exp</span>
          </div>
        </div>
        <div style={{ padding: "24px 20px" }}>
          <div className="job-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
            {[["💰 Salary", formatSalary(job)], ["📅 Posted", timeSince(job.posted_at)], ["🏢 Company", job.company], ["🎯 Type", job.job_type]].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 18px" }}>
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
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>{job.description}</p>
          </div>
          <div className="job-detail-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onApply(job)} style={{
              flex: 1, padding: "14px 28px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              border: "none", borderRadius: 12, color: "#0f172a", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.3,
            }}>Apply Now →</button>
            <button onClick={() => onSave(job.id)} style={{
              padding: "14px 20px",
              background: saved ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${saved ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, color: saved ? "#a78bfa" : "#64748b", fontSize: 15, cursor: "pointer"
            }}>{saved ? "★" : "☆"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
