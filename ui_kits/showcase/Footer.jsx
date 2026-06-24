const FootIcon = window.TwicoIcon;
const { Button } = window.TwicoUiDesignSystem_f2f16a;

function Footer() {
  const cols = [
    { title: "Product", links: ["Components", "Themes", "Templates", "Changelog"] },
    { title: "Docs", links: ["Getting started", "Theming", "Dark mode", "Accessibility"] },
    { title: "Community", links: ["GitHub", "Discord", "X / Twitter", "Contribute"] },
  ];
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      {/* CTA band */}
      <div className="twui-container" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div style={{
          borderRadius: "var(--radius-2xl)", padding: "44px 40px", textAlign: "center",
          background: "linear-gradient(135deg, var(--color-primary), var(--brand-700))", color: "#fff",
          boxShadow: "var(--shadow-brand)",
        }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>Start building with Twico UI</h2>
          <p style={{ opacity: 0.9, fontSize: 16, margin: "10px 0 22px" }}>Free, open source, and ready for your next project.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button size="lg" variant="solid" onClick={() => {}} className="twui-cta-light"
              style={{ background: "#fff", color: "var(--color-primary)" }}
              leftIcon={<FootIcon name="Rocket" size={18} />}>Get started free</Button>
          </div>
        </div>
      </div>
      <div className="twui-container" style={{ paddingBottom: 40, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 28 }}>
        <div>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-primary)", color: "#fff", display: "grid", placeItems: "center" }}>
              <FootIcon name="Blocks" size={18} />
            </span>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-text)" }}>
              Twico <span style={{ color: "var(--color-primary)" }}>UI</span>
            </span>
          </a>
          <p style={{ color: "var(--color-text-subtle)", fontSize: 13.5, marginTop: 14, maxWidth: 240, lineHeight: 1.55 }}>
            The free React + Tailwind component library. MIT licensed.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-subtle)", marginBottom: 12 }}>{c.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {c.links.map((l) => (
                <a key={l} href="#" style={{ fontSize: 14, color: "var(--color-text-muted)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--color-divider)" }}>
        <div className="twui-container" style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "var(--color-text-subtle)" }}>© 2026 Twico UI. Released under the MIT License.</span>
          <span style={{ display: "flex", gap: 14, color: "var(--color-text-subtle)" }}>
            <FootIcon name="Github" size={18} /><FootIcon name="Twitter" size={18} /><FootIcon name="Slack" size={18} />
          </span>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
