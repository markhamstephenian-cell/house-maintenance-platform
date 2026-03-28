import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "house_maintenance.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
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
