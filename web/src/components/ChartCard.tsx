import type { ReactNode } from "react";

export function ChartCard({ height = 320, children }: { height?: number; children: ReactNode }) {
  return (
    <div
      style={{
        height,
        background: "var(--surface-1)",
        borderRadius: 12,
        border: "1px solid var(--border)",
        padding: "8px 8px 0",
      }}
    >
      {children}
    </div>
  );
}
