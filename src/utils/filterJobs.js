export function filterAndSortJobs(jobs, search, filters) {
  const titleQuery = String(search?.title || "").trim().toLowerCase();
  const locationQuery = String(search?.location || "").trim().toLowerCase();
  const selectedSkills = Array.isArray(filters?.skills) ? filters.skills : [];

  return (Array.isArray(jobs) ? jobs : [])
    .filter(j => {
      if (!j || typeof j !== "object") return false;
      if (filters?.category && j.category !== filters.category) return false;

      const title = String(j.title || "").toLowerCase();
      const company = String(j.company || "").toLowerCase();
      const skills = Array.isArray(j.skills) ? j.skills : [];
      const searchableSkills = skills.join(" ").toLowerCase();
      if (titleQuery && !title.includes(titleQuery) && !company.includes(titleQuery) && !searchableSkills.includes(titleQuery)) return false;

      const location = String(j.location || "").toLowerCase();
      if (locationQuery && !location.includes(locationQuery)) return false;
      if (filters?.remote && !j.remote) return false;
      if (filters?.exp && j.experience_level !== filters.exp) return false;
      if (selectedSkills.length > 0 && !selectedSkills.some(s => skills.includes(s))) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters?.sort === "newest") {
        const aTime = new Date(a.posted_at).getTime();
        const bTime = new Date(b.posted_at).getTime();
        return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
      }
      if (filters?.sort === "salary") return (Number(b.salary_max) || 0) - (Number(a.salary_max) || 0);
      if (filters?.sort === "remote") return (b.remote ? 1 : 0) - (a.remote ? 1 : 0);
      return 0;
    });
}
