export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div style={{
        width: 42, height: 42, borderRadius: 999,
        background: "#1F52DC",
        border: "1px solid #1F52DC",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 900, color: "#ffffff", letterSpacing: -0.5,
        boxShadow: "0 10px 24px rgba(31,82,220,0.22)"
      }}>AR</div>
      <span className="logo-text" style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontWeight: 800,
        fontSize: 20,
        color: "#1F52DC",
        letterSpacing: -0.5,
        textTransform: "none",
      }}>
        AI Robotics Job.com
      </span>
    </div>
  );
}
