import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
console.log(await db.select().from(schema.users));
