"use client"

export function SectionLabel({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: "32px",
      }}
    >
      {label}
    </p>
  )
}

export function MediaGrid({
  children,
  columns = "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
}: {
  children: React.ReactNode
  columns?: string
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
        gridTemplateColumns: columns,
      }}
    >
      {children}
    </div>
  )
}

export function MediaCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  )
}
