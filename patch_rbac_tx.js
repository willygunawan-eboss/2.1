import fs from 'fs';
let code = fs.readFileSync('src/routes/rbacRoutes.ts', 'utf8');

// Replace role-permissions
const rolePermissionsOld = `  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  for (const pId of permissionIds) {
    await db.insert(rolePermissions).values({ id: randomUUID(), roleId, permissionId: pId });
  }`;

const rolePermissionsNew = `  db.transaction((tx) => {
    tx.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId)).run();
    for (const pId of permissionIds) {
      tx.insert(rolePermissions).values({ id: randomUUID(), roleId, permissionId: pId }).run();
    }
  });`;

code = code.replace(rolePermissionsOld, rolePermissionsNew);

// Replace user-roles
const userRolesOld = `  await db.delete(userRoles).where(eq(userRoles.userId, userId));
  for (const rId of roleIds) {
    await db.insert(userRoles).values({ id: randomUUID(), userId, roleId: rId });
  }`;

const userRolesNew = `  db.transaction((tx) => {
    tx.delete(userRoles).where(eq(userRoles.userId, userId)).run();
    for (const rId of roleIds) {
      tx.insert(userRoles).values({ id: randomUUID(), userId, roleId: rId }).run();
    }
  });`;

code = code.replace(userRolesOld, userRolesNew);

// Replace menu-permissions
const menuPermissionsOld = `  await db.delete(menuPermissions).where(eq(menuPermissions.roleId, roleId));
  for (const m of menus) {
    await db.insert(menuPermissions).values({ id: randomUUID(), roleId, menu: m });
  }`;

const menuPermissionsNew = `  db.transaction((tx) => {
    tx.delete(menuPermissions).where(eq(menuPermissions.roleId, roleId)).run();
    for (const m of menus) {
      tx.insert(menuPermissions).values({ id: randomUUID(), roleId, menu: m }).run();
    }
  });`;

code = code.replace(menuPermissionsOld, menuPermissionsNew);

// Replace role-scopes
const roleScopesOld = `  await db.delete(roleDataScopes).where(eq(roleDataScopes.roleId, roleId));
  for (const ms of moduleScopes) {
    await db.insert(roleDataScopes).values({ id: randomUUID(), roleId, module: ms.module, scopeId: ms.scopeId });
  }`;

const roleScopesNew = `  db.transaction((tx) => {
    tx.delete(roleDataScopes).where(eq(roleDataScopes.roleId, roleId)).run();
    for (const ms of moduleScopes) {
      tx.insert(roleDataScopes).values({ id: randomUUID(), roleId, module: ms.module, scopeId: ms.scopeId }).run();
    }
  });`;

code = code.replace(roleScopesOld, roleScopesNew);

fs.writeFileSync('src/routes/rbacRoutes.ts', code);
