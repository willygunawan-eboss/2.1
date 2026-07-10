import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const getOld = `  const createGetRoute = (path: string, table: any) => {
    app.get(path, async (req, res) => {
      try {
        const data = await db.select().from(table);
        res.json({ success: true, data });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };`;

const getNew = `  const createGetRoute = (path: string, table: any) => {
    app.get(path, async (req, res) => {
      try {
        const data = await db.select().from(table);
        res.json({ success: true, message: 'Data fetched successfully', data, meta: { total: data.length } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to fetch data', errors: String(e) });
      }
    });
  };`;

const postOld = `  const createPostRoute = (path: string, table: any) => {
    app.post(path, async (req, res) => {
      try {
        await db.insert(table).values({ id: req.body.id || 'ID-' + Date.now(), ...req.body });
        res.json({ success: true });
      } catch (e) {
        res.status(500).json({ success: false, error: String(e) });
      }
    });
  };`;

const postNew = `  const createPostRoute = (path: string, table: any) => {
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

code = code.replace(getOld, getNew);
code = code.replace(postOld, postNew);

if (!code.includes('import crypto from "crypto";')) {
  code = code.replace('import express from "express";', 'import express from "express";\nimport crypto from "crypto";');
}

fs.writeFileSync('server.ts', code);
