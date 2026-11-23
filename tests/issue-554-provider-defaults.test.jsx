import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Datatable, CardGrid, TwicoProvider, Card, Text } from "../src/index.ts";
import { NonceContext } from "../components/_styles.js";

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
