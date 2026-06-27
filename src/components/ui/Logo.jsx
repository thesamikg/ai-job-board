export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: "linear-gradient(135deg, #1d4ed8, #2563eb 62%, #7c3aed)",
        border: "1px solid rgba(255,255,255,0.42)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 900, color: "#ffffff", letterSpacing: 0,
        boxShadow: "0 12px 26px rgba(31,82,220,0.28), inset 0 1px 0 rgba(255,255,255,0.32)"
      }}>AR</div>
      <span className="logo-text" style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontWeight: 800,
        fontSize: 20,
        color: "#1d4ed8",
        letterSpacing: 0,
        textTransform: "none",
      }}>
        AI Robotics Job.com
      </span>
    </div>
  );
}
