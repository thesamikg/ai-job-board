export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: -1,
        boxShadow: "0 0 16px rgba(37,99,235,0.35)"
      }}>N</div>
      <span className="logo-text" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700, fontSize: 18, color: "#0f172a", letterSpacing: -0.2 }}>
        NeuralHire
      </span>
    </div>
  );
}
