// Compile-only guard for #168. The shared Option/OptionGroup type must be mutually
// assignable with each per-component alias, and a single Option[] value must feed
// all three Select-family components' `options` prop.
import type {
  Option,
  OptionGroup,
  SelectOption,
  ComboboxOption,
  MultiSelectOption,
  SelectProps,
  ComboboxProps,
  MultiSelectProps,
} from "../../src";

const opt: Option = { value: "a", label: "A", description: "first" };
const sel: SelectOption = opt;
const combo: ComboboxOption = opt;
const multi: MultiSelectOption = opt;
const back: Option = sel; // aliases are structurally identical

const group: OptionGroup = { group: "G", options: ["x", opt] };
const opts: Option[] = [opt];

// One Option[] value satisfies every component's `options` prop.
const _s: SelectProps["options"] = opts;
const _c: ComboboxProps["options"] = opts;
const _m: MultiSelectProps["options"] = opts;
const _g: SelectProps["options"] = [group];

void [combo, multi, back, _s, _c, _m, _g];
