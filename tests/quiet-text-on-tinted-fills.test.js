import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// #462 (review) — the guard this issue should have shipped with.
//
// `--color-text-subtle` on `--color-surface-sunken` is 4.344:1 in light, and on `--color-primary-subtle`
// 4.256:1. Neither can be fixed by moving the ramp, because the background moves with the text — so the
// rule is structural: quiet text that can end up on one of those fills must use `--color-text-muted`
// (6.92:1 / 6.78:1). tests/tokens-a11y.test.js asserts the token PAIRINGS but only reads
// tokens/colors.css, so it cannot see a call site. That gap is why #462 shipped having missed six sites:
// a child's own `color` declaration beats the tinted parent's, so the text does not follow the row, and
// each one passes at rest on a plain surface and fails only once the row is hovered, active or selected.
//
// Each entry below is a selector whose element sits inside something that takes a sunken or tinted
// fill — verified against that component's own CSS. Reverting any of them to text-subtle fails here.
//
// What this does NOT do: it cannot discover the pattern in a component nobody has classified yet.
// Saying so explicitly, because the thing that made #462 incomplete was a comment claiming a guard
// existed where none did. Adding a component here is a manual step; the co-occurrence query in the
// commit message for this change is the way to find candidates.

const read = (p) => readFileSync(resolve(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");

/** The declaration block for the first rule whose selector list contains `selector`. */
function ruleBody(src, selector) {
  const i = src.indexOf(selector);
  if (i < 0) throw new Error(`selector not found: ${selector}`);
  const open = src.indexOf("{", i);
  return src.slice(open + 1, src.indexOf("}", open));
}

// [file, selector, what puts a tinted/sunken fill underneath it]
const QUIET_TEXT_ON_FILLS = [
  ["components/data-display/List.jsx", ".twc-list__trail", '.twc-list__item[data-interactive]:hover / [data-active]'],
  ["components/data-display/AvatarMenu.jsx", ".twc-avatar-menu__sub", ".twc-avatar-menu:hover"],
  ["components/data-display/Datatable.jsx", ".twc-dt__rownum", ".twc-dt__row:hover .twc-dt__td"],
  ["components/data-display/Datatable.jsx", ".twc-dt__col-combined", ".twc-dt__row:hover .twc-dt__td"],
  ["components/data-display/Datatable.jsx", ".twc-dt__mi-hint", ".twc-dt__mi:hover"],
  ["components/data-display/Datatable.jsx", ".twc-dt__diff-old", ".twc-dt__row:hover .twc-dt__td"],
  ["components/overlay/Menu.jsx", ".twc-menu__shortcut", '.twc-menu__item:hover / [data-active]'],
  ["components/overlay/CommandPalette.jsx", ".twc-cmdk__item-desc", '.twc-cmdk__item[data-active]'],
  ["components/overlay/CommandPalette.jsx", ".twc-cmdk__item-sc", '.twc-cmdk__item[data-active]'],
  ["components/navigation/TreeView.jsx", ".twc-tree__badge", '.twc-tree__row:hover / [data-selected]'],
  ["components/inputs/FileUpload.jsx", ".twc-upload__hint", '.twc-upload__zone:hover / [data-drag]'],
  ["components/inputs/Input.jsx", ".twc-input__affix", ".twc-input[data-readonly]"],
  ["components/data-display/Table.jsx", ".twc-table__empty", '.twc-table[data-hover="true"] tbody tr:hover (hover defaults to TRUE)'],
  ["components/data-display/Datatable.jsx", ".twc-dt__pivot td[data-empty]", ".twc-dt__row:hover .twc-dt__td"],
  ["components/inputs/DatePicker.jsx", '.twc-dp__day[data-outside="true"]', ".twc-dp__day:hover"],
  ["components/inputs/DatePicker.jsx", '.twc-dp__yr[data-outside="true"]', ".twc-dp__yr:hover"],
  ["components/inputs/DateRangePicker.jsx", '.twc-drp__day[data-outside="true"]', '.twc-drp__day:hover / [data-in]'],
  ["components/inputs/DateRangePicker.jsx", '.twc-drp__yr[data-outside="true"]', ".twc-drp__yr:hover"],
];

describe("quiet text that can land on a tinted or sunken fill uses text-muted (#462)", () => {
  for (const [file, selector, why] of QUIET_TEXT_ON_FILLS) {
    it(`${selector} in ${file.split("/").pop()} (under ${why})`, () => {
      const body = ruleBody(read(file), selector);
      expect(body, `${selector} must not use --color-text-subtle here`).not.toMatch(/--color-text-subtle/);
      expect(body, `${selector} should declare a colour`).toMatch(/--color-text-muted|--color-text\b/);
    });
  }

  // The readonly placeholders are a separate construct: a scoped override rather than a changed value,
  // so assert the override exists rather than the absence of text-subtle (the base rule keeps it).
  const READONLY_PLACEHOLDERS = [
    ["components/inputs/Input.jsx", '.twc-input[data-readonly] .twc-input__el::placeholder'],
    ["components/inputs/Textarea.jsx", ".twc-textarea__el[data-readonly]::placeholder"],
    ["components/inputs/Currency.jsx", '.twc-cur[data-readonly="true"] .twc-cur__el::placeholder'],
    ["components/inputs/CurrencyField.jsx", '.twc-cur[data-readonly="true"] .twc-cur__el::placeholder'],
  ];
  for (const [file, selector] of READONLY_PLACEHOLDERS) {
    it(`${file.split("/").pop()} scopes its readonly placeholder to text-muted`, () => {
      const src = read(file);
      expect(src, "readonly fill must exist for this override to matter").toMatch(/data-readonly[^{]*\{[^}]*--color-surface-sunken/);
      expect(ruleBody(src, selector)).toMatch(/--color-text-muted/);
    });
  }
});
