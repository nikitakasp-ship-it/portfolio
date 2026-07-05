import Link from "next/link"

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        background: "var(--background)",
        color: "var(--text-primary)",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(5rem, 15vw, 10rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "var(--text-primary)",
        }}
      >
        404
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", textAlign: "center" }}>
        Page not found
      </p>
      <Link
        href="/"
        style={{
          color: "var(--text-muted)",
          fontSize: "0.875rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "2px",
        }}
      >
        Back to home
      </Link>
    </main>
  )
}
