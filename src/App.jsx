import { useState, useEffect } from "react";
import { HomePage, JobsPage, DashboardPage, LoginPage, AddJobPage } from "./pages";
import { SAMPLE_JOBS } from "./data/jobs";
import { filterAndSortJobs } from "./utils/filterJobs";
import { fetchJobs, addJob } from "./services/jobsService";
import { signInWithPassword, signUpWithPassword, signInWithGoogle, getSession, onAuthStateChange, signOut } from "./services/authService";
import "./styles/global.css";

const LOCAL_JOBS_KEY = "ai_jobboard_local_jobs";

function normalizeJob(job) {
  return {
    ...job,
    posted_at: job?.posted_at ? new Date(job.posted_at) : new Date(),
  };
}

function loadLocalJobs() {
  try {
    const raw = localStorage.getItem(LOCAL_JOBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeJob);
  } catch {
    return [];
  }
}

function saveLocalJobs(jobs) {
  try {
    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(jobs));
  } catch {
    // Ignore storage write errors.
  }
}

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [page, setPage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [emails, setEmails] = useState([]);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [search, setSearch] = useState({ title: "", location: "" });
  const [filters, setFilters] = useState({ remote: false, skills: [], exp: "", sort: "newest" });
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      const localJobs = loadLocalJobs();
      try {
        const data = await fetchJobs();
        const baseJobs = data.length > 0 ? data : [...SAMPLE_JOBS];
        setJobs([...localJobs, ...baseJobs]);
      } catch (err) {
        console.warn("Could not load jobs from Supabase, using sample data:", err);
        setJobs([...localJobs, ...SAMPLE_JOBS]);
      } finally {
        setJobsLoading(false);
      }
    }
    loadJobs();
  }, []);

  useEffect(() => {
    getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email, id: session.user.id });
      }
    });
    const unsubscribe = onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email, id: session.user.id });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleSave = (jobId) => {
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    const isSaving = !savedJobs.includes(jobId);
    showToast(isSaving ? "✓ Job saved to your dashboard" : "Job removed from saved");
  };

  const handleApplySubmit = (email, job) => {
    setEmails(prev => [...prev, { email, jobId: job.id, at: new Date() }]);
    setApplyJob(null);
    showToast("✓ Redirecting to application...");
    setTimeout(() => window.open(job.apply_url, "_blank"), 500);
  };

  const handleSignIn = async () => {
    if (!loginEmail.trim() || !loginEmail.includes("@")) {
      showToast("Please enter a valid email");
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      showToast("Please enter your password (min 6 characters)");
      return;
    }
    setAuthLoading(true);
    try {
      await signInWithPassword(loginEmail.trim(), loginPassword);
      showToast("✓ Welcome back!");
      setPage("jobs");
      setLoginPassword("");
    } catch (err) {
      showToast(err?.message || "Sign in failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!loginEmail.trim() || !loginEmail.includes("@")) {
      showToast("Please enter a valid email");
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }
    setAuthLoading(true);
    try {
      const data = await signUpWithPassword(loginEmail.trim(), loginPassword);
      if (data?.session?.user) {
        showToast("✓ Account created and signed in!");
        setPage("jobs");
      } else {
        showToast("✓ Account created! Check your email to confirm, then sign in.");
      }
      setLoginPassword("");
    } catch (err) {
      showToast(err?.message || "Sign up failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const { url } = await signInWithGoogle();
      if (url) {
        window.location.href = url;
        return;
      }
      showToast("Google sign-in did not return a redirect URL.");
    } catch (err) {
      showToast(err?.message || "Google sign-in failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setPage("home");
      showToast("Signed out");
    } catch (err) {
      showToast(err?.message || "Sign out failed");
    }
  };

  const handleAddJob = async (job) => {
    try {
      const saved = await addJob(job);
      setJobs(prev => [saved, ...prev]);
      return { ok: true, persisted: "supabase" };
    } catch (err) {
      const localJob = normalizeJob(job);
      const nextLocal = [localJob, ...loadLocalJobs()];
      saveLocalJobs(nextLocal);
      setJobs(prev => [localJob, ...prev]);
      const msg = err?.message || err?.error_description || String(err);
      console.error("Add job failed:", err);
      showToast(msg.includes("relation") ? "Database table missing. Run the migration in Supabase." : `Could not save to DB: ${msg.slice(0, 50)}`);
      return { ok: true, persisted: "local" };
    }
  };

  const filteredJobs = filterAndSortJobs(jobs, search, filters);

  if (page === "home") {
    return (
      <HomePage
        jobs={jobs}
        jobsLoading={jobsLoading}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        savedJobs={savedJobs}
        handleSave={handleSave}
        showToast={showToast}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        applyJob={applyJob}
        setApplyJob={setApplyJob}
        handleApplySubmit={handleApplySubmit}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        subscribed={subscribed}
        setSubscribed={setSubscribed}
        toast={toast}
        user={user}
        onSignOut={handleSignOut}
      />
    );
  }

  if (page === "jobs") {
    return (
      <JobsPage
        jobsLoading={jobsLoading}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        filteredJobs={filteredJobs}
        savedJobs={savedJobs}
        handleSave={handleSave}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        applyJob={applyJob}
        setApplyJob={setApplyJob}
        handleApplySubmit={handleApplySubmit}
        toast={toast}
        user={user}
        onSignOut={handleSignOut}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <DashboardPage
        jobsLoading={jobsLoading}
        page={page}
        setPage={setPage}
        jobs={jobs}
        savedJobs={savedJobs}
        emails={emails}
        handleSave={handleSave}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        applyJob={applyJob}
        setApplyJob={setApplyJob}
        handleApplySubmit={handleApplySubmit}
        toast={toast}
        user={user}
        onSignOut={handleSignOut}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        setPage={setPage}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
        handleGoogleSignIn={handleGoogleSignIn}
        authLoading={authLoading}
        toast={toast}
      />
    );
  }

  if (page === "addJob") {
    return (
      <AddJobPage
        page={page}
        setPage={setPage}
        onAddJob={handleAddJob}
        showToast={showToast}
        toast={toast}
        user={user}
        onSignOut={handleSignOut}
      />
    );
  }

  return null;
}
