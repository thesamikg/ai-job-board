import { useState } from "react";
import { Badge, SkillTag } from "../ui";
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
} from "../../utils/jobHelpers";

export default function JobCard({ job, onClick, onApply }) {
  const [hovered, setHovered] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const companyLogo = String(job?.companyLogo || "").trim();
  const useLogoImage = isCompanyLogoImage(companyLogo) && !logoFailed;
  const companyInitials = getCompanyInitials(job?.company, companyLogo);
  const showSalary = hasSalaryRange(job);

  return (
    <div
      className="job-card"
      onClick={() => onClick(job)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
        border: `1px solid ${hovered ? "rgba(37,99,235,0.5)" : "rgba(148,163,184,0.28)"}`,
        borderRadius: 18, padding: "18px 20px", cursor: "pointer",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
        boxShadow: hovered ? "0 18px 42px rgba(15,23,42,0.13), 0 0 0 3px rgba(37,99,235,0.08)" : "0 8px 24px rgba(15,23,42,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
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
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(124,58,237,0.12))",
            border: "1px solid rgba(37,99,235,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, color: "#1d4ed8", letterSpacing: 0, overflow: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
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
              <span style={{ fontFamily: "'Merriweather', serif", fontWeight: 700, fontSize: 16, color: "#0f172a", lineHeight: 1.35 }}>{job.title}</span>
              {isNew(job.posted_at) && <Badge color="#22c55e">New</Badge>}
              {isHot(job) && <Badge color="#f97316">Hot</Badge>}
              {job.featured && <Badge color="#1d4ed8">Featured</Badge>}
              {job.category && <Badge color="#475569">{job.category}</Badge>}
            </div>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 11, textAlign: "left", fontWeight: 600 }}>
              {job.company} · {job.location}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(job.skills || []).slice(0, 4).map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        </div>
        <div className="job-card-side" style={{ textAlign: "right", flexShrink: 0, minWidth: 140 }}>
          <div className="job-card-pay" style={{ marginBottom: 8 }}>
            {showSalary && <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>{formatSalary(job)}</div>}
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
              background: hovered ? "linear-gradient(135deg, #1d4ed8, #2563eb)" : "#ffffff",
              border: hovered ? "1px solid #1d4ed8" : "1px solid rgba(37,99,235,0.28)",
              borderRadius: 999, padding: "6px 12px", cursor: "pointer",
              color: hovered ? "#ffffff" : "#1d4ed8", fontSize: 12, transition: "all 0.15s", fontWeight: 800,
              boxShadow: hovered ? "0 10px 18px rgba(37,99,235,0.24)" : "none",
            }}
          >Apply</button>
        </div>
      </div>
      <div className="job-card-meta" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 15, paddingTop: 14, borderTop: "1px solid rgba(148,163,184,0.18)", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 6, lineHeight: 1 }}>
          <span>📍</span>{getWorkModeLabel(job)}
        </span>
        <span style={{ color: "#94a3b8", lineHeight: 1 }}>·</span>
        <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1 }}>{job.job_type}</span>
        <span style={{ color: "#94a3b8", lineHeight: 1 }}>·</span>
        <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1 }}>{formatExperienceLevel(job.experience_level)}</span>
      </div>
    </div>
  );
}
