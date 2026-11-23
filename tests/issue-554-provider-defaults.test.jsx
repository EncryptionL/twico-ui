import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Datatable, CardGrid, TwicoProvider, DiffTable, Card, Text } from "../src/index.ts";
import { NonceContext } from "../components/_styles.js";
import { DefaultsContext, useStableDefaults } from "../components/_defaults.js";

afterEach(cleanup);

const COLS = [{ field: "name", headerName: "Name" }, { field: "state", headerName: "State" }];
const ROWS = [
  { id: "a", name: "Alpha", state: "live" },
  { id: "b", name: "Bravo", state: "removed" },
  { id: "c", name: "Charlie", state: "live" },
];
const key = (r) => r.id;

const strips = (c) => [...c.querySelectorAll(".twc-dt__row-resizer")];
const scrollH = (c) => c.querySelector(".twc-dt__scroll").style.maxHeight;

// =================================================================================================
describe("TwicoProvider — component defaults (#554)", () => {
  it("a default reaches a grid mounted directly, with no wrapper component", () => {
    const { container } = render(
      <TwicoProvider defaults={{ Datatable: { rowResize: true } }}>
        <Datatable columns={COLS} rows={ROWS} rowKey={key} />
      </TwicoProvider>);
    expect(strips(container).length, "the prop nobody wrote at this call site").toBe(ROWS.length);
  });

  it("a call site always wins - built-in < provider default < prop", () => {
    const { container } = render(
      <TwicoProvider defaults={{ Datatable: { rowResize: true, height: 300 } }}>
        <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize={false} height={500} />
      </TwicoProvider>);
    expect(strips(container).length).toBe(0);
    expect(scrollH(container)).toBe("500px");
  });

  it("a prop passed as undefined does NOT veto the default", () => {
    const flag = undefined;
    const { container } = render(
      <TwicoProvider defaults={{ Datatable: { rowResize: true } }}>
        <Datatable columns={COLS} rows={ROWS} rowKey={key} rowResize={flag} />
      </TwicoProvider>);
    expect(strips(container).length,
      "omitting a prop and passing undefined have to mean the same thing").toBe(ROWS.length);
  });

  it("the built-in default still applies when neither supplies one", () => {
    const { container } = render(
      <TwicoProvider defaults={{ Datatable: { height: 300 } }}>
        <Datatable columns={COLS} rows={ROWS} rowKey={key} />
      </TwicoProvider>);
    expect(strips(container).length, "rowResize = false from the signature").toBe(0);
    expect(scrollH(container)).toBe("300px");
  });

  it("the nearest provider wins, so a subtree can opt out", () => {
    const { container } = render(
      <TwicoProvider defaults={{ Datatable: { rowResize: true } }}>
        <TwicoProvider defaults={{ Datatable: { rowResize: false } }}>
          <Datatable columns={COLS} rows={ROWS} rowKey={key} />
        </TwicoProvider>
      </TwicoProvider>);
    expect(strips(container).length).toBe(0);
  });

  it("no provider changes nothing", () => {
    const { container } = render(<Datatable columns={COLS} rows={ROWS} rowKey={key} />);
    expect(strips(container).length).toBe(0);
    expect(scrollH(container)).toBe("440px");
  });

  it("a provider with no defaults changes nothing either", () => {
    const { container } = render(
      <TwicoProvider nonce="abc"><Datatable columns={COLS} rows={ROWS} rowKey={key} /></TwicoProvider>);
    expect(strips(container).length).toBe(0);
  });

  it("CardGrid reads the channel too", () => {
    const { container } = render(
      <TwicoProvider defaults={{ CardGrid: { searchable: true } }}>
        <CardGrid rows={ROWS} rowKey="id" renderCard={(r) => <Card><Text>{r.name}</Text></Card>} />
      </TwicoProvider>);
    expect(container.querySelector("input[type='search'], .twc-cardgrid input"),
      "a default nobody wrote at this call site").not.toBeNull();
  });

  it("names a key that reaches no component, instead of silently doing nothing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <TwicoProvider defaults={{ Buttton: { size: "sm" } }}>
        <Datatable columns={COLS} rows={ROWS} rowKey={key} />
      </TwicoProvider>);
    expect(warn).toHaveBeenCalled();
    const msg = warn.mock.calls.map((c) => String(c[0])).join(" ");
    expect(msg).toContain("Buttton");
    expect(msg, "and says which components do read it").toContain("Datatable");
    warn.mockRestore();
  });

  it("says nothing about a key that IS wired up", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <TwicoProvider defaults={{ Datatable: { rowResize: true }, CardGrid: { searchable: true } }}>
        <Datatable columns={COLS} rows={ROWS} rowKey={key} />
      </TwicoProvider>);
    expect(warn.mock.calls.filter((c) => String(c[0]).includes("TwicoProvider"))).toEqual([]);
    warn.mockRestore();
  });

  // The reason useStableDefaults exists, and it was entirely unguarded: `grep -rn useStableDefaults
  // tests/` returned nothing, which is how the non-primitive hole below survived review.
  describe("context identity", () => {
    const seen = (valuesOut, defaultsFor) => {
      const Probe = () => { valuesOut.push(React.useContext(DefaultsContext)); return null; };
      const Host = ({ n }) => {
        const value = useStableDefaults(defaultsFor(n));
        return <DefaultsContext.Provider value={value}><Probe /></DefaultsContext.Provider>;
      };
      const { rerender } = render(<Host n={1} />);
      rerender(<Host n={2} />);
      rerender(<Host n={3} />);
      return new Set(valuesOut).size;
    };

    it("an inline literal of primitives is one stable value across re-renders", () => {
      const out = [];
      expect(seen(out, () => ({ Datatable: { rowResize: true, height: 300 } }))).toBe(1);
      expect(out.length).toBeGreaterThan(2);
    });

    it("...and so is an inline ARRAY default, which is the spelling #554 itself names", () => {
      const out = [];
      expect(seen(out, () => ({ Datatable: { pageSizeOptions: [5, 10, 25] } })),
        "a fresh literal is never === itself, so this needs a real comparison").toBe(1);
    });

    it("...and an inline plain-object default", () => {
      const out = [];
      expect(seen(out, () => ({ Datatable: { defaultColumn: { resizable: false, width: 120 } } }))).toBe(1);
    });

    it("a genuine change still produces a new value", () => {
      const out = [];
      expect(seen(out, (n) => ({ Datatable: { height: 300 + n } }))).toBe(3);
    });

    it("an inline FUNCTION default stays unstable, which is the documented limit", () => {
      const out = [];
      expect(seen(out, () => ({ Datatable: { isRowSelectable: (r) => !!r } })),
        "there is no correct cheap comparison for a function - hoist or useMemo it").toBe(3);
    });
  });

  // The issue's own reason for plain context over a module registry. A registry passes every
  // behavioural assertion in this file, so without an SSR case the decision was unguarded.
  it("two apps rendered in ONE process do not share defaults", () => {
    const grid = () => <Datatable columns={COLS} rows={ROWS} rowKey={key} />;
    const withDefaults = () => renderToString(
      <TwicoProvider defaults={{ Datatable: { rowResize: true } }}>{grid()}</TwicoProvider>);
    const bare = () => renderToString(grid());
    const a = withDefaults();
    const b = bare();
    const a2 = withDefaults();
    // Count rendered ELEMENTS, not occurrences: the SSR output also carries the component's
    // stylesheet, which mentions the class several times.
    const count = (html) => (html.match(/class="twc-dt__row-resizer"/g) || []).length;
    expect(count(a), "app A opted in").toBeGreaterThan(0);
    expect(count(b), "app B shares the process and must be unaffected").toBe(0);
    expect(count(a2), "and A is still itself afterwards").toBe(count(a));
  });

  it("DiffTable's inner grid inherits defaults.Datatable - documented, not accidental", () => {
    // DiffTable is a thin wrapper over Datatable's diff mode (#239), so a Datatable default reaches
    // it transitively even though DiffTable is not in DEFAULTABLE. Asserting it so the behaviour is
    // a decision with a test rather than a surprise.
    const from = [{ id: 1, sku: "A-1", qty: 2 }];
    const to = [{ id: 1, sku: "A-1", qty: 5 }];
    const cols = [{ field: "sku" }, { field: "qty" }];
    const { container } = render(
      <TwicoProvider defaults={{ Datatable: { rowResize: true } }}>
        <DiffTable from={from} to={to} rowKey={key} columns={cols} />
      </TwicoProvider>);
    expect(container.querySelectorAll(".twc-dt__row-resizer").length).toBeGreaterThan(0);
  });

  it("composes with the nonce the provider already carried, rather than shadowing it", () => {
    let seen = "(never rendered)";
    const ReadNonce = () => { seen = React.useContext(NonceContext); return null; };
    const { container } = render(
      <TwicoProvider nonce="n0nce" defaults={{ Datatable: { rowResize: true } }}>
        <ReadNonce />
        <Datatable columns={COLS} rows={ROWS} rowKey={key} />
      </TwicoProvider>);
    expect(seen, "#57's context must still reach the subtree").toBe("n0nce");
    expect(strips(container).length, "and the default still lands").toBe(ROWS.length);
  });
});
