const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Insert after 'createGetRoute("/api/projects", schema.projects);'
const marker = 'createGetRoute("/api/projects", schema.projects);';
const newRoutes = `
  createGetRoute("/api/assets", schema.assets);
  createPostRoute("/api/assets", schema.assets);
  
  app.put("/api/assets/:id", async (req, res) => {
    try {
      await db.update(schema.assets).set(req.body).where(eq(schema.assets.id, req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
  
  app.get("/api/employees/:id/assets", async (req, res) => {
    try {
      // First get assets from employeeAssets table
      const employeeAssetsTable = await db.select().from(schema.employeeAssets).where(eq(schema.employeeAssets.employeeId, req.params.id));
      // Then get assets from assets table where assignedTo = employee.id
      const assignedAssets = await db.select().from(schema.assets).where(eq(schema.assets.assignedTo, req.params.id));
      
      const combined = [
        ...employeeAssetsTable,
        ...assignedAssets.map(a => ({
          id: a.id,
          employeeId: a.assignedTo,
          assetName: a.name,
          assetCode: a.assetId,
          givenDate: a.purchaseDate,
          returnDate: ''
        }))
      ];
      
      res.json({ success: true, data: combined });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
`;
content = content.replace(marker, marker + '\n' + newRoutes);

fs.writeFileSync('server.ts', content);
