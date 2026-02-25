import { Logo, Toast } from "../components/ui";

export default function LoginPage({
  setPage, loginEmail, setLoginEmail, loginSent, handleLogin, toast
}) {
  const bg = { background: "#060b18", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#94a3b8" };

  return (
    <div style={{ ...bg, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      {[["#7c3aed", "-10%", "20%"], ["#2563eb", "60%", "-5%"]].map(([c, l, t], i) => (
        <div key={i} style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${c}15, transparent 70%)`, left: l, top: t, animation: `blob ${5 + i}s ease-in-out infinite`, filter: "blur(40px)", animationDelay: `${i * 1.5}s` }} />
      ))}
      <div style={{ position: "relative", maxWidth: 420, width: "100%", padding: "24px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}><Logo /></div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 24px", backdropFilter: "blur(20px)" }}>
          {!loginSent ? (
            <>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Welcome back</h2>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>Sign in with your email — no password needed. We'll send you a magic link.</p>
              <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 8, letterSpacing: 0.5 }}>EMAIL ADDRESS</label>
              <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="you@company.com"
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", marginBottom: 20 }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <button onClick={handleLogin} style={{ width: "100%", padding: "13px 24px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
                Send Magic Link ✨
              </button>
              <button onClick={() => setPage("home")} style={{ width: "100%", marginTop: 12, padding: "10px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#64748b", fontSize: 13, cursor: "pointer" }}>
                Continue as Guest
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🪄</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Check your inbox</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>We sent a magic link to <span style={{ color: "#a78bfa" }}>{loginEmail}</span>. (Demo: logging you in now…)</p>
            </div>
          )}
        </div>
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
