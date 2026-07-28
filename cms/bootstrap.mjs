#!/usr/bin/env node
/**
 * Directus bootstrap for Dacan Tour.
 *
 *   node cms/bootstrap.mjs            # create schema, grant public read, seed
 *   node cms/bootstrap.mjs --reset    # drop the collections first (clean upgrade)
 *
 * Schema:
 *   - categories, destinations, trips collections
 *   - departures & itinerary use a friendly click-to-add LIST interface (no raw JSON)
 *   - heroImage = a single uploadable image; gallery = drag-in multiple images (files)
 *
 * Idempotent. Seed images are imported from the placeholder URLs so seeded trips
 * look complete; you then replace them by drag-drop in the admin.
 *
 * Config (env; also reads infra/.env): DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL,
 * DIRECTUS_ADMIN_PASSWORD.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const RESET = process.argv.includes("--reset");

function loadEnvFile(p) {
  if (!existsSync(p)) return {};
  const out = {};
  for (const line of readFileSync(p, "utf8").split("\n")) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = { ...loadEnvFile(join(root, "infra", ".env")), ...process.env };
// Node's fetch prefers IPv6 (::1) for "localhost"; Directus in Docker is published
// on IPv4, so force 127.0.0.1 to avoid a "fetch failed" (ECONNREFUSED).
const URL = (env.DIRECTUS_URL || "http://localhost:8055")
  .replace(/\/$/, "")
  .replace("//localhost", "//127.0.0.1");
const EMAIL = env.DIRECTUS_ADMIN_EMAIL || "admin@dacantour.com";
const PASSWORD = env.DIRECTUS_ADMIN_PASSWORD || "change-me";
const seed = JSON.parse(readFileSync(join(__dirname, "seed.json"), "utf8"));

let token = "";
async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await res.text();
  const json = t ? JSON.parse(t) : {};
  if (!res.ok) {
    const e = new Error(`${method} ${path} → ${res.status}: ${json?.errors?.[0]?.message || res.statusText}`);
    e.status = res.status;
    throw e;
  }
  return json.data;
}
async function has(path) {
  try { await api(path); return true; } catch (e) { if (e.status === 404 || e.status === 403) return false; throw e; }
}

// --- field builders -------------------------------------------------------
const pk = () => ({ field: "id", type: "integer", meta: { hidden: true, readonly: true, interface: "input" }, schema: { is_primary_key: true, has_auto_increment: true } });
const str = (field, o = {}) => ({ field, type: "string", meta: { interface: "input", required: !!o.required, width: o.width || "full" }, schema: { is_unique: !!o.unique } });
const text = (field) => ({ field, type: "text", meta: { interface: "input-multiline" } });
const int = (field) => ({ field, type: "integer", meta: { interface: "input" } });
const bool = (field, def = true) => ({ field, type: "boolean", meta: { interface: "boolean" }, schema: { default_value: def } });
const tags = (field) => ({ field, type: "json", meta: { interface: "tags", options: { presets: [] } } });
const dropdown = (field, choices, def) => ({ field, type: "string", meta: { interface: "select-dropdown", options: { choices: choices.map((c) => ({ text: c, value: c })) } }, schema: def ? { default_value: def } : {} });
const listField = (field, fields, template) => ({ field, type: "json", meta: { interface: "list", special: ["cast-json"], options: { fields, template } } });

const departuresField = listField("departures", [
  { field: "startDate", name: "Start date", type: "date", meta: { interface: "datetime", width: "half" } },
  { field: "endDate", name: "End date", type: "date", meta: { interface: "datetime", width: "half" } },
  { field: "capacity", name: "Capacity", type: "integer", meta: { interface: "input", width: "half" } },
  { field: "spotsTaken", name: "Spots taken", type: "integer", meta: { interface: "input", width: "half" } },
  { field: "status", name: "Status", type: "string", meta: { interface: "select-dropdown", width: "half", options: { choices: [
    { text: "Open", value: "open" }, { text: "Full", value: "full" }, { text: "Closed", value: "closed" }] } } },
], "{{startDate}} – {{endDate}} ({{status}})");

const itineraryField = listField("itinerary", [
  { field: "day", name: "Day", type: "integer", meta: { interface: "input", width: "half" } },
  { field: "title", name: "Title", type: "string", meta: { interface: "input", width: "half" } },
  { field: "text", name: "Description", type: "text", meta: { interface: "input-multiline", width: "full" } },
], "Day {{day}} — {{title}}");

// Base (scalar) fields only — heroImage & gallery are added as file relations after.
const baseCollections = {
  categories: { meta: { icon: "category", display_template: "{{name}}" },
    fields: [pk(), str("slug", { required: true, unique: true }), str("name", { required: true }), text("blurb"), dropdown("icon", ["horse", "trek", "history", "city", "scenic", "ski"])] },
  destinations: { meta: { icon: "landscape", display_template: "{{name}}" },
    fields: [pk(), str("slug", { required: true, unique: true }), str("name", { required: true }), dropdown("country", ["KG", "US"], "KG"), str("region"), text("intro"), text("description"), bool("published", true)] },
  trips: { meta: { icon: "tour", display_template: "{{title}}" },
    fields: [pk(), str("slug", { required: true, unique: true }), str("title", { required: true }), dropdown("country", ["KG", "US"], "KG"), str("region"), tags("categories"), text("summary"), text("description"), int("durationDays"), int("priceFrom"), str("currency"), dropdown("difficulty", ["Easy", "Moderate", "Challenging"]), int("groupSizeMax"), bool("featured", false), tags("highlights"), itineraryField, departuresField, bool("published", true)] },
};

async function ensureCollection(name, def) {
  if (await has(`/collections/${name}`)) { console.log(`  · collection "${name}" exists`); return; }
  await api("/collections", { method: "POST", body: { collection: name, meta: def.meta, schema: {}, fields: def.fields } });
  console.log(`  ✓ created collection "${name}"`);
}

// Single uploadable image (M2O → directus_files)
async function ensureImageField(collection, field = "heroImage") {
  if (!(await has(`/fields/${collection}/${field}`))) {
    await api(`/fields/${collection}`, { method: "POST", body: { field, type: "uuid", meta: { interface: "file-image", special: ["file"], display: "image", width: "full" }, schema: {} } });
  }
  if (!(await has(`/relations/${collection}/${field}`))) {
    await api("/relations", { method: "POST", body: { collection, field, related_collection: "directus_files", schema: { on_delete: "SET NULL" }, meta: {} } });
  }
  console.log(`  ✓ ${collection}.${field} (upload image)`);
}

// Multiple uploadable images (M2M → directus_files) via a junction collection
async function ensureFilesField(parent, field = "gallery") {
  const junction = `${parent}_files`;
  const fk = `${parent}_id`;
  if (!(await has(`/collections/${junction}`))) {
    await api("/collections", { method: "POST", body: { collection: junction, meta: { hidden: true, icon: "import_export" }, schema: {}, fields: [pk()] } });
  }
  if (!(await has(`/fields/${junction}/${fk}`)))
    await api(`/fields/${junction}`, { method: "POST", body: { field: fk, type: "integer", meta: { hidden: true }, schema: {} } });
  if (!(await has(`/fields/${junction}/directus_files_id`)))
    await api(`/fields/${junction}`, { method: "POST", body: { field: "directus_files_id", type: "uuid", meta: { hidden: true }, schema: {} } });
  if (!(await has(`/fields/${junction}/sort`)))
    await api(`/fields/${junction}`, { method: "POST", body: { field: "sort", type: "integer", meta: { hidden: true }, schema: {} } });
  if (!(await has(`/fields/${parent}/${field}`)))
    await api(`/fields/${parent}`, { method: "POST", body: { field, type: "alias", meta: { interface: "files", special: ["files"], options: {} } } });
  if (!(await has(`/relations/${junction}/${fk}`)))
    await api("/relations", { method: "POST", body: { collection: junction, field: fk, related_collection: parent, meta: { one_field: field, sort_field: "sort", junction_field: "directus_files_id" }, schema: { on_delete: "CASCADE" } } });
  if (!(await has(`/relations/${junction}/directus_files_id`)))
    await api("/relations", { method: "POST", body: { collection: junction, field: "directus_files_id", related_collection: "directus_files", meta: { junction_field: fk }, schema: { on_delete: "SET NULL" } } });
  console.log(`  ✓ ${parent}.${field} (upload multiple images)`);
}

async function grantPublicRead() {
  let policyId;
  try {
    const policies = await api("/policies?limit=-1&fields=id,name,admin_access,app_access,roles");
    let p = policies.find((x) => /public/i.test(x.name || ""));
    if (!p) p = policies.find((x) => x.admin_access === false && x.app_access === false && (!x.roles || x.roles.length === 0));
    policyId = p?.id;
  } catch { /* ignore */ }
  if (!policyId) {
    console.log("  ! Could not find the Public policy automatically.");
    console.log("    Settings → Access Policies → Public → add READ on: categories, destinations, trips, directus_files, trips_files, destinations_files.");
    return;
  }
  const existing = await api(`/permissions?limit=-1&filter[policy][_eq]=${policyId}&fields=collection,action`).catch(() => []);
  const targets = [
    ["categories", {}], ["destinations", { published: { _eq: true } }], ["trips", { published: { _eq: true } }],
    ["directus_files", {}], ["trips_files", {}], ["destinations_files", {}],
  ];
  for (const [collection, permissions] of targets) {
    if (existing.some((e) => e.collection === collection && e.action === "read")) { console.log(`  · public read on "${collection}"`); continue; }
    await api("/permissions", { method: "POST", body: { policy: policyId, collection, action: "read", fields: ["*"], permissions } });
    console.log(`  ✓ public read granted on "${collection}"`);
  }
}

