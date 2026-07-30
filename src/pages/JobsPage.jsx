import { useState } from "react";
import { JobCard, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { Toast } from "../components/ui";
import { ALL_SKILLS, CATEGORY_OPTIONS, EXPERIENCE_LEVEL_SUGGESTIONS } from "../data/jobs";

export default function JobsPage({
  jobsLoading, page, setPage, search, setSearch, filters, setFilters, filteredJobs,
  openJobDetail, applyJob, setApplyJob, handleApplySubmit, toast,
  user, onSignOut, isAdmin, canPostJobs, onSelectCategory
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const clearFilters = () => {
    setFilters((current) => ({
      ...current,
      category: "",
      remote: false,
      exp: "",
      skills: [],
    }));
  };

  const activeFilterCount = [
    filters.category,
    filters.remote,
    filters.exp,
    ...(filters.skills || []),
  ].filter(Boolean).length;

  return (
    <div className="site-shell jobs-page-shell">
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        onSignOut={onSignOut}
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={onSelectCategory}
      />

      <main className="jobs-main">
        <section className="jobs-intro">
          <div>
            <span className="section-kicker">Specialist opportunities</span>
            <h1>Find work at the frontier.</h1>
            <p>AI, machine learning, and robotics roles from ambitious teams around the world.</p>
          </div>
          <div className="jobs-count-card">
            <strong>{filteredJobs.length}</strong>
            <span>open roles</span>
          </div>
        </section>

        <section className="jobs-search-bar" aria-label="Search jobs">
          <label>
            <span>What</span>
            <input
              value={search.title}
              onChange={(event) => setSearch((current) => ({ ...current, title: event.target.value }))}
              placeholder="Role, company, or skill"
            />
          </label>
          <label>
            <span>Where</span>
            <input
              value={search.location}
              onChange={(event) => setSearch((current) => ({ ...current, location: event.target.value }))}
              placeholder="Remote or location"
            />
          </label>
          <label className="jobs-sort-label">
            <span>Sort by</span>
            <select
              className="jobs-sort"
              value={filters.sort}
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            >
              <option value="newest">Newest first</option>
              <option value="salary">Highest salary</option>
              <option value="remote">Remote first</option>
            </select>
          </label>
        </section>

        <section className="jobs-content">
          <aside className="jobs-sidebar">
            <div className={`jobs-sidebar-inner${filtersOpen ? " filters-open" : ""}`}>
              <div className="filter-header">
                <button
                  className="filter-toggle"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                >
                  <span>Filter jobs</span>
                  {activeFilterCount > 0 && <small>{activeFilterCount} active</small>}
                  <i>{filtersOpen ? "Hide" : "Show"}</i>
                </button>
                <button className="filter-clear" onClick={clearFilters}>Clear</button>
              </div>

              <div className="filter-body">
                <details className="filter-group" open>
                  <summary>Field <span>+</span></summary>
                  <div className="filter-options">
                    {CATEGORY_OPTIONS.map((category) => (
                      <label key={category.name}>
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === category.name}
                          onChange={() => setFilters((current) => ({ ...current, category: category.name }))}
                        />
                        <span>{category.icon} {category.name}</span>
                      </label>
                    ))}
                  </div>
                </details>

                <details className="filter-group" open>
                  <summary>Work style <span>+</span></summary>
                  <div className="filter-options">
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.remote}
                        onChange={(event) => setFilters((current) => ({ ...current, remote: event.target.checked }))}
                      />
                      <span>Remote only</span>
                    </label>
                  </div>
                </details>

                <details className="filter-group">
                  <summary>Experience <span>+</span></summary>
                  <div className="filter-options">
                    {EXPERIENCE_LEVEL_SUGGESTIONS.map((experience) => (
                      <label key={experience}>
                        <input
                          type="radio"
                          name="experience"
                          checked={filters.exp === experience}
                          onChange={() => setFilters((current) => ({ ...current, exp: experience }))}
                        />
                        <span>{experience}</span>
                      </label>
                    ))}
                  </div>
                </details>

                <details className="filter-group">
                  <summary>Skills <span>+</span></summary>
                  <div className="filter-options">
                    {ALL_SKILLS.map((skill) => (
                      <label key={skill}>
                        <input
                          type="checkbox"
                          checked={filters.skills.includes(skill)}
                          onChange={(event) => setFilters((current) => ({
                            ...current,
                            skills: event.target.checked
                              ? [...current.skills, skill]
                              : current.skills.filter((item) => item !== skill),
                          }))}
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </aside>

          <div className="jobs-results">
            <div className="results-header">
              <div>
                <strong>{filteredJobs.length} jobs</strong>
                <span> matching your search</span>
              </div>
              {filters.category && (
                <button
                  className="active-filter-pill"
                  onClick={() => setFilters((current) => ({ ...current, category: "" }))}
                >
                  {filters.category} ×
                </button>
              )}
            </div>

            <div className="job-list-shell">
              {jobsLoading ? (
                <div className="list-state">Loading the latest roles…</div>
              ) : filteredJobs.length === 0 ? (
                <div className="empty-jobs-state">
                  <span>0 roles</span>
                  <h2>No exact matches yet.</h2>
                  <p>Try a broader title, location, or fewer filters.</p>
                  <button onClick={clearFilters}>Clear filters</button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={(selectedJob) => openJobDetail(selectedJob, "jobs")}
                    onApply={(selectedJob) => setApplyJob(selectedJob)}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {applyJob && (
        <EmailModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSubmit={handleApplySubmit}
        />
      )}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
