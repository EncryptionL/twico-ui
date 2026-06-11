import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Stack, Button, IconButton, Drawer, useMediaQuery, useDisclosure } from "twico-ui";
import Logo from "./Logo.jsx";
import Sidebar from "./Sidebar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import TableOfContents from "./TableOfContents.jsx";
import PageTransition from "./PageTransition.jsx";
import { CodeLangToggle } from "./CodeLang.jsx";
import { REPO_URL, NPM_URL, CHANGELOG_URL } from "../data/site.js";

const HEADER_H = 64;

const MenuIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
const GithubIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" /></svg>
);

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isMobile = useMediaQuery("(max-width: 859px)");
  const showToc = useMediaQuery("(min-width: 1200px)");
  const nav = useDisclosure(false);

  React.useEffect(() => {
    nav.onClose();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const header = (
    <Box
      as="header"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "color-mix(in srgb, var(--color-bg) 88%, transparent)",
        backdropFilter: "saturate(180%) blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Stack direction="row" justify="space-between" align="center" gap={4} style={{ height: HEADER_H, padding: "0 24px" }}>
        <Stack direction="row" align="center" gap={2}>
          {!isHome && isMobile ? (
            <IconButton variant="ghost" aria-label="Toggle navigation" icon={MenuIcon} onClick={nav.onToggle} />
          ) : null}
          <Link to="/" aria-label="Twico UI home" style={{ display: "inline-flex" }}><Logo /></Link>
        </Stack>
        <Stack direction="row" align="center" gap={1}>
          {!isMobile ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/docs/installation")}>Docs</Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/components")}>Components</Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(CHANGELOG_URL, "_blank", "noopener,noreferrer")}>Changelog</Button>
              <Button variant="ghost" size="sm" onClick={() => window.open(NPM_URL, "_blank", "noopener,noreferrer")}>npm</Button>
            </>
          ) : null}
          {!isMobile && !isHome ? <CodeLangToggle /> : null}
          <IconButton variant="ghost" aria-label="GitHub repository" icon={GithubIcon} onClick={() => window.open(REPO_URL, "_blank", "noopener,noreferrer")} />
          <ThemeToggle />
        </Stack>
      </Stack>
    </Box>
  );

  if (isHome) {
    return (
      <Box style={{ minHeight: "100vh" }}>
        {header}
        <Box as="main"><PageTransition><Outlet /></PageTransition></Box>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: "100vh" }}>
      {header}
      <Stack direction="row" gap={0} align="flex-start">
        {!isMobile ? (
          <Box
            as="aside"
            style={{ width: 268, flex: "none", position: "sticky", top: HEADER_H, alignSelf: "flex-start", height: `calc(100vh - ${HEADER_H}px)`, overflowY: "auto", padding: "28px 12px 48px 24px", borderRight: "1px solid var(--color-border)" }}
          >
            <Sidebar />
          </Box>
        ) : null}
        <Box as="main" style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
          <Stack
            direction="row"
            gap={9}
            align="flex-start"
            style={{ width: "100%", maxWidth: showToc ? 1120 : 880, padding: isMobile ? "24px 16px 64px" : "44px 44px 88px" }}
          >
            <Box as="article" id="doc-article" style={{ flex: 1, minWidth: 0, maxWidth: 760 }}>
              <PageTransition><Outlet /></PageTransition>
            </Box>
            {showToc ? <TableOfContents /> : null}
          </Stack>
        </Box>
      </Stack>
      {isMobile ? (
        <Drawer open={nav.open} onClose={nav.onClose} side="left" size={288}>
          <Sidebar onNavigate={nav.onClose} />
        </Drawer>
      ) : null}
    </Box>
  );
}
