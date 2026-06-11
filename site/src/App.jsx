import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Installation from "./pages/Installation.jsx";
import Theming from "./pages/Theming.jsx";
import DarkMode from "./pages/DarkMode.jsx";
import Accessibility from "./pages/Accessibility.jsx";
import ComponentsIndex from "./pages/ComponentsIndex.jsx";
import ComponentPage from "./pages/ComponentPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/docs/installation" element={<Installation />} />
        <Route path="/docs/theming" element={<Theming />} />
        <Route path="/docs/dark-mode" element={<DarkMode />} />
        <Route path="/docs/accessibility" element={<Accessibility />} />
        <Route path="/components" element={<ComponentsIndex />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
