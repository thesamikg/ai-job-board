export default function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 2000,
      background: "#1e293b", border: "1px solid rgba(124,58,237,0.4)",
      borderRadius: 12, padding: "12px 20px", color: "#e2e8f0", fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0, transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)"
    }}>{message}</div>
  );
}
