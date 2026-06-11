const FIcon = window.TwicoIcon;
const { Card } = window.TwicoUiDesignSystem_f2f16a;

function Features() {
  const features = [
    { icon: "Palette", title: "Fully themeable", body: "Every color, radius, and shadow is a CSS variable. Remap the brand scale to reskin instantly." },
    { icon: "Moon", title: "Dark mode built in", body: "A single class flips the entire system. Semantic tokens handle the rest, automatically." },
    { icon: "Sparkles", title: "Lively motion", body: "Spring entrances, click ripples, and smooth transitions — tuned, and reduced-motion aware." },
    { icon: "Smartphone", title: "Responsive", body: "Designed mobile-first and tested across phone, tablet, and desktop breakpoints." },
    { icon: "Accessibility", title: "Accessible", body: "Keyboard navigation, focus rings, ARIA roles, and semantic markup come standard." },
    { icon: "Heart", title: "Free & open source", body: "MIT licensed and free forever — no tiers, no paywalls, no attribution required." },
  ];
  return (
    <section className="twui-container" style={{ paddingBottom: 80 }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>Everything you need</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 17, marginTop: 8 }}>Thoughtful defaults that scale from prototype to production.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {features.map((f) => (
          <Card key={f.title} variant="outline" interactive padding="lg">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ width: 46, height: 46, borderRadius: "var(--radius-lg)", background: "var(--color-primary-subtle)", color: "var(--color-primary-subtle-fg)", display: "grid", placeItems: "center" }}>
                <FIcon name={f.icon} size={23} />
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "var(--color-text)" }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--color-text-muted)", lineHeight: 1.55 }}>{f.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

window.Features = Features;
