/* Twico UI — Lucide icon helper.
   Requires React (global) and the Lucide UMD bundle to be loaded first.
   Usage:  window.TwicoIcon({ name: "Plus", size: 18 })
           <TwicoIcon name="Settings" />  (after assigning to a local: const TwicoIcon = window.TwicoIcon) */
(function () {
  function resolve(name) {
    var L = window.lucide || {};
    if (!name) return null;
    // try as given, then PascalCase, then via icons map
    if (L[name]) return L[name];
    var pascal = name
      .replace(/(^|[-_ ])(\w)/g, function (_, __, c) { return c.toUpperCase(); });
    if (L[pascal]) return L[pascal];
    if (L.icons && L.icons[name]) return L.icons[name];
    if (L.icons && L.icons[pascal]) return L.icons[pascal];
    return null;
  }

  window.TwicoIcon = function TwicoIcon(props) {
    var React = window.React;
    props = props || {};
    var name = props.name;
    var size = props.size || 20;
    var stroke = props.strokeWidth || 2;
    var node = resolve(name);
    var childTuples = Array.isArray(node)
      ? (Array.isArray(node[0]) ? node : (node[2] || []))
      : [];
    var children = childTuples.map(function (t, i) {
      var tag = t[0];
      var attrs = Object.assign({ key: i }, t[1] || {});
      return React.createElement(tag, attrs);
    });
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: stroke,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        style: Object.assign({ display: "block", flex: "none" }, props.style || {}),
        className: props.className || undefined,
      },
      children
    );
  };
})();
