import Database from "better-sqlite3";
import path from "path";

const DB_DIR = process.env.DB_PATH || process.cwd();
const DB_PATH = path.join(DB_DIR, "house_maintenance.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
    mergeDuplicateHouses(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS houses (
      id TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contractors (
      id TEXT PRIMARY KEY,
      house_id TEXT NOT NULL,
      name TEXT NOT NULL,
      service_type TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      website TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      house_id TEXT NOT NULL,
      name TEXT NOT NULL,
      frequency TEXT NOT NULL CHECK(frequency IN ('monthly','bi_monthly','six_monthly','annual','two_year','five_year')),
      last_completed_date TEXT,
      next_due_date TEXT,
      notes TEXT,
      purchase_link TEXT,
      contractor_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
      FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_house_id ON tasks(house_id);
    CREATE INDEX IF NOT EXISTS idx_contractors_house_id ON contractors(house_id);
    CREATE INDEX IF NOT EXISTS idx_houses_slug ON houses(slug);
  `);
}

function normalizeSlug(address: string): string {
  let slug = address
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "house";
}

function mergeDuplicateHouses(db: Database.Database) {
  const allHouses = db
    .prepare("SELECT id, address, slug, created_at FROM houses ORDER BY created_at ASC")
    .all() as { id: string; address: string; slug: string; created_at: string }[];

  // Group houses by their normalized address
  const groups = new Map<string, typeof allHouses>();
  for (const house of allHouses) {
    const normalized = normalizeSlug(house.address);
    const group = groups.get(normalized) || [];
    group.push(house);
    groups.set(normalized, group);
  }

  const merge = db.transaction(() => {
    // Temporarily disable foreign keys so we can reassign references
    db.pragma("foreign_keys = OFF");

    for (const [normalizedSlug, houses] of groups) {
      if (houses.length <= 1) continue;

      // Keep the oldest house as canonical
      const canonical = houses[0];
      const duplicates = houses.slice(1);

      // Ensure the canonical house has the clean normalized slug
      if (canonical.slug !== normalizedSlug) {
        db.prepare("UPDATE houses SET slug = ? WHERE id = ?").run(
          normalizedSlug,
          canonical.id
        );
      }

      for (const dup of duplicates) {
        // Move contractors from duplicate to canonical,
        // skipping any with the same name + service_type
        const dupContractors = db
          .prepare("SELECT id, name, service_type FROM contractors WHERE house_id = ?")
          .all(dup.id) as { id: string; name: string; service_type: string }[];

        for (const contractor of dupContractors) {
          const existing = db
            .prepare(
              "SELECT id FROM contractors WHERE house_id = ? AND LOWER(name) = LOWER(?) AND LOWER(service_type) = LOWER(?)"
            )
            .get(canonical.id, contractor.name, contractor.service_type) as { id: string } | undefined;

          if (existing) {
            // Update any tasks referencing this duplicate contractor to point to the canonical one
            db.prepare(
              "UPDATE tasks SET contractor_id = ? WHERE contractor_id = ?"
            ).run(existing.id, contractor.id);
            db.prepare("DELETE FROM contractors WHERE id = ?").run(contractor.id);
          } else {
            db.prepare("UPDATE contractors SET house_id = ? WHERE id = ?").run(
              canonical.id,
              contractor.id
            );
          }
        }

        // Move tasks from duplicate to canonical,
        // skipping any with the same name (keep the one with the most recent activity)
        const dupTasks = db
          .prepare("SELECT id, name, last_completed_date, next_due_date FROM tasks WHERE house_id = ?")
          .all(dup.id) as { id: string; name: string; last_completed_date: string | null; next_due_date: string | null }[];

        for (const task of dupTasks) {
          const existing = db
            .prepare(
              "SELECT id, last_completed_date FROM tasks WHERE house_id = ? AND LOWER(name) = LOWER(?)"
            )
            .get(canonical.id, task.name) as { id: string; last_completed_date: string | null } | undefined;

          if (existing) {
            // If the duplicate task has been completed more recently, update the canonical task
            if (
              task.last_completed_date &&
              (!existing.last_completed_date || task.last_completed_date > existing.last_completed_date)
            ) {
              db.prepare(
                "UPDATE tasks SET last_completed_date = ?, next_due_date = ?, updated_at = datetime('now') WHERE id = ?"
              ).run(task.last_completed_date, task.next_due_date, existing.id);
            }
            db.prepare("DELETE FROM tasks WHERE id = ?").run(task.id);
          } else {
            db.prepare("UPDATE tasks SET house_id = ? WHERE id = ?").run(
              canonical.id,
              task.id
            );
          }
        }

        // Delete the duplicate house
        db.prepare("DELETE FROM houses WHERE id = ?").run(dup.id);
      }
    }

    db.pragma("foreign_keys = ON");
  });

  merge();
}
