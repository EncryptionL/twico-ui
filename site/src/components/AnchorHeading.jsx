import React from "react";
import { Stack, Heading, IconButton, useCopyToClipboard } from "twico-ui";
import { Link2Icon, CheckIcon } from "twico-ui/icons";

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
        icon={copied ? <CheckIcon size={15} /> : <Link2Icon size={15} />}
        onClick={onCopy}
        style={{ opacity: show || copied ? 1 : 0, transition: "opacity 0.15s ease", color: copied ? "var(--color-success)" : "var(--color-text-subtle)" }}
      />
    </Stack>
  );
}
