export function timeSince(date) {
  const hours = Math.floor((Date.now() - date) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function isNew(date) {
  return Date.now() - date < 48 * 60 * 60 * 1000;
}

export function isHot(job) {
  return (job.salary_min > 150000) || (job.currency === "LPA" && job.salary_min > 60);
}

export function formatSalary(job) {
  if (job.currency === "LPA") return `₹${job.salary_min}–${job.salary_max} LPA`;
  return `$${(job.salary_min / 1000).toFixed(0)}K–$${(job.salary_max / 1000).toFixed(0)}K`;
}
