const { Button, Badge } = window.TwicoUiDesignSystem_f2f16a;
const HeroIcon = window.TwicoIcon;

function InstallCmd() {
  const [copied, setCopied] = React.useState(false);
  const cmd = "npm i twico-ui";
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer",
        padding: "10px 12px 10px 16px", borderRadius: "var(--radius-md)",
        background: "var(--color-surface)", border: "1px solid var(--color-border)",
        fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-text)", boxShadow: "var(--shadow-sm)",
      }}>
      <span style={{ color: "var(--color-text-subtle)" }}>$</span>
      <span>npm i <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>twico-ui</span></span>
      <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: "var(--radius-sm)", background: "var(--color-surface-sunken)", color: copied ? "var(--color-success)" : "var(--color-text-subtle)" }}>
        <HeroIcon name={copied ? "Check" : "Copy"} size={15} />
      </span>
    </button>
  );
}

function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
        backgroundSize: "26px 26px", opacity: 0.5,
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
      }} />
      <div className="twui-container" style={{ position: "relative", paddingTop: 92, paddingBottom: 64, textAlign: "center" }}>
        <div style={{ display: "inline-flex", marginBottom: 22 }}>
          <Badge tone="primary" variant="soft" size="lg" dot>v2.0 — now with 24 components</Badge>
        </div>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04, margin: "0 auto", maxWidth: 820 }}>
          The free React + Tailwind<br />component library
        </h1>
        <p style={{ fontSize: 19, color: "var(--color-text-muted)", maxWidth: 600, margin: "20px auto 0", lineHeight: 1.55 }}>
          Beautifully crafted, fully themeable components with dark mode, motion, and accessibility built in. Open source and free forever.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
          <Button size="lg" rightIcon={<HeroIcon name="ArrowRight" size={19} />}>Get started</Button>
          <Button size="lg" variant="outline" leftIcon={<HeroIcon name="Github" size={18} />}>Star on GitHub</Button>
        </div>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "center" }}>
          <InstallCmd />
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
