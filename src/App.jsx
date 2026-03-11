import { useState, useEffect } from "react";
import { HomePage, JobsPage, DashboardPage, LoginPage, AddJobPage, AdminPage } from "./pages";
import { filterAndSortJobs } from "./utils/filterJobs";
import { fetchJobs, addJob, updateJobStatus, deleteJob } from "./services/jobsService";
import { signInWithPassword, signUpWithPassword, signInWithGoogle, getSession, onAuthStateChange, signOut, isEmailRegistered } from "./services/authService";
import { isAdminUser, ensureUserProfile, fetchUsersForAdmin, addApplication, fetchApplicationsForAdmin, fetchApplicationsForUser, fetchUserRole } from "./services/adminService";
import "./styles/global.css";

const PENDING_SIGNUP_ROLE_KEY = "ai_jobboard_pending_signup_role";
const SAVED_JOBS_BY_USER_KEY = "ai_jobboard_saved_jobs_by_user";
const BLOCKED_EMPLOYER_DOMAINS = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]);
const LOCAL_PAGE_KEY = "ai_jobboard_current_page";
const LOCAL_USER_KEY = "ai_jobboard_current_user";
const JOBS_CACHE_KEY = "ai_jobboard_jobs_cache_v1";

function getUserStorageId(user) {
  if (!user) return "";
  return String(user.id || user.email || "").toLowerCase();
}

