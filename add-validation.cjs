const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Add imports
content = content.replace(
  'import { eq } from "drizzle-orm";',
  'import { eq } from "drizzle-orm";\nimport { z } from "zod";\nimport { loginSchema, employeeSchema, salesOrderSchema, projectSchema } from "./src/validations";'
);

// Update login
const loginCode = `app.post('/api/auth/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;`;
content = content.replace(`app.post('/api/auth/login', async (req, res) => {\n  try {\n    const { username, password } = req.body;`, loginCode);

// Add ZodError catching in login
content = content.replace(`res.status(500).json({ success: false, error: String(e) });\n  }\n});\n\napp.post('/api/auth/refresh'`, 
  `if (e instanceof z.ZodError) return res.status(400).json({ success: false, message: e.errors[0].message });\n    res.status(500).json({ success: false, error: String(e) });\n  }\n});\n\napp.post('/api/auth/refresh'`);

// Update employees
const empCode = `app.post("/api/employees", async (req, res) => {
  try {
    const validatedData = employeeSchema.parse(req.body);
    const employeeId = req.body.id || 'EMP-' + Date.now();
    const employeeName = validatedData.name;
    const joinDate = validatedData.joinDate;`;
content = content.replace(`app.post("/api/employees", async (req, res) => {\n    try {\n      const employeeId = req.body.id || 'EMP-' + Date.now();\n      const employeeName = req.body.name || 'Unknown Employee';\n      const joinDate = req.body.joinDate || new Date().toISOString().split('T')[0];`, empCode);

content = content.replace(
  `// Insert employee\n      await db.insert(schema.employees).values({ id: employeeId, ...req.body, avatar: req.body.avatar || '' });`,
  `// Insert employee\n      await db.insert(schema.employees).values({ id: employeeId, ...validatedData, avatar: req.body.avatar || '' });`
);

// Add ZodError catching in employees
content = content.replace(
  `res.status(500).json({ success: false, error: String(e) });\n    }\n  });\n\n  // Generic Post Routes (except employees which is custom)`,
  `if (e instanceof z.ZodError) return res.status(400).json({ success: false, message: e.errors[0].message });\n      res.status(500).json({ success: false, error: String(e) });\n    }\n  });\n\n  // Generic Post Routes (except employees which is custom)`
);

// Update sales-orders
const salesCode = `app.post("/api/sales-orders", async (req, res) => {
    try {
      const validatedData = salesOrderSchema.parse(req.body);
      await db.insert(schema.salesOrders).values({ id: req.body.id || 'SO-' + Date.now(), ...validatedData });`;
content = content.replace(
  `app.post("/api/sales-orders", async (req, res) => {\n    try {\n      await db.insert(schema.salesOrders).values({ id: req.body.id || 'SO-' + Date.now(), ...req.body });`,
  salesCode
);

content = content.replace(
  `res.status(500).json({ success: false, error: String(e) });\n    }\n  });\n\n  createPostRoute("/api/products"`,
  `if (e instanceof z.ZodError) return res.status(400).json({ success: false, message: e.errors[0].message });\n      res.status(500).json({ success: false, error: String(e) });\n    }\n  });\n\n  createPostRoute("/api/products"`
);

// Update projects
const projCode = `app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = projectSchema.parse(req.body);
      await db.insert(schema.projects).values({ id: req.body.id || 'PRJ-' + Date.now(), ...validatedData });`;
content = content.replace(
  `app.post("/api/projects", async (req, res) => {\n    try {\n      await db.insert(schema.projects).values({ id: req.body.id || 'PRJ-' + Date.now(), ...req.body });`,
  projCode
);

content = content.replace(
  `res.status(500).json({ success: false, error: String(e) });\n    }\n  });\n\n  if (process.env.NODE_ENV !== "production") {`,
  `if (e instanceof z.ZodError) return res.status(400).json({ success: false, message: e.errors[0].message });\n      res.status(500).json({ success: false, error: String(e) });\n    }\n  });\n\n  if (process.env.NODE_ENV !== "production") {`
);

fs.writeFileSync('server.ts', content);
