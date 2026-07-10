import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'import cmdbRoutes from "./src/routes/cmdbRoutes";',
  'import cmdbRoutes from "./src/routes/cmdbRoutes";\nimport employeeRoutes from "./src/routes/employeeRoutes";'
);

code = code.replace(
  'app.use("/api/cmdb", cmdbRoutes);',
  'app.use("/api/cmdb", cmdbRoutes);\n  app.use("/api/employees", employeeRoutes);'
);

// We need to keep the old createGetRoute("/api/employees", schema.employees) and createPostRoute because they might be used by generic lists.
// The custom route uses app.use("/api/employees", ...) so we must mount it BEFORE the generic routes, or the generic routes might conflict?
// Actually, generic routes in server.ts are just app.get("/api/employees") and app.post, whereas the router has app.get("/:id/workspace"). They don't conflict.

fs.writeFileSync('server.ts', code);
