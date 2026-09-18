interface FilterGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function FilterGroup({ label, options, selected, onChange }: FilterGroupProps) {
  const allSelected = selected.length === options.length;

  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </span>
        <button
          onClick={() => onChange(allSelected ? [] : options)}
          style={{
            background: "none",
            border: "none",
            color: "var(--brand-copper)",
            fontSize: 11,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {allSelected ? "Aucun" : "Tous"}
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              title={opt}
              style={{
                border: `1px solid ${active ? "var(--brand-copper)" : "var(--border)"}`,
                background: active ? "rgba(197, 120, 45, 0.18)" : "transparent",
                color: active ? "var(--brand-cream)" : "var(--text-muted)",
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 12,
                cursor: "pointer",
                maxWidth: 160,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
