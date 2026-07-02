const SKILL_COLORS = {
  Python: "#3b82f6", PyTorch: "#ef4444", ROS: "#10b981", LLM: "#8b5cf6",
  "Computer Vision": "#f59e0b", "C++": "#6b7280", CUDA: "#22d3ee", JAX: "#a78bfa"
};

export default function SkillTag({ skill }) {
  const color = SKILL_COLORS[skill] || "#94a3b8";
  return (
    <span style={{
      background: color + "14", color: color + "ee",
      border: `1px solid ${color}2e`,
      borderRadius: 999, padding: "4px 9px", fontSize: 11, fontWeight: 700,
      lineHeight: 1.1,
    }}>{skill}</span>
  );
}
