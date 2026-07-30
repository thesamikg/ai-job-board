import { useEffect, useRef, useState } from "react";
import { Logo } from "../ui";
import { CATEGORY_OPTIONS } from "../../data/jobs";

const FEATURED_CATEGORY_OPTIONS = CATEGORY_OPTIONS.filter((category) => (
  [
    "AI Engineering",
    "AI/ML Engineering",
    "Robotics Engineering",
    "Autonomous Systems",
    "AI Research",
    "MLOps",
  ].includes(category.name)
));

export default function Navbar({
  page,
  setPage,
  user,
  onSignOut,
  isAdmin = false,
  canPostJobs = false,
  onSelectCategory,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const categoryRef = useRef(null);
  const profileRef = useRef(null);
  const isSignedIn = Boolean(user?.id || user?.email);
  const displayName = String(user?.name || user?.email?.split("@")[0] || "User");
  const email = String(user?.email || "");
  const initial = (displayName.trim().charAt(0) || "U").toUpperCase();

  const closeMenus = () => {
    setMenuOpen(false);
    setCategoryOpen(false);
    setProfileOpen(false);
  };

  const goTo = (nextPage) => {
    setPage(nextPage);
    closeMenus();
  };

  const pickCategory = (category) => {
    if (typeof onSelectCategory === "function") {
      onSelectCategory(category);
    } else {
      setPage("jobs");
    }
    closeMenus();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!categoryRef.current?.contains(event.target)) setCategoryOpen(false);
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <nav className="new-navbar">
        <button className="nav-logo-button" onClick={() => goTo("home")} aria-label="Go to homepage">
          <Logo />
        </button>

        <div className="nav-desktop new-nav-links">
          <button
            className={page === "jobs" ? "nav-link nav-link-active" : "nav-link"}
            onClick={() => goTo("jobs")}
          >
            Find jobs
          </button>

          <div className="nav-dropdown-wrap" ref={categoryRef}>
            <button
              className={categoryOpen ? "nav-link nav-link-active" : "nav-link"}
              onClick={() => {
                setCategoryOpen((open) => !open);
                setProfileOpen(false);
              }}
              aria-expanded={categoryOpen}
            >
              Browse fields <span className="nav-chevron">⌄</span>
            </button>
            {categoryOpen && (
              <div className="nav-dropdown">
                <span className="nav-dropdown-label">Explore specialist fields</span>
                {FEATURED_CATEGORY_OPTIONS.map((category) => (
                  <button key={category.name} onClick={() => pickCategory(category.name)}>
                    <span aria-hidden="true">{category.icon}</span>
                    <span>{category.name}</span>
                    <i aria-hidden="true">→</i>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isSignedIn && (
            <button
              className={page === "dashboard" ? "nav-link nav-link-active" : "nav-link"}
              onClick={() => goTo("dashboard")}
            >
              Dashboard
            </button>
          )}

          {isAdmin && (
            <button
              className={page === "admin" ? "nav-link nav-link-active" : "nav-link"}
              onClick={() => goTo("admin")}
            >
              Admin
            </button>
          )}
        </div>

        <div className="nav-desktop new-nav-actions">
          {!isSignedIn ? (
            <button className="nav-sign-in" onClick={() => goTo("login")}>Sign in</button>
          ) : (
            <div className="nav-profile-wrap" ref={profileRef}>
              <button
                className="nav-profile-button"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setCategoryOpen(false);
                }}
                aria-expanded={profileOpen}
              >
                <span>{initial}</span>
                <small>{displayName}</small>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div>
                    <strong>{displayName}</strong>
                    <span>{email}</span>
                  </div>
                  <button onClick={() => goTo("dashboard")}>Open dashboard</button>
                  <button
                    onClick={() => {
                      closeMenus();
                      onSignOut();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
          {(!isSignedIn || canPostJobs) && (
            <button className="coral-button nav-post-button" onClick={() => goTo("addJob")}>
              Post a job
            </button>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          <div className="new-mobile-nav">
            <button onClick={() => goTo("jobs")}>Find jobs <span>→</span></button>
            <div className="mobile-fields">
              <span>Browse fields</span>
              {FEATURED_CATEGORY_OPTIONS.map((category) => (
                <button key={category.name} onClick={() => pickCategory(category.name)}>
                  <span>{category.icon} {category.name}</span>
                  <i>→</i>
                </button>
              ))}
            </div>
            {isSignedIn ? (
              <>
                <button onClick={() => goTo("dashboard")}>Dashboard <span>→</span></button>
                {isAdmin && <button onClick={() => goTo("admin")}>Admin <span>→</span></button>}
                <button onClick={() => { closeMenus(); onSignOut(); }}>Sign out <span>→</span></button>
              </>
            ) : (
              <button onClick={() => goTo("login")}>Sign in <span>→</span></button>
            )}
            {(!isSignedIn || canPostJobs) && (
              <button className="coral-button mobile-post-button" onClick={() => goTo("addJob")}>
                Post a job <span>→</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
