export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12,
        background: "linear-gradient(135deg, #0f172a, #2563eb)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: -0.4,
        boxShadow: "0 12px 28px rgba(37,99,235,0.22)"
      }}>AR</div>
      <span className="logo-text" style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontWeight: 800,
        fontSize: 20,
        color: "#0f172a",
        letterSpacing: -0.6,
        textTransform: "none",
      }}>
        AIRoboticsjob
      </span>
    </div>
  );
}
