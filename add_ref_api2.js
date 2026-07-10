import fs from 'fs';
let serverCode = fs.readFileSync('server.ts', 'utf8');

const referenceApi2 = `
  // PUT Group
  app.put("/api/reference/groups/:id", async (req, res) => {
    try {
      await db.update(schema.referenceGroups).set(req.body).where(eq(schema.referenceGroups.id, req.params.id));
      clearReferenceCache();
      res.json({ success: true });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // DELETE Group
  app.delete("/api/reference/groups/:id", async (req, res) => {
    try {
      await db.delete(schema.referenceGroups).where(eq(schema.referenceGroups.id, req.params.id));
      clearReferenceCache();
      res.json({ success: true });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });
`;

serverCode = serverCode.replace('  // POST Value', referenceApi2 + '\n  // POST Value');

fs.writeFileSync('server.ts', serverCode);
