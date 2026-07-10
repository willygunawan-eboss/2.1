import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const getOld = `  const createGetRoute = (path: string, table: any) => {
    app.get(path, async (req, res) => {
      try {
        const result = await db.select().from(table);
        res.json({ success: true, data: result });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };`;

const getNew = `  const createGetRoute = (path: string, table: any, moduleName?: string) => {
    const middleware = moduleName ? requirePermission(moduleName, 'read') : (req, res, next) => next();
    app.get(path, middleware, async (req, res) => {
      try {
        const result = await db.select().from(table);
        res.json({ success: true, message: 'Data fetched successfully', data: result, meta: { total: result.length } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to fetch data', errors: String(e) });
      }
    });
  };`;

const postOld = `  const createPostRoute = (path: string, table: any) => {
    app.post(path, async (req, res) => {
      try {
        const id = req.body.id || 'ID-' + crypto.randomUUID();
        await db.insert(table).values({ id, ...req.body });
        res.json({ success: true, message: 'Record created successfully', data: { id } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to create record', errors: String(e) });
      }
    });
  };`;

const postNew = `  const createPostRoute = (path: string, table: any, moduleName?: string) => {
    const middleware = moduleName ? requirePermission(moduleName, 'write') : (req, res, next) => next();
    app.post(path, middleware, async (req, res) => {
      try {
        const id = req.body.id || 'ID-' + crypto.randomUUID();
        await db.insert(table).values({ id, ...req.body });
        res.json({ success: true, message: 'Record created successfully', data: { id } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to create record', errors: String(e) });
      }
    });
  };`;

code = code.replace(getOld, getNew);
code = code.replace(postOld, postNew);

if (!code.includes("import { requirePermission }")) {
  code = code.replace('import express from "express";', 'import express from "express";\nimport { requirePermission } from "./src/middleware/rbacMiddleware.js";');
}

fs.writeFileSync('server.ts', code);
