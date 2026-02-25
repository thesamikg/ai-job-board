export function filterAndSortJobs(jobs, search, filters) {
  return jobs
    .filter(j => {
      if (search.title && !j.title.toLowerCase().includes(search.title.toLowerCase()) && !j.company.toLowerCase().includes(search.title.toLowerCase())) return false;
      if (search.location && !j.location.toLowerCase().includes(search.location.toLowerCase())) return false;
      if (filters.remote && !j.remote) return false;
      if (filters.exp && j.experience_level !== filters.exp) return false;
      if (filters.skills.length > 0 && !filters.skills.some(s => j.skills.includes(s))) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "newest") return b.posted_at - a.posted_at;
      if (filters.sort === "salary") return b.salary_max - a.salary_max;
      if (filters.sort === "remote") return (b.remote ? 1 : 0) - (a.remote ? 1 : 0);
      return 0;
    });
}
