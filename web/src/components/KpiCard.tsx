import type { ReactNode } from "react";

export function KpiCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--surface-2), var(--surface-3))",
        borderRadius: "var(--radius-lg)",
        padding: "18px 22px",
        borderLeft: "4px solid var(--brand-copper)",
      }}
    >
      <h2 style={{ fontSize: "2rem", color: "var(--brand-cream)", margin: 0 }}>{value}</h2>
      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{label}</p>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "var(--brand-cream)",
        borderBottom: "2px solid var(--brand-copper)",
        paddingBottom: 6,
        marginBottom: 14,
        marginTop: 0,
      }}
    >
      {children}
    </p>
  );
}
