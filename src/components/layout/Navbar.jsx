import { useEffect, useRef, useState } from "react";
import { Logo } from "../ui";
import { CATEGORIES } from "../../data/jobs";

const navBtn = (page, p) => ({
  background: page === p ? "rgba(37,99,235,0.1)" : "transparent",
  border: `1px solid ${page === p ? "rgba(37,99,235,0.35)" : "transparent"}`,
  borderRadius: 8, padding: "6px 16px", color: page === p ? "#1d4ed8" : "#475569",
  cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "inherit"
});

const categoryBtn = (page, open = false) => ({
  background: open || page === "jobs" ? "rgba(37,99,235,0.06)" : "#ffffff",
  border: `1px solid ${open || page === "jobs" ? "#2563eb" : "rgba(37,99,235,0.55)"}`,
  borderRadius: 14,
  padding: "10px 18px",
  color: "#2563eb",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 700,
  fontFamily: "'Source Sans 3', sans-serif",
  boxShadow: open ? "0 10px 24px rgba(37,99,235,0.12)" : "none",
});

const postJobBtn = {
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  border: "1px solid rgba(29,78,216,0.7)",
  borderRadius: 14,
  padding: "10px 18px",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 700,
  fontFamily: "'Source Sans 3', sans-serif",
};

const CATEGORY_OPTIONS = CATEGORIES.filter((category) => (
  ["AI Engineering", "Computer Vision", "Robotics", "Research"].includes(category.name)
));