// Import an image from a URL into Directus files (idempotent by title).
const fileCache = new Map();
async function importImage(url) {
  if (!url) return null;
  if (fileCache.has(url)) return fileCache.get(url);
  try {
    const found = await api(`/files?limit=1&filter[title][_eq]=${encodeURIComponent(url)}&fields=id`);
    let id = found?.[0]?.id;
    if (!id) {
      const file = await api("/files/import", { method: "POST", body: { url, data: { title: url } } });
      id = file?.id;
    }
    fileCache.set(url, id);
    return id;
  } catch (e) {
    console.log(`    · image import skipped (${e.status || "err"}): ${url}`);
    return null;
  }
}

async function seedItem(collection, row) {
  const found = await api(`/items/${collection}?filter[slug][_eq]=${encodeURIComponent(row.slug)}&limit=1&fields=id`).catch(() => []);
  if (found?.length) { console.log(`  · ${collection}/${row.slug} exists`); return; }
  const { heroImage, gallery, ...rest } = row;
  const heroId = await importImage(heroImage);
  const galleryIds = [];
  for (const g of gallery || []) { const id = await importImage(g); if (id) galleryIds.push(id); }
  const payload = { ...rest };
  if (heroId) payload.heroImage = heroId;
  if (galleryIds.length) payload.gallery = galleryIds.map((id) => ({ directus_files_id: id }));
  await api(`/items/${collection}`, { method: "POST", body: payload });
  console.log(`  ✓ seeded ${collection}/${row.slug} (hero:${heroId ? "✓" : "–"}, gallery:${galleryIds.length})`);
}

