const { IconButton, Button } = window.TwicoUiDesignSystem_f2f16a;
const Icon = window.TwicoIcon;

function Nav({ dark, onToggleDark }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const root = document.querySelector(".twui-app");
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Docs", "Components", "Themes", "Templates"];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "color-mix(in srgb, var(--color-bg) 82%, transparent)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
      transition: "border-color .2s",
    }}>
      <div className="twui-container" style={{ height: 68, display: "flex", alignItems: "center", gap: 28 }}>
        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
          <span style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", background: "var(--color-primary)", color: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--shadow-brand)" }}>
            <Icon name="Blocks" size={20} />
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-text)" }}>
            twico<span style={{ color: "var(--color-primary)" }}>UI</span>
          </span>
        </a>

        <nav style={{ display: "flex", gap: 4, marginLeft: 8 }} className="twui-navlinks">
          {links.map((l) => (
            <a key={l} href="#" style={{
              padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 600,
              color: "var(--color-text-muted)", textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-sunken)"; e.currentTarget.style.color = "var(--color-text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
            >{l}</a>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--color-text-subtle)" }}>
            <Icon name="Star" size={15} /> 4.2k
          </span>
          <IconButton aria-label="GitHub" variant="ghost" icon={<Icon name="Github" />} />
          <IconButton aria-label="Toggle dark mode" variant="ghost" onClick={onToggleDark} icon={<Icon name={dark ? "Sun" : "Moon"} />} />
          <Button size="sm" leftIcon={<Icon name="Rocket" size={15} />}>Get started</Button>
        </div>
      </div>
    </header>
  );
}

window.Nav = Nav;
