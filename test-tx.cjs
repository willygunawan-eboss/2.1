const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { sqliteTable, text } = require('drizzle-orm/sqlite-core');

const sqlite = new Database(':memory:');
const db = drizzle(sqlite);

const users = sqliteTable('users', { id: text('id').primaryKey() });
db.run(require('drizzle-orm').sql`CREATE TABLE users (id TEXT PRIMARY KEY)`);

async function test() {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(users).values({ id: '1' });
    });
    console.log("Transaction succeeded");
  } catch (e) {
    console.error("Transaction failed:", e);
  }
}
test();
