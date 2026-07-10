import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';

async function generate() {
  const allRoles = await db.select().from(schema.roles);
  console.log('--- ALL ROLES ---');
  console.log(allRoles.map(r => r.name).join(', '));
  
  const allPerms = await db.select().from(schema.permissions);
  console.log('\n--- PERMISSION STATS ---');
  console.log('Total Permissions:', allPerms.length);
  
  const modules = [...new Set(allPerms.map(p => p.module))];
  console.log('Total Modules:', modules.length);
  console.log('Modules:', modules.join(', '));
  
  const adminUser = await db.select().from(schema.users).where(import('drizzle-orm').then(m => m.eq(schema.users.username, 'admin')));
  console.log('\n--- ADMIN USER ---');
  console.log('Username:', adminUser[0].username);
  console.log('Role Field:', adminUser[0].role);
  
  const adminRoles = await db.select({ role: schema.roles.name }).from(schema.userRoles).leftJoin(schema.roles, import('drizzle-orm').then(m => m.eq(schema.roles.id, schema.userRoles.roleId))).where(import('drizzle-orm').then(m => m.eq(schema.userRoles.userId, adminUser[0].id)));
  console.log('Mapped Roles:', adminRoles.map(r => r.role).join(', '));
}

generate().catch(console.error);
