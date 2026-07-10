import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const debugMeStr = `
app.get('/api/debug/me', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  const permissions = getUserPermissions(user.id);
  const roles = getUserRoles(user.id);
  const modules = [...new Set(permissions.map((p: string) => p.split('_')[1]?.toLowerCase()).filter(Boolean))];
  const employee = await db.select().from(schema.employees).where(eq(schema.employees.userId, user.id));
  
  res.json({
    success: true,
    user,
    employee: employee[0] || null,
    role: roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : roles[0] || user.role,
    permissions,
    modules,
    menu: [],
    accessibleRoutes: []
  });
});
`;

if (!code.includes('/api/debug/me')) {
  code = code.replace("app.use(authMiddleware);", "app.use(authMiddleware);\n" + debugMeStr);
  fs.writeFileSync('server.ts', code);
}
