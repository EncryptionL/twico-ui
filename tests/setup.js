import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount anything mounted during a test so DOM/state never leaks across tests.
afterEach(() => cleanup());