export default function Navbar({ page, setPage, user, onSignOut, isAdmin = false, canPostJobs = false, onSelectCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const isSignedIn = Boolean(user?.id || user?.email);
  const isEmployerLike = Boolean(canPostJobs);
  const displayName = String(user?.name || user?.email?.split("@")[0] || "User");
  const email = String(user?.email || "");
  const initial = (displayName.trim().charAt(0) || "U").toUpperCase();

  const goTo = (p) => {
    setPage(p);
    setMenuOpen(false);
    setProfileOpen(false);
    setCategoryOpen(false);
    setMobileCategoryOpen(false);
  };

  const handleCategoryPick = (category) => {
    if (typeof onSelectCategory === "function") {
      onSelectCategory(category);
    } else {
      setPage("jobs");
    }
    setMenuOpen(false);
    setProfileOpen(false);
    setCategoryOpen(false);
    setMobileCategoryOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!categoryRef.current?.contains(event.target)) {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(148,163,184,0.3)", padding: "0 16px 0 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
    }}>
      <div onClick={() => goTo("home")} style={{ cursor: "pointer" }}><Logo /></div>

      {/* Desktop nav - hidden on mobile */}
      <div className="nav-desktop" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div ref={categoryRef} style={{ position: "relative" }}>
          <button
            onClick={() => {
              setCategoryOpen((v) => !v);
              setProfileOpen(false);
            }}
            style={{ ...categoryBtn(page, categoryOpen), display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Browse by Category
            <span style={{
              width: 8,
              height: 8,
              borderRight: "2px solid #2563eb",
              borderBottom: "2px solid #2563eb",
              transform: categoryOpen ? "rotate(-135deg)" : "rotate(45deg)",
              transition: "transform 0.15s ease",
              marginLeft: 4,
              marginTop: categoryOpen ? 4 : -2,
            }} />
          </button>
          {categoryOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              minWidth: 220,
              background: "#ffffff",
              border: "1px solid rgba(148,163,184,0.28)",
              borderRadius: 14,
              padding: 8,
              boxShadow: "0 16px 36px rgba(15,23,42,0.16)",
              zIndex: 130,
            }}>
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryPick(category.name)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#ffffff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: "#334155",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {!isSignedIn && (
          <button onClick={() => goTo("addJob")} style={postJobBtn}>Post a Job</button>
        )}
        {isSignedIn && isEmployerLike && (
          <button onClick={() => goTo("addJob")} style={postJobBtn}>Post a Job</button>
        )}
        {isSignedIn ? (
          <>
            <button onClick={() => goTo("jobs")} style={navBtn(page, "jobs")}>Jobs</button>
            <button onClick={() => goTo("dashboard")} style={navBtn(page, "dashboard")}>Dashboard</button>
            <div style={{ position: "relative", marginLeft: 4 }}>
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setCategoryOpen(false);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.45)",
                  borderRadius: 999,
                  padding: "4px 10px 4px 4px",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Source Sans 3', sans-serif",
                }}>{initial}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>Profile</span>
              </button>
              {profileOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: 240,
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.35)",
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: "0 12px 28px rgba(15,23,42,0.18)",
                  zIndex: 120,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>{initial}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
                      <div style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onSignOut();
                    }}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 12px",
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Hamburger - visible only on mobile */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        style={{
          display: "none", flexDirection: "column", gap: 5, padding: 8,
          background: "transparent", border: "1px solid rgba(148,163,184,0.4)",
          borderRadius: 8, cursor: "pointer",
        }}
      >
        <span style={{ width: 22, height: 2, background: "#475569", borderRadius: 1 }} />
        <span style={{ width: 22, height: 2, background: "#475569", borderRadius: 1 }} />
        <span style={{ width: 22, height: 2, background: "#475569", borderRadius: 1 }} />
      </button>
    </nav>

    {/* Mobile menu overlay */}
    {menuOpen && (
      <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
        <div className="nav-mobile-links" onClick={e => e.stopPropagation()}>
          <button onClick={() => setMobileCategoryOpen((v) => !v)} style={{
            ...categoryBtn(page, mobileCategoryOpen),
            width: "100%",
            borderRadius: 10,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span>Browse by Category</span>
            <span style={{
              width: 8,
              height: 8,
              borderRight: "2px solid #2563eb",
              borderBottom: "2px solid #2563eb",
              transform: mobileCategoryOpen ? "rotate(-135deg)" : "rotate(45deg)",
              transition: "transform 0.15s ease",
              marginTop: mobileCategoryOpen ? 4 : -2,
            }} />
          </button>
          {mobileCategoryOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px 4px" }}>
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryPick(category.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid rgba(148,163,184,0.22)",
                    borderRadius: 10,
                    padding: "11px 14px",
                    color: "#334155",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
          {!isSignedIn && (
            <button onClick={() => goTo("addJob")} style={{
              ...postJobBtn,
              borderRadius: 10,
              padding: "12px 20px",
              fontSize: 14,
              width: "100%",
            }}>Post a Job</button>
          )}
          {isSignedIn && isEmployerLike && (
            <button onClick={() => goTo("addJob")} style={{
              ...postJobBtn,
              borderRadius: 10,
              padding: "12px 20px",
              fontSize: 14,
              width: "100%",
            }}>Post a Job</button>
          )}
          {isSignedIn ? (
            <>
              <button onClick={() => goTo("jobs")} style={{ ...navBtn(page, "jobs"), marginTop: 8, width: "100%", padding: "12px 20px" }}>Jobs</button>
              <button onClick={() => goTo("dashboard")} style={{ ...navBtn(page, "dashboard"), marginTop: 8, width: "100%", padding: "12px 20px" }}>Dashboard</button>
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setMobileCategoryOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.45)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginTop: 8,
                  cursor: "pointer",
                }}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  color: "#ffffff", fontSize: 13, fontWeight: 800,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{initial}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Profile</span>
              </button>
              {profileOpen && (
                <div style={{ width: "100%", border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 10, marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, wordBreak: "break-word" }}>{email}</div>
                  <button onClick={() => { setProfileOpen(false); onSignOut(); }} style={{
                    background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#ffffff",
                    border: "none", borderRadius: 10, padding: "12px 16px",
                    fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%"
                  }}>Sign Out</button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    )}
  </>
  );
}
