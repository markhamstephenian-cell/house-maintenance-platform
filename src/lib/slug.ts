import { getDb } from "./db";

export function normalizeAddress(address: string): string {
  let slug = address
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "house";
}

export function generateSlug(address: string): string {
  const slug = normalizeAddress(address);

  const db = getDb();
  const existing = db
    .prepare("SELECT slug FROM houses WHERE slug = ? OR slug LIKE ?")
    .all(slug, `${slug}-%`) as { slug: string }[];

  if (existing.length === 0) return slug;

  const existingSlugs = new Set(existing.map((r) => r.slug));
  if (!existingSlugs.has(slug)) return slug;

  let suffix = 2;
  while (existingSlugs.has(`${slug}-${suffix}`)) {
    suffix++;
  }
  return `${slug}-${suffix}`;
}