async function reset() {
  console.log("Resetting collections…");
  for (const c of ["trips_files", "destinations_files", "trips", "destinations", "categories"]) {
    try { await api(`/collections/${c}`, { method: "DELETE" }); console.log(`  ✓ dropped ${c}`); }
    catch (e) { if (e.status !== 404) console.log(`  · ${c}: ${e.message}`); }
  }
}

async function preflight() {
  try {
    await fetch(`${URL}/server/ping`);
  } catch {
    console.error(`\n✖ Can't reach Directus at ${URL}`);
    console.error("  Is it running?  →  cd infra && docker compose up");
    console.error("  Still failing? give it ~20s to finish booting, then retry.\n");
    process.exit(1);
  }
}

async function main() {
  console.log(`\nDacan Tour · Directus bootstrap → ${URL}\n`);
  await preflight();
  token = (await api("/auth/login", { method: "POST", body: { email: EMAIL, password: PASSWORD } })).access_token;
  console.log("✓ authenticated as", EMAIL, "\n");

  if (RESET) { await reset(); console.log(""); }

  console.log("Schema:");
  for (const [name, def] of Object.entries(baseCollections)) await ensureCollection(name, def);
  await ensureImageField("destinations");
  await ensureFilesField("destinations");
  await ensureImageField("trips");
  await ensureFilesField("trips");

  console.log("\nPermissions:");
  await grantPublicRead();

  console.log("\nSeed (importing images — this can take a minute):");
  for (const row of seed.categories) await seedItem("categories", row);
  for (const row of seed.destinations) await seedItem("destinations", row);
  for (const row of [...seed.kgTrips, ...seed.usTrips]) await seedItem("trips", row);

  console.log("\n✅ Done. Trips/itineraries are click-to-add and images are drag-drop uploads.\n");
}

main().catch((e) => { console.error("\n✖ Bootstrap failed:", e.message, "\n"); process.exit(1); });
