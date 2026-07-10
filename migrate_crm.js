import Database from 'better-sqlite3';
const db = new Database('data/erp.db');

db.exec(`
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pic TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  npwp TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  pic TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_interest TEXT,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  owner TEXT,
  estimated_value INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  date TEXT NOT NULL,
  notes TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);
console.log("CRM Migration successful");
