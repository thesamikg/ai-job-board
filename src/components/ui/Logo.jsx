export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: -1,
        boxShadow: "0 0 16px rgba(124,58,237,0.5)"
      }}>N</div>
      <span className="logo-text" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>
        NeuralHire
      </span>
    </div>
  );
}
