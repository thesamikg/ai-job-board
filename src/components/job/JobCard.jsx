import { useState } from "react";
import { Badge, SkillTag } from "../ui";
import { timeSince, isNew, isHot, formatSalary, isCompanyLogoImage, getCompanyInitials } from "../../utils/jobHelpers";

export default function JobCard({ job, onClick, onApply }) {
  const [hovered, setHovered] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const companyLogo = String(job?.companyLogo || "").trim();
  const useLogoImage = isCompanyLogoImage(companyLogo) && !logoFailed;
  const companyInitials = getCompanyInitials(job?.company, companyLogo);

  return (
    <div
      className="job-card"
      onClick={() => onClick(job)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        border: `1.5px solid ${hovered ? "rgba(37,99,235,0.5)" : "rgba(148,163,184,0.45)"}`,
        borderRadius: 16, padding: "16px 20px", cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 0 0 2px rgba(37,99,235,0.12), 0 10px 26px rgba(15,23,42,0.12)" : "0 2px 8px rgba(15,23,42,0.05)",
        transform: hovered ? "translateY(-1px)" : "none",
        position: "relative", overflow: "hidden",
        textAlign: "left",
      }}
    >
      {job.featured && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #2563eb, transparent)" }} />
      )}
      <div className="job-card-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div className="job-card-summary" style={{ display: "flex", gap: 14, flex: 1, alignItems: "flex-start", minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(96,165,250,0.25))",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "#1d4ed8", letterSpacing: -0.5, overflow: "hidden"
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontFamily: "'Merriweather', serif", fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{job.title}</span>
              {isNew(job.posted_at) && <Badge color="#22c55e">New</Badge>}
              {isHot(job) && <Badge color="#f97316">Hot</Badge>}
              {job.featured && <Badge color="#1d4ed8">Featured</Badge>}
            </div>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 10, textAlign: "left" }}>
              {job.company} · {job.location}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {job.skills.slice(0, 4).map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        </div>
        <div className="job-card-side" style={{ textAlign: "right", flexShrink: 0, minWidth: 140 }}>
          <div className="job-card-pay" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>{formatSalary(job)}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{timeSince(job.posted_at)}</div>
          </div>
          <button
            className="job-card-apply-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onApply) onApply(job);
            }}
            style={{
              marginTop: 8,
              background: "#2563eb",
              border: "1px solid #1d4ed8",
              borderRadius: 6, padding: "4px 8px", cursor: "pointer",
              color: "#ffffff", fontSize: 12, transition: "all 0.15s", fontWeight: 700
            }}
          >Apply</button>
        </div>
      </div>
      <div className="job-card-meta" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(148,163,184,0.3)", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 6, lineHeight: 1 }}>
          <span>📍</span>{job.remote ? "Remote" : "On-site"}
        </span>
        <span style={{ color: "#94a3b8", lineHeight: 1 }}>·</span>
        <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1 }}>{job.job_type}</span>
        <span style={{ color: "#94a3b8", lineHeight: 1 }}>·</span>
        <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1 }}>{job.experience_level} yrs</span>
      </div>
    </div>
  );
}
