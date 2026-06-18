import React from "react";
import { Card, Button } from "twico-ui";

const variations = [
  {
    title: "Variants",
    description: "Three surface styles: elevated (shadow), outline (border), and soft (sunken).",
    code: `<Card variant="elevated" title="Elevated">Raised with a shadow.</Card>
<Card variant="outline" title="Outline">Bordered, flat surface.</Card>
<Card variant="soft" title="Soft">Sunken background tint.</Card>`,
    render: () => (
      <>
        <div style={{ width: 220 }}>
          <Card variant="elevated" title="Elevated">Raised with a shadow.</Card>
        </div>
        <div style={{ width: 220 }}>
          <Card variant="outline" title="Outline">Bordered, flat surface.</Card>
        </div>
        <div style={{ width: 220 }}>
          <Card variant="soft" title="Soft">Sunken background tint.</Card>
        </div>
      </>
    ),
  },
  {
    title: "Header, body & footer",
    description: "A title and subtitle in the header, with action buttons in the footer.",
    code: `<Card
  title="Monthly revenue"
  subtitle="June 2026"
  footer={
    <>
      <Button size="sm">View report</Button>
      <Button size="sm" variant="ghost">Dismiss</Button>
    </>
  }
>
  Revenue grew 18% month over month.
</Card>`,
    render: () => (
      <div style={{ width: 320, maxWidth: "100%" }}>
        <Card
          title="Monthly revenue"
          subtitle="June 2026"
          footer={
            <>
              <Button size="sm">View report</Button>
              <Button size="sm" variant="ghost">Dismiss</Button>
            </>
          }
        >
          Revenue grew 18% month over month.
        </Card>
      </div>
    ),
  },
  {
    title: "Padding",
    description: "Control inner spacing — or remove it with none for edge-to-edge content.",
    code: `<Card padding="lg" title="Large padding">Roomy interior.</Card>
<Card padding="md" title="Medium padding">The default.</Card>
<Card variant="outline" padding="none">
  <div style={{ padding: "12px 16px" }}>No padding — manage it yourself.</div>
</Card>`,
    render: () => (
      <>
        <div style={{ width: 220 }}>
          <Card padding="lg" title="Large padding">Roomy interior.</Card>
        </div>
        <div style={{ width: 220 }}>
          <Card padding="md" title="Medium padding">The default.</Card>
        </div>
        <div style={{ width: 220 }}>
          <Card variant="outline" padding="none">
            <div style={{ padding: "12px 16px" }}>No padding — manage it yourself.</div>
          </Card>
        </div>
      </>
    ),
  },
  {
    title: "Interactive",
    description: "Hover to lift — pairs well with the outline variant for clickable cards.",
    code: `<Card variant="outline" interactive title="Hover me">
  This card lifts on hover and shows a pointer cursor.
</Card>`,
    render: () => (
      <div style={{ width: 280, maxWidth: "100%" }}>
        <Card variant="outline" interactive title="Hover me">
          This card lifts on hover and shows a pointer cursor.
        </Card>
      </div>
    ),
  },
  {
    title: "All props",
    description: "Every Card-specific prop in one place — title and subtitle render the header, footer holds actions, variant/padding set the look, interactive adds the hover-lift, and fullHeight stretches the card to fill its grid/flex cell. children is the body content.",
    code: `<Card
  title="Monthly revenue"          // header title (ReactNode)
  subtitle="June 2026"             // muted subtitle under the title
  variant="outline"               // elevated | outline | soft
  padding="lg"                    // none | md | lg
  interactive={true}              // hover-lift + pointer cursor
  fullHeight={false}              // set true to fill a grid/flex cell (height: 100%)
  footer={
    <>
      <Button size="sm">View report</Button>
      <Button size="sm" variant="ghost">Dismiss</Button>
    </>
  }
>
  Revenue grew 18% month over month. {/* children = body */}
</Card>`,
    render: () => (
      <div style={{ width: 320, maxWidth: "100%" }}>
        <Card
          title="Monthly revenue"
          subtitle="June 2026"
          variant="outline"
          padding="lg"
          interactive={true}
          fullHeight={false}
          footer={
            <>
              <Button size="sm">View report</Button>
              <Button size="sm" variant="ghost">Dismiss</Button>
            </>
          }
        >
          Revenue grew 18% month over month.
        </Card>
      </div>
    ),
  },
];

export default variations;
