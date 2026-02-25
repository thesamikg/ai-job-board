export default function Badge({ children, color = "#7c3aed", style = {} }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700,
      letterSpacing: 0.5, textTransform: "uppercase", ...style
    }}>{children}</span>
  );
}
