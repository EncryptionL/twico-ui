// Shared option shape for the Select family (Select, Combobox, MultiSelect). One
// canonical pair instead of three byte-identical duplicates; the per-component names
// (SelectOption, ComboboxOption, …) stay as structural aliases so existing imports
// keep resolving. Types only — no runtime. CurrencyField's CurrencyOption is a
// deliberately separate, narrower shape and is NOT unified here.

/** A single selectable option. */
export interface Option {
  value: string;
  label: string;
  /** Optional second line shown under the label. */
  description?: string;
  /** Disable this option — not selectable, skipped by keyboard navigation. */
  disabled?: boolean;
}

/** A labeled group of options (or bare string values). */
export interface OptionGroup {
  group: string;
  options: Array<string | Option>;
}
