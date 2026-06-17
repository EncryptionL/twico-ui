// AUTO-GENERATED — gen-docs.mjs (component reference) then enrich-props.mjs (inherited DOM props). Do not edit by hand.
export const components = [
  {
    "name": "Accordion",
    "slug": "accordion",
    "group": "Navigation",
    "summary": "Accordion renders vertically stacked, expandable disclosure panels with a smooth open/close height animation. Use it to organize content like FAQs or settings into collapsible sections, optionally allowing several panels open at once.",
    "importName": "Accordion",
    "propsRows": [
      {
        "prop": "items",
        "type": "AccordionItem[]",
        "required": true,
        "default": "—",
        "description": "The array of disclosure panels to render, each an { value, label, content, icon? } object keyed by its unique value."
      },
      {
        "prop": "multiple",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, lets several panels stay open simultaneously instead of collapsing others as each new panel expands."
      },
      {
        "prop": "defaultOpen",
        "type": "string[]",
        "required": false,
        "default": "[]",
        "description": "The list of item values that should start expanded on first render, useful for surfacing key sections by default."
      },
      {
        "prop": "open",
        "type": "string[]",
        "required": false,
        "default": "—",
        "description": "Controlled open panel values; pair with onOpenChange. When set, internal state is bypassed and defaultOpen is ignored."
      },
      {
        "prop": "onOpenChange",
        "type": "(values: string[]) => void",
        "required": false,
        "default": "—",
        "description": "Called with the next open values whenever a panel trigger is toggled (fires in both controlled and uncontrolled modes)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Accordion } from \"twico-ui\";\n\n<Accordion\n  multiple\n  defaultOpen={[\"a\"]}\n  items={[\n    { value: \"a\", label: \"Is Twico UI free?\", content: \"Yes — MIT licensed, forever.\" },\n    { value: \"b\", label: \"Does it support dark mode?\", content: \"Out of the box.\" },\n  ]}\n/>",
    "tagline": "Expandable, stacked disclosure panels"
  },
  {
    "name": "Alert",
    "slug": "alert",
    "group": "Feedback",
    "summary": "Alert is an inline message banner with four semantic tones (info, success, warning, danger), an optional bold title, a default or custom icon, and an optional dismiss button. Use it to surface contextual feedback inline within a page, such as success confirmations, warnings, or errors.",
    "importName": "Alert",
    "propsRows": [
      {
        "prop": "tone",
        "type": "\"info\" | \"success\" | \"warning\" | \"danger\"",
        "required": false,
        "default": "\"info\"",
        "description": "Sets the semantic color and default icon, choosing between info, success, warning, or danger to match the message intent."
      },
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a bold heading line above the body, useful for summarizing the alert before its supporting detail."
      },
      {
        "prop": "icon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Overrides the default tone icon with your own node when you need a more specific or branded visual cue."
      },
      {
        "prop": "onClose",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "When provided, shows a dismiss button and runs this callback so the alert can be closed by the user."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The main body content of the alert, typically the descriptive message shown beneath the optional title."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Alert } from \"twico-ui\";\n\n<Alert tone=\"success\" title=\"Saved\" onClose={dismiss}>\n  Your changes are live.\n</Alert>\n\n<Alert tone=\"warning\">\n  Your trial ends in 3 days.\n</Alert>",
    "tagline": "Inline message banner with semantic tones"
  },
  {
    "name": "Avatar",
    "slug": "avatar",
    "group": "Data display",
    "summary": "Avatar displays a user's image with a graceful fallback to initials and an optional presence dot. Use it to represent people or entities in lists, headers, comments, and profile menus.",
    "importName": "Avatar",
    "propsRows": [
      {
        "prop": "src",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "The image URL to display, gracefully falling back to derived initials when it is missing or fails to load."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "The person's full name, used to derive the displayed initials and the avatar's accessible label."
      },
      {
        "prop": "size",
        "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the overall avatar dimensions from xs to xl to suit lists, headers, comments, or profile menus."
      },
      {
        "prop": "square",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, renders the avatar as a rounded square instead of the default circle for a different visual style."
      },
      {
        "prop": "status",
        "type": "\"online\" | \"busy\" | \"away\" | \"offline\"",
        "required": false,
        "default": "—",
        "description": "Shows a small presence dot indicating online, busy, away, or offline state on the avatar."
      },
      {
        "prop": "ring",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, adds a brand-colored ring around the avatar to emphasize or highlight the user."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Avatar } from \"twico-ui\";\n\n<Avatar src=\"/u/jane.jpg\" name=\"Jane Doe\" />\n<Avatar name=\"Sam Lee\" status=\"online\" />\n<Avatar name=\"Twico\" size=\"lg\" square ring />",
    "tagline": "User image with initials fallback and presence dot"
  },
  {
    "name": "AvatarMenu",
    "slug": "avatarmenu",
    "group": "Data display",
    "summary": "AvatarMenu is a user avatar that opens a portaled account dropdown with a rich header (avatar, name, email) above the menu items. Use it for the classic account menu — avatar-only in a navbar, or with name/email/chevron in a sidebar.",
    "importName": "AvatarMenu",
    "propsRows": [
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "The user's full name, driving the derived initials and the rich header shown atop the dropdown."
      },
      {
        "prop": "src",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "The avatar image URL shown in both the trigger and the dropdown header, falling back to initials when absent."
      },
      {
        "prop": "email",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "The email address shown in the dropdown header, and in the trigger when showName is enabled."
      },
      {
        "prop": "subtitle",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Overrides the secondary line in the header and trigger, defaulting to the email when not provided."
      },
      {
        "prop": "status",
        "type": "\"online\" | \"busy\" | \"away\" | \"offline\"",
        "required": false,
        "default": "—",
        "description": "Shows a presence dot indicating online, busy, away, or offline state on the trigger avatar."
      },
      {
        "prop": "size",
        "type": "\"xs\" | \"sm\" | \"md\" | \"lg\" | \"xl\"",
        "required": false,
        "default": "\"sm\"",
        "description": "Sets the trigger avatar dimensions from xs to xl to fit a compact navbar or a roomier sidebar."
      },
      {
        "prop": "items",
        "type": "MenuItemDef[]",
        "required": true,
        "default": "—",
        "description": "The account menu entries to render in the dropdown, using the same MenuItemDef shape as Menu's items."
      },
      {
        "prop": "showName",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, displays the name and email beside the avatar in the trigger instead of showing the avatar alone."
      },
      {
        "prop": "showChevron",
        "type": "boolean",
        "required": false,
        "default": "showName",
        "description": "When true, shows a chevron in the trigger to hint at the dropdown, defaulting to the showName value."
      },
      {
        "prop": "align",
        "type": "\"start\" | \"end\"",
        "required": false,
        "default": "\"end\"",
        "description": "Aligns the dropdown's start or end edge to the trigger, defaulting to end for right-anchored account menus."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { AvatarMenu } from \"twico-ui\";\n\n<AvatarMenu\n  name=\"Ada Park\"\n  email=\"ada@twico.dev\"\n  status=\"online\"\n  showName\n  items={[\n    { label: \"Profile\", onClick: openProfile },\n    { label: \"Settings\", shortcut: \"⌘,\", onClick: openSettings },\n    { separator: true },\n    { label: \"Sign out\", danger: true, onClick: signOut },\n  ]}\n/>",
    "tagline": "Avatar that opens an account dropdown"
  },
  {
    "name": "Badge",
    "slug": "badge",
    "group": "Data display",
    "summary": "Badge is a compact status label or count chip available in six semantic tones and three fill styles. Use it to flag state (active, pending, draft), categories, or small counts inline next to text, list items, or table rows.",
    "importName": "Badge",
    "propsRows": [
      {
        "prop": "tone",
        "type": "\"primary\" | \"success\" | \"warning\" | \"danger\" | \"info\" | \"neutral\"",
        "required": false,
        "default": "\"primary\"",
        "description": "Sets the semantic color from six options like success or danger to convey the badge's state or category."
      },
      {
        "prop": "variant",
        "type": "\"soft\" | \"solid\" | \"outline\"",
        "required": false,
        "default": "\"soft\"",
        "description": "Chooses the fill style between soft, solid, and outline to control how prominently the badge reads."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Adds a new \"sm\" option (smaller font padding/height than md) to the existing size scale; md/lg unchanged and md remains the default."
      },
      {
        "prop": "dot",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, shows a small leading status dot before the label to reinforce the badge's state."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The badge content, typically a short status label or a small count shown inline next to text."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Badge } from \"twico-ui\";\n\n<Badge tone=\"success\" dot>Active</Badge>\n<Badge tone=\"warning\" variant=\"solid\">Pending</Badge>\n<Badge tone=\"neutral\" variant=\"outline\">Draft</Badge>\n<Badge tone=\"info\" size=\"lg\">12 new</Badge>",
    "tagline": "Compact status label or count chip"
  },
  {
    "name": "Box",
    "slug": "box",
    "group": "Layout",
    "importName": "Box",
    "summary": "Generic, token-styled box — the building block for non-flex layout (padding, margin, background, border, radius, shadow) without writing CSS.",
    "propsRows": [
      {
        "prop": "p, px, py, pt, pr, pb, pl",
        "type": "number | string",
        "required": false,
        "default": "—",
        "description": "Sets inner padding on the matching side(s), accepting a spacing-scale step (number) or any raw CSS length string."
      },
      {
        "prop": "m, mx, my, mt, mr, mb, ml",
        "type": "number | string",
        "required": false,
        "default": "—",
        "description": "Sets outer margin on the matching side(s), accepting a spacing-scale step (number) or any raw CSS length string."
      },
      {
        "prop": "bg",
        "type": "\"surface\" | \"surface-raised\" | \"surface-sunken\" | \"bg\" | string",
        "required": false,
        "default": "—",
        "description": "Sets the background to a surface token like \"surface\" or \"surface-raised\", or to any custom CSS color value."
      },
      {
        "prop": "border",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, draws a 1px border using the theme's border token, useful for visually separating the box from its surroundings."
      },
      {
        "prop": "radius",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Applies a border-radius from the radius token scale by suffix (e.g. \"lg\") to round the box's corners."
      },
      {
        "prop": "shadow",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Applies an elevation box-shadow from the shadow token scale by suffix (e.g. \"md\") to lift the box off the page."
      },
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "\"div\"",
        "description": "Sets which element or tag the box renders as, defaulting to \"div\" but accepting any semantic HTML element type."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Box } from \"twico-ui\";\n\n<Box p={4} bg=\"surface\" border radius=\"lg\" shadow=\"sm\">\n  Padded, bordered surface.\n</Box>",
    "tagline": "Token-styled box for non-flex layout"
  },
  {
    "name": "Breadcrumb",
    "slug": "breadcrumb",
    "group": "Navigation",
    "summary": "Breadcrumb renders a navigation trail to the current page, with optional per-item icons and a custom separator. Use it to show hierarchy and let users jump back up the path; it can collapse the middle of long trails into a \"…\" that expands on click.",
    "importName": "Breadcrumb",
    "propsRows": [
      {
        "prop": "items",
        "type": "BreadcrumbItem[]",
        "required": true,
        "default": "—",
        "description": "The ordered array of trail entries ({ label, href?, icon?, onClick? }), where the last item renders as the current, non-linked page."
      },
      {
        "prop": "separator",
        "type": "React.ReactNode",
        "required": false,
        "default": "<ChevronSep />",
        "description": "The node drawn between adjacent items, defaulting to a chevron but replaceable with any custom divider such as a slash."
      },
      {
        "prop": "maxItems",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Collapses the middle of the trail into an expandable ellipsis once the item count exceeds this number, with 0 disabling collapsing."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Breadcrumb } from \"twico-ui\";\n\n<Breadcrumb\n  items={[\n    { label: \"Home\", href: \"/\" },\n    { label: \"Projects\", href: \"/projects\" },\n    { label: \"Twico UI\" },\n  ]}\n/>\n\n<Breadcrumb maxItems={3} items={longTrail} />",
    "tagline": "Navigation trail to the current page"
  },
  {
    "name": "Button",
    "slug": "button",
    "group": "Buttons & actions",
    "summary": "Button is a primary action button with solid, soft, outline, ghost, and danger variants, three sizes, loading state, optional left/right icons, and a click ripple effect. Use it for primary and secondary actions throughout the UI.",
    "importName": "Button",
    "propsRows": [
      {
        "prop": "variant",
        "type": "\"solid\" | \"soft\" | \"outline\" | \"ghost\"",
        "required": false,
        "default": "\"solid\"",
        "description": "Fill style: solid (primary CTA), soft (tinted), outline, or ghost. Cross with `tone` for color."
      },
      {
        "prop": "tone",
        "type": "\"primary\" | \"danger\"",
        "required": false,
        "default": "\"primary\"",
        "description": "Color/intent, orthogonal to variant — primary by default; tone=\"danger\" makes a destructive button in any variant."
      },
      {
        "prop": "size",
        "type": "\"xs\" | \"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Adds a new \"xs\" size (~26px tall, smaller than \"sm\") to the existing union; sm/md/lg are unchanged. xs height is composed locally from space tokens (no global control-h-xs token)."
      },
      {
        "prop": "leftIcon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an icon node before the label, commonly used to reinforce the action with a leading visual cue."
      },
      {
        "prop": "rightIcon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an icon node after the label, often a chevron or arrow signaling navigation or progression."
      },
      {
        "prop": "loading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, swaps in a spinner and disables interaction to signal an in-flight action and prevent duplicate clicks."
      },
      {
        "prop": "fullWidth",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Stretches the button to fill its container's width, handy for full-width CTAs and stacked mobile action buttons."
      },
      {
        "prop": "as",
        "type": "\"button\" | \"a\"",
        "required": false,
        "default": "\"button\"",
        "description": "Chooses whether to render a native \"button\" or an \"a\" anchor, letting the button act as a real link when needed."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The label content rendered inside the button, typically text but accepting any inline node alongside the icons."
      },
      {
        "prop": "href",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Link destination — only used with as=\"a\"; scheme-sanitized (javascript:/data:/vbscript: render without href)."
      },
      {
        "prop": "target",
        "type": "React.HTMLAttributeAnchorTarget",
        "required": false,
        "default": "—",
        "description": "Anchor target — only used with as=\"a\" (e.g. \"_blank\")."
      },
      {
        "prop": "rel",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Anchor rel — only used with as=\"a\"; pair \"noopener noreferrer\" with target=\"_blank\"."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires on click/tap and on Enter or Space."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "type",
        "type": "\"button\" | \"submit\" | \"reset\"",
        "required": false,
        "default": "\"button\"",
        "description": "Native button type — use \"submit\" to submit a surrounding form."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "autoFocus",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Focus the element automatically when it mounts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.ButtonHTMLAttributes<HTMLButtonElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <button> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Button } from \"twico-ui\";\n\n<Button variant=\"solid\" size=\"md\" onClick={save}>Save changes</Button>\n<Button variant=\"soft\" leftIcon={<PlusIcon />}>Add item</Button>\n<Button variant=\"outline\">Cancel</Button>\n<Button variant=\"ghost\">Skip</Button>\n<Button tone=\"danger\" loading>Deleting…</Button>",
    "tagline": "Action button with five variants and loading state"
  },
  {
    "name": "Card",
    "slug": "card",
    "group": "Data display",
    "summary": "Card is a surface container for grouping related content, with an optional header (title/subtitle), body, and footer. Use it to present grouped information such as stats, summaries, or actions, optionally making it interactive with a hover-lift effect.",
    "importName": "Card",
    "propsRows": [
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a bold title in the card header, giving the grouped content a clear heading at the top."
      },
      {
        "prop": "subtitle",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a muted subtitle beneath the title to add supporting context or a brief secondary description."
      },
      {
        "prop": "footer",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders pinned footer content such as action buttons below the card body, separated from the main content."
      },
      {
        "prop": "variant",
        "type": "\"elevated\" | \"outline\" | \"soft\"",
        "required": false,
        "default": "\"elevated\"",
        "description": "Selects the surface treatment from elevated, outline, or soft to control how the card stands out from the page."
      },
      {
        "prop": "padding",
        "type": "\"none\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the card's inner padding to none, md, or lg, with none useful for edge-to-edge media or custom layouts."
      },
      {
        "prop": "interactive",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, adds a hover-lift effect and pointer cursor to signal the whole card is clickable."
      },
      {
        "prop": "fullHeight",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Stretches the card to fill its parent cell (height: 100%) so cards in a grid or flex row align to equal height."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The main body content of the card, rendered between the optional header and footer regions."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Card } from \"twico-ui\";\n\n<Card\n  title=\"Monthly revenue\"\n  subtitle=\"June 2026\"\n  footer={<Button size=\"sm\">View report</Button>}\n>\n  Revenue grew 18% month over month.\n</Card>\n\n<Card variant=\"outline\" interactive>\n  Hover me — I lift.\n</Card>",
    "tagline": "Surface container with header, body, and footer"
  },
  {
    "name": "Carousel",
    "slug": "carousel",
    "group": "Data display",
    "summary": "Carousel is a sliding one-slide-per-view component with prev/next arrows, dot indicators, optional looping, and optional autoplay that pauses on hover. Use it to showcase a sequence of images or content panels where each child is a single slide.",
    "importName": "Carousel",
    "propsRows": [
      {
        "prop": "showArrows",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "When true, displays prev/next arrow controls so users can step manually between slides in either direction."
      },
      {
        "prop": "showDots",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "When true, displays dot indicators beneath the slides showing position and letting users jump to a specific slide."
      },
      {
        "prop": "loop",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "When true, wraps navigation around the ends so advancing past the last slide returns to the first and vice versa."
      },
      {
        "prop": "autoPlay",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "When true, automatically advances slides on a timer, pausing while the pointer hovers over the carousel."
      },
      {
        "prop": "interval",
        "type": "number",
        "required": false,
        "default": "4000",
        "description": "Sets the delay in milliseconds between automatic slide advances when autoPlay is enabled, defaulting to 4000."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The slide elements, where each direct child is rendered as a single full-width slide in the carousel."
      },
      {
        "prop": "index",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Controlled active slide index — pair with onIndexChange."
      },
      {
        "prop": "defaultIndex",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Initial slide index when uncontrolled."
      },
      {
        "prop": "onIndexChange",
        "type": "(index: number) => void",
        "required": false,
        "default": "—",
        "description": "Fired when the active slide changes (arrows, dots, or autoplay)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Carousel } from \"twico-ui\";\n\n<Carousel autoPlay interval={5000}>\n  <img src=\"/a.jpg\" alt=\"\" />\n  <img src=\"/b.jpg\" alt=\"\" />\n  <div>Any slide content</div>\n</Carousel>",
    "tagline": "Sliding one-slide-per-view with arrows and dots"
  },
  {
    "name": "Chart",
    "slug": "chart",
    "group": "Data display",
    "summary": "A lightweight, dependency-free SVG chart that renders bar or line graphs (single or multi-series) with grid, axes, animated entrance, tooltips, and an optional legend. Use it to visualize small datasets like daily metrics or trends without pulling in a charting library.",
    "importName": "Chart",
    "propsRows": [
      {
        "prop": "type",
        "type": "\"bar\" | \"line\"",
        "required": false,
        "default": "\"bar\"",
        "description": "Selects the rendering style, drawing the data as grouped bars or as connected lines for trends over time."
      },
      {
        "prop": "data",
        "type": "ChartDatum[]",
        "required": true,
        "default": "—",
        "description": "Supplies the array of data points, each carrying a label plus one numeric field for every named series."
      },
      {
        "prop": "series",
        "type": "string[]",
        "required": false,
        "default": "[\"value\"]",
        "description": "Names the numeric fields to plot, where multiple keys yield grouped bars or multiple lines per data point."
      },
      {
        "prop": "height",
        "type": "number",
        "required": false,
        "default": "220",
        "description": "Sets the chart's pixel height, controlling its vertical footprint while it scales horizontally to its container."
      },
      {
        "prop": "showGrid",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Draws horizontal grid lines behind the data, on by default, to make values easier to read against the scale."
      },
      {
        "prop": "showAxis",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Renders axis tick marks and label text, enabled by default, so viewers can map plotted values to categories."
      },
      {
        "prop": "showLegend",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Displays a legend keying each series to its color, off by default and most useful when plotting multiple series."
      },
      {
        "prop": "valueFormat",
        "type": "(value: number) => string",
        "required": false,
        "default": "—",
        "description": "Formats raw numeric values into display strings for tooltips, letting you add units, separators, or currency symbols."
      },
      {
        "prop": "colors",
        "type": "string[]",
        "required": false,
        "default": "built-in token palette",
        "description": "Per-series colors (any CSS color), cycled when shorter than series."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Chart } from \"twico-ui\";\n\n<Chart\n  type=\"bar\"\n  data={[\n    { label: \"Mon\", value: 240 },\n    { label: \"Tue\", value: 310 },\n    { label: \"Wed\", value: 280 },\n  ]}\n  valueFormat={(v) => `$${v}`}\n/>\n\n<Chart\n  type=\"line\"\n  series={[\"signups\", \"active\"]}\n  showLegend\n  data={[\n    { label: \"Jan\", signups: 120, active: 80 },\n    { label: \"Feb\", signups: 180, active: 140 },\n  ]}\n/>",
    "tagline": "Dependency-free SVG bar and line charts"
  },
  {
    "name": "Checkbox",
    "slug": "checkbox",
    "group": "Inputs",
    "summary": "An accessible checkbox with an animated checkmark, optional label and description, and an indeterminate (mixed) state. Use it for binary on/off choices in forms, or as a \"select all\" control that can show a partially-selected dash.",
    "importName": "Checkbox",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders text or a node beside the box, serving as the clickable caption that describes what the checkbox toggles."
      },
      {
        "prop": "description",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows secondary helper text below the label to clarify the option's meaning or consequences without crowding it."
      },
      {
        "prop": "indeterminate",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Displays the mixed dash state instead of a check, ideal for a select-all that is only partially selected."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\"",
        "required": false,
        "default": "\"md\"",
        "description": "Adjusts the checkbox dimensions between sm and md to match the density of the surrounding form layout."
      },
      {
        "prop": "checked",
        "type": "boolean",
        "required": false,
        "default": "—",
        "description": "Drives the checked state in controlled mode, requiring an onChange handler to keep the input in sync."
      },
      {
        "prop": "defaultChecked",
        "type": "boolean",
        "required": false,
        "default": "—",
        "description": "Sets the initial checked state for uncontrolled usage, after which the input manages its own value internally."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Blocks interaction and dims the control when true, signaling the option is currently unavailable to the user."
      },
      {
        "prop": "onChange",
        "type": "React.ChangeEventHandler<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Fires on every toggle with the native change event, letting you read the new checked state and update state."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Sets the input's id used to associate the label, auto-generated when omitted so the click target stays connected."
      },
      {
        "prop": "className",
        "type": "string",
        "required": false,
        "default": "\"\"",
        "description": "Appends extra class names to the wrapping label element for custom spacing, alignment, or layout overrides."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message shown below the control; tints the box red and wires aria-invalid/aria-describedby."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required for native form validation."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Checkbox } from \"twico-ui\";\n\n<Checkbox label=\"Subscribe to updates\" defaultChecked />\n<Checkbox label=\"Select all\" indeterminate />\n<Checkbox\n  label=\"Notifications\"\n  description=\"Get email alerts for new activity\"\n/>\n<Checkbox label=\"Disabled option\" disabled />\n<Checkbox label=\"Compact\" size=\"sm\" />",
    "tagline": "Accessible checkbox with an indeterminate state"
  },
  {
    "name": "Code",
    "slug": "code",
    "group": "Typography",
    "importName": "Code",
    "summary": "Inline code with a mono font and a subtle token-styled surface — use it instead of a bare code tag.",
    "propsRows": [
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "\"code\"",
        "description": "Overrides the rendered element, defaulting to a code tag but allowing any tag when the semantics differ."
      },
      {
        "prop": "children",
        "type": "ReactNode",
        "required": false,
        "default": "—",
        "description": "Provides the inline code text or nodes shown in the mono font on the subtle token-styled surface."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Code, Text } from \"twico-ui\";\n\n<Text>Install with <Code>npm install twico-ui</Code>.</Text>",
    "tagline": "Inline code with a mono surface"
  },
  {
    "name": "ColorPicker",
    "slug": "colorpicker",
    "group": "Inputs",
    "summary": "ColorPicker is a popover-based color input featuring a saturation/value square, a hue slider, a hex text field, and preset swatches, with the value represented as a hex string. Use it when you need users to choose a color (e.g. a brand or theme color), either controlled via value/onChange or uncontrolled via defaultValue.",
    "importName": "ColorPicker",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an optional caption above the trigger to describe which color the picker controls, such as a brand color."
      },
      {
        "prop": "value",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Sets the selected hex color in controlled mode, pairing with onChange to keep the displayed color in sync."
      },
      {
        "prop": "defaultValue",
        "type": "string",
        "required": false,
        "default": "\"#6366F1\"",
        "description": "Provides the initial hex color for uncontrolled usage, after which the picker tracks selection internally."
      },
      {
        "prop": "presets",
        "type": "string[]",
        "required": false,
        "default": "8 default swatches (e.g. #6366F1, #0EA5E9, #14B8A6, ...)",
        "description": "Lists hex swatch colors shown below the picker for quick one-click selection of common or brand-approved colors."
      },
      {
        "prop": "onChange",
        "type": "(hex: string) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the new hex string whenever the user adjusts saturation, hue, the text field, or picks a preset."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disable all interaction (the popover cannot be opened)."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Helper text shown below when there is no error."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message — turns the field red and replaces the hint."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required (adds an asterisk to the label)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { ColorPicker } from \"twico-ui\";\n\n// Controlled\nconst [color, setColor] = React.useState(\"#6366F1\");\n<ColorPicker label=\"Brand color\" value={color} onChange={setColor} />\n\n// Uncontrolled with custom presets\n<ColorPicker\n  defaultValue=\"#14B8A6\"\n  presets={[\"#6366F1\", \"#14B8A6\", \"#F43F5E\"]}\n/>",
    "tagline": "Popover color input with hue and swatches"
  },
  {
    "name": "Combobox",
    "slug": "combobox",
    "group": "Inputs",
    "summary": "Combobox is a searchable single-select dropdown (MUI-Autocomplete style) where you type directly in the field to filter options, with support for grouped options and two-line (title + subtitle) entries. Use it when a select list is long enough that users benefit from typeahead filtering rather than scrolling.",
    "importName": "Combobox",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a caption above the control to identify the field and improve accessibility for the searchable select."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the field to guide input, displayed only while no error message is present."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays an error message, marks the field invalid, and replaces the hint to flag a failed validation."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Adds a required asterisk next to the label, signaling that the user must select a value before submitting."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the control height across sm, md, or lg to match the density of the surrounding form."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "\"Select…\"",
        "description": "Sets the muted text shown in the empty field before the user types to filter or selects an option."
      },
      {
        "prop": "options",
        "type": "Array<string | ComboboxOption | ComboboxGroup>",
        "required": true,
        "default": "—",
        "description": "Defines the selectable items as plain strings, value/label/description objects, or grouped option collections."
      },
      {
        "prop": "value",
        "type": "string | null",
        "required": false,
        "default": "—",
        "description": "Sets the selected option's value in controlled mode, pairing with onChange to keep the field in sync."
      },
      {
        "prop": "defaultValue",
        "type": "string | null",
        "required": false,
        "default": "null",
        "description": "Provides the initial selection for uncontrolled usage, defaulting to null so the field starts empty."
      },
      {
        "prop": "onChange",
        "type": "(value: string | null) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the newly selected value, or null when the selection is cleared, so you can update state."
      },
      {
        "prop": "clearable",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Adds a clear button when a value is selected, letting users reset the field back to an empty selection."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Blocks typing and selection while dimming the field, indicating the control is currently unavailable."
      },
      {
        "prop": "placement",
        "type": "\"bottom\" | \"top\"",
        "required": false,
        "default": "\"bottom\"",
        "description": "Open the menu upward instead of down (e.g. near a viewport bottom)."
      },
      {
        "prop": "portal",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Render the dropdown in a portal (position:fixed on document.body) so it is never clipped by a scrolling/overflow-hidden ancestor; auto-flips up near the viewport bottom."
      },
      {
        "prop": "minWidth",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Minimum popover width in px when portaled (useful when the control is narrow)."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Combobox } from \"twico-ui\";\n\n<Combobox\n  label=\"Country\"\n  placeholder=\"Search a country\"\n  clearable\n  value={country}\n  onChange={setCountry}\n  options={[\n    { group: \"Asia\", options: [\n      { value: \"id\", label: \"Indonesia\", description: \"Jakarta\" },\n      { value: \"jp\", label: \"Japan\", description: \"Tokyo\" },\n    ]},\n    { group: \"Europe\", options: [\n      { value: \"de\", label: \"Germany\", description: \"Berlin\" },\n    ]},\n  ]}\n/>",
    "tagline": "Searchable single-select with typeahead filtering"
  },
  {
    "name": "CommandPalette",
    "slug": "commandpalette",
    "group": "Overlay",
    "summary": "A ⌘K-style command palette overlay with searchable, grouped commands and full keyboard navigation (↑/↓, Enter, Esc). Use it to give users a fast, central way to run actions or jump around the app, typically opened on Cmd/Ctrl+K.",
    "importName": "CommandPalette",
    "propsRows": [
      {
        "prop": "open",
        "type": "boolean",
        "required": true,
        "default": "—",
        "description": "Controls whether the palette overlay is visible; you own this state and typically toggle it on Cmd/Ctrl+K."
      },
      {
        "prop": "onClose",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "Fires when the palette should dismiss, such as on Esc, an overlay click, or after a command is selected."
      },
      {
        "prop": "commands",
        "type": "Command[]",
        "required": true,
        "default": "—",
        "description": "The list of Command objects to search, group, and render, each typically defining a label, action, and optional group."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "\"Type a command or search…\"",
        "description": "Sets the search input's placeholder text, defaulting to \"Type a command or search…\" to hint at the expected query."
      },
      {
        "prop": "emptyText",
        "type": "string",
        "required": false,
        "default": "\"No results found\"",
        "description": "The message shown when no command matches the current query, defaulting to \"No results found\"."
      },
      {
        "prop": "onClick",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "Alias for onSelect, matching the other item-array APIs (Menu, List, Sidebar, ...) — used when onSelect is absent; palette closes after it runs."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { CommandPalette } from \"twico-ui\";\n\nconst [open, setOpen] = React.useState(false);\nReact.useEffect(() => {\n  const h = (e) => {\n    if ((e.metaKey || e.ctrlKey) && e.key === \"k\") { e.preventDefault(); setOpen(true); }\n  };\n  window.addEventListener(\"keydown\", h);\n  return () => window.removeEventListener(\"keydown\", h);\n}, []);\n\n<CommandPalette\n  open={open}\n  onClose={() => setOpen(false)}\n  commands={[\n    { group: \"Navigation\", label: \"Go to Dashboard\", shortcut: \"G D\", onSelect: goDash },\n    { group: \"Actions\", label: \"New project\", keywords: \"create add\", onSelect: create },\n  ]}\n/>",
    "tagline": "Cmd-K command overlay with keyboard navigation"
  },
  {
    "name": "Container",
    "slug": "container",
    "group": "Layout",
    "importName": "Container",
    "summary": "Centers content and caps its width with responsive horizontal padding — the outer wrapper for a page or section.",
    "propsRows": [
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\" | \"xl\" | \"full\" | string",
        "required": false,
        "default": "\"lg\"",
        "description": "Caps the maximum width using a named token (sm through xl, or full) or any CSS length, defaulting to \"lg\"."
      },
      {
        "prop": "padded",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Adds responsive horizontal padding so content does not touch the viewport edges; enabled by default, set false to remove it."
      },
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "\"div\"",
        "description": "Chooses the rendered HTML element or component (such as \"section\" or \"main\"), defaulting to \"div\" for semantic flexibility."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Container, Heading } from \"twico-ui\";\n\n<Container size=\"lg\">\n  <Heading level={1}>Page title</Heading>\n</Container>",
    "tagline": "Centers and caps page content width"
  },
  {
    "name": "Currency",
    "slug": "currency",
    "group": "Inputs",
    "summary": "Currency is a text input for monetary amounts with a fixed currency defined in code: it renders the currency symbol as a prefix, the currency code as a suffix, and enforces the currency's decimal precision as you type. Use it when the currency is known up front (use CurrencyField when the user should pick one).",
    "importName": "Currency",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a label above the input describing the monetary field, accepting any ReactNode for icons or rich text."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the input to guide entry, displayed only when no error is present."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays an error message below the input and marks the field invalid, overriding any hint while set."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field as required and renders an asterisk beside the label; off by default."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the input height and padding (sm, md, or lg) to match the surrounding form's density, defaulting to \"md\"."
      },
      {
        "prop": "currency",
        "type": "string",
        "required": false,
        "default": "\"USD\"",
        "description": "Selects the fixed currency by code from the built-in table (e.g. USD, EUR, IDR, JPY), driving symbol and precision."
      },
      {
        "prop": "precision",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Overrides the number of decimal digits enforced while typing, instead of the currency's default precision."
      },
      {
        "prop": "symbol",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Overrides the prefix symbol shown before the amount, useful when the built-in symbol for the currency isn't desired."
      },
      {
        "prop": "code",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Overrides the suffix code displayed after the amount, replacing the default currency code label."
      },
      {
        "prop": "value",
        "type": "string | number",
        "required": false,
        "default": "—",
        "description": "Sets the controlled amount as a string or number, keeping the input value driven entirely by your state."
      },
      {
        "prop": "defaultValue",
        "type": "string | number",
        "required": false,
        "default": "\"\"",
        "description": "Sets the initial amount for uncontrolled usage, after which the input manages its own value; defaults to an empty string."
      },
      {
        "prop": "onChange",
        "type": "(e: React.ChangeEvent<HTMLInputElement>) => void",
        "required": false,
        "default": "—",
        "description": "The native change handler receiving the raw input event, useful when you need the underlying DOM event."
      },
      {
        "prop": "onValueChange",
        "type": "(value: number | null, formatted: string) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the parsed numeric value (or null) and the formatted display string whenever the amount changes."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Currency } from \"twico-ui\";\n\n<Currency label=\"Price\" currency=\"USD\" onValueChange={(n) => setPrice(n)} />\n<Currency label=\"Harga\" currency=\"IDR\" />\n<Currency label=\"Total\" currency=\"JPY\" />\n<Currency label=\"Custom\" symbol=\"₿\" code=\"BTC\" precision={8} />",
    "tagline": "Money input with a fixed currency and precision"
  },
  {
    "name": "CurrencyField",
    "slug": "currencyfield",
    "group": "Inputs",
    "summary": "CurrencyField is a currency amount input where the user picks the currency from a searchable dropdown, and that choice drives the prefix symbol, suffix code, and enforced decimal precision. Use it when you need to capture a monetary amount whose currency can be chosen and changed by the user (switching currency re-clamps the amount to the new precision).",
    "importName": "CurrencyField",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a label above the field describing the amount, accepting any ReactNode for icons or formatted text."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the field to guide entry, displayed only when no error message is present."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays an error message and marks the field invalid when set, taking visual precedence over the hint."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field as required and renders an asterisk beside the label; off by default."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the input and dropdown height (sm, md, or lg) to match the surrounding form's density, defaulting to \"md\"."
      },
      {
        "prop": "currency",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Controls the selected currency code from your state, keeping the chosen currency driven externally."
      },
      {
        "prop": "defaultCurrency",
        "type": "string",
        "required": false,
        "default": "\"USD\"",
        "description": "Sets the initially selected currency code for uncontrolled usage, defaulting to \"USD\"."
      },
      {
        "prop": "onCurrencyChange",
        "type": "(code: string) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the new code when the user picks a different currency from the searchable dropdown."
      },
      {
        "prop": "currencies",
        "type": "Array<string | CurrencyOption>",
        "required": false,
        "default": "—",
        "description": "Restricts the selectable currencies to the given codes or {value,label} options, instead of the full built-in list."
      },
      {
        "prop": "value",
        "type": "string | number",
        "required": false,
        "default": "—",
        "description": "Sets the controlled amount as a string or number, keeping the entered value driven entirely by your state."
      },
      {
        "prop": "defaultValue",
        "type": "string | number",
        "required": false,
        "default": "\"\"",
        "description": "Sets the initial amount for uncontrolled usage, after which the field manages its own value; defaults to an empty string."
      },
      {
        "prop": "onValueChange",
        "type": "(value: number | null, formatted: string, currency: string) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the parsed number (or null), the formatted string, and the active currency code whenever either changes."
      },
      {
        "prop": "onChange",
        "type": "(e: React.ChangeEvent<HTMLInputElement>) => void",
        "required": false,
        "default": "—",
        "description": "Native change handler (receives the event); fires alongside onValueChange, matching Currency. Previously typed-out via Omit and silently dropped at runtime."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { CurrencyField } from \"twico-ui\";\n\n<CurrencyField\n  label=\"Amount\"\n  defaultCurrency=\"USD\"\n  onValueChange={(n, str, code) => save(n, code)}\n/>\n\n{/* limit the currency choices */}\n<CurrencyField\n  label=\"Amount\"\n  defaultCurrency=\"EUR\"\n  currencies={[\"USD\", \"EUR\", \"GBP\", \"IDR\"]}\n/>",
    "tagline": "Money input with a selectable currency"
  },
  {
    "name": "Datatable",
    "slug": "datatable",
    "group": "Data display",
    "summary": "Datatable is an advanced, MUI Data Grid-style data table with sortable, filterable, hideable, pinnable, reorderable, and resizable columns, plus a toolbar, density control, multi-format export, optional checkbox selection with batch actions, an actions column, pagination, and a skeleton loading state. Use it to display large tabular datasets that need interactive sorting, filtering, grouping, aggregation, or a server-side mode where only the current page is loaded.",
    "importName": "Datatable",
    "propsRows": [
      {
        "prop": "columns",
        "type": "DatatableColumn array",
        "required": true,
        "default": "-",
        "description": "Defines each column's field, header, type, and behavior, controlling sorting, filtering, formatting, and pinning across the grid."
      },
      {
        "prop": "rows",
        "type": "any array",
        "required": true,
        "default": "-",
        "description": "Supplies the row objects to render, holding only the current page's data when serverMode is enabled."
      },
      {
        "prop": "loading",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Replaces the grid body with skeleton rows while data is being fetched; off by default."
      },
      {
        "prop": "rowKey",
        "type": "(row,index)=>key",
        "required": false,
        "default": "(r,i)=>r.id??i",
        "description": "Returns a stable unique key per row, defaulting to the row's id or its index, to keep selection and renders consistent."
      },
      {
        "prop": "checkboxSelection",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Adds a leading checkbox column for selecting rows, enabling batch actions; off by default."
      },
      {
        "prop": "batchActions",
        "type": "DatatableBatchAction array",
        "required": false,
        "default": "[]",
        "description": "Defines actions shown in the selection toolbar that operate on the currently selected rows; empty by default."
      },
      {
        "prop": "density",
        "type": "compact|standard|comfortable",
        "required": false,
        "default": "standard",
        "description": "Sets the row height preset (compact, standard, or comfortable) to trade vertical space for readability, defaulting to standard."
      },
      {
        "prop": "pageSize",
        "type": "number",
        "required": false,
        "default": "10",
        "description": "Sets the initial number of rows shown per page, defaulting to 10; pass 0 to disable pagination."
      },
      {
        "prop": "pageSizeOptions",
        "type": "number array",
        "required": false,
        "default": "[5,10,25,50]",
        "description": "Lists the selectable rows-per-page values offered in the pagination control, defaulting to [5,10,25,50]."
      },
      {
        "prop": "height",
        "type": "number",
        "required": false,
        "default": "440",
        "description": "Sets the maximum scroll height of the grid body in pixels before rows scroll internally, defaulting to 440."
      },
      {
        "prop": "serverMode",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Switches to server-side data handling so sorting, filtering, and paging are delegated to your backend; off by default."
      },
      {
        "prop": "rowCount",
        "type": "number",
        "required": false,
        "default": "-",
        "description": "Tells the grid the total number of server-side rows so pagination can render correctly in serverMode."
      },
      {
        "prop": "onServerChange",
        "type": "(state)=>void",
        "required": false,
        "default": "-",
        "description": "Fires with the current query state (sort, filter, page) in serverMode so you can fetch the matching rows."
      },
      {
        "prop": "showExport",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Shows the toolbar Export button for downloading data in supported formats; enabled by default."
      },
      {
        "prop": "exportFilename",
        "type": "string",
        "required": false,
        "default": "export",
        "description": "Sets the base filename used for exported files, defaulting to \"export\"."
      },
      {
        "prop": "aggregationValues",
        "type": "object|null",
        "required": false,
        "default": "null",
        "description": "Supplies precomputed footer aggregation values for serverMode, where totals cannot be calculated client-side; null by default."
      },
      {
        "prop": "disableColumnReorder",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Prevents users from dragging columns into a new order, locking the column arrangement; off by default."
      },
      {
        "prop": "disableColumnResize",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Prevents resizing columns, locking their widths; off by default. When enabled, drag a header's right edge to resize, or double-click it to auto-fit the column to its content (Excel-style)."
      },
      {
        "prop": "editMode",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes all columns editable inline so users can change cell values directly; off by default."
      },
      {
        "prop": "onRowUpdate",
        "type": "(updated,original,field)=>void",
        "required": false,
        "default": "-",
        "description": "Fires when an inline cell edit is committed, receiving the updated row, the original row, and the edited field."
      },
      {
        "prop": "onRowsChange",
        "type": "(rows)=>void",
        "required": false,
        "default": "-",
        "description": "Fires with the full next array of rows after an edit, letting you persist the new dataset."
      },
      {
        "prop": "onBatchUpdate",
        "type": "(rows,patch,keys)=>void",
        "required": false,
        "default": "-",
        "description": "Fires when a batch edit is applied, receiving the affected rows, the patch object, and the selected keys."
      },
      {
        "prop": "showPageJumper",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Shows a go-to-page input in the pagination footer for jumping directly to a page number; enabled by default."
      },
      {
        "prop": "selectionMode",
        "type": "none|row|cell",
        "required": false,
        "default": "none",
        "description": "Sets click-to-select granularity (none, row, or cell), controlling what gets highlighted on click, defaulting to none."
      },
      {
        "prop": "onRowClick",
        "type": "(row,key)=>void",
        "required": false,
        "default": "-",
        "description": "Fires with the clicked row and its key, useful for navigation or opening a detail view."
      },
      {
        "prop": "onCellClick",
        "type": "(value,row,field)=>void",
        "required": false,
        "default": "-",
        "description": "Fires with the clicked cell's value, its row, and the field name when a cell is clicked."
      },
      {
        "prop": "onActiveCellChange",
        "type": "(cell|null)=>void",
        "required": false,
        "default": "-",
        "description": "Fires when the active cell changes via keyboard or click, receiving the new cell descriptor or null."
      },
      {
        "prop": "showAggregation",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Shows a totals row with column aggregations beneath the data on initial render; off by default."
      },
      {
        "prop": "ariaLabel",
        "type": "string",
        "required": false,
        "default": "Data table",
        "description": "Sets the grid's accessible aria-label for screen readers, defaulting to \"Data table\"."
      },
      {
        "prop": "rowGrouping",
        "type": "string array",
        "required": false,
        "default": "[]",
        "description": "Lists the field names to group rows by on initial render, collapsing rows into expandable groups; empty by default."
      },
      {
        "prop": "rowPinning",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Allows users to pin rows to the top or bottom so they stay visible while scrolling; off by default."
      },
      {
        "prop": "rowReorder",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Enables drag-and-drop reordering of rows so users can change their sequence; off by default."
      },
      {
        "prop": "rowResize",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Allows users to drag row edges to adjust individual row heights; off by default."
      },
      {
        "prop": "onRowOrderChange",
        "type": "(keys)=>void",
        "required": false,
        "default": "-",
        "description": "Fires with the new array of row keys after a drag reorder, letting you persist the updated order."
      },
      {
        "prop": "pivot",
        "type": "object|null",
        "required": false,
        "default": "null",
        "description": "Supplies the initial pivot model defining row, column, and value fields for cross-tabulated analysis; null by default."
      },
      {
        "prop": "pivotMode",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renders the grid in pivot view from the start instead of the flat table layout; off by default."
      },
      {
        "prop": "align",
        "type": "\"left\" | \"right\"",
        "required": false,
        "default": "\"right\" for number/actions columns, else \"left\"",
        "description": "Cell alignment; currently affects the actions column's button justification. Already supported at runtime — newly exposed in the .d.ts."
      },
      {
        "prop": "virtualized",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Opt into row virtualization (windowing). Active only when pagination is off (pageSize={0}) and row grouping is not active; otherwise ignored and the table renders normally. Pair with a fixed height. Selection/inline-edit keep working because they key off the row id, not the rendered index."
      },
      {
        "prop": "overscan",
        "type": "number",
        "required": false,
        "default": "8",
        "description": "Extra rows rendered above and below the visible window for smoother fast scrolling when virtualized."
      },
      {
        "prop": "rowHeight",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Estimated/fixed row height in px used to compute the virtualization window. Set if rows have a custom height so the scrollbar stays accurate."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { useState } from \"react\";\nimport { Datatable, Avatar, Badge } from \"twico-ui\";\n\n// Sample data — swap for your own array or API rows. Each row needs a stable `id`.\nconst seed = [\n  { id: 1, name: \"Ava Stone\", email: \"ava.stone@twico.io\", role: \"Admin\", department: \"Engineering\", status: \"active\", country: \"US\", seats: 12, mrr: 480, salary: 128000, startDate: \"2023-01-14\" },\n  { id: 2, name: \"Liam Reed\", email: \"liam.reed@twico.io\", role: \"Editor\", department: \"Design\", status: \"invited\", country: \"GB\", seats: 4, mrr: 120, salary: 92000, startDate: \"2023-05-02\" },\n  { id: 3, name: \"Noah Park\", email: \"noah.park@twico.io\", role: \"Viewer\", department: \"Sales\", status: \"active\", country: \"DE\", seats: 2, mrr: 60, salary: 74000, startDate: \"2024-02-20\" },\n  { id: 4, name: \"Mia Cruz\", email: \"mia.cruz@twico.io\", role: \"Editor\", department: \"Support\", status: \"suspended\", country: \"ID\", seats: 7, mrr: 240, salary: 105000, startDate: \"2022-11-09\" },\n];\n\nconst ROLES = [\"Admin\", \"Editor\", \"Viewer\"];\nconst DEPARTMENTS = [\"Engineering\", \"Design\", \"Sales\", \"Marketing\", \"Support\", \"Finance\"];\nconst STATUSES = [\"active\", \"invited\", \"suspended\"];\nconst STATUS_TONE = { active: \"success\", invited: \"info\", suspended: \"danger\" };\nconst usd = (n) => \"$\" + Number(n).toLocaleString(\"en-US\");\n\n// Inline SVG icons (no CDN) for the actions column + batch toolbar.\nconst Eye = () => (<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" /></svg>);\nconst Pencil = () => (<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\"><path d=\"M12 20h9\" /><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z\" /></svg>);\nconst Trash = () => (<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\"><path d=\"M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6\" /></svg>);\nconst Download = () => (<svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\"><path d=\"M12 3v12M7 10l5 5 5-5M5 21h14\" /></svg>);\nconst Mail = () => (<svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\"><path d=\"M3 6h18v12H3z\" /><path d=\"M3 7l9 6 9-6\" /></svg>);\n\nexport default function Example() {\n  const [rows, setRows] = useState(seed);\n\n  const columns = [\n    {\n      field: \"name\", headerName: \"Name\", width: 220, pinned: \"left\",\n      renderCell: (v) => (\n        <span style={{ display: \"flex\", alignItems: \"center\", gap: 10 }}>\n          <Avatar name={v} size=\"sm\" /> <strong>{v}</strong>\n        </span>\n      ),\n    },\n    { field: \"email\", headerName: \"Email\", width: 220 },\n\n    // Editable columns: double-click a cell to edit it, AND when rows are ticked an\n    // \"Edit\" button appears in the selection toolbar to set one value across every\n    // selected row at once (fires onBatchUpdate).\n    {\n      field: \"role\", headerName: \"Role\", width: 130,\n      editable: true, editType: \"select\", valueOptions: ROLES,\n      renderCell: (v) => <Badge variant=\"soft\" size=\"sm\" tone=\"neutral\">{v}</Badge>,\n    },\n    { field: \"department\", headerName: \"Department\", width: 150, editable: true, editType: \"select\", valueOptions: DEPARTMENTS },\n    {\n      field: \"status\", headerName: \"Status\", width: 130,\n      editable: true, editType: \"select\", valueOptions: STATUSES,\n      renderCell: (v) => <Badge variant=\"soft\" size=\"sm\" tone={STATUS_TONE[v]}>{v}</Badge>,\n    },\n    { field: \"country\", headerName: \"Country\", width: 120, valueOptions: [\"US\", \"GB\", \"DE\", \"ID\", \"JP\", \"BR\", \"CA\", \"AU\"] },\n    { field: \"seats\", headerName: \"Seats\", type: \"number\", width: 110, editable: true, aggregation: \"sum\" },\n    { field: \"mrr\", headerName: \"MRR\", type: \"number\", width: 120, aggregation: \"sum\", valueFormatter: usd, aggregationFormatter: usd },\n    { field: \"salary\", headerName: \"Salary\", type: \"number\", width: 130, editable: true, aggregation: \"avg\", valueFormatter: usd },\n    { field: \"startDate\", headerName: \"Start date\", width: 130 },\n\n    // Per-row actions: inline icon buttons + an overflow (⋮) menu (showInMenu).\n    {\n      field: \"actions\", headerName: \"Actions\", type: \"actions\", width: 110,\n      getActions: (row) => [\n        { icon: <Eye />, label: \"View\", onClick: () => console.log(\"view\", row.id) },\n        { icon: <Pencil />, label: \"Edit\", showInMenu: true, onClick: () => console.log(\"edit\", row.id) },\n        { icon: <Trash />, label: \"Delete\", showInMenu: true, danger: true, onClick: () => setRows((d) => d.filter((r) => r.id !== row.id)) },\n      ],\n    },\n  ];\n\n  // Actions for the toolbar that replaces the header when one or more rows are ticked.\n  // (A built-in \"Edit\" button is added automatically because some columns are editable.)\n  const batchActions = [\n    { label: \"Export\", icon: <Download />, onClick: (keys, selected, clear) => clear() },\n    { label: \"Email\", icon: <Mail />, onClick: (keys, selected, clear) => { console.log(selected); clear(); } },\n    { label: \"Delete\", icon: <Trash />, danger: true, onClick: (keys, selected, clear) => { setRows((d) => d.filter((r) => !keys.includes(r.id))); clear(); } },\n  ];\n\n  return (\n    <Datatable\n      columns={columns}\n      rows={rows}\n      checkboxSelection\n      rowNumbers\n      batchActions={batchActions}\n      onRowUpdate={(updated) => setRows((d) => d.map((r) => (r.id === updated.id ? updated : r)))}\n      onBatchUpdate={(changed) => setRows((d) => d.map((r) => changed.find((c) => c.id === r.id) || r))}\n      showAggregation\n      rowPinning\n      pageSize={10}\n    />\n  );\n}",
    "tagline": "Advanced data grid with sorting, filtering, and export"
  },
  {
    "name": "DatePicker",
    "slug": "datepicker",
    "group": "Inputs",
    "summary": "DatePicker is a calendar-popover date input with month/year navigation, a month grid, today highlight, min/max bounds, and a clearable value. Use it when you need users to select a single date with optional range limits and custom formatting.",
    "importName": "DatePicker",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Optional field label rendered above the input to name the control and associate it for accessibility."
      },
      {
        "prop": "value",
        "type": "Date | null",
        "required": false,
        "default": "—",
        "description": "Controlled selected date, or null when empty; pair it with onChange to own the value in state."
      },
      {
        "prop": "defaultValue",
        "type": "Date | null",
        "required": false,
        "default": "null",
        "description": "Initial date for uncontrolled usage when value is omitted, defaulting to null so the field starts empty."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "\"Select date\"",
        "description": "Text shown in the trigger when no date is selected, defaulting to \"Select date\" to prompt the user."
      },
      {
        "prop": "min",
        "type": "Date",
        "required": false,
        "default": "—",
        "description": "Earliest selectable date; dates before it are disabled in the calendar grid to enforce a lower bound."
      },
      {
        "prop": "max",
        "type": "Date",
        "required": false,
        "default": "—",
        "description": "Latest selectable date; dates after it are disabled in the calendar grid to enforce an upper bound."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control and prevents the calendar popover from opening, useful for read-only or gated form states."
      },
      {
        "prop": "clearable",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Shows a clear (×) button when a date is set so users can reset the field, enabled by default."
      },
      {
        "prop": "format",
        "type": "(date: Date) => string",
        "required": false,
        "default": "—",
        "description": "Custom formatter that turns the selected Date into display text, defaulting to a localized medium date string."
      },
      {
        "prop": "weekStartsOn",
        "type": "0 | 1 | 2 | 3 | 4 | 5 | 6",
        "required": false,
        "default": "0",
        "description": "Widened from 0|1 to any weekday; controls which day the calendar grid + weekday header start on (0 = Sunday)."
      },
      {
        "prop": "onChange",
        "type": "(date: Date | null) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the newly selected Date, or null when the value is cleared, so you can update state."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Helper text shown below when there is no error."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message — turns the field red and replaces the hint."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required (adds an asterisk to the label)."
      },
      {
        "prop": "locale",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "BCP-47 locale for Intl-derived month/weekday names and date formatting; omit for the runtime default."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { DatePicker } from \"twico-ui\";\n\nconst [date, setDate] = useState(null);\n\n<DatePicker\n  label=\"Start date\"\n  value={date}\n  onChange={setDate}\n  min={new Date()}\n  weekStartsOn={1}\n/>",
    "tagline": "Calendar-popover input for a single date"
  },
  {
    "name": "DateRangePicker",
    "slug": "daterangepicker",
    "group": "Inputs",
    "summary": "DateRangePicker is a calendar input for selecting a start and end date with click-start/click-end selection, in-range highlighting, hover preview, and quick presets (Last 7/14/30/90 days). Use it when a form needs a reporting period or any bounded date span.",
    "importName": "DateRangePicker",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Optional field label rendered above the control to name the date range input and aid accessibility."
      },
      {
        "prop": "value",
        "type": "DateRange",
        "required": false,
        "default": "—",
        "description": "Controlled range as a { start, end } object; pair it with onChange to own the selection in state."
      },
      {
        "prop": "defaultValue",
        "type": "DateRange",
        "required": false,
        "default": "{ start: null, end: null }",
        "description": "Initial range for uncontrolled usage, defaulting to { start: null, end: null } so the field starts empty."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "\"Select date range\"",
        "description": "Text shown in the trigger when no range is selected, defaulting to \"Select date range\" to prompt the user."
      },
      {
        "prop": "presets",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Shows the quick-preset column (Last 7/14/30/90 days) for fast range selection, enabled by default."
      },
      {
        "prop": "weekStartsOn",
        "type": "0 | 1 | 2 | 3 | 4 | 5 | 6",
        "required": false,
        "default": "0",
        "description": "Widened from 0|1 to any weekday; controls which day the calendar grid + weekday header start on (0 = Sunday)."
      },
      {
        "prop": "onChange",
        "type": "(range: DateRange) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the updated { start, end } range whenever the selection changes so you can update state."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disable all interaction (the popover cannot be opened)."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Helper text shown below when there is no error."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message — turns the field red and replaces the hint."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required (adds an asterisk to the label)."
      },
      {
        "prop": "locale",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "BCP-47 locale for Intl-derived month/weekday names and date formatting; omit for the runtime default."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { DateRangePicker } from \"twico-ui\";\n\nconst [range, setRange] = useState({ start: null, end: null });\n\n<DateRangePicker\n  label=\"Reporting period\"\n  value={range}\n  onChange={setRange}\n  weekStartsOn={1}\n/>",
    "tagline": "Calendar input for a start and end date"
  },
  {
    "name": "Dialog",
    "slug": "dialog",
    "group": "Overlay",
    "summary": "Dialog is a modal overlay with a scrim, pop-in animation, focus trapping, Esc-to-close, and backdrop-close. Use it to interrupt the user for confirmations, forms, or detail views that require attention before continuing.",
    "importName": "Dialog",
    "propsRows": [
      {
        "prop": "open",
        "type": "boolean",
        "required": true,
        "default": "—",
        "description": "Controls whether the modal is visible; the dialog renders null when false, so drive it from state."
      },
      {
        "prop": "onClose",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "Called when the dialog requests to close via Esc, a backdrop click, or the close button."
      },
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Heading content rendered in the dialog header to announce the modal's purpose to the user."
      },
      {
        "prop": "description",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Secondary supporting text shown beneath the title to give context for the dialog's content or task."
      },
      {
        "prop": "footer",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Footer region for pinned actions, typically right-aligned confirm and cancel buttons below the body."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\" | \"full\"",
        "required": false,
        "default": "\"md\"",
        "description": "Adds a new \"full\" option: a near-fullscreen panel that fills the viewport minus a small margin (existing sm/md/lg unchanged)."
      },
      {
        "prop": "closeOnBackdrop",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Closes the dialog when the surrounding scrim is clicked, enabled by default; disable for required interactions."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Main body content of the dialog, such as forms, messages, or detail views requiring the user's attention."
      },
      {
        "prop": "scrollBody",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Keep the header and footer fixed and scroll only the body, so long content does not overflow the viewport."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Dialog, Button } from \"twico-ui\";\n\n<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title=\"Delete project?\"\n  description=\"This action cannot be undone.\"\n  footer={\n    <>\n      <Button variant=\"ghost\" onClick={() => setOpen(false)}>Cancel</Button>\n      <Button variant=\"danger\" onClick={confirm}>Delete</Button>\n    </>\n  }\n>\n  The project and all its data will be permanently removed.\n</Dialog>",
    "tagline": "Modal overlay with focus trap and scrim"
  },
  {
    "name": "Divider",
    "slug": "divider",
    "group": "Layout",
    "summary": "Divider is a thin separator rule that visually splits content, either horizontally or vertically. Use it to break up sections, lists, or inline items, optionally with a centered or aligned label (e.g. \"OR\").",
    "importName": "Divider",
    "propsRows": [
      {
        "prop": "orientation",
        "type": "\"horizontal\" | \"vertical\"",
        "required": false,
        "default": "\"horizontal\"",
        "description": "Direction of the separator rule, either horizontal (default) to split stacked content or vertical for inline items."
      },
      {
        "prop": "inset",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Indents the start of a horizontal rule to align it with inset content like list item text."
      },
      {
        "prop": "align",
        "type": "\"left\" | \"center\" | \"right\" | \"start\" | \"end\"",
        "required": false,
        "default": "\"center\"",
        "description": "Label alignment when children are provided; logical start/end now accepted and map to left/right (additive — existing left/center/right unchanged)."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Optional label text rendered within the rule, such as \"OR\", to break content with a caption."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Divider } from \"twico-ui\";\n\n<Divider />\n\n<Divider>OR</Divider>\n\n<span>A</span>\n<Divider orientation=\"vertical\" />\n<span>B</span>",
    "tagline": "Separator rule with an optional label"
  },
  {
    "name": "Drawer",
    "slug": "drawer",
    "group": "Overlay",
    "summary": "Drawer is a slide-in overlay panel that anchors to any screen edge with a scrim, Esc-to-close, focus trapping, and a header/body/footer layout. Use it for nav menus, filters, detail views, or carts that should appear over the current page; drive it with the open and onClose props.",
    "importName": "Drawer",
    "propsRows": [
      {
        "prop": "open",
        "type": "boolean",
        "required": true,
        "default": "—",
        "description": "Controls whether the panel is visible; the drawer renders nothing when false, so drive it from state."
      },
      {
        "prop": "onClose",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "Called when the drawer requests to close via Esc, a backdrop click, or the close button."
      },
      {
        "prop": "side",
        "type": "\"left\" | \"right\" | \"top\" | \"bottom\"",
        "required": false,
        "default": "\"right\"",
        "description": "Screen edge the panel anchors to and slides in from, defaulting to right (left, right, top, or bottom)."
      },
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Heading content rendered in the drawer header to announce the panel's purpose to the user."
      },
      {
        "prop": "description",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Secondary supporting text shown under the title to give context for the drawer's content or task."
      },
      {
        "prop": "footer",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Footer region for pinned actions, typically right-aligned buttons displayed below the drawer body."
      },
      {
        "prop": "closeOnBackdrop",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Closes the drawer when the backdrop scrim is clicked, enabled by default; disable for required interactions."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Body content of the drawer, such as nav menus, filters, detail views, or a cart over the page."
      },
      {
        "prop": "width",
        "type": "\"sm\" | \"md\" | \"lg\" | number | string",
        "required": false,
        "default": "\"md\"",
        "description": "Panel width for side left/right — preset sm/md/lg, a number (px), or a CSS length."
      },
      {
        "prop": "height",
        "type": "\"sm\" | \"md\" | \"lg\" | number | string",
        "required": false,
        "default": "\"md\"",
        "description": "Panel height for side top/bottom — preset sm/md/lg, a number (px), or a CSS length."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Drawer } from \"twico-ui\";\n\nconst [open, setOpen] = useState(false);\n\n<Drawer\n  open={open}\n  onClose={() => setOpen(false)}\n  side=\"right\"\n  title=\"Filters\"\n  description=\"Narrow down the results\"\n  footer={<button onClick={() => setOpen(false)}>Apply</button>}\n>\n  ...filter controls...\n</Drawer>",
    "tagline": "Slide-in panel anchored to any edge"
  },
  {
    "name": "EmptyState",
    "slug": "emptystate",
    "group": "Feedback",
    "summary": "EmptyState is a zero-data placeholder that centers an optional icon tile, title, description, and an actions row for a call-to-action. Use it when a list, table, inbox, or panel has no content yet, or as a dashed drop-target placeholder.",
    "importName": "EmptyState",
    "propsRows": [
      {
        "prop": "icon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an illustrative icon inside a tinted tile above the title, signalling visually why the area has no content yet."
      },
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Sets the centered headline summarising the empty condition, such as \"No results\" or \"Your inbox is empty\"."
      },
      {
        "prop": "description",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Provides supporting copy beneath the title that explains the empty state and hints at how to fill it."
      },
      {
        "prop": "actions",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a row of call-to-action buttons below the text so users can immediately add content or take the next step."
      },
      {
        "prop": "bordered",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Adds a dashed border around the placeholder when true, ideal for drop targets or visually distinct empty regions."
      },
      {
        "prop": "border",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Add a dashed border (good for drop targets / placeholders); preferred alias for bordered."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { EmptyState, Button } from \"twico-ui\";\n\n<EmptyState\n  icon={<InboxIcon />}\n  title=\"No messages yet\"\n  description=\"When someone sends you a message, it'll show up here.\"\n  actions={<Button>Compose</Button>}\n/>",
    "tagline": "Zero-data placeholder with icon and actions"
  },
  {
    "name": "FileUpload",
    "slug": "fileupload",
    "group": "Inputs",
    "summary": "FileUpload is a drag-and-drop dropzone with a click-to-browse fallback and a removable list of selected files. Use it when you need users to attach one or more files, either controlled via value/onChange or uncontrolled.",
    "importName": "FileUpload",
    "propsRows": [
      {
        "prop": "accept",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Restricts selectable files using a native input accept string such as \"image/*,.pdf\", filtering the browse dialog and drops."
      },
      {
        "prop": "multiple",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Allows selecting and attaching more than one file at a time when true; defaults to single-file selection."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the dropzone and underlying input when true, blocking clicks, drops, and any further file changes."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a hint line under the prompt, defaulting to the accepted types or \"Any file\" when not provided."
      },
      {
        "prop": "value",
        "type": "File[]",
        "required": false,
        "default": "—",
        "description": "Supplies the controlled array of selected File objects, making the component fully managed by parent state."
      },
      {
        "prop": "onChange",
        "type": "(files: File[]) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the updated File array whenever files are added or removed, letting you sync controlled state."
      },
      {
        "prop": "defaultValue",
        "type": "File[]",
        "required": false,
        "default": "[]",
        "description": "Uncontrolled initial file list."
      },
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Field label rendered above the dropzone."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message shown below the dropzone; turns the border red (sets aria-invalid)."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required (adds an asterisk to the label)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { FileUpload } from \"twico-ui\";\n\nconst [files, setFiles] = React.useState([]);\n\n<FileUpload\n  multiple\n  accept=\"image/*,.pdf\"\n  value={files}\n  onChange={setFiles}\n  hint=\"PNG, JPG or PDF up to 10MB\"\n/>",
    "tagline": "Drag-and-drop dropzone with a file list"
  },
  {
    "name": "Grid",
    "slug": "grid",
    "group": "Layout",
    "importName": "Grid",
    "summary": "CSS grid primitive — a responsive auto-fill grid (minChildWidth) or a fixed column count (columns).",
    "propsRows": [
      {
        "prop": "minChildWidth",
        "type": "number | string",
        "required": false,
        "default": "—",
        "description": "Enables a responsive auto-fill grid where columns wrap once children fall below this minimum width (number is treated as px)."
      },
      {
        "prop": "columns",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Sets a fixed number of equal columns, used when minChildWidth is unset for predictable non-responsive layouts."
      },
      {
        "prop": "gap",
        "type": "number | string",
        "required": false,
        "default": "4",
        "description": "Controls spacing between grid cells as a spacing-step number or any CSS length, defaulting to step 4."
      },
      {
        "prop": "align",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Maps to the CSS align-items value, controlling how children are aligned along the block (vertical) axis."
      },
      {
        "prop": "justify",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Maps to the CSS justify-items value, controlling how children are aligned along the inline (horizontal) axis."
      },
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "\"div\"",
        "description": "Renders the grid as a different element or tag instead of the default div, for semantic markup."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Grid, Card } from \"twico-ui\";\n\n<Grid minChildWidth={220} gap={4}>\n  <Card>One</Card>\n  <Card>Two</Card>\n  <Card>Three</Card>\n</Grid>",
    "tagline": "Responsive CSS grid primitive"
  },
  {
    "name": "Heading",
    "slug": "heading",
    "group": "Typography",
    "importName": "Heading",
    "summary": "Heading (h1–h6) with consistent token typography. Use it instead of bare heading tags.",
    "propsRows": [
      {
        "prop": "level",
        "type": "1 | 2 | 3 | 4 | 5 | 6",
        "required": false,
        "default": "2",
        "description": "Chooses which h1-h6 tag renders and its default token size, keeping document hierarchy and typography consistent."
      },
      {
        "prop": "size",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Overrides the font-size token suffix (e.g. \"3xl\") to decouple visual scale from the semantic heading level."
      },
      {
        "prop": "align",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Sets the CSS text-align value, letting you left-align, center, or right-align the heading text."
      },
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "—",
        "description": "Renders a different tag while preserving the level's size, useful when semantics and visual weight should differ."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Heading } from \"twico-ui\";\n\n<Heading level={1}>Dashboard</Heading>\n<Heading level={3}>Recent activity</Heading>",
    "tagline": "Headings with consistent token typography"
  },
  {
    "name": "IconButton",
    "slug": "iconbutton",
    "group": "Buttons & actions",
    "summary": "IconButton is a square or circular button that renders a single icon and always requires an aria-label for accessibility. Use it in toolbars, cards, and dense UI where an icon-only control is clearer than a labeled button.",
    "importName": "IconButton",
    "propsRows": [
      {
        "prop": "icon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Supplies the single icon node to render, such as a Lucide SVG, falling back to children when omitted."
      },
      {
        "prop": "variant",
        "type": "\"solid\" | \"soft\" | \"outline\" | \"ghost\"",
        "required": false,
        "default": "\"ghost\"",
        "description": "Fill style (same axes as Button): solid, soft, outline, or ghost; ghost by default. Cross with `tone` for color."
      },
      {
        "prop": "tone",
        "type": "\"primary\" | \"danger\"",
        "required": false,
        "default": "\"primary\"",
        "description": "Color/intent, orthogonal to variant (mirrors Button) — primary by default; tone=\"danger\" makes an icon-only destructive button in any variant."
      },
      {
        "prop": "size",
        "type": "\"xs\" | \"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Adds a new \"xs\" size (~26px square, smaller than \"sm\") to the existing union; sm/md/lg are unchanged."
      },
      {
        "prop": "round",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renders a fully rounded circular button when true instead of the default squared shape with rounded corners."
      },
      {
        "prop": "aria-label",
        "type": "string",
        "required": true,
        "default": "—",
        "description": "Provides the required accessible name for this icon-only button so screen readers announce its purpose."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires on click/tap and on Enter or Space."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "type",
        "type": "\"button\" | \"submit\" | \"reset\"",
        "required": false,
        "default": "\"button\"",
        "description": "Native button type — use \"submit\" to submit a surrounding form."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "autoFocus",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Focus the element automatically when it mounts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.ButtonHTMLAttributes<HTMLButtonElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <button> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { IconButton } from \"twico-ui\";\n\n<IconButton aria-label=\"Settings\" icon={<SettingsIcon />} />\n<IconButton aria-label=\"Like\" variant=\"soft\" round icon={<HeartIcon />} />\n<IconButton aria-label=\"Delete\" variant=\"outline\" icon={<TrashIcon />} />",
    "tagline": "Icon-only button with a required aria-label"
  },
  {
    "name": "Input",
    "slug": "input",
    "group": "Inputs",
    "summary": "A text input with optional label, hint text, error/validation state, and inline leading/trailing icons. Use it for any single-line form field; with type=\"password\" it gets a built-in reveal/hide eye toggle.",
    "importName": "Input",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a label node above the control so the field has an accessible, visible name for the user."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the input to guide entry; it is hidden once an error message is present."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays a validation error below the field, switches the control to its red invalid state, and replaces the hint."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field as required and appends an asterisk to the label to signal mandatory input; defaults to false."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the control height and padding (sm, md, or lg) to match the density of the surrounding form."
      },
      {
        "prop": "leftIcon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an icon node inside the field on the leading edge, useful as a prefix like a search or mail glyph."
      },
      {
        "prop": "rightIcon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a trailing icon node inside the field, overriding the built-in password reveal toggle when supplied."
      },
      {
        "prop": "onChange",
        "type": "(e: React.ChangeEvent) => void",
        "required": false,
        "default": "—",
        "description": "Native change handler on the underlying form control."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Input } from \"twico-ui\";\n\n<Input label=\"Email\" type=\"email\" placeholder=\"you@twico.dev\" required />\n<Input label=\"Search\" leftIcon={<SearchIcon />} placeholder=\"Search…\" />\n<Input label=\"Amount\" rightIcon={<span>USD</span>} placeholder=\"0.00\" />\n<Input label=\"Password\" type=\"password\" placeholder=\"••••••••\" />\n<Input label=\"Username\" hint=\"Choose a unique handle\" placeholder=\"twico\" />\n<Input label=\"Email\" type=\"email\" error=\"Invalid email address\" defaultValue=\"nope\" />",
    "tagline": "Text field with label, icons, and validation"
  },
  {
    "name": "Kanban",
    "slug": "kanban",
    "group": "Data display",
    "summary": "Kanban is a drag-and-drop board that arranges cards into columns you can drag between. Use it for visualizing and reorganizing work items (tasks, tickets, stages) by status, either controlled via cards + onCardMove or uncontrolled.",
    "importName": "Kanban",
    "propsRows": [
      {
        "prop": "columns",
        "type": "KanbanColumn[] ({ id: string; title: React.ReactNode; color?: string })",
        "required": true,
        "default": "—",
        "description": "Defines the board columns, each with an id matching cards' column field, a title, and an optional heading dot color."
      },
      {
        "prop": "cards",
        "type": "KanbanCard[] ({ id; column; title?; description?; tags?; footer?; ... })",
        "required": true,
        "default": "—",
        "description": "Supplies the cards to render, each assigned to a column via its column field and carrying title, description, and tags."
      },
      {
        "prop": "onCardMove",
        "type": "(cardId: string, toColumn: string, nextCards: KanbanCard[]) => void",
        "required": false,
        "default": "—",
        "description": "Fires when a card is dropped into a different column, passing the card id, target column, and updated card list."
      },
      {
        "prop": "renderCard",
        "type": "(card: KanbanCard) => React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Overrides the default card contents with a custom renderer, falling back to title, description, tags, and footer."
      },
      {
        "prop": "defaultCards",
        "type": "KanbanCard[]",
        "required": false,
        "default": "[]",
        "description": "Initial cards when uncontrolled (the board applies moves internally)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Kanban } from \"twico-ui\";\n\n<Kanban\n  columns={[\n    { id: \"todo\", title: \"To do\", color: \"var(--slate-400)\" },\n    { id: \"doing\", title: \"In progress\", color: \"var(--amber-500)\" },\n    { id: \"done\", title: \"Done\", color: \"var(--emerald-500)\" },\n  ]}\n  cards={[\n    { id: \"1\", column: \"todo\", title: \"Design tokens\", tags: [\"Design\"] },\n    { id: \"2\", column: \"doing\", title: \"Datatable filters\" },\n    { id: \"3\", column: \"done\", title: \"Ship release\" },\n  ]}\n  onCardMove={(id, to) => save(id, to)}\n/>",
    "tagline": "Drag-and-drop board of columns and cards"
  },
  {
    "name": "List",
    "slug": "list",
    "group": "Data display",
    "summary": "List renders a vertical stack of rows with optional leading/trailing slots, a title, and a description. Use it for compact data displays like people, files, or settings, where rows can be static, links, or buttons.",
    "importName": "List",
    "propsRows": [
      {
        "prop": "items",
        "type": "ListItemData[]",
        "required": true,
        "default": "—",
        "description": "Provides the rows to render, each with a title plus optional description, leading, trailing, onClick, href, and active fields."
      },
      {
        "prop": "plain",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Drops the card chrome to render borderless, transparent rows when set to true; defaults to false for the boxed style."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { List } from \"twico-ui\";\n\n<List\n  items={[\n    { title: \"Ada Park\", description: \"ada@twico.dev\", trailing: \"Active\", onClick: () => {} },\n    { title: \"report.pdf\", description: \"2.4 MB\", trailing: \"Today\" },\n  ]}\n/>",
    "tagline": "Vertical rows with leading and trailing slots"
  },
  {
    "name": "Menu",
    "slug": "menu",
    "group": "Overlay",
    "summary": "Menu is a portaled dropdown menu that takes a clickable trigger and an array of items supporting icons, shortcuts, separators, section headings, and danger styling. Use it for contextual action lists (e.g. an account or \"more options\" menu) that need to stay keyboard-navigable and never get clipped by overflow.",
    "importName": "Menu",
    "propsRows": [
      {
        "prop": "trigger",
        "type": "React.ReactNode",
        "required": true,
        "default": "—",
        "description": "Defines the clickable element that opens the menu, typically a Button or IconButton the dropdown anchors to."
      },
      {
        "prop": "items",
        "type": "MenuItemDef[]",
        "required": true,
        "default": "—",
        "description": "Lists the menu entries, where each can be an action item, a separator, or a section heading."
      },
      {
        "prop": "align",
        "type": "\"start\" | \"end\"",
        "required": false,
        "default": "\"start\"",
        "description": "Aligns the menu horizontally to the trigger's start or end edge so it sits flush in tight layouts; defaults to start."
      },
      {
        "prop": "header",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an optional rich node above the items, handy for surfacing user info or context at the top of the menu."
      },
      {
        "prop": "width",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Pins the menu to a fixed pixel width, otherwise it sizes to the larger of 200px and the trigger's width."
      },
      {
        "prop": "open",
        "type": "boolean",
        "required": false,
        "default": "—",
        "description": "Controlled open state - pair with onOpenChange. Omit for internal (uncontrolled) state."
      },
      {
        "prop": "onOpenChange",
        "type": "(open: boolean) => void",
        "required": false,
        "default": "—",
        "description": "Called with the requested open state on trigger click, item select, Esc, or outside click."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Menu, Button } from \"twico-ui\";\n\n<Menu\n  align=\"end\"\n  trigger={<Button>Options</Button>}\n  items={[\n    { label: \"Account\", heading: true },\n    { label: \"Profile\", onClick: openProfile, shortcut: \"⌘P\" },\n    { label: \"Settings\", onClick: openSettings },\n    { separator: true },\n    { label: \"Sign out\", danger: true, onClick: signOut },\n  ]}\n/>",
    "tagline": "Portaled dropdown menu with icons and shortcuts"
  },
  {
    "name": "MultiSelect",
    "slug": "multiselect",
    "group": "Inputs",
    "summary": "MultiSelect is a MUI-Autocomplete-style multi-select where chosen values appear as removable chips and you type inline to filter a checkable options overlay. Use it when users need to pick several values from a list that benefits from search, grouped headings, or two-line (label + description) options.",
    "importName": "MultiSelect",
    "propsRows": [
      {
        "prop": "options",
        "type": "Array<string | MultiSelectOption | MultiSelectGroup>",
        "required": true,
        "default": "—",
        "description": "Supplies the selectable options as plain strings, {value,label,description} objects, or {group,options} grouped sections."
      },
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a label node above the control so the multi-select has an accessible, visible name for the user."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the control to guide selection; it is hidden once an error message is present."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays a validation error below the control and styles it as invalid to flag a selection problem."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field as required and adds an asterisk to the label to signal a mandatory selection; defaults to false."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "\"Select…\"",
        "description": "Sets the prompt text shown when no chips are selected, defaulting to \"Select…\" to invite a choice."
      },
      {
        "prop": "value",
        "type": "string[]",
        "required": false,
        "default": "—",
        "description": "Controls the selected values as a string array, making the component fully controlled when paired with onChange."
      },
      {
        "prop": "defaultValue",
        "type": "string[]",
        "required": false,
        "default": "[]",
        "description": "Seeds the initially selected values for uncontrolled usage, defaulting to an empty array of no selections."
      },
      {
        "prop": "onChange",
        "type": "(values: string[]) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the new array of selected values whenever a chip is added or removed from the selection."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control and blocks all interaction when set to true, greying out the field; defaults to false."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Control height preset, matching Select/Combobox."
      },
      {
        "prop": "clearable",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Show a clear-all (×) affix when at least one value is selected."
      },
      {
        "prop": "placement",
        "type": "\"bottom\" | \"top\"",
        "required": false,
        "default": "\"bottom\"",
        "description": "Open the menu upward instead of down (e.g. near a viewport bottom)."
      },
      {
        "prop": "portal",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Render the dropdown in a portal (position:fixed on document.body) so it is never clipped by a scrolling/overflow-hidden ancestor; auto-flips up near the viewport bottom."
      },
      {
        "prop": "minWidth",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Minimum popover width in px when portaled (useful when the control is narrow)."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { MultiSelect } from \"twico-ui\";\n\nconst [tags, setTags] = useState([\"react\", \"tailwind\"]);\n\n<MultiSelect\n  label=\"Tech stack\"\n  placeholder=\"Add technologies\"\n  value={tags}\n  onChange={setTags}\n  options={[\n    { group: \"Frameworks\", options: [\n      { value: \"react\", label: \"React\", description: \"UI library\" },\n      { value: \"vue\", label: \"Vue\", description: \"Progressive framework\" },\n    ]},\n    { group: \"Tooling\", options: [\"tailwind\", \"typescript\"] },\n  ]}\n/>",
    "tagline": "Multi-select with removable chips and search"
  },
  {
    "name": "Navbar",
    "slug": "navbar",
    "group": "Navigation",
    "summary": "Navbar is a top application bar with a left brand/logo slot, center inline navigation links (hidden on small screens), and a right-aligned actions slot. Use it as the primary site or app header; it is sticky and translucent by default.",
    "importName": "Navbar",
    "propsRows": [
      {
        "prop": "brand",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders the brand or logo node in the navbar's left slot, typically a wordmark or icon linking home."
      },
      {
        "prop": "links",
        "type": "NavbarLink[]",
        "required": false,
        "default": "[]",
        "description": "Inline navigation items shown centered, each with a label and optional href, icon, active state, or onClick."
      },
      {
        "prop": "actions",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Right-aligned content such as buttons, a search field, or an avatar for account and primary actions."
      },
      {
        "prop": "sticky",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Pins the navbar to the top of the viewport with a translucent blur as the page scrolls; on by default."
      },
      {
        "prop": "onMenuClick",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "Fires when the hamburger button (shown only on small screens) is clicked, typically to open a mobile drawer."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Navbar } from \"twico-ui\";\n\n<Navbar\n  brand={<>twico<span style={{ color: \"var(--color-primary)\" }}>UI</span></>}\n  links={[\n    { label: \"Dashboard\", active: true },\n    { label: \"Projects\" },\n    { label: \"Team\" },\n  ]}\n  actions={<button>Sign in</button>}\n/>",
    "tagline": "Sticky top app bar with brand and actions"
  },
  {
    "name": "Pagination",
    "slug": "pagination",
    "group": "Data display",
    "summary": "Pagination renders page navigation with prev/next buttons and smart ellipsis truncation, keeping boundary and sibling pages visible. Use it to let users move through paged data (tables, lists, search results), optionally with a \"Go to\" page jumper.",
    "importName": "Pagination",
    "propsRows": [
      {
        "prop": "page",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "The currently active 1-based page number, used to highlight the active button and compute which pages to show."
      },
      {
        "prop": "total",
        "type": "number",
        "required": true,
        "default": "—",
        "description": "Total number of pages available, determining the range of page buttons and when ellipsis truncation appears."
      },
      {
        "prop": "onChange",
        "type": "(page: number) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the destination page number whenever the user clicks a page, prev, next, or jumper control."
      },
      {
        "prop": "siblings",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Number of adjacent page buttons rendered on each side of the current page before ellipsis truncation kicks in."
      },
      {
        "prop": "boundaries",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Number of page buttons always kept visible at each end so the first and last pages stay reachable."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the control density, sm or md, scaling button height and spacing to match the surrounding layout."
      },
      {
        "prop": "showJumper",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Adds a \"Go to\" number input so users can jump directly to a specific page instead of clicking through."
      },
      {
        "prop": "jumperLabel",
        "type": "React.ReactNode",
        "required": false,
        "default": "\"Go to\"",
        "description": "Text or node rendered before the jumper input, defaulting to \"Go to\", to clarify what the field does."
      },
      {
        "prop": "defaultPage",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Initial 1-based page when uncontrolled (no `page` prop)."
      },
      {
        "prop": "showPageJumper",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Show a \"Go to\" page input for jumping directly to a page; preferred alias for showJumper."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Pagination } from \"twico-ui\";\n\nconst [page, setPage] = useState(1);\n\n<Pagination\n  page={page}\n  total={12}\n  onChange={setPage}\n  showJumper\n/>",
    "tagline": "Page navigation with smart ellipsis truncation"
  },
  {
    "name": "Popover",
    "slug": "popover",
    "group": "Overlay",
    "summary": "Popover is a click-triggered floating panel anchored to a trigger element, rendered in a portal so it is never clipped, auto-flipping near viewport edges and closing on outside-click or Esc. Use it for rich interactive content (inputs, buttons, links); for plain text hints use Tooltip instead.",
    "importName": "Popover",
    "propsRows": [
      {
        "prop": "trigger",
        "type": "React.ReactNode",
        "required": true,
        "default": "—",
        "description": "The clickable element the panel anchors to; clicking it toggles the popover open and closed."
      },
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Optional bold heading rendered at the top of the panel to introduce its interactive content."
      },
      {
        "prop": "placement",
        "type": "\"top\" | \"bottom\" | \"left\" | \"right\"",
        "required": false,
        "default": "\"bottom\"",
        "description": "Which side of the trigger the panel opens toward (top, bottom, left, or right), auto-flipping near viewport edges."
      },
      {
        "prop": "align",
        "type": "\"start\" | \"center\" | \"end\"",
        "required": false,
        "default": "\"center\"",
        "description": "Cross-axis alignment (start, center, or end) of the panel relative to the trigger for top and bottom placements."
      },
      {
        "prop": "width",
        "type": "number",
        "required": false,
        "default": "240",
        "description": "Fixed width of the floating panel in pixels, controlling how much interactive content fits on each line."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The rich interactive content rendered inside the panel, such as inputs, buttons, or links."
      },
      {
        "prop": "open",
        "type": "boolean",
        "required": false,
        "default": "—",
        "description": "Controlled open state - pair with onOpenChange. Omit for internal (uncontrolled) state."
      },
      {
        "prop": "onOpenChange",
        "type": "(open: boolean) => void",
        "required": false,
        "default": "—",
        "description": "Called with the requested open state on trigger click, Esc, or outside click."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Popover, Button, Input } from \"twico-ui\";\n\n<Popover\n  trigger={<Button variant=\"outline\">Share</Button>}\n  title=\"Share link\"\n  placement=\"bottom\"\n>\n  <Input defaultValue=\"https://twico.dev/x\" />\n  <Button fullWidth>Copy link</Button>\n</Popover>",
    "tagline": "Click-triggered floating panel, portaled and flipping"
  },
  {
    "name": "Progress",
    "slug": "progress",
    "group": "Feedback",
    "summary": "Progress is a linear progress bar that can be determinate (driven by a value) or indeterminate, with semantic tones. Use it to show task completion, upload/download progress, or ongoing background work.",
    "importName": "Progress",
    "propsRows": [
      {
        "prop": "value",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Current progress amount that drives how much of the bar is filled, interpreted relative to max."
      },
      {
        "prop": "max",
        "type": "number",
        "required": false,
        "default": "100",
        "description": "Upper bound the bar represents, so value divided by max determines the filled percentage."
      },
      {
        "prop": "tone",
        "type": "\"primary\" | \"info\" | \"success\" | \"warning\" | \"danger\"",
        "required": false,
        "default": "\"primary\"",
        "description": "Added `info` value to the existing tone union; maps the bar fill to var(--color-info)."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Thickness of the bar, sm, md, or lg, to match the visual weight of the surrounding content."
      },
      {
        "prop": "indeterminate",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Switches to a continuously animated bar that ignores value, signaling work of unknown duration."
      },
      {
        "prop": "showLabel",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Displays a percentage label above the bar so users can read the exact completion at a glance."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Progress } from \"twico-ui\";\n\n<Progress value={64} showLabel />\n<Progress value={90} tone=\"success\" />\n<Progress value={45} tone=\"warning\" size=\"lg\" />\n<Progress indeterminate />",
    "tagline": "Linear progress bar, determinate or indeterminate"
  },
  {
    "name": "Radio",
    "slug": "radio",
    "group": "Inputs",
    "summary": "Radio is a single radio button rendered with an optional label and description. Use several Radio inputs sharing the same `name` to let users pick exactly one option from a group.",
    "importName": "Radio",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Text or node rendered beside the radio dot, naming the option the user selects when choosing it."
      },
      {
        "prop": "description",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Secondary helper text shown under the label to add context or clarify what selecting the option means."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\"",
        "required": false,
        "default": "\"md\"",
        "description": "Visual size of the radio control, sm or md, to align with the density of nearby form fields."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message shown below the control; tints the dot red and wires aria-invalid/aria-describedby."
      },
      {
        "prop": "onChange",
        "type": "(e: React.ChangeEvent) => void",
        "required": false,
        "default": "—",
        "description": "Native change handler on the underlying form control."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required for native form validation."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Radio } from \"twico-ui\";\n\n<Radio name=\"plan\" value=\"free\" label=\"Free\" defaultChecked />\n<Radio\n  name=\"plan\"\n  value=\"pro\"\n  label=\"Pro\"\n  description=\"$12 / month\"\n/>",
    "tagline": "Single radio button for grouped choices"
  },
  {
    "name": "Rating",
    "slug": "rating",
    "group": "Inputs",
    "summary": "Rating is a star-rating input that works either as an interactive control (click or hover to set a score) or as a read-only display. Use it to capture user feedback like reviews or to show an existing score; clicking the current star again clears the rating to 0.",
    "importName": "Rating",
    "propsRows": [
      {
        "prop": "value",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Controlled rating from 0 to count, letting the parent own the score and re-render when it changes."
      },
      {
        "prop": "defaultValue",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Initial score for uncontrolled usage, defaulting to 0 so no stars start filled until the user interacts."
      },
      {
        "prop": "count",
        "type": "number",
        "required": false,
        "default": "5",
        "description": "Total number of stars rendered, defaulting to 5, which sets the maximum selectable score."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the star size (sm, md, or lg) to match the surrounding text density, defaulting to md."
      },
      {
        "prop": "color",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Overrides the filled-star color with any CSS color, falling back to the warning/amber token when omitted."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renders the stars as a non-interactive display only, useful for showing an existing score without accepting input."
      },
      {
        "prop": "showValue",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Displays the numeric score beside the stars when enabled, giving an exact figure alongside the visual rating."
      },
      {
        "prop": "onChange",
        "type": "(value: number) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the new rating when the user clicks a star, or 0 when they clear the current selection."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disable all interaction and dim the control."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Rating } from \"twico-ui\";\n\n// Interactive\nconst [r, setR] = React.useState(0);\n<Rating value={r} onChange={setR} />\n\n// Read-only display with numeric value\n<Rating value={4} readOnly showValue />\n\n// Uncontrolled, larger stars\n<Rating defaultValue={3} size=\"lg\" count={5} />",
    "tagline": "Star-rating input or read-only display"
  },
  {
    "name": "Select",
    "slug": "select",
    "group": "Inputs",
    "summary": "A custom select that replaces the native browser dropdown with a rounded, keyboard-navigable popover, supporting grouped options and two-line (title + subtitle) options. Use it when you need a styled single-select with optional in-popover search, grouping, or descriptions.",
    "importName": "Select",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a field label above the trigger to identify what the select controls within a form."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the trigger to guide selection, automatically hidden once an error message is set."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays an error message and marks the field invalid, replacing the hint to flag failed validation."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Appends a required asterisk to the label, signaling that a selection must be made before submitting."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Controls the trigger height (sm, md, or lg) to match the density of nearby form controls, defaulting to md."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "\"Select…\"",
        "description": "Text shown in the trigger when no value is selected, defaulting to \"Select…\" as a prompt to choose."
      },
      {
        "prop": "searchPlaceholder",
        "type": "string",
        "required": false,
        "default": "\"Search…\"",
        "description": "Placeholder text for the in-popover search box, defaulting to \"Search…\" to invite filtering of options."
      },
      {
        "prop": "searchable",
        "type": "boolean",
        "required": false,
        "default": "—",
        "description": "Shows the filter search box inside the popover, auto-enabling when more than five options exist if left unset."
      },
      {
        "prop": "options",
        "type": "Array<string | SelectOption | SelectGroup>",
        "required": true,
        "default": "—",
        "description": "The selectable items as plain strings, {value,label,description} objects, or {group,options} groups for two-line or grouped lists."
      },
      {
        "prop": "value",
        "type": "string | null",
        "required": false,
        "default": "—",
        "description": "Controlled selected value as a string or null, letting the parent own which option is currently chosen."
      },
      {
        "prop": "defaultValue",
        "type": "string | null",
        "required": false,
        "default": "null",
        "description": "Initial selected value for uncontrolled usage, defaulting to null so nothing is selected at first."
      },
      {
        "prop": "onChange",
        "type": "(value: string) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the chosen value string when the user selects an option from the popover."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the trigger so the popover cannot open and no selection can be made."
      },
      {
        "prop": "placement",
        "type": "\"bottom\" | \"top\"",
        "required": false,
        "default": "\"bottom\"",
        "description": "Opens the menu downward or upward from the trigger, defaulting to \"bottom\" for the typical dropdown direction."
      },
      {
        "prop": "portal",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renders the dropdown in a body portal so it is never clipped, auto-flipping when near the viewport bottom."
      },
      {
        "prop": "minWidth",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Sets the minimum popover width in pixels when portaled, ensuring the menu stays at least this wide."
      },
      {
        "prop": "clearable",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Show a clear (×) affix when a value is selected; Delete/Backspace on the closed trigger also clears. Emits onChange(null)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Select } from \"twico-ui\";\n\nconst [v, setV] = useState(null);\n\n<Select\n  label=\"Assignee\"\n  placeholder=\"Pick a teammate\"\n  value={v}\n  onChange={setV}\n  options={[\n    { group: \"Design\", options: [\n      { value: \"ada\", label: \"Ada Park\", description: \"Product designer\" },\n      { value: \"sam\", label: \"Sam Lee\", description: \"Brand designer\" },\n    ]},\n    { group: \"Engineering\", options: [\n      { value: \"jo\", label: \"Jo Kim\", description: \"Frontend\" },\n    ]},\n  ]}\n/>",
    "tagline": "Styled single-select with search and grouping"
  },
  {
    "name": "Sidebar",
    "slug": "sidebar",
    "group": "Navigation",
    "summary": "Sidebar is a collapsible side-navigation panel with a brand header, grouped nav items (icons, labels, badges, or uppercase section headings), an optional footer, and a collapse toggle that switches to an icon-only rail. Use it as the primary app navigation in a fixed-height layout.",
    "importName": "Sidebar",
    "propsRows": [
      {
        "prop": "items",
        "type": "SidebarItem[]",
        "required": true,
        "default": "—",
        "description": "The navigation entries, each a link with label, icon, href, active, onClick, and badge, or a { section } heading."
      },
      {
        "prop": "brand",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Brand or logo content shown in the header, with its text hidden when the sidebar collapses to the icon rail."
      },
      {
        "prop": "footer",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Content pinned above the collapse toggle, such as a user row, anchored to the bottom of the panel."
      },
      {
        "prop": "collapsed",
        "type": "boolean",
        "required": false,
        "default": "—",
        "description": "Controlled collapsed state, letting the parent toggle the sidebar between full width and the icon-only rail."
      },
      {
        "prop": "defaultCollapsed",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Initial collapsed state for uncontrolled usage, defaulting to false so the sidebar starts fully expanded."
      },
      {
        "prop": "collapsible",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Shows the collapse toggle button when true (the default), allowing users to switch to the icon-only rail."
      },
      {
        "prop": "onCollapsedChange",
        "type": "(collapsed: boolean) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the new boolean state whenever the collapse toggle is activated, useful for persisting the preference."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Sidebar } from \"twico-ui\";\n\n<Sidebar\n  brand={<>twico<span style={{ color: \"var(--color-primary)\" }}>UI</span></>}\n  items={[\n    { section: \"Main\" },\n    { label: \"Dashboard\", icon: <HomeIcon />, active: true },\n    { label: \"Inbox\", icon: <MailIcon />, badge: 4 },\n    { section: \"Account\" },\n    { label: \"Settings\", icon: <CogIcon /> },\n  ]}\n  footer={<UserRow />}\n  defaultCollapsed={false}\n/>",
    "tagline": "Collapsible side navigation with grouped items"
  },
  {
    "name": "Skeleton",
    "slug": "skeleton",
    "group": "Feedback",
    "summary": "Skeleton is a shimmering placeholder shown while content loads. Use it to reserve layout space and signal loading for text, avatars, or image/card blocks before real data arrives.",
    "importName": "Skeleton",
    "propsRows": [
      {
        "prop": "variant",
        "type": "\"text\" | \"circle\" | \"rect\"",
        "required": false,
        "default": "\"text\"",
        "description": "Chooses the placeholder shape: text for lines, circle for avatars, or rect for image and card blocks, defaulting to text."
      },
      {
        "prop": "width",
        "type": "string | number",
        "required": false,
        "default": "—",
        "description": "Sets the placeholder width as a CSS string or number, such as \"120px\" or 60, to match expected content."
      },
      {
        "prop": "height",
        "type": "string | number",
        "required": false,
        "default": "—",
        "description": "Sets the placeholder height as a CSS string or number to reserve the vertical space the real content will occupy."
      },
      {
        "prop": "lines",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "For the text variant, the number of lines to render, defaulting to 1, with the last line shortened for realism."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Skeleton } from \"twico-ui\";\n\n<Skeleton variant=\"circle\" width={40} height={40} />\n<Skeleton variant=\"text\" lines={3} />\n<Skeleton variant=\"rect\" height={120} />",
    "tagline": "Shimmering placeholder shown while content loads"
  },
  {
    "name": "Slider",
    "slug": "slider",
    "group": "Inputs",
    "summary": "Slider is a range input with a filled track, draggable thumb, a value bubble that appears while dragging, optional step ticks, and full keyboard support (arrows, Home, End). Use it when users need to pick a number within a range, such as volume, price, or other continuous settings.",
    "importName": "Slider",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a label above the track to describe what the slider adjusts, such as volume or price."
      },
      {
        "prop": "value",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Controlled current value, letting the parent own the slider position and re-render as the number changes."
      },
      {
        "prop": "defaultValue",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Initial value for uncontrolled usage, defaulting to 0 so the thumb starts at the low end."
      },
      {
        "prop": "min",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Lowest value the slider can reach, defaulting to 0, defining the start of the selectable range."
      },
      {
        "prop": "max",
        "type": "number",
        "required": false,
        "default": "100",
        "description": "Highest value the slider can reach, defaulting to 100, defining the end of the selectable range."
      },
      {
        "prop": "step",
        "type": "number",
        "required": false,
        "default": "1",
        "description": "Increment between selectable values, defaulting to 1, which controls how finely the thumb can be positioned."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables dragging and keyboard input while dimming the slider to show it is currently inactive."
      },
      {
        "prop": "showValue",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Displays the current value at the top-right above the track when true (the default), for an always-visible readout."
      },
      {
        "prop": "showTicks",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renders step ticks along the rail when enabled, helping users see and snap to discrete increments."
      },
      {
        "prop": "formatValue",
        "type": "(value: number) => React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Formats the displayed value in the label and drag bubble, useful for adding units, currency, or custom text."
      },
      {
        "prop": "onChange",
        "type": "(value: number) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the new number whenever the value changes via drag or keyboard, keeping state in sync."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Helper text shown below the track when there is no error."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message shown below the track; turns it red (sets aria-invalid) and replaces the hint."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Slider } from \"twico-ui\";\n\nconst [vol, setVol] = React.useState(40);\n\n<Slider label=\"Volume\" value={vol} onChange={setVol} />\n\n<Slider\n  label=\"Price\"\n  min={0}\n  max={1000}\n  step={50}\n  showTicks\n  defaultValue={250}\n  formatValue={(v) => `$${v}`}\n/>",
    "tagline": "Range input with a value bubble and ticks"
  },
  {
    "name": "Spinner",
    "slug": "spinner",
    "group": "Feedback",
    "summary": "An indeterminate loading spinner that signals an ongoing background operation. Use it when content or an action is loading and there's no measurable progress to show, such as inside buttons or over panels.",
    "importName": "Spinner",
    "propsRows": [
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\" | \"xl\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the spinner diameter (sm, md, lg, or xl) so it fits its context, from inside a button to over a panel."
      },
      {
        "prop": "tone",
        "type": "\"primary\" | \"neutral\" | \"white\"",
        "required": false,
        "default": "\"primary\"",
        "description": "Picks the stroke color (primary, neutral, or white); use \"white\" when spinning over colored or dark backgrounds."
      },
      {
        "prop": "label",
        "type": "string",
        "required": false,
        "default": "\"Loading\"",
        "description": "Accessible name exposed via aria-label so screen readers announce the loading state, defaulting to \"Loading\"."
      },
      {
        "prop": "color",
        "type": "\"current\" | \"primary\" | \"neutral\" | \"white\"",
        "required": false,
        "default": "\"current\"",
        "description": "Preferred name for the spinner color; supersedes the deprecated `tone` prop. Wins over `tone` when both are set. Inherits currentColor by default (visible inside buttons, themed)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Spinner } from \"twico-ui\";\n\n<Spinner />\n<Spinner size=\"lg\" />\n<Spinner tone=\"white\" /> {/* on a colored button/background */}",
    "tagline": "Indeterminate loading spinner"
  },
  {
    "name": "Stack",
    "slug": "stack",
    "group": "Layout",
    "importName": "Stack",
    "summary": "Flexbox layout primitive — arranges children in a row or column with token-based gaps. Reach for it instead of hand-written flex divs.",
    "propsRows": [
      {
        "prop": "direction",
        "type": "\"row\" | \"column\"",
        "required": false,
        "default": "\"column\"",
        "description": "Sets the main-axis flow, stacking children vertically with \"column\" (default) or side by side with \"row\"."
      },
      {
        "prop": "gap",
        "type": "number | string",
        "required": false,
        "default": "4",
        "description": "Sets spacing between children, as a numeric spacing step mapped to --space-* or any raw CSS length string."
      },
      {
        "prop": "align",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Maps to the align-items value, controlling how children line up along the cross axis."
      },
      {
        "prop": "justify",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Maps to the justify-content value, controlling how children are distributed along the main axis."
      },
      {
        "prop": "wrap",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Allows children to wrap onto multiple lines instead of overflowing when they exceed the container width."
      },
      {
        "prop": "inline",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Renders the stack as inline-flex rather than block-level flex, so it sits inline with surrounding content."
      },
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "\"div\"",
        "description": "Overrides the rendered element or tag (default \"div\"), useful for semantic wrappers like nav, ul, or section."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Stack } from \"twico-ui\";\n\n<Stack direction=\"row\" gap={3} align=\"center\" wrap>\n  <Button>Save</Button>\n  <Button variant=\"ghost\">Cancel</Button>\n</Stack>",
    "tagline": "Flex row or column with token gaps"
  },
  {
    "name": "Stat",
    "slug": "stat",
    "group": "Data display",
    "summary": "Stat is a KPI / metric card that displays a label, a large value, and optional icon, trend delta, and help text. Use it on dashboards or summary panels to surface a single key metric with its trend direction.",
    "importName": "Stat",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": true,
        "default": "—",
        "description": "Renders the metric's caption shown above the value, naming what the number represents such as \"Revenue\"."
      },
      {
        "prop": "value",
        "type": "React.ReactNode",
        "required": true,
        "default": "—",
        "description": "Renders the large primary metric value that anchors the card, like a count, currency amount, or percentage."
      },
      {
        "prop": "icon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an optional icon in a tinted tile at the top-right corner to visually reinforce the metric's meaning."
      },
      {
        "prop": "delta",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows the trend change beside the value, such as \"+12.5%\" or \"-3%\", to convey movement over a period."
      },
      {
        "prop": "deltaDirection",
        "type": "\"up\" | \"down\" | \"flat\"",
        "required": false,
        "default": "—",
        "description": "Forces the delta's direction and color (up, down, or flat); otherwise it is inferred from a leading minus sign."
      },
      {
        "prop": "helpText",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders muted context after the delta, such as \"vs last month\", to clarify the comparison period."
      },
      {
        "prop": "plain",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Strips the card chrome (border, background, and padding) so the stat blends into an existing surface."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Stat } from \"twico-ui\";\n\n<Stat\n  label=\"Revenue\"\n  value=\"$48,200\"\n  delta=\"+12.5%\"\n  helpText=\"vs last month\"\n/>\n<Stat\n  label=\"Churn\"\n  value=\"2.1%\"\n  delta=\"-0.4%\"\n  deltaDirection=\"up\"\n  helpText=\"improved\"\n/>",
    "tagline": "KPI card with a value and trend delta"
  },
  {
    "name": "Stepper",
    "slug": "stepper",
    "group": "Navigation",
    "summary": "Stepper is a multi-step progress indicator for wizards and checkout flows: steps before the active index show a check, the active step is ringed, and later steps are muted. Use it to show users where they are in a sequential, multi-step process, either horizontally or vertically.",
    "importName": "Stepper",
    "propsRows": [
      {
        "prop": "steps",
        "type": "Step[]  ({ title, description?, icon?, error? })",
        "required": true,
        "default": "—",
        "description": "The ordered array of step objects to render, each with a title and optional description, icon, and error flag."
      },
      {
        "prop": "active",
        "type": "number",
        "required": false,
        "default": "0",
        "description": "Zero-based index of the current step; earlier steps render as complete and later steps as upcoming."
      },
      {
        "prop": "orientation",
        "type": "\"horizontal\" | \"vertical\"",
        "required": false,
        "default": "\"horizontal\"",
        "description": "Lays the stepper out horizontally (default) or vertically to fit wide toolbars or narrow sidebars."
      },
      {
        "prop": "clickable",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Lets users click completed or active steps to navigate back, enabling jump-around movement through the flow."
      },
      {
        "prop": "onStepClick",
        "type": "(index: number) => void",
        "required": false,
        "default": "—",
        "description": "Callback fired with the clicked step's index when steps are clickable, letting you drive navigation."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Stepper } from \"twico-ui\";\n\n<Stepper\n  active={1}\n  steps={[\n    { title: \"Account\", description: \"Your details\" },\n    { title: \"Payment\", description: \"Billing info\" },\n    { title: \"Confirm\" },\n  ]}\n/>\n\n<Stepper\n  orientation=\"vertical\"\n  active={2}\n  clickable\n  onStepClick={setActive}\n  steps={steps}\n/>",
    "tagline": "Multi-step progress indicator for wizards"
  },
  {
    "name": "Switch",
    "slug": "switch",
    "group": "Inputs",
    "summary": "Switch is a toggle control with a springy thumb for instant on/off settings, optionally labeled with a title and supporting description. Use it for binary settings that apply immediately, like enabling dark mode or notifications.",
    "importName": "Switch",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders the title text shown beside the switch, naming the setting it toggles like \"Enable notifications\"."
      },
      {
        "prop": "description",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders secondary helper text below the label to explain what the setting does or its consequences."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\"",
        "required": false,
        "default": "\"md\"",
        "description": "Sets the visual size of the track and thumb (sm or md) to match the density of the surrounding form."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message shown below the control; tints the track red and wires aria-invalid/aria-describedby."
      },
      {
        "prop": "onChange",
        "type": "(e: React.ChangeEvent) => void",
        "required": false,
        "default": "—",
        "description": "Native change handler on the underlying form control."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required for native form validation."
      },
      {
        "prop": "autoComplete",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Browser autocomplete hint (e.g. \"email\", \"off\")."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.InputHTMLAttributes<HTMLInputElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <input> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Switch } from \"twico-ui\";\n\n<Switch label=\"Dark mode\" defaultChecked />\n\n<Switch\n  label=\"Email notifications\"\n  description=\"Send me product updates\"\n/>\n\n<Switch label=\"Compact view\" size=\"sm\" />",
    "tagline": "Toggle control for instant on/off settings"
  },
  {
    "name": "Table",
    "slug": "table",
    "group": "Data display",
    "summary": "A data table with a styled header, hover and zebra-striped rows, client-side click-to-sort headers, custom cell renderers, and selected-row highlighting. Use it to display structured rows of data when you need lightweight sorting and per-column rendering or alignment.",
    "importName": "Table",
    "propsRows": [
      {
        "prop": "columns",
        "type": "TableColumn<T>[]",
        "required": true,
        "default": "—",
        "description": "Defines each column with key, header, optional align, width, sortable flag, and a custom render function for cell content."
      },
      {
        "prop": "hover",
        "type": "boolean",
        "required": false,
        "default": "true",
        "description": "Highlights the row under the cursor on mouse-over, on by default to aid scanning and pointing at dense rows."
      },
      {
        "prop": "striped",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Applies zebra striping to alternating rows when enabled, improving readability across wide tables of similar-looking data."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\"",
        "required": false,
        "default": "\"md\"",
        "description": "Controls cell padding density, choosing sm for compact rows or md for the default roomier spacing."
      },
      {
        "prop": "sortable",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Enables client-side click-to-sort headers when true, letting users reorder rows by any column marked sortable."
      },
      {
        "prop": "rowKey",
        "type": "(row: T, index: number) => string | number",
        "required": false,
        "default": "—",
        "description": "Returns a stable unique key for each row from its data and index, defaulting to the row index."
      },
      {
        "prop": "selectedKeys",
        "type": "Array<string | number>",
        "required": false,
        "default": "—",
        "description": "Lists the keys of rows to render with selected-row highlighting, useful for marking chosen or active records."
      },
      {
        "prop": "sort",
        "type": "TableSort | null",
        "required": false,
        "default": "—",
        "description": "Controlled sort state — pair with onSortChange (null = unsorted)."
      },
      {
        "prop": "defaultSort",
        "type": "TableSort",
        "required": false,
        "default": "{ key: null, dir: \"asc\" }",
        "description": "Initial sort when uncontrolled."
      },
      {
        "prop": "onSortChange",
        "type": "(sort: TableSort) => void",
        "required": false,
        "default": "—",
        "description": "Fired when a sortable header is clicked with the next sort state."
      },
      {
        "prop": "stickyHeader",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Pin the header to the top while the body scrolls (use with maxHeight or an enclosing scroll container)."
      },
      {
        "prop": "maxHeight",
        "type": "number | string",
        "required": false,
        "default": "—",
        "description": "Cap the table height and give it its own vertical scroll area (CSS length or number of px); enables stickyHeader to shine."
      },
      {
        "prop": "rows",
        "type": "T[]",
        "required": false,
        "default": "—",
        "description": "Row objects."
      },
      {
        "prop": "field (column)",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Alias for key (Datatable vocabulary); key wins when both are set."
      },
      {
        "prop": "headerName (column)",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Alias for header (Datatable vocabulary); header wins when both are set."
      },
      {
        "prop": "renderCell (column)",
        "type": "(value: any, row: T, index: number) => React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Alias for render (Datatable vocabulary); render wins when both are set."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Table } from \"twico-ui\";\n\n<Table\n  sortable\n  striped\n  rowKey={(r) => r.id}\n  columns={[\n    { field: \"name\", headerName: \"Name\" },\n    { field: \"role\", headerName: \"Role\" },\n    { field: \"status\", headerName: \"Status\" },\n    { field: \"mrr\", headerName: \"MRR\", align: \"right\" },\n  ]}\n  rows={users}\n/>",
    "tagline": "Sortable data table with custom cell renderers"
  },
  {
    "name": "Tabs",
    "slug": "tabs",
    "group": "Navigation",
    "summary": "Tabbed navigation with a sliding active indicator, available as a line or pill variant. Use it to switch between related views or sections, either controlled (value + onChange) or uncontrolled (defaultValue).",
    "importName": "Tabs",
    "propsRows": [
      {
        "prop": "items",
        "type": "TabItem[]",
        "required": true,
        "default": "—",
        "description": "Defines the tabs to render, each carrying a value, label, and optional icon, count badge, and content."
      },
      {
        "prop": "value",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Sets the active tab value for controlled usage, kept in sync by handling onChange yourself."
      },
      {
        "prop": "defaultValue",
        "type": "string",
        "required": false,
        "default": "items[0]?.value",
        "description": "Sets the initially active tab for uncontrolled usage, defaulting to the first item's value when omitted."
      },
      {
        "prop": "onChange",
        "type": "(value: string) => void",
        "required": false,
        "default": "—",
        "description": "Fires with the newly selected tab value whenever the user switches tabs, used to drive controlled state."
      },
      {
        "prop": "variant",
        "type": "\"line\" | \"pill\"",
        "required": false,
        "default": "\"line\"",
        "description": "Selects the visual style, rendering either a line underline indicator or a pill-shaped background behind the active tab."
      },
      {
        "prop": "orientation",
        "type": "\"horizontal\" | \"vertical\"",
        "required": false,
        "default": "\"horizontal\"",
        "description": "Layout axis. Vertical stacks the tablist with the active indicator on its trailing edge and the panel beside it; ArrowUp/ArrowDown navigate between tabs (Home/End still jump to ends)."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Tabs } from \"twico-ui\";\n\n<Tabs\n  variant=\"line\"\n  defaultValue=\"overview\"\n  items={[\n    { value: \"overview\", label: \"Overview\", content: <p>Overview panel</p> },\n    { value: \"activity\", label: \"Activity\", count: 12, content: <p>Activity panel</p> },\n    { value: \"settings\", label: \"Settings\", content: <p>Settings panel</p> },\n  ]}\n/>",
    "tagline": "Tabbed navigation with a sliding indicator"
  },
  {
    "name": "Tag",
    "slug": "tag",
    "group": "Data display",
    "summary": "Tag is a removable chip for displaying filters, selected items, or keywords. Use it when you need compact, dismissible labels with an optional leading icon and an optional remove (×) button.",
    "importName": "Tag",
    "propsRows": [
      {
        "prop": "onRemove",
        "type": "(e: React.MouseEvent<HTMLButtonElement>) => void",
        "required": false,
        "default": "—",
        "description": "Renders the remove (×) button and handles its click, letting users dismiss the tag as a filter or selection."
      },
      {
        "prop": "leftIcon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders an optional leading icon before the label, useful for signaling the tag's category or status."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Provides the tag's label content, typically the filter name, selected item, or keyword being displayed."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Tag } from \"twico-ui\";\n\n<Tag onRemove={() => remove(\"react\")}>React</Tag>\n<Tag leftIcon={<span>#</span>}>design-system</Tag>\n<Tag>read-only</Tag>",
    "tagline": "Removable chip for filters and keywords"
  },
  {
    "name": "Text",
    "slug": "text",
    "group": "Typography",
    "importName": "Text",
    "summary": "Body text with token sizes and semantic color tones. Use it instead of bare paragraph/span tags.",
    "propsRows": [
      {
        "prop": "size",
        "type": "\"xs\" | \"sm\" | \"base\" | \"lg\" | \"xl\"",
        "required": false,
        "default": "\"base\"",
        "description": "Picks the font-size token from xs to xl, scaling the body text to fit its context, base by default."
      },
      {
        "prop": "tone",
        "type": "\"default\" | \"muted\" | \"subtle\" | \"primary\" | \"danger\"",
        "required": false,
        "default": "\"default\"",
        "description": "Applies a semantic color such as muted, subtle, primary, or danger to convey emphasis or meaning."
      },
      {
        "prop": "weight",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Sets the font-weight token suffix like semibold to adjust how heavy the text appears."
      },
      {
        "prop": "align",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Sets the text-align value, controlling whether the text reads left, center, right, or justified."
      },
      {
        "prop": "as",
        "type": "ElementType",
        "required": false,
        "default": "\"p\"",
        "description": "Chooses the element or tag rendered, defaulting to p so you can swap in span or other tags."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Text } from \"twico-ui\";\n\n<Text>Default paragraph text.</Text>\n<Text size=\"sm\" tone=\"muted\">A muted caption.</Text>",
    "tagline": "Body text with token sizes and tones"
  },
  {
    "name": "Textarea",
    "slug": "textarea",
    "group": "Inputs",
    "summary": "Textarea is a multi-line text input with an optional label, hint text, and error state for longer-form content. Use it when collecting paragraph-length input like bios, descriptions, or comments.",
    "importName": "Textarea",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Renders a field label above the textarea, identifying what longer-form input the control collects."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Shows helper text below the textarea to guide input, hidden whenever an error message is present."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Displays an error message and marks the field invalid when set, replacing the hint text below."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Adds a required asterisk beside the label when true, signaling that the field must be filled in."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Control size — same padding steps as Input."
      },
      {
        "prop": "onChange",
        "type": "(e: React.ChangeEvent) => void",
        "required": false,
        "default": "—",
        "description": "Native change handler on the underlying form control."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "name",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Form field name submitted with the value."
      },
      {
        "prop": "placeholder",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Placeholder text shown while the field is empty."
      },
      {
        "prop": "rows",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Visible number of text rows."
      },
      {
        "prop": "disabled",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Disables the control — no interaction and a dimmed appearance."
      },
      {
        "prop": "readOnly",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Makes the field non-editable while still focusable/selectable."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.TextareaHTMLAttributes<HTMLTextAreaElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for <textarea> — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Textarea } from \"twico-ui\";\n\n<Textarea\n  label=\"Bio\"\n  rows={4}\n  placeholder=\"Tell us about yourself\"\n  hint=\"Max 280 characters\"\n/>",
    "tagline": "Multi-line text field with validation"
  },
  {
    "name": "Timeline",
    "slug": "timeline",
    "group": "Data display",
    "summary": "Timeline renders a vertical list of events as node dots connected by a rail, each showing a title, optional timestamp, and description. Use it for activity feeds, order tracking, or history views.",
    "importName": "Timeline",
    "propsRows": [
      {
        "prop": "items",
        "type": "TimelineItem[] — { title, time?, description?, icon?, tone? }",
        "required": true,
        "default": "—",
        "description": "Array of events to render as connected node dots, each with a title, optional time, description, icon, and primary/success/warning/danger tone."
      },
      {
        "prop": "className",
        "type": "string",
        "required": false,
        "default": "\"\"",
        "description": "Extra CSS class appended to the root <ul> so you can layer custom spacing or styling onto the timeline."
      },
      {
        "prop": "tone (TimelineItem)",
        "type": "\"primary\" | \"info\" | \"success\" | \"warning\" | \"danger\"",
        "required": false,
        "default": "—",
        "description": "Added `info` value to the per-item node tone union; maps the dot to var(--color-info) with var(--color-info-fg) icon color."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Timeline } from \"twico-ui\";\n\n<Timeline\n  items={[\n    { title: \"Order placed\", time: \"9:41 AM\", description: \"We received your order.\", tone: \"primary\" },\n    { title: \"Shipped\", time: \"2:10 PM\", description: \"Left the warehouse.\", tone: \"success\" },\n    { title: \"Out for delivery\", time: \"Tomorrow\" },\n  ]}\n/>",
    "tagline": "Vertical event feed of connected nodes"
  },
  {
    "name": "Toast",
    "slug": "toast",
    "group": "Feedback",
    "summary": "Toast is a transient notification card with a tone accent, optional title/icon, and a dismiss button. Use it to surface brief feedback (success, warning, error, info) by managing a list of toasts in state and rendering them inside a fixed-position ToastViewport.",
    "importName": "Toast, ToastViewport",
    "propsRows": [
      {
        "prop": "tone",
        "type": "\"default\" | \"neutral\" | \"success\" | \"warning\" | \"danger\" | \"info\"",
        "required": false,
        "default": "\"default\"",
        "description": "\"neutral\" is now accepted as an alias for \"default\" (aligns with Badge's tone vocabulary). No new standalone props were added."
      },
      {
        "prop": "title",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Bold heading text shown above the body content to summarize what the toast is reporting at a glance."
      },
      {
        "prop": "icon",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Custom leading icon that overrides the default tone icon when you want a more specific visual marker."
      },
      {
        "prop": "onClose",
        "type": "() => void",
        "required": false,
        "default": "—",
        "description": "Callback invoked on dismissal; providing it also reveals the close button so users can manually remove the toast."
      },
      {
        "prop": "duration",
        "type": "number",
        "required": false,
        "default": "4500",
        "description": "Milliseconds before the toast auto-dismisses and calls onClose (default 4500); the countdown pauses on hover or focus, and 0 or Infinity keeps it open."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Body or description content rendered beneath the title to give users the detailed message of the notification."
      },
      {
        "prop": "limit (ToastViewport)",
        "type": "number",
        "required": false,
        "default": "—",
        "description": "Caps how many toasts the viewport shows at once, keeping the most recent and dropping older ones so bursts never flood the screen."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Toast, ToastViewport } from \"twico-ui\";\n\nconst [toasts, setToasts] = useState([]);\nconst push = (t) => setToasts((s) => [...s, { id: Date.now(), ...t }]);\nconst remove = (id) => setToasts((s) => s.filter((t) => t.id !== id));\n\n{/* limit caps what's shown; each toast auto-dismisses after ~4.5s */}\n<ToastViewport limit={4}>\n  {toasts.map((t) => (\n    <Toast\n      key={t.id}\n      tone={t.tone}\n      title={t.title}\n      onClose={() => remove(t.id)}\n    >\n      {t.body}\n    </Toast>\n  ))}\n</ToastViewport>",
    "tagline": "Transient notification card in a fixed viewport"
  },
  {
    "name": "Tooltip",
    "slug": "tooltip",
    "group": "Overlay",
    "summary": "Tooltip is a small hover/focus overlay that wraps a single trigger element and shows a label on interaction. Use it to surface short, supplementary hints (like icon-button descriptions) without cluttering the UI.",
    "importName": "Tooltip",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": true,
        "default": "—",
        "description": "The short hint text or content revealed on hover or focus, ideal for describing icon buttons without cluttering the layout."
      },
      {
        "prop": "placement",
        "type": "\"top\" | \"bottom\" | \"left\" | \"right\"",
        "required": false,
        "default": "\"top\"",
        "description": "Chooses which side of the trigger the tooltip appears on, one of top, bottom, left, or right (default top)."
      },
      {
        "prop": "delay",
        "type": "number",
        "required": false,
        "default": "120",
        "description": "Open delay in milliseconds before the tooltip appears (default 120), preventing flicker as the pointer passes over triggers."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": true,
        "default": "—",
        "description": "The single trigger element the tooltip wraps and attaches its hover and focus listeners to."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Tooltip } from \"twico-ui\";\n\n<Tooltip label=\"Copy to clipboard\" placement=\"top\">\n  <button aria-label=\"Copy\">Copy</button>\n</Tooltip>",
    "tagline": "Hover or focus hint on a trigger"
  },
  {
    "name": "TreeView",
    "slug": "treeview",
    "group": "Navigation",
    "summary": "TreeView renders a hierarchical, expand/collapse tree with indentation, icons, badges, and a selectable row. Use it for file explorers and nested navigation where items have parent/child relationships.",
    "importName": "TreeView",
    "propsRows": [
      {
        "prop": "defaultExpanded",
        "type": "string[]",
        "required": false,
        "default": "[]",
        "description": "Node ids that start expanded on first render, letting you reveal specific branches of the tree by default."
      },
      {
        "prop": "selectedId",
        "type": "string | null",
        "required": false,
        "default": "—",
        "description": "Controlled id of the currently selected node; omit it to let the component manage selection internally on its own."
      },
      {
        "prop": "onSelect",
        "type": "(id: string, node: TreeNode) => void",
        "required": false,
        "default": "—",
        "description": "Fired when a row is clicked, id first (the full node is the second argument)."
      },
      {
        "prop": "expanded",
        "type": "string[]",
        "required": false,
        "default": "—",
        "description": "Controlled expanded node ids (pair with `onExpandedChange`)."
      },
      {
        "prop": "onExpandedChange",
        "type": "(ids: string[]) => void",
        "required": false,
        "default": "—",
        "description": "Fired with the next expanded ids whenever a row expands or collapses."
      },
      {
        "prop": "items",
        "type": "TreeNode[]",
        "required": false,
        "default": "[]",
        "description": "Tree nodes."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id applied to the root element, handy for labels and aria wiring."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { TreeView } from \"twico-ui\";\n\n<TreeView\n  defaultExpanded={[\"src\"]}\n  onSelect={(id) => open(id)}\n  items={[\n    { id: \"src\", label: \"src\", children: [\n      { id: \"app\", label: \"App.tsx\" },\n      { id: \"comp\", label: \"components\", children: [\n        { id: \"btn\", label: \"Button.tsx\", badge: 3 },\n      ]},\n    ]},\n  ]}\n/>",
    "tagline": "Hierarchical expand and collapse tree"
  },
  {
    "name": "Field",
    "slug": "field",
    "group": "Inputs",
    "importName": "Field",
    "tagline": "Shared label / hint / error / required field chrome",
    "summary": "Field is the reusable form-field wrapper that supplies the label, required asterisk, helper hint, and error message (with the matching ARIA ids) that Input and Select already use internally. Wrap any control with it to get consistent field spacing, the danger-colored error treatment, and the aria-describedby target without re-implementing the markup.",
    "propsRows": [
      {
        "prop": "label",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Field label rendered above the control."
      },
      {
        "prop": "hint",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Helper text shown below when there is no error."
      },
      {
        "prop": "error",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Error message — replaces the hint and renders in the danger color."
      },
      {
        "prop": "required",
        "type": "boolean",
        "required": false,
        "default": "false",
        "description": "Marks the field required, adding an asterisk after the label."
      },
      {
        "prop": "htmlFor",
        "type": "string",
        "required": false,
        "default": "—",
        "description": "Id of the control the <label> binds to (sets the label's htmlFor)."
      },
      {
        "prop": "size",
        "type": "\"sm\" | \"md\" | \"lg\"",
        "required": false,
        "default": "\"md\"",
        "description": "Spacing scale for parity with Input/Select; exposed via data-size on the root."
      },
      {
        "prop": "id",
        "type": "string",
        "required": false,
        "default": "auto",
        "description": "Base id; the hint/error element gets `${id}-desc` for your control's aria-describedby."
      },
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "The control(s) the field wraps."
      },
      {
        "prop": "onClick",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Click handler — fires when the element is clicked or tapped."
      },
      {
        "prop": "onMouseEnter",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer enters the element (e.g. to open a hovercard)."
      },
      {
        "prop": "onMouseLeave",
        "type": "(e: React.MouseEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the pointer leaves the element."
      },
      {
        "prop": "onFocus",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element receives keyboard or pointer focus."
      },
      {
        "prop": "onBlur",
        "type": "(e: React.FocusEvent) => void",
        "required": false,
        "default": "—",
        "description": "Fires when the element loses focus."
      },
      {
        "prop": "onKeyDown",
        "type": "(e: React.KeyboardEvent) => void",
        "required": false,
        "default": "—",
        "description": "Key-down handler on the element, for custom keyboard shortcuts."
      },
      {
        "prop": "style",
        "type": "React.CSSProperties",
        "required": false,
        "default": "—",
        "description": "Inline styles merged onto the root element after the component's own."
      },
      {
        "prop": "...rest",
        "type": "React.HTMLAttributes<HTMLElement>",
        "required": false,
        "default": "—",
        "description": "Every other standard prop for the root element — remaining event handlers, plus `data-*` and `aria-*` attributes — is forwarded to it."
      }
    ],
    "snippet": "import { Field, Input } from \"twico-ui\";\n\n// Wrap any control to get the shared label/hint/error chrome.\n<Field label=\"Email\" hint=\"We'll never share it.\" required htmlFor=\"email\">\n  <input id=\"email\" type=\"email\" />\n</Field>\n\n<Field label=\"Token\" error=\"That token is invalid.\" htmlFor=\"tok\">\n  <input id=\"tok\" aria-invalid aria-describedby=\"<id>-desc\" />\n</Field>"
  },
  {
    "name": "ToastProvider",
    "slug": "toast-provider",
    "group": "Feedback",
    "importName": "ToastProvider, useToast",
    "tagline": "Imperative toast manager (useToast)",
    "summary": "ToastProvider drops a ready-made toast manager into your tree: it owns the toast list and renders a single ToastViewport, so you no longer hand-manage an array in state. Anywhere beneath it, call const { toast } = useToast() and fire toast.success(\"Saved\") or toast.error({ title, description }); each toast auto-dismisses on the shared timer.",
    "propsRows": [
      {
        "prop": "children",
        "type": "React.ReactNode",
        "required": false,
        "default": "—",
        "description": "Your app — anything under the provider can call useToast()."
      },
      {
        "prop": "limit",
        "type": "number",
        "required": false,
        "default": "4",
        "description": "Maximum toasts shown at once (the most recent are kept)."
      },
      {
        "prop": "duration",
        "type": "number",
        "required": false,
        "default": "4500",
        "description": "Default auto-dismiss duration (ms) for toasts that don't set their own."
      },
      {
        "prop": "toast() (useToast)",
        "type": "(opts) => number",
        "required": false,
        "default": "—",
        "description": "Push a toast; has tone helpers toast.success/warning/danger/error/info(title, options?)."
      },
      {
        "prop": "dismiss / clear (useToast)",
        "type": "(id) => void / () => void",
        "required": false,
        "default": "—",
        "description": "Remove one toast by id, or clear them all."
      }
    ],
    "snippet": "import { ToastProvider, useToast, Button } from \"twico-ui\";\n\nfunction App() {\n  return (\n    <ToastProvider limit={4}>\n      <Page />\n    </ToastProvider>\n  );\n}\n\nfunction Page() {\n  const { toast } = useToast();\n  return (\n    <Button onClick={() => toast.success(\"Saved\")}>Save</Button>\n  );\n}"
  }
];
