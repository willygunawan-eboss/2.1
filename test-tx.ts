import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';

try {
  db.transaction((tx) => {
    tx.insert(schema.departments).values({ id: 'DEPT-TEST', name: 'Test Dept' }).run();
  });
  console.log("Tx block finished");
  const depts = db.select().from(schema.departments).all();
  console.log("Departments:", depts.find(d => d.id === 'DEPT-TEST'));
} catch (e) {
  console.error(e);
}
