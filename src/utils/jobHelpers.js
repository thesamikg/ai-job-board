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

export function hasSalaryRange(job) {
  const min = Number(job?.salary_min);
  const max = Number(job?.salary_max);
  return Number.isFinite(min) && Number.isFinite(max) && min > 0 && max > 0 && min <= max;
}

export function isHot(job) {
  return hasSalaryRange(job) && Number(job.salary_min) > 150000;
}

export function formatSalary(job) {
  if (!hasSalaryRange(job)) return "";

  const min = Number(job.salary_min);
  const max = Number(job.salary_max);
  const symbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };
  const symbol = symbols[job.currency] || "";
  if (!job.currency || job.currency === "USD") {
    return `$${(min / 1000).toFixed(0)}K–$${(max / 1000).toFixed(0)}K`;
  }
  return `${symbol}${min.toLocaleString()}–${symbol}${max.toLocaleString()} ${job.currency}`;
}

export function isCompanyLogoImage(logoValue) {
  const value = String(logoValue || "").trim();
  return /^https?:\/\/.+/i.test(value) || /^data:image\/[a-zA-Z]+;base64,/i.test(value);
}

export function getCompanyInitials(companyName, logoValue = "") {
  const logoText = String(logoValue || "").trim();
  if (logoText && !isCompanyLogoImage(logoText)) {
    return logoText.slice(0, 3).toUpperCase();
  }
  const words = String(companyName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return "CO";
}

export function getWorkModeLabel(job) {
  if (job?.remote) return "Remote";
  if (job?.hybrid) return "Hybrid";
  return "On-site";
}

export function formatExperienceLevel(experienceLevel) {
  const value = String(experienceLevel || "").trim();
  if (!value) return "";
  if (/year|entry level/i.test(value)) return value;
  if (/^\d+\+$/.test(value) || /^\d+\s*-\s*\d+$/.test(value)) {
    return `${value} years`;
  }
  return value;
}
