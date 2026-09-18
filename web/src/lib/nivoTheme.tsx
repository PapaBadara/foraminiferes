// Resolved hex values (Nivo renders to SVG/canvas and cannot read CSS custom
// properties), kept in sync with theme.css.
const textSecondary = "#b3a99b";
const textMuted = "#746b5f";
const gridline = "#2a251e";
const surface2 = "#1e1a14";

export const nivoTheme = {
  background: "transparent",
  text: { fill: textSecondary, fontSize: 12, fontFamily: "Inter, system-ui, sans-serif" },
  axis: {
    domain: { line: { stroke: gridline } },
    ticks: { line: { stroke: gridline }, text: { fill: textMuted, fontSize: 11 } },
    legend: { text: { fill: textSecondary, fontSize: 12 } },
  },
  grid: { line: { stroke: gridline, strokeWidth: 1 } },
  legends: { text: { fill: textSecondary, fontSize: 11 } },
  tooltip: {
    container: {
      background: surface2,
      color: "#ece6de",
      fontSize: 12,
      borderRadius: 8,
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    },
  },
  labels: { text: { fill: "#17140f" } },
};

export function chartTooltip({ id, value, color, indexValue }: any) {
  return (
    <div
      style={{
        background: surface2,
        color: "#ece6de",
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
      <strong>{id}</strong>
      {indexValue !== undefined && <span>· {indexValue}</span>}
      <span>: {value}</span>
    </div>
  );
}
