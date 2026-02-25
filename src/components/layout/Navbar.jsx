import { useState } from "react";
import { Logo } from "../ui";

const navBtn = (page, p) => ({
  background: page === p ? "rgba(124,58,237,0.15)" : "transparent",
  border: `1px solid ${page === p ? "rgba(124,58,237,0.4)" : "transparent"}`,
  borderRadius: 8, padding: "6px 16px", color: page === p ? "#a78bfa" : "#64748b",
  cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "inherit"
});

export default function Navbar({ page, setPage, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

  return (
    <>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(6,11,24,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 16px 0 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
    }}>
      <div onClick={() => goTo("home")} style={{ cursor: "pointer" }}><Logo /></div>

      {/* Desktop nav - hidden on mobile */}
      <div className="nav-desktop" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {[["Jobs", "jobs"], ["Dashboard", "dashboard"]].map(([label, p]) => (
          <button key={p} onClick={() => setPage(p)} style={navBtn(page, p)}>{label}</button>
        ))}
        <button onClick={() => setPage("addJob")} style={{
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          border: "none", borderRadius: 8, padding: "6px 16px", color: "#fff",
          cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif"
        }}>Post Job</button>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
              {user.email[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <button onClick={() => setPage("login")} style={{
            marginLeft: 8, background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            border: "none", borderRadius: 8, padding: "7px 18px", color: "#fff",
            cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif"
          }}>Sign In</button>
        )}
      </div>

      {/* Hamburger - visible only on mobile */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        style={{
          display: "none", flexDirection: "column", gap: 5, padding: 8,
          background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, cursor: "pointer",
        }}
      >
        <span style={{ width: 22, height: 2, background: "#94a3b8", borderRadius: 1 }} />
        <span style={{ width: 22, height: 2, background: "#94a3b8", borderRadius: 1 }} />
        <span style={{ width: 22, height: 2, background: "#94a3b8", borderRadius: 1 }} />
      </button>
    </nav>

    {/* Mobile menu overlay */}
    {menuOpen && (
      <div className="nav-mobile-menu" onClick={() => setMenuOpen(false)}>
        <div className="nav-mobile-links" onClick={e => e.stopPropagation()}>
          {[["Jobs", "jobs"], ["Dashboard", "dashboard"]].map(([label, p]) => (
            <button key={p} className={page === p ? "nav-active" : ""} onClick={() => goTo(p)}>{label}</button>
          ))}
          <button className="nav-post-job" onClick={() => goTo("addJob")}>Post Job</button>
          {user ? (
            <div className="nav-user-row">
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                {user.email[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>{user.email}</span>
            </div>
          ) : (
            <button onClick={() => goTo("login")} style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
              border: "none", borderRadius: 10, padding: "14px 24px", marginTop: 8,
              fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%"
            }}>Sign In</button>
          )}
        </div>
      </div>
    )}
  </>
  );
}
