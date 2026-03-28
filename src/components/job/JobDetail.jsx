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
import { formatRichTextForDisplay } from "../../utils/richText";

export default function JobDetail({ job, onBack, backLabel = "Back", onApply }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const descriptionHtml = formatRichTextForDisplay(job?.description || "");
  const companyLogo = String(job?.companyLogo || "").trim();
  const useLogoImage = isCompanyLogoImage(companyLogo) && !logoFailed;
  const companyInitials = getCompanyInitials(job?.company, companyLogo);
  const metaItems = [
    getWorkModeLabel(job),
    job.job_type,
    formatExperienceLevel(job.experience_level),
  ];
  const summaryItems = [
    ["📅 Posted", timeSince(job.posted_at)],
    ["🏢 Company", job.company],
    ["🗂 Category", job.category],
    ["🎯 Type", job.job_type],
    ["🧭 Work mode", getWorkModeLabel(job)],
    ["📈 Experience", formatExperienceLevel(job.experience_level)],
  ];

  if (hasSalaryRange(job)) {
    summaryItems.unshift(["💰 Salary", formatSalary(job)]);
  }

  return (
    <section className="job-detail-shell" style={{ width: "100%" }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            padding: "8px 12px",
            background: "#ffffff",
            border: "1px solid rgba(148,163,184,0.35)",
            borderRadius: 999,
            color: "#475569",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </button>
      )}

      <div className="job-detail-hero" style={{
        border: "1px solid rgba(148,163,184,0.28)",
        borderRadius: 24,
        padding: "18px 20px",
        background: "rgba(255,255,255,0.78)",
        boxShadow: "0 18px 36px rgba(15,23,42,0.06)",
        marginBottom: 30,
        height: 166,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}>
        <div className="job-detail-top" style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div className="job-detail-brand" style={{ display: "flex", gap: 18, alignItems: "center", flex: "1 1 620px", minWidth: 0 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(124,58,237,0.16), rgba(37,99,235,0.14))",
              border: "1px solid rgba(148,163,184,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#1d4ed8", overflow: "hidden",
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

            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 800, lineHeight: 1.2, color: "#0f172a", marginBottom: 6 }}>
                {job.title}
              </h2>
              <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.5, marginBottom: 18 }}>
                {job.company} · {job.location}
              </div>
              <div className="job-detail-meta-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                {isNew(job.posted_at) && <Badge color="#22c55e">New</Badge>}
                {isHot(job) && <Badge color="#f97316">Hot</Badge>}
                {job.featured && <Badge color="#a78bfa">Featured</Badge>}
                {metaItems.map((item) => (
                  <span key={item} style={{ fontSize: 15, color: "#64748b", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(100,116,139,0.4)" }} />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="job-detail-cta" style={{ width: 220, maxWidth: "100%", flexShrink: 0, display: "flex", alignItems: "center" }}>
          <button
            onClick={() => onApply(job)}
            style={{
              width: "100%",
              padding: "12px 20px",
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

      <div className="job-detail-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(250px, 0.9fr)", gap: 36, alignItems: "start" }}>
        <div className="job-detail-main" style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              About This Role
            </h4>
            <div
              className="job-description-rich"
              style={{ fontSize: 17, color: "#475569", lineHeight: 1.95, textAlign: "left", maxWidth: 780 }}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
          <div className="job-detail-description-cta" style={{ paddingTop: 10 }}>
            <button
              onClick={() => onApply(job)}
              style={{
                minWidth: 220,
                padding: "15px 24px",
                background: "#2563eb",
                border: "1px solid #1d4ed8",
                borderRadius: 14,
                color: "#ffffff",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              Apply Now
            </button>
          </div>
        </div>

        <aside className="job-detail-sidebar" style={{ background: "rgba(255,255,255,0.72)", borderRadius: 24, padding: "24px 22px", boxShadow: "0 18px 40px rgba(15,23,42,0.07)" }}>
          <h4 style={{ fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 18 }}>
            Quick Details
          </h4>
          <div style={{ display: "grid", gap: 18 }}>
            {summaryItems.map(([label, value], index) => (
              <div
                key={label}
                style={{
                  paddingBottom: index === summaryItems.length - 1 ? 0 : 18,
                  borderBottom: index === summaryItems.length - 1 ? "none" : "1px solid rgba(148,163,184,0.18)",
                }}
              >
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  {label}
                </div>
                <div style={{ fontSize: 16, color: "#0f172a", fontWeight: 600, lineHeight: 1.45 }}>
                  {value}
                </div>
              </div>
            ))}
            {job.skills?.length > 0 && (
              <div style={{ paddingTop: 18, borderTop: "1px solid rgba(148,163,184,0.18)" }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  Skills Required
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {job.skills.map((skill) => <SkillTag key={skill} skill={skill} />)}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
