import { Logo, Toast } from "../components/ui";
import { JobCard, EmailModal } from "../components/job";
import Navbar from "../components/layout/Navbar";
import { CATEGORY_OPTIONS } from "../data/jobs";

const FEATURED_FIELDS = [
  "AI Engineering",
  "AI/ML Engineering",
  "Robotics Engineering",
  "AI Research",
  "MLOps",
  "Autonomous Systems",
];

const TRUST_MARKS = [
  ["Specialist roles", "No generic-tech noise"],
  ["Global teams", "Remote, hybrid & on-site"],
  ["Fresh listings", "New opportunities every week"],
];

export default function HomePage({
  jobs, jobsLoading, setPage, search, setSearch,
  openJobDetail, applyJob, setApplyJob, handleApplySubmit,
  emailInput, setEmailInput, subscribed, subscribeLoading, onSubscribe, toast,
  user, onSignOut, isAdmin, canPostJobs, onSelectCategory
}) {
  const liveJobs = jobs || [];
  const availableJobs = liveJobs.slice(0, 8);

  const browseField = (field) => {
    if (typeof onSelectCategory === "function") {
      onSelectCategory(field);
      return;
    }
    setPage("jobs");
  };

  const fieldMeta = FEATURED_FIELDS.map((name) => {
    const category = CATEGORY_OPTIONS.find((item) => item.name === name);
    return {
      name,
      icon: category?.icon || "•",
      count: liveJobs.filter((job) => job.category === name).length,
    };
  });

  return (
    <div className="site-shell">
      <Navbar
        page="home"
        setPage={setPage}
        user={user}
        onSignOut={onSignOut}
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={onSelectCategory}
      />

      <main>
        <section className="new-hero">
          <div className="new-hero-inner">
            <div className="new-hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                {liveJobs.length || "New"} specialist roles live
              </div>
              <h1>
                The focused job board for <span>AI &amp; robotics.</span>
              </h1>
              <p className="new-hero-lede">
                Find serious roles with teams building intelligent systems,
                autonomous machines, and the infrastructure behind them.
              </p>

              <div className="hero-search" role="search">
                <label className="hero-search-field">
                  <span>What</span>
                  <input
                    value={search.title}
                    onChange={(event) => setSearch((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Role, company, or skill"
                  />
                </label>
                <label className="hero-search-field">
                  <span>Where</span>
                  <input
                    value={search.location}
                    onChange={(event) => setSearch((current) => ({ ...current, location: event.target.value }))}
                    placeholder="Remote or location"
                  />
                </label>
                <button onClick={() => setPage("jobs")} className="coral-button hero-search-button">
                  Search jobs
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="hero-popular">
                <span>Popular:</span>
                {["LLM", "Computer Vision", "ROS", "MLOps"].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSearch((current) => ({ ...current, title: skill }));
                      setPage("jobs");
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <aside className="employer-panel">
              <div className="employer-panel-top">
                <span className="panel-kicker">For hiring teams</span>
                <span className="panel-icon" aria-hidden="true">↗</span>
              </div>
              <h2>Put your role in front of people who speak the language.</h2>
              <p>
                Reach engineers, researchers, and builders already looking for
                their next AI or robotics challenge.
              </p>
              <button onClick={() => setPage("addJob")} className="coral-button employer-button">
                Post a job
                <span aria-hidden="true">→</span>
              </button>
              <div className="panel-proof">
                <span>Built for niche hiring</span>
                <span>•</span>
                <span>Global reach</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="trust-strip" aria-label="Why use AI Robotics Job">
          <div className="trust-strip-inner">
            {TRUST_MARKS.map(([title, description], index) => (
              <div className="trust-item" key={title}>
                <span className="trust-number">0{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="field-section">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">Browse by field</span>
              <h2>Go straight to your discipline.</h2>
            </div>
            <button className="text-link" onClick={() => setPage("jobs")}>
              View every category <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="field-grid">
            {fieldMeta.map((field) => (
              <button className="field-card" key={field.name} onClick={() => browseField(field.name)}>
                <span className="field-icon" aria-hidden="true">{field.icon}</span>
                <span className="field-copy">
                  <strong>{field.name}</strong>
                  <small>{field.count ? `${field.count} open roles` : "Explore roles"}</small>
                </span>
                <span className="field-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="latest-section">
          <div className="latest-header">
            <div>
              <span className="section-kicker">Latest opportunities</span>
              <h2>AI &amp; robotics jobs</h2>
            </div>
            <div className="latest-header-meta">
              <span><i /> Updated regularly</span>
              <button className="text-link" onClick={() => setPage("jobs")}>
                Browse all jobs <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="job-list-shell">
            {jobsLoading ? (
              <div className="list-state">Loading the latest roles…</div>
            ) : availableJobs.length ? (
              availableJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={(selectedJob) => openJobDetail(selectedJob, "home")}
                  onApply={(selectedJob) => setApplyJob(selectedJob)}
                />
              ))
            ) : (
              <div className="list-state">New opportunities are being added. Check back soon.</div>
            )}
          </div>

          <button className="wide-jobs-button" onClick={() => setPage("jobs")}>
            See all open roles <span aria-hidden="true">→</span>
          </button>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-copy">
            <span className="section-kicker section-kicker-light">Weekly job signal</span>
            <h2>The best new roles, minus the scrolling.</h2>
            <p>Get a concise weekly edit of AI and robotics openings in your inbox.</p>
          </div>
          {!subscribed ? (
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              onSubmit={(event) => {
                event.preventDefault();
                onSubscribe();
              }}
              className="newsletter-form"
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <input
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
              />
              <button type="submit" disabled={subscribeLoading}>
                {subscribeLoading ? "Joining…" : "Get job alerts"}
              </button>
            </form>
          ) : (
            <div className="newsletter-success">✓ You’re on the list.</div>
          )}
        </section>
      </main>

      <footer className="new-footer">
        <div>
          <Logo />
          <p>Specialist hiring for intelligent systems.</p>
        </div>
        <div className="footer-links">
          <button onClick={() => setPage("jobs")}>Find jobs</button>
          <button onClick={() => setPage("addJob")}>Post a job</button>
          <span>© 2026 AIRoboticsjob</span>
        </div>
      </footer>

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
