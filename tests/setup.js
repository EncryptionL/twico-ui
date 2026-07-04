import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount anything mounted during a test so DOM/state never leaks across tests.
afterEach(() => cleanup());

// jsdom has no layout engine, so scrollIntoView is undefined. Components that keep
// an active item in view (CommandPalette, Menu, …) call it in an effect — stub it
// so those effects don't throw under test.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
