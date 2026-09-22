// Shared file-validation primitives for FileUpload + the useFilePicker hook, so a custom trigger/headless
// picker reuses exactly the same accept / maxSize / maxFiles / dedupe rules (mirrors how _overlay.js backs
// useFocusTrap/usePortal). No React, no DOM — pure functions, SSR-safe.

// #102: does a file satisfy an `accept` list (extensions, exact MIME, or `type/*`)?
export function matchesAccept(file, accept) {
  if (!accept) return true;
  const toks = accept.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (!toks.length) return true;
  const name = file.name.toLowerCase(), type = (file.type || "").toLowerCase();
  return toks.some((t) => t.startsWith(".") ? name.endsWith(t) : t.endsWith("/*") ? type.startsWith(t.slice(0, -1)) : type === t);
}

// #104: stable identity for a File so re-adds dedupe and rows key by identity.
export const fileKey = (f) => `${f.name}-${f.size}-${f.lastModified}`;

// #102/#103/#104: split an incoming FileList into { accepted, rejections } against accept / maxSize / maxFiles,
// deduping re-adds in multiple mode. `current` is the already-selected files (only consulted in multiple mode).
export function partitionFiles(list, { current = [], accept, multiple = false, maxSize, maxFiles } = {}) {
  const incoming = Array.from(list || []);
  const retained = multiple ? current.slice() : [];
  const seen = new Set(retained.map(fileKey));
  const accepted = [];
  const rejections = [];
  for (const f of incoming) {
    if (multiple && seen.has(fileKey(f))) continue; // dedupe — silent no-op
    let reason = null;
    if (accept && !matchesAccept(f, accept)) reason = "type";
    else if (maxSize && f.size > maxSize) reason = "size";
    else if (multiple && maxFiles && retained.length + accepted.length >= maxFiles) reason = "count";
    if (reason) { rejections.push({ file: f, reason }); continue; }
    accepted.push(f);
    if (multiple) seen.add(fileKey(f));
  }
  return { accepted, rejections };
}
