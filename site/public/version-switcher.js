/*
 * Twico UI docs — version switcher for ARCHIVED snapshots.
 *
 * The live site (root base "/twico-ui/") renders a React <VersionSelector/> in its
 * navbar. The frozen per-version snapshots ("/twico-ui/v1.1/", …) are built from old
 * git tags that predate that component, so the deploy workflow injects THIS tiny,
 * dependency-free script into each snapshot's index.html instead. It draws a floating
 * control (bottom-right) that reads the shared /twico-ui/versions.json and lets the
 * reader jump to another version. Self-hosted — no CDN, no framework, SSR-irrelevant.
 */
(function () {
  "use strict";
  if (window.__twicoVersionSwitcher) return; // idempotent
  window.__twicoVersionSwitcher = true;

  // The manifest always lives at the Pages root, regardless of which snapshot we're in.
  var ROOT = "/twico-ui/";
  var MANIFEST = ROOT + "versions.json";

  function currentBase(items) {
    // Longest base that prefixes the current path wins (so "/twico-ui/v1.1/" beats "/twico-ui/").
    var path = location.pathname;
    var best = null;
    for (var i = 0; i < items.length; i++) {
      var b = items[i].base;
      if (path.indexOf(b) === 0 && (!best || b.length > best.base.length)) best = items[i];
    }
    return best;
  }

  function injectStyles() {
    if (document.getElementById("twico-vswitch-style")) return;
    var css =
      ".twico-vswitch{position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:var(--font-sans,system-ui,sans-serif)}" +
      ".twico-vswitch__btn{display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:1px solid var(--color-border,#d4d4d8);" +
      "background:var(--color-surface,#fff);color:var(--color-text,#18181b);border-radius:var(--radius-full,999px);" +
      "padding:8px 14px;font-size:13px;font-weight:600;box-shadow:var(--shadow-md,0 4px 12px rgba(0,0,0,.12));line-height:1}" +
      ".twico-vswitch__btn:hover{border-color:var(--color-primary,#6366f1)}" +
      ".twico-vswitch__dot{width:7px;height:7px;border-radius:999px;background:var(--color-warning,#f59e0b)}" +
      ".twico-vswitch__menu{position:absolute;right:0;bottom:calc(100% + 8px);min-width:180px;background:var(--color-surface,#fff);" +
      "border:1px solid var(--color-border,#d4d4d8);border-radius:var(--radius-lg,12px);box-shadow:var(--shadow-lg,0 12px 32px rgba(0,0,0,.18));" +
      "padding:6px;display:none}" +
      ".twico-vswitch[data-open=\"true\"] .twico-vswitch__menu{display:block}" +
      ".twico-vswitch__head{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-text-subtle,#71717a);padding:6px 10px 4px}" +
      ".twico-vswitch__item{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;text-align:left;cursor:pointer;" +
      "border:0;background:none;color:var(--color-text,#18181b);font-size:13px;font-weight:500;padding:8px 10px;border-radius:var(--radius-md,8px)}" +
      ".twico-vswitch__item:hover{background:var(--color-surface-sunken,#f4f4f5)}" +
      ".twico-vswitch__item[aria-current=\"true\"]{color:var(--color-primary,#6366f1);font-weight:700}" +
      ".twico-vswitch__tag{font-size:11px;color:var(--color-text-subtle,#71717a)}";
    var s = document.createElement("style");
    s.id = "twico-vswitch-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function render(items) {
    var cur = currentBase(items);
    injectStyles();

    var root = document.createElement("div");
    root.className = "twico-vswitch";
    root.setAttribute("data-open", "false");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "twico-vswitch__btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    var dot = document.createElement("span");
    dot.className = "twico-vswitch__dot";
    btn.appendChild(dot);
    var label = document.createElement("span");
    label.textContent = (cur ? cur.label : "Version") + " ▾";
    btn.appendChild(label);
    btn.setAttribute("aria-label", "Documentation version: " + (cur ? cur.label : "unknown") + ". Change version");

    var menu = document.createElement("div");
    menu.className = "twico-vswitch__menu";
    menu.setAttribute("role", "menu");
    var head = document.createElement("div");
    head.className = "twico-vswitch__head";
    head.textContent = "Documentation version";
    menu.appendChild(head);

    items.forEach(function (it) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "twico-vswitch__item";
      item.setAttribute("role", "menuitem");
      var isCur = cur && it.base === cur.base;
      if (isCur) item.setAttribute("aria-current", "true");
      var name = document.createElement("span");
      name.textContent = it.label;
      item.appendChild(name);
      if (it.latest) {
        var tag = document.createElement("span");
        tag.className = "twico-vswitch__tag";
        tag.textContent = "latest";
        item.appendChild(tag);
      }
      item.addEventListener("click", function () {
        if (isCur) { close(); return; }
        // Preserve the in-page hash route across versions.
        window.location.href = it.base + window.location.hash;
      });
      menu.appendChild(item);
    });

    function open() { root.setAttribute("data-open", "true"); btn.setAttribute("aria-expanded", "true"); }
    function close() { root.setAttribute("data-open", "false"); btn.setAttribute("aria-expanded", "false"); }
    function toggle() { (root.getAttribute("data-open") === "true" ? close : open)(); }

    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    document.addEventListener("click", function (e) { if (!root.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    root.appendChild(menu);
    root.appendChild(btn);
    document.body.appendChild(root);
  }

  function init() {
    fetch(MANIFEST, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.items || !data.items.length) return;
        render(data.items);
      })
      .catch(function () {/* no manifest -> no widget */});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
