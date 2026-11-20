// Pixel-diff a committed baseline against a regenerated one.
//
//   node scripts/diff-baselines.mjs <dir-of-new-pngs> [name.png ...]
//
// A regenerated set routinely comes back with a handful of differing BYTES on pages nothing
// touched, and a ~100-byte PNG delta on a 430 kB image is either antialiasing noise or a real
// change in a few pixels - the byte count cannot tell them apart. This can: it reports how many
// pixels differ, the max per-channel delta, and the bounding box. A dimension change is the honest
// signal that content moved.
//
// Reseeding is a Linux-runner job (the baselines are OS-sensitive): dispatch visual.yml with
// mode=update, download the "updated-baselines" artifact, run this against it, then commit.
// See docs/development.md.
import { chromium } from "playwright";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { basename } from "node:path";

const [dir, ...only] = process.argv.slice(2);
if (!dir) {
  console.error("usage: node scripts/diff-baselines.mjs <dir-of-new-pngs> [name.png ...]");
  process.exit(2);
}
const BASE = "tests/__screenshots__/";
const pairs = (only.length ? only : readdirSync(dir).filter((f) => f.endsWith(".png"))).sort();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("about:blank");

for (const name of pairs) {
  const a = BASE + name;
  const b = join(dir, name);
  if (!existsSync(a)) { console.log(name.padEnd(28) + "NEW (no committed baseline)"); continue; }
  if (!existsSync(b)) { console.log(name.padEnd(28) + "missing from " + dir); continue; }
  if (readFileSync(a).equals(readFileSync(b))) { console.log(name.padEnd(28) + "byte-identical"); continue; }
  const toUri = (p) => "data:image/png;base64," + readFileSync(p).toString("base64");
  const r = await page.evaluate(async ([ua, ub]) => {
    const load = (u) => new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = u;
    });
    const [ia, ib] = await Promise.all([load(ua), load(ub)]);
    if (ia.width !== ib.width || ia.height !== ib.height) {
      return { dim: [ia.width, ia.height, ib.width, ib.height] };
    }
    const grab = (img) => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(img, 0, 0);
      return x.getImageData(0, 0, img.width, img.height).data;
    };
    const da = grab(ia), db = grab(ib);
    let diff = 0, maxDelta = 0, over2 = 0;
    let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(
        Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]),
        Math.abs(da[i + 2] - db[i + 2]), Math.abs(da[i + 3] - db[i + 3]));
      if (d > 0) {
        diff++;
        if (d > maxDelta) maxDelta = d;
        if (d > 2) over2++;
        const px = (i / 4) % ia.width;
        const py = Math.floor(i / 4 / ia.width);
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
      }
    }
    return {
      w: ia.width, h: ia.height, total: ia.width * ia.height,
      diff, over2, maxDelta,
      box: diff ? [minX, minY, maxX, maxY] : null,
    };
  }, [toUri(a), toUri(b)]);

  if (r.dim) {
    console.log(basename(name) + ": DIMENSIONS CHANGED " + r.dim[0] + "x" + r.dim[1] + " -> " + r.dim[2] + "x" + r.dim[3]);
    continue;
  }
  const pct = ((r.diff / r.total) * 100).toFixed(4);
  console.log(
    basename(name).padEnd(28) + r.w + "x" + r.h +
    "  diff=" + r.diff + " px (" + pct + "%)" +
    "  >2/255=" + r.over2 +
    "  maxDelta=" + r.maxDelta +
    (r.box ? "  bbox=[" + r.box.join(",") + "]" : ""));
}
await browser.close();
