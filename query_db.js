import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
(async () => {
  const cats = await db.select().from(schema.ticketCategories);
  const subCats = await db.select().from(schema.ticketSubCategories);
  console.log("Categories:", cats.length);
  console.log("SubCategories:", subCats.length);
})();
