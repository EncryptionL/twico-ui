import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import Sidebar from "./Sidebar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { REPO_URL, NPM_URL } from "../data/site.js";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileNav, setMobileNav] = React.useState(false);

  // Close the mobile drawer + scroll to top on route change.
  React.useEffect(() => {
    setMobileNav(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="docs-root">
      <header className="docs-header">
        <div className="docs-header__inner">
          <div className="docs-header__left">
            {!isHome ? (
              <button
                type="button"
                className="docs-iconbtn docs-menu-btn"
                aria-label="Toggle navigation"
                onClick={() => setMobileNav((v) => !v)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              </button>
            ) : null}
            <Link to="/" className="docs-brand" aria-label="Twico UI home">
              <Logo />
            </Link>
          </div>
          <nav className="docs-header__nav" aria-label="Primary">
            <Link to="/docs/installation" className="docs-toplink">Docs</Link>
            <Link to="/components" className="docs-toplink">Components</Link>
            <a className="docs-toplink" href={NPM_URL} target="_blank" rel="noreferrer">npm</a>
            <a className="docs-iconbtn" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" /></svg>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {isHome ? (
        <main className="docs-home-main">
          <Outlet />
        </main>
      ) : (
        <div className="docs-shell">
          <aside className={`docs-sidebar ${mobileNav ? "is-open" : ""}`}>
            <Sidebar onNavigate={() => setMobileNav(false)} />
          </aside>
          {mobileNav ? <div className="docs-scrim" onClick={() => setMobileNav(false)} /> : null}
          <main className="docs-main">
            <div className="docs-content">
              <Outlet />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
