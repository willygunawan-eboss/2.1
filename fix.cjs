const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Remove all createPostRoute definitions
code = code.replace(/const createPostRoute = \(path: string, table: any\) => \{[\s\S]*?\};\n/g, '');
// Remove all calls
code = code.replace(/createPostRoute\(".*?"\, schema\..*?\);\n/g, '');

// Insert it back once
const target = 'const createGetRoute = (path: string, table: any) => {';
const postRouteDef = `  const createPostRoute = (path: string, table: any) => {
    app.post(path, async (req, res) => {
      try {
        await db.insert(table).values({ id: 'ID-' + Date.now(), ...req.body });
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };\n\n`;

code = code.replace(target, postRouteDef + target);

// Insert calls
code = code.replace(/createGetRoute\("\/api\/employees", schema.employees\);/, 
  'createGetRoute("/api/employees", schema.employees);\n  createPostRoute("/api/employees", schema.employees);');
code = code.replace(/createGetRoute\("\/api\/attendance", schema.attendance\);/, 
  'createGetRoute("/api/attendance", schema.attendance);\n  createPostRoute("/api/attendance", schema.attendance);');
code = code.replace(/createGetRoute\("\/api\/payroll", schema.payroll\);/, 
  'createGetRoute("/api/payroll", schema.payroll);\n  createPostRoute("/api/payroll", schema.payroll);');
code = code.replace(/createGetRoute\("\/api\/transactions", schema.transactions\);/, 
  'createGetRoute("/api/transactions", schema.transactions);\n  createPostRoute("/api/transactions", schema.transactions);');
code = code.replace(/createGetRoute\("\/api\/sales-orders", schema.salesOrders\);/, 
  'createGetRoute("/api/sales-orders", schema.salesOrders);\n  createPostRoute("/api/sales-orders", schema.salesOrders);');
code = code.replace(/createGetRoute\("\/api\/products", schema.products\);/, 
  'createGetRoute("/api/products", schema.products);\n  createPostRoute("/api/products", schema.products);');
code = code.replace(/createGetRoute\("\/api\/production-orders", schema.productionOrders\);/, 
  'createGetRoute("/api/production-orders", schema.productionOrders);\n  createPostRoute("/api/production-orders", schema.productionOrders);');
code = code.replace(/createGetRoute\("\/api\/projects", schema.projects\);/, 
  'createGetRoute("/api/projects", schema.projects);\n  createPostRoute("/api/projects", schema.projects);');

fs.writeFileSync('server.ts', code);
