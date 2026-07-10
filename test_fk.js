import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
(async () => {
  try {
    await db.insert(schema.tickets).values({
      id: "TEST-123",
      ticketNumber: "TEST-123",
      title: "Title",
      description: "Desc",
      categoryId: "CAT-001",
      subCategoryId: "SCAT-001",
      priorityId: "PRI-001",
      impactId: "IMP-001",
      urgencyId: "URG-001",
      customerId: "", // empty string foreign key
    });
    console.log("Success inserting empty string FK");
  } catch (e) {
    console.error("Failed:", e);
  }
})();
