import fs from 'fs';
let code = fs.readFileSync('src/routes/rbacRoutes.ts', 'utf8');

const oldContext = `    data: {
      roles: getUserRoles(user.id),
      permissions: getUserPermissions(user.id),
      menus: getUserMenus(user.id),
      // To get scopes properly`;

const newContext = `    data: {
      roles: getUserRoles(user.id),
      permissions: getUserPermissions(user.id),
      modules: [...new Set(getUserPermissions(user.id).map((p: string) => p.split('_')[1]?.toLowerCase()).filter(Boolean))],
      menus: getUserMenus(user.id),
      // To get scopes properly`;

code = code.replace(oldContext, newContext);
fs.writeFileSync('src/routes/rbacRoutes.ts', code);
