/*
 * Twico UI docs — version switcher for ARCHIVED snapshots.
 *
 * The live site (root base "/twico-ui/") renders a React <VersionSelector/> in its
 * navbar. The frozen per-version snapshots ("/twico-ui/v1.1/", …) are built from old
 * git tags that predate that component, so the deploy workflow injects THIS tiny,
 * dependency-free script into each snapshot's index.html instead.
 *
 * To keep the control in the SAME place across versions, it mounts itself INTO the
 * navbar (the sticky <header>'s right-hand controls) once React has rendered, and
 * re-mounts if a route change re-renders the navbar. If the navbar can't be found it
 * falls back to a floating control. Reads the shared /twico-ui/versions.json. No CDN,
 * no framework.
 */
(function () {
  "use strict";
  if (window.__twicoVersionSwitcher) return;
  window.__twicoVersionSwitcher = true;

  var ROOT = "/twico-ui/";
  var ID = "twico-vswitch";
  var ITEMS = null;

  function strip(s) { return String(s).replace(/\/+$/, ""); }

  // Longest base that prefixes the current path wins (so "/twico-ui/v1.1/" beats "/twico-ui/").
  function currentItem() {
    var p = strip(location.pathname);
    var best = null;
    for (var i = 0; i < ITEMS.length; i++) {
      var b = strip(ITEMS[i].base);
      if ((p === b || p.indexOf(b + "/") === 0) && (!best || b.length > strip(best.base).length)) best = ITEMS[i];
    }
    return best;
  }
  // "Latest" entry shows the version it points at (e.g. "v1.3 · latest"); others show their label.
  function entryLabel(it) { return it.latest ? ((it.version || "Latest") + " · latest") : it.label; }
  function isHomeRoute() { var h = location.hash; return h === "" || h === "#" || h === "#/"; }

  function injectStyles() {
    if (document.getElementById(ID + "-style")) return;
    var css =
      "#" + ID + "{position:relative;font-family:var(--font-sans,system-ui,sans-serif)}" +
      "#" + ID + " .vsw-btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;border:1px solid var(--color-border,#d4d4d8);" +
      "background:var(--color-surface,#fff);color:var(--color-text,#18181b);border-radius:var(--radius-md,8px);" +
      "padding:6px 10px;font-size:13px;font-weight:600;line-height:1;font-variant-numeric:tabular-nums}" +
      "#" + ID + " .vsw-btn:hover{border-color:var(--color-primary,#6366f1)}" +
      "#" + ID + " .vsw-menu{position:absolute;right:0;top:calc(100% + 6px);min-width:190px;background:var(--color-surface,#fff);" +
      "border:1px solid var(--color-border,#d4d4d8);border-radius:var(--radius-lg,12px);box-shadow:var(--shadow-lg,0 12px 32px rgba(0,0,0,.18));" +
      "padding:6px;display:none;z-index:1000}" +
      "#" + ID + "[data-open=\"true\"] .vsw-menu{display:block}" +
      "#" + ID + " .vsw-head{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-text-subtle,#71717a);padding:6px 10px 4px}" +
      "#" + ID + " .vsw-item{display:flex;align-items:center;gap:8px;width:100%;text-align:left;cursor:pointer;border:0;background:none;" +
      "color:var(--color-text,#18181b);font-size:13px;font-weight:500;padding:8px 10px;border-radius:var(--radius-md,8px)}" +
      "#" + ID + " .vsw-item:hover{background:var(--color-surface-sunken,#f4f4f5)}" +
      "#" + ID + " .vsw-item[aria-current=\"true\"]{color:var(--color-primary,#6366f1);font-weight:700}" +
      "#" + ID + " .vsw-check{width:14px;flex:none;display:inline-block}" +
      ".vsw-float{position:fixed;right:16px;bottom:16px;z-index:2147483000}";
    var s = document.createElement("style");
    s.id = ID + "-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildControl() {
    var cur = currentItem();
    var root = document.createElement("div");
    root.id = ID;
    root.setAttribute("data-open", "false");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vsw-btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Documentation version: " + (cur ? cur.label : "unknown") + ". Change version");
    btn.appendChild(document.createTextNode(cur ? cur.label : "Version"));
    var caret = document.createElement("span");
    caret.textContent = "▾";
    caret.setAttribute("aria-hidden", "true");
    btn.appendChild(caret);

    var menu = document.createElement("div");
    menu.className = "vsw-menu";
    menu.setAttribute("role", "menu");
    var head = document.createElement("div");
    head.className = "vsw-head";
    head.textContent = "Documentation version";
    menu.appendChild(head);

    ITEMS.forEach(function (it) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "vsw-item";
      item.setAttribute("role", "menuitem");
      var isCur = cur && strip(it.base) === strip(cur.base);
      if (isCur) item.setAttribute("aria-current", "true");
      var check = document.createElement("span");
      check.className = "vsw-check";
      check.textContent = isCur ? "✓" : "";
      item.appendChild(check);
      item.appendChild(document.createTextNode(entryLabel(it)));
      item.addEventListener("click", function () {
        if (isCur) { close(); return; }
        window.location.href = it.base + window.location.hash; // preserve the hash route
      });
      menu.appendChild(item);
    });

    function open() { root.setAttribute("data-open", "true"); btn.setAttribute("aria-expanded", "true"); }
    function close() { root.setAttribute("data-open", "false"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); (root.getAttribute("data-open") === "true" ? close : open)(); });
    document.addEventListener("click", function (e) { if (!root.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    root.appendChild(btn);
    root.appendChild(menu);
    return root;
  }

  // Find the navbar's right-hand controls. The navbar isn't a <header> in older builds
  // (Box rendered a <div>), so anchor on the logo link's stable aria-label, which every
  // version uses: logo -> left group -> the flex row -> its last child = right controls.
  function navbarRightControls() {
    var logo = document.querySelector('a[aria-label="Twico UI home"]');
    if (!logo) return null;
    var leftGroup = logo.parentElement;
    var flexRow = leftGroup && leftGroup.parentElement;
    var right = flexRow && flexRow.lastElementChild;
    return right && right !== leftGroup ? right : null;
  }

  function mount() {
    if (!ITEMS) return;
    if (isHomeRoute()) { var e0 = document.getElementById(ID); if (e0) e0.remove(); return; }
    if (document.getElementById(ID)) return; // already mounted
    injectStyles();
    var right = navbarRightControls();
    if (right) {
      // Sit just before the last control (the theme toggle), near where the React
      // selector lives on the latest site.
      right.insertBefore(buildControl(), right.lastElementChild || null);
    }
  }

  function mountFloating() {
    if (isHomeRoute() || document.getElementById(ID)) return;
    injectStyles();
    var el = buildControl();
    el.className = "vsw-float";
    el.querySelector(".vsw-menu").style.top = "auto";
    el.querySelector(".vsw-menu").style.bottom = "calc(100% + 6px)";
    document.body.appendChild(el);
  }

  function init() {
    fetch(ROOT + "versions.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.items || !data.items.length) return;
        ITEMS = data.items;
        // React renders the navbar after load; (re)mount when it appears or re-renders.
        new MutationObserver(function () { mount(); }).observe(document.body, { childList: true, subtree: true });
        window.addEventListener("hashchange", mount);
        mount();
        // If the navbar never shows up, fall back to a floating control so it's never lost.
        setTimeout(function () { if (!document.getElementById(ID)) mountFloating(); }, 4000);
      })
      .catch(function () {/* no manifest -> no widget */});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
