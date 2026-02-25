const SKILL_COLORS = {
  Python: "#3b82f6", PyTorch: "#ef4444", ROS: "#10b981", LLM: "#8b5cf6",
  "Computer Vision": "#f59e0b", "C++": "#6b7280", CUDA: "#22d3ee", JAX: "#a78bfa"
};

export default function SkillTag({ skill }) {
  const color = SKILL_COLORS[skill] || "#94a3b8";
  return (
    <span style={{
      background: color + "18", color: color + "dd",
      border: `1px solid ${color}33`,
      borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600,
    }}>{skill}</span>
  );
}
