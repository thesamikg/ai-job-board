export default function Badge({ children, color = "#7c3aed", style = {} }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 99, padding: "3px 9px", fontSize: 10, fontWeight: 800,
      letterSpacing: 0.4, textTransform: "uppercase", lineHeight: 1.1, ...style
    }}>{children}</span>
  );
}
