import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
(async () => {
  const tickets = await db.select().from(schema.tickets);
  console.log("Tickets:", tickets.map(t => t.ticketNumber));
})();
