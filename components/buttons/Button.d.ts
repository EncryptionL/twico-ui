import * as React from "react";
import type { Tone } from "../_types";

/**
 * Primary action button with a solid / soft / outline / ghost **variant** (fill style) crossed with a
 * **tone** (primary / danger color), four sizes, loading state, icons, and a click ripple. A danger
 * button is `tone="danger"` with any variant (e.g. `<Button tone="danger">`, `<Button variant="soft"
 * tone="danger">`) — danger is no longer a variant value.
 *
 * @startingPoint section="Buttons" subtitle="Action button with ripple + variants" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Fill style. @default "solid" */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /**
   * Color/intent, orthogonal to `variant`. @default "primary"
   *
   * #504: the full {@link Tone} scale, widened from `ActionTone` (`primary | danger`). A standalone
   * affirmative action — a row-level confirm sitting beside a `danger` sibling, reading as
   * "yes / no" — could not be green, so the colour carrying that distinction came out the same blue
   * as every neutral action on the page. `ActionTone` is still exported and still describes the two
   * intents most actions want; it is no longer the ceiling.
   *
   * `neutral` follows Badge's mapping rather than an accent ramp of its own: `--color-text` on
   * `--color-surface` for `solid`, `--color-surface-sunken` for `soft`. Note `variant="ghost"` and
   * `variant="outline"` already express a quiet action, so reach for those first.
   */
  tone?: Tone;
  /** Control size; "xs" (~26px) is smaller than "sm". @default "md" */
  size?: "xs" | "sm" | "md" | "lg";
  /** Icon node rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon node rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Show a spinner and block interaction. @default false */
  loading?: boolean;
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean;
  /** #398: when `disabled`, stay in the tab order (render `aria-disabled` instead of native `disabled`) so a
   *  wrapping `Tooltip` explaining *why* it's disabled is reachable by keyboard. Click and Enter/Space are
   *  still blocked and the disabled styling still applies. @default false */
  focusableWhenDisabled?: boolean;
  /** #405: toggle "on" state — sets `aria-pressed` and shows a soft fill + border in the current `tone`
   *  (works with any `variant`). Omit for a plain (non-toggle) button. @default undefined */
  pressed?: boolean;
  /** #411: tone of the pressed ("on") fill, so a toggle can carry a different selected-state meaning
   *  from its unpressed look. Both are the full `Tone` scale since #504 — before that `tone` was
   *  `ActionTone` and this was the only way to reach the other four. Defaults to `tone`.
   *  @default undefined */
  pressedTone?: Tone;
  /** Render as a different element (e.g. "a"). @default "button" */
  as?: "button" | "a";
  /** Link destination — only used with as="a"; scheme-sanitized (javascript:/data:/vbscript: render without href). */
  href?: string;
  /** Anchor target — only used with as="a" (e.g. "_blank"). */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel — only used with as="a"; pair "noopener noreferrer" with target="_blank". */
  rel?: string;
  children?: React.ReactNode;
}

/**
 * #490: forwards `ref` to the `<button>` (or the `<a>` when `as="a"` — `ButtonProps` already commits to
 * `ButtonHTMLAttributes<HTMLButtonElement>`, so the declared element type follows it).
 *
 * Declared rather than left to React 19's implicit pass-through: on React 19 `ref` is an ordinary
 * prop, so `{...rest}` would land one on the element anyway, but React 18 strips it and the type
 * denied it on both. `forwardRef` works on both majors — see #488.
 */
export declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;
