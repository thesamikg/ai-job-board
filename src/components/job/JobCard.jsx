import { useState } from "react";
import {
  timeSince,
  isNew,
  formatSalary,
  getCompanyInitials,
  getWorkModeLabel,
  hasSalaryRange,
  isCompanyLogoImage,
} from "../../utils/jobHelpers";

export default function JobCard({ job, onClick, onApply }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const companyLogo = String(job?.companyLogo || "").trim();
  const useLogoImage = isCompanyLogoImage(companyLogo) && !logoFailed;
  const companyInitials = getCompanyInitials(job?.company, companyLogo);
  const showSalary = hasSalaryRange(job);

  return (
    <article
      className={`compact-job-card${job.featured ? " compact-job-card-featured" : ""}`}
      onClick={() => onClick(job)}
    >
      <div className="compact-job-logo">
        {useLogoImage ? (
          <img
            src={companyLogo}
            alt={`${job.company} logo`}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span>{companyInitials}</span>
        )}
      </div>

      <div className="compact-job-main">
        <div className="compact-job-title-line">
          <h3>{job.title}</h3>
          {isNew(job.posted_at) && <span className="job-label job-label-new">New</span>}
          {job.featured && <span className="job-label job-label-featured">Featured</span>}
        </div>
        <div className="compact-job-company">{job.company}</div>
        <div className="compact-job-tags">
          {job.category && <span>{job.category}</span>}
          <span>{job.job_type}</span>
          <span>{getWorkModeLabel(job)}</span>
          {(job.skills || []).slice(0, 2).map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </div>

      <div className="compact-job-side">
        {showSalary && <strong>{formatSalary(job)}</strong>}
        <span>{job.location}</span>
        <small>{timeSince(job.posted_at)}</small>
      </div>

      <button
        className="compact-job-apply"
        onClick={(event) => {
          event.stopPropagation();
          if (onApply) onApply(job);
        }}
        aria-label={`Apply for ${job.title} at ${job.company}`}
      >
        Apply <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
