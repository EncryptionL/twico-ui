import React from "react";
import { Stack, Heading, IconButton, useCopyToClipboard } from "twico-ui";

const LinkIcon = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
  </svg>
);
const CheckIcon = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// A heading with a copy-link button that reveals on hover/focus. `section` is the
// in-page anchor id; without it the link points at the component itself.
export default function AnchorHeading({ level = 2, slug, section, children }) {
  const { copied, copy } = useCopyToClipboard();
  const [show, setShow] = React.useState(false);

  const onCopy = () => {
    const base = `${window.location.origin}${window.location.pathname}#/components/${slug}`;
    copy(section ? `${base}?s=${section}` : base);
  };

  return (
    <Stack
      direction="row"
      align="center"
      gap={1}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={{ scrollMarginTop: 84 }}
    >
      <Heading level={level} id={section || undefined}>{children}</Heading>
      <IconButton
        size="sm"
        variant="ghost"
        aria-label={copied ? "Link copied" : "Copy link"}
        icon={copied ? CheckIcon : LinkIcon}
        onClick={onCopy}
        style={{ opacity: show || copied ? 1 : 0, transition: "opacity 0.15s ease", color: copied ? "var(--color-success)" : "var(--color-text-subtle)" }}
      />
    </Stack>
  );
}
