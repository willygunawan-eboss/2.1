import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'import rbacRoutes from "./src/routes/rbacRoutes";',
  'import rbacRoutes from "./src/routes/rbacRoutes";\nimport customerRoutes from "./src/routes/customerRoutes";'
);

code = code.replace(
  'app.use("/api/rbac", rbacRoutes);',
  'app.use("/api/rbac", rbacRoutes);\n  app.use("/api/customers", customerRoutes);'
);

fs.writeFileSync('server.ts', code);
