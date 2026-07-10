import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const oldAuthMe = `app.get('/api/auth/me', (req, res) => {
  if ((req as any).user) return res.json({ success: true, user: (req as any).user });
  res.status(401).json({ success: false, message: 'Not authenticated' });
});`;

const newAuthMe = `app.get('/api/auth/me', async (req, res) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  // get permissions from rbac engine
  const permissions = getUserPermissions(user.id);
  const roles = getUserRoles(user.id);
  const modules = [...new Set(permissions.map((p: string) => p.split('_')[1]?.toLowerCase()).filter(Boolean))];
  
  // attempt to fetch employee
  const employee = await db.select().from(schema.employees).where(eq(schema.employees.userId, user.id)).get() || null;
  
  res.json({ 
    success: true, 
    user,
    employee,
    role: roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : roles[0] || user.role,
    permissions,
    modules
  });
});`;

code = code.replace(oldAuthMe, newAuthMe);

if (!code.includes("import { getUserPermissions, getUserRoles }")) {
  code = code.replace('import { requirePermission } from "./src/middleware/rbacMiddleware.js";', 'import { requirePermission } from "./src/middleware/rbacMiddleware.js";\nimport { getUserPermissions, getUserRoles } from "./src/middleware/rbac-engine.js";');
}

fs.writeFileSync('server.ts', code);
