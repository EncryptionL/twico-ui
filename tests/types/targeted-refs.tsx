// Compile-only fixture for #490 — the nine components converted to forwardRef must accept a ref of
// the right element type, and reject the wrong one. Typechecked by `npm run typecheck`.
//
// This is the half no runtime test can cover: #488's reported symptom was `error TS2322`, not a
// behavioural failure, and every one of these had the same gap.
import * as React from "react";
import {
  Button, IconButton, Checkbox, Switch, Radio, Select, Combobox, MultiSelect, Code,
} from "../../src";

export function targetedRefFixture() {
  const btn = React.useRef<HTMLButtonElement>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const el = React.useRef<HTMLElement>(null);
  const opts = [{ label: "A", value: "a" }];

  // focus management, the motivating use case
  const focusFirst = () => btn.current?.focus();
  void focusFirst;

  return (
    <>
      <Button ref={btn}>Go</Button>
      <IconButton ref={btn} aria-label="Go">x</IconButton>
      <Checkbox ref={input} label="C" />
      <Switch ref={input} label="S" />
      <Radio ref={input} label="R" name="g" value="a" />
      <Select ref={btn} label="Sel" options={opts} />
      <Combobox ref={input} label="Cb" options={opts} />
      <MultiSelect ref={input} label="Ms" options={opts} />
      <Code ref={el}>x</Code>

      {/* a callback ref, including the React 19 cleanup form the merge helper now honours */}
      <Checkbox label="C" ref={(n) => { void n?.indeterminate; }} />
      <Select label="Sel" options={opts} ref={(n) => { const id = n?.id; return () => void id; }} />

      {/* @ts-expect-error — Button's ref is a button, not an input */}
      <Button ref={input}>Go</Button>
      {/* @ts-expect-error — Checkbox's ref is an input, not a button */}
      <Checkbox ref={btn} label="C" />
      {/* @ts-expect-error — Select's trigger is a button, not an input */}
      <Select ref={input} label="Sel" options={opts} />
      {/* @ts-expect-error — Combobox's ref is an input, not a button */}
      <Combobox ref={btn} label="Cb" options={opts} />
    </>
  );
}
