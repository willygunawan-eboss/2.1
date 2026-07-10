import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';
import path from 'path';
import fs from 'fs';

let dbPath = process.env.DATABASE_URL;
if (!dbPath) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  dbPath = path.join(dataDir, 'erp.db');
} else if (dbPath.startsWith('file:')) {
  dbPath = dbPath.replace('file:', '');
}

export const getDbPath = () => dbPath;

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

export function runMigrations() {
  const migrationsFolder = path.join(process.cwd(), 'drizzle');
  if (fs.existsSync(migrationsFolder)) {
    console.log(`[DB] Running migrations from ${migrationsFolder}...`);
    try {
      migrate(db, { migrationsFolder });
      console.log(`[DB] Migrations completed successfully.`);
      return true;
    } catch (error) {
      console.error(`[DB] Migration failed:`, error);
      throw error;
    }
  } else {
    console.warn(`[DB] No migrations folder found at ${migrationsFolder}.`);
    return false;
  }
}
