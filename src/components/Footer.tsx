export default function Footer() {
  return (
    <footer
      style={{
        padding: "32px 40px",
        borderTop: "1px solid var(--border)",
        background: "var(--background)",
      }}
    >
      <div
        className="content-container flex items-center justify-between"
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          &copy; 2026 Nikita Kasperovich
        </p>
      </div>
    </footer>
  )
}