function loadSavedJobsForUser(user) {
  const userKey = getUserStorageId(user);
  if (!userKey) return [];
  try {
    const raw = localStorage.getItem(SAVED_JOBS_BY_USER_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const list = parsed?.[userKey];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveSavedJobsForUser(user, savedJobs) {
  const userKey = getUserStorageId(user);
  if (!userKey) return;
  try {
    const raw = localStorage.getItem(SAVED_JOBS_BY_USER_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[userKey] = savedJobs;
    localStorage.setItem(SAVED_JOBS_BY_USER_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore storage errors.
  }
}

function getEmailDomain(email) {
  const value = String(email || "").toLowerCase().trim();
  const at = value.lastIndexOf("@");
  return at === -1 ? "" : value.slice(at + 1);
}

function loadCurrentPage() {
  try {
    const page = localStorage.getItem(LOCAL_PAGE_KEY);
    return page || "home";
  } catch {
    return "home";
  }
}

function saveCurrentPage(page) {
  try {
    localStorage.setItem(LOCAL_PAGE_KEY, page);
  } catch {
    // Ignore storage errors.
  }
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.id && !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(LOCAL_USER_KEY);
      return;
    }
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors.
  }
}

function deriveDisplayName(sessionUser) {
  const fullName = sessionUser?.user_metadata?.full_name || sessionUser?.user_metadata?.name || "";
  if (fullName && String(fullName).trim()) return String(fullName).trim();
  const email = String(sessionUser?.email || "");
  const prefix = email.split("@")[0] || "User";
  return prefix;
}

function clearLegacyLocalJobCache() {
  try {
    localStorage.removeItem("ai_jobboard_local_jobs");
    localStorage.removeItem("ai_jobboard_job_status");
    localStorage.removeItem("ai_jobboard_deleted_jobs");
    localStorage.removeItem("ai_jobboard_remote_jobs_cache");
  } catch {
    // Ignore storage errors.
  }
}

function normalizeCachedJob(job) {
  return {
    ...job,
    posted_at: job?.posted_at ? new Date(job.posted_at) : new Date(),
  };
}

function loadJobsCache() {
  try {
    const raw = localStorage.getItem(JOBS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeCachedJob) : [];
  } catch {
    return [];
  }
}

function saveJobsCache(jobs) {
  try {
    localStorage.setItem(JOBS_CACHE_KEY, JSON.stringify(jobs));
  } catch {
    // Ignore storage errors.
  }
}

async function fetchJobsWithTimeout(options = {}, timeoutMs = 5000) {
  return Promise.race([
    fetchJobs(options),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timed out while loading jobs")), timeoutMs);
    }),
  ]);
}

async function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [page, setPage] = useState(loadCurrentPage);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [search, setSearch] = useState({ title: "", location: "" });
  const [filters, setFilters] = useState({ category: "", remote: false, skills: [], exp: "", sort: "newest" });
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [user, setUser] = useState(loadCurrentUser);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupRole, setSignupRole] = useState("job_seeker");
  const [signupCompanyName, setSignupCompanyName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const userRole = user?.role || "job_seeker";
  const isAdmin = userRole === "admin";
  const canPostJobs = userRole === "employer";
  
  const applySessionUser = async (sessionUser, preferredRole = "job_seeker") => {
    if (!sessionUser) {
      setUser(null);
      return null;
    }
    const pendingRole = localStorage.getItem(PENDING_SIGNUP_ROLE_KEY);
    const metaRole = sessionUser?.user_metadata?.role;
    let fetchedRole = "job_seeker";
    try {
      fetchedRole = await fetchUserRole(sessionUser.id, sessionUser.email, metaRole || preferredRole);
    } catch (err) {
      console.warn("Could not fetch role, using fallback:", err);
      fetchedRole = metaRole || preferredRole || "job_seeker";
    }
    const role = pendingRole && pendingRole !== "job_seeker" ? pendingRole : fetchedRole;
    const nextUser = { email: sessionUser.email, id: sessionUser.id, role, name: deriveDisplayName(sessionUser) };
    setUser(nextUser);
    saveCurrentUser(nextUser);
    setSavedJobs(loadSavedJobsForUser(nextUser));
    const companyName = sessionUser?.user_metadata?.company_name || "";
    ensureUserProfile(sessionUser, { role, companyName }).catch((err) => {
      console.warn("Could not ensure profile:", err);
    });
    if (pendingRole) {
      localStorage.removeItem(PENDING_SIGNUP_ROLE_KEY);
    }
    return role;
  };

  useEffect(() => {
    async function loadJobs() {
      clearLegacyLocalJobCache();
      const cachedJobs = loadJobsCache();
      if (cachedJobs.length > 0) {
        setJobs(cachedJobs);
        setJobsLoading(false);
      } else {
        setJobsLoading(true);
      }
      try {
        const data = await fetchJobsWithTimeout({ includeAll: false }, 5000);
        const nextJobs = Array.isArray(data) ? data : [];
        setJobs(nextJobs);
        saveJobsCache(nextJobs);
      } catch (err) {
        console.warn("Could not load jobs from Supabase:", err);
        if (cachedJobs.length === 0) {
          setJobs([]);
        }
      } finally {
        setJobsLoading(false);
      }
    }
    loadJobs();
  }, []);

  useEffect(() => {
    async function loadAdminJobs() {
      if (!isAdmin || page !== "admin") return;
      try {
        const data = await fetchJobsWithTimeout({ includeAll: true }, 5000);
        if (Array.isArray(data)) {
          setJobs(data);
        }
      } catch (err) {
        console.warn("Could not load full admin jobs:", err);
      }
    }
    loadAdminJobs();
  }, [isAdmin, page]);

  useEffect(() => {
    saveCurrentPage(page);
  }, [page]);

  useEffect(() => {
    getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await applySessionUser(session.user);
      }
    });
    const unsubscribe = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await applySessionUser(session.user);
        if (event === "SIGNED_IN") {
          setPage("dashboard");
        }
      } else {
        setUser(null);
        saveCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function loadAdminData() {
      if (!isAdmin) {
        setAdminUsers([]);
        return;
      }
      setAdminLoading(true);
      try {
        const users = await fetchUsersForAdmin();
        setAdminUsers(users);
      } catch (err) {
        console.warn("Could not load admin users:", err);
      } finally {
        setAdminLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  useEffect(() => {
    async function loadApplications() {
      if (!user?.id && !user?.email) {
        setApplications([]);
        return;
      }
      try {
        if (isAdmin) {
          const rows = await fetchApplicationsForAdmin();
          setApplications(rows);
          return;
        }
        const rows = await fetchApplicationsForUser(user?.id, user?.email);
        setApplications(rows);
      } catch (err) {
        console.warn("Could not load applications:", err);
        setApplications([]);
      }
    }
    loadApplications();
  }, [user?.id, user?.email, isAdmin]);

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleCategorySelect = (category) => {
    setFilters((prev) => ({ ...prev, category: category || "" }));
    setPage("jobs");
  };

  const handleSave = (jobId) => {
    const nextSaved = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(nextSaved);
    if (user) saveSavedJobsForUser(user, nextSaved);
    const isSaving = !savedJobs.includes(jobId);
    showToast(isSaving ? "✓ Job saved to your dashboard" : "Job removed from saved");
  };

  const handleApplySubmit = (email, job) => {
    addApplication({ id: Date.now(), userId: user?.id || null, email, jobId: job.id }).catch((err) => {
      console.warn("Could not save application:", err);
    });
    setApplications((prev) => [{
      id: Date.now(),
      applicant_id: user?.id || null,
      applicant_email: email,
      job_id: job.id,
      submitted_at: new Date().toISOString(),
    }, ...prev]);
    setApplyJob(null);
    showToast("✓ Redirecting to application...");
    setTimeout(() => window.open(job.apply_url, "_blank"), 500);
  };

  const handleSignIn = async () => {
    if (authLoading) return;
    if (!loginEmail.trim() || !loginEmail.includes("@")) {
      showToast("Please enter a valid email");
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      showToast("Please enter your password (min 6 characters)");
      return;
    }
    setAuthLoading(true);
    let registrationKnown = null;
    try {
      registrationKnown = await withTimeout(
        isEmailRegistered(loginEmail.trim()),
        3000,
        "Email lookup timed out."
      ).catch(() => null);
      if (registrationKnown === false) {
        showToast("Email is not registered, continue to sign up.");
        setPage("signup");
        return;
      }
      const data = await withTimeout(
        signInWithPassword(loginEmail.trim(), loginPassword),
        10000,
        "Sign-in timed out. Please try again."
      );
      if (data?.session?.user) {
        await applySessionUser(data.session.user);
        showToast("✓ Welcome back!");
        setPage("dashboard");
        setLoginPassword("");
        return;
      }
      const { data: { session } } = await withTimeout(
        getSession(),
        8000,
        "Could not restore session after sign-in."
      );
      if (session?.user) {
        await applySessionUser(session.user);
        showToast("✓ Welcome back!");
        setPage("dashboard");
        setLoginPassword("");
        return;
      }
      showToast("Sign-in succeeded but no active session was found. Please verify your email and try again.");
      return;
    } catch (err) {
      const msg = String(err?.message || "Sign in failed");
      if (msg.toLowerCase().includes("email not confirmed")) {
        showToast("Please confirm your email before signing in.");
      } else if (msg.toLowerCase().includes("invalid login credentials") && registrationKnown !== true) {
        showToast("Email is not registered, continue to sign up.");
        setPage("signup");
      } else {
        showToast(msg);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (authLoading) return;
    if (!loginEmail.trim() || !loginEmail.includes("@")) {
      showToast("Please enter a valid email");
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }
    if (signupRole === "employer") {
      const domain = getEmailDomain(loginEmail);
      if (BLOCKED_EMPLOYER_DOMAINS.has(domain)) {
        showToast("Please use a company email address to register as an employer.");
        return;
      }
    }
    setAuthLoading(true);
    try {
      const companyName = signupCompanyName.trim();
      const data = await signUpWithPassword(loginEmail.trim(), loginPassword, signupRole, companyName);
      const hasIdentity = Array.isArray(data?.user?.identities) ? data.user.identities.length > 0 : true;
      if (!hasIdentity) {
        showToast("Email id is already in use.");
        return;
      }
      if (data?.user) {
        await ensureUserProfile(data.user, { role: signupRole, companyName });
      }
      if (data?.session?.user) {
        await applySessionUser(data.session.user, signupRole);
        showToast("✓ Account created and signed in!");
        setPage("dashboard");
      } else {
        showToast("✓ Account created! Check your email to confirm, then sign in.");
      }
      setLoginPassword("");
      setSignupCompanyName("");
    } catch (err) {
      const msg = String(err?.message || "Sign up failed");
      if (msg.toLowerCase().includes("already registered")) {
        showToast("Email id is already in use.");
      } else {
        showToast(msg);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (authLoading) return;
    setAuthLoading(true);
    try {
      localStorage.setItem(PENDING_SIGNUP_ROLE_KEY, signupRole);
      const redirectTo = window.location.origin + window.location.pathname;
      const { url } = await withTimeout(
        signInWithGoogle(redirectTo),
        10000,
        "Google sign-in timed out. Please try again."
      );
      if (url) {
        window.location.href = url;
        return;
      }
      localStorage.removeItem(PENDING_SIGNUP_ROLE_KEY);
      showToast("Google sign-in did not return a redirect URL.");
    } catch (err) {
      localStorage.removeItem(PENDING_SIGNUP_ROLE_KEY);
      showToast(err?.message || "Google sign-in failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setUser(null);
    saveCurrentUser(null);
    setSavedJobs([]);
    setApplications([]);
    setPage("home");
    try {
      await signOut();
      showToast("Signed out");
    } catch (err) {
      console.warn("Remote sign out failed:", err);
      showToast("Signed out locally");
    }
  };

  const handleModerateJob = async (jobId, status) => {
    setJobs((prev) => {
      const nextJobs = prev.map((job) => (String(job.id) === String(jobId) ? { ...job, status } : job));
      saveJobsCache(nextJobs.filter((job) => job.status !== "pending" && job.status !== "rejected"));
      return nextJobs;
    });
    try {
      await updateJobStatus(jobId, status);
    } catch (err) {
      console.warn("Could not update remote job status:", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    setJobs((prev) => {
      const nextJobs = prev.filter((job) => String(job.id) !== String(jobId));
      saveJobsCache(nextJobs.filter((job) => job.status !== "pending" && job.status !== "rejected"));
      return nextJobs;
    });
    try {
      await deleteJob(jobId);
    } catch (err) {
      console.warn("Could not delete remote job:", err);
    }
  };

  const handleAddJob = async (job) => {
    const enrichedJob = {
      ...job,
      posted_by: user?.id || user?.email || null,
    };
    try {
      const saved = await addJob(enrichedJob);
      setJobs((prev) => {
        const nextJobs = [saved, ...prev.filter((item) => String(item.id) !== String(saved.id))];
        saveJobsCache(nextJobs.filter((jobItem) => jobItem.status !== "pending" && jobItem.status !== "rejected"));
        return nextJobs;
      });
      return { ok: true, persisted: "supabase" };
    } catch (err) {
      const msg = err?.message || err?.error_description || String(err);
      console.error("Add job failed:", err);
      showToast(msg.includes("relation") ? "Database table missing. Run the migration in Supabase." : `Could not save to DB: ${msg.slice(0, 50)}`);
      return { ok: false, error: msg };
    }
  };

  const visibleJobs = jobs.filter((job) => job.status !== "pending" && job.status !== "rejected");
  const filteredJobs = filterAndSortJobs(visibleJobs, search, filters);

  if (page === "home") {
    return (
      <HomePage
        jobs={visibleJobs}
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
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={handleCategorySelect}
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
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={handleCategorySelect}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <DashboardPage
        jobsLoading={jobsLoading}
        page={page}
        setPage={setPage}
        jobs={visibleJobs}
        savedJobs={savedJobs}
        applications={applications}
        handleSave={handleSave}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        applyJob={applyJob}
        setApplyJob={setApplyJob}
        handleApplySubmit={handleApplySubmit}
        toast={toast}
        user={user}
        userRole={userRole}
        onSignOut={handleSignOut}
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={handleCategorySelect}
      />
    );
  }

  if (page === "admin") {
    if (!isAdmin) {
      return (
        <LoginPage
          setPage={setPage}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          signupRole={signupRole}
          setSignupRole={setSignupRole}
          signupCompanyName={signupCompanyName}
          setSignupCompanyName={setSignupCompanyName}
          handleSignIn={handleSignIn}
          handleSignUp={handleSignUp}
          handleGoogleSignIn={handleGoogleSignIn}
          authLoading={authLoading}
          toast={{ message: "Admin access required.", visible: true }}
          initialMode="signin"
        />
      );
    }
    return (
      <AdminPage
        page={page}
        setPage={setPage}
        user={user}
        onSignOut={handleSignOut}
        toast={toast}
        jobs={jobs}
        users={adminUsers}
        applications={applications}
        onApprove={(id) => handleModerateJob(id, "approved")}
        onReject={(id) => handleModerateJob(id, "rejected")}
        onDelete={handleDeleteJob}
        isLoading={adminLoading}
        onSelectCategory={handleCategorySelect}
      />
    );
  }

  if (page === "login" || page === "signup") {
    return (
      <LoginPage
        setPage={setPage}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        signupRole={signupRole}
        setSignupRole={setSignupRole}
        signupCompanyName={signupCompanyName}
        setSignupCompanyName={setSignupCompanyName}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
        handleGoogleSignIn={handleGoogleSignIn}
        authLoading={authLoading}
        toast={toast}
        initialMode={page === "signup" ? "signup" : "signin"}
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
        isAdmin={isAdmin}
        canPostJobs={canPostJobs}
        onSelectCategory={handleCategorySelect}
      />
    );
  }

  return null;
}
