import { useState } from "react";

export default function EmailModal({ job, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubmitted(true);
    setTimeout(() => { onSubmit(email, job); }, 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0f172a", border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 20, padding: 36, maxWidth: 420, width: "100%",
        boxShadow: "0 0 60px rgba(124,58,237,0.2), 0 32px 64px rgba(0,0,0,0.6)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #7c3aed, #2563eb, transparent)" }} />
        {!submitted ? (
          <>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
              Apply to {job.company}
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
              Enter your email to continue to the application. We'll also notify you of similar AI roles.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 8 }}>EMAIL ADDRESS</label>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f1f5f9",
                  fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24, cursor: "pointer" }}>
              <input type="checkbox" checked={subscribe} onChange={e => setSubscribe(e.target.checked)}
                style={{ accentColor: "#7c3aed", width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: "#64748b" }}>Get weekly AI & Robotics job alerts</span>
            </label>
            <button onClick={handleSubmit} style={{
              width: "100%", padding: "13px 24px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: 0.3,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.9}
              onMouseLeave={e => e.target.style.opacity = 1}
            >Continue to Application →</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Redirecting you now…</h3>
            <p style={{ fontSize: 13, color: "#64748b" }}>Opening {job.company}'s application page</p>
          </div>
        )}
      </div>
    </div>
  );
}
