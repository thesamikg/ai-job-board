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
  return job.salary_min > 150000;
}

export function formatSalary(job) {
  const symbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };
  const symbol = symbols[job.currency] || "";
  if (!job.currency || job.currency === "USD") {
    return `$${(job.salary_min / 1000).toFixed(0)}K–$${(job.salary_max / 1000).toFixed(0)}K`;
  }
  return `${symbol}${job.salary_min.toLocaleString()}–${symbol}${job.salary_max.toLocaleString()} ${job.currency}`;
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
