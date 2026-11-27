import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const site = fileURLToPath(new URL("../", import.meta.url));
const projects = ["campus", "ledger", "incident", "clinic", "manual", "review", "access", "funnel"];
const pages = ["index.html", ...projects.map(key => `source/${key}/index.html`)];
assert(statSync(path.join(site, "demos/review/index.html")).isFile(), "Missing requirements review demo");
assert(statSync(path.join(site, "demos/manual/index.html")).isFile(), "Missing support workspace demo");
assert(statSync(path.join(site, "demos/access/index.html")).isFile(), "Missing temporary access demo");
assert(statSync(path.join(site, "demos/funnel/index.html")).isFile(), "Missing product funnel demo");
for (const page of pages) {
  const html = readFileSync(path.join(site, page), "utf8");
  for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|#)/i.test(url)) continue;
    const target = path.resolve(site, path.dirname(page), url.split(/[?#]/, 1)[0]);
    assert(statSync(target).isFile(), `${page} references a missing file: ${url}`);
  }
}
for (const key of projects) {
  for (const kind of ["source", "run"]) {
    const archive = readFileSync(path.join(site, "downloads", `${key}-${kind}.zip`));
    assert.equal(archive.readUInt32LE(0), 0x04034b50, `Invalid ZIP for ${key}-${kind}`);
  }
  for (const image of ["main", "detail", "study"]) {
    assert(statSync(path.join(site, "images", `${key}-${image}.webp`)).size > 0);
  }
}
const scripts = readdirSync(site).filter(file => file.endsWith(".js")).concat("source/reader.js");
for (const script of scripts) {
  execFileSync(process.execPath, ["--check", path.join(site, script)], { stdio: "inherit" });
}
console.log(`Checked ${pages.length} pages, ${scripts.length} scripts and all project downloads and images.`);
