import { useState } from "react";
import { Logo } from "../ui";

const navBtn = (page, p) => ({
  background: page === p ? "rgba(37,99,235,0.1)" : "transparent",
  border: `1px solid ${page === p ? "rgba(37,99,235,0.35)" : "transparent"}`,
  borderRadius: 8, padding: "6px 16px", color: page === p ? "#1d4ed8" : "#475569",
  cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "inherit"
});

export default function Navbar({ page, setPage, user, onSignOut, isAdmin = false, canPostJobs = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isSignedIn = Boolean(user?.id || user?.email);
  const role = user?.role || "job_seeker";
  const isEmployerLike = role === "employer" || role === "admin";

  const goTo = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

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
        {!isSignedIn && (
          <button onClick={() => setPage("login")} style={{
            background: "transparent", border: "1px solid rgba(37,99,235,0.45)", borderRadius: 8, padding: "7px 16px", color: "#1d4ed8",
            cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif"
          }}>Post a Job</button>
        )}
        {isSignedIn && isEmployerLike && (
          <button onClick={() => setPage("addJob")} style={{
            background: "transparent", border: "1px solid rgba(37,99,235,0.45)", borderRadius: 8, padding: "7px 16px", color: "#1d4ed8",
            cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif"
          }}>Post a Job</button>
        )}
        {isSignedIn && !isEmployerLike && (
          <button onClick={() => setPage("jobs")} style={{
            background: "transparent", border: "1px solid rgba(37,99,235,0.45)", borderRadius: 8, padding: "7px 16px", color: "#1d4ed8",
            cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif"
          }}>Browse Jobs</button>
        )}
        {isSignedIn ? (
          <>
            <button onClick={() => setPage("jobs")} style={navBtn(page, "jobs")}>Jobs</button>
            <button onClick={() => setPage("dashboard")} style={navBtn(page, "dashboard")}>Dashboard</button>
            <button onClick={onSignOut} style={{
              marginLeft: 4, background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              border: "none", borderRadius: 8, padding: "7px 18px", color: "#ffffff",
              cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif"
            }}>Sign Out</button>
          </>
        ) : (
          <button onClick={() => setPage("login")} style={{
            marginLeft: 4, background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            border: "none", borderRadius: 8, padding: "7px 18px", color: "#ffffff",
            cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Source Sans 3', sans-serif"
          }}>Sign In / Sign Up</button>
        )}
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
          {!isSignedIn && (
            <button onClick={() => goTo("login")} style={{
              background: "transparent",
              border: "1px solid rgba(37,99,235,0.45)",
              borderRadius: 10,
              padding: "12px 20px",
              color: "#1d4ed8",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}>Post a Job</button>
          )}
          {isSignedIn && isEmployerLike && (
            <button onClick={() => goTo("addJob")} style={{
              background: "transparent",
              border: "1px solid rgba(37,99,235,0.45)",
              borderRadius: 10,
              padding: "12px 20px",
              color: "#1d4ed8",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}>Post a Job</button>
          )}
          {isSignedIn && !isEmployerLike && (
            <button onClick={() => goTo("jobs")} style={{
              background: "transparent",
              border: "1px solid rgba(37,99,235,0.45)",
              borderRadius: 10,
              padding: "12px 20px",
              color: "#1d4ed8",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}>Browse Jobs</button>
          )}
          {isSignedIn ? (
            <>
              <button onClick={() => goTo("jobs")} style={{ ...navBtn(page, "jobs"), marginTop: 8, width: "100%", padding: "12px 20px" }}>Jobs</button>
              <button onClick={() => goTo("dashboard")} style={{ ...navBtn(page, "dashboard"), marginTop: 8, width: "100%", padding: "12px 20px" }}>Dashboard</button>
              <button onClick={onSignOut} style={{
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#ffffff",
                border: "none", borderRadius: 10, padding: "14px 24px", marginTop: 8,
                fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%"
              }}>Sign Out</button>
            </>
          ) : (
            <button onClick={() => goTo("login")} style={{
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#ffffff",
              border: "none", borderRadius: 10, padding: "14px 24px", marginTop: 8,
              fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%"
            }}>Sign In / Sign Up</button>
          )}
        </div>
      </div>
    )}
  </>
  );
}
