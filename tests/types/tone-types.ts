// Compile-only guard for #169. Typechecked by `npm run typecheck` (tests/types is
// in tsconfig include). The exported tone unions must accept the right members and
// reject the wrong ones — the @ts-expect-error lines fail the build if the union
// ever widens/narrows incorrectly.
import type { Tone, ActionTone, TextTone, ToastTone, BarTone } from "../../src";

const _tone: Tone = "neutral";
const _action: ActionTone = "danger";
const _text: TextTone = "muted";
const _textScale: TextTone = "success"; // TextTone subsumes the full Tone scale
const _toast: ToastTone = "default";
const _bar: BarTone = "info";

// @ts-expect-error — BarTone excludes "neutral"
const _barBad: BarTone = "neutral";
// @ts-expect-error — ActionTone is brand/danger only
const _actionBad: ActionTone = "success";
// @ts-expect-error — Tone has no "default" role (that is TextTone/ToastTone)
const _toneBad: Tone = "default";

void [_tone, _action, _text, _textScale, _toast, _bar, _barBad, _actionBad, _toneBad];
