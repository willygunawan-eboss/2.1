import fs from 'fs';
let serverCode = fs.readFileSync('server.ts', 'utf8');

const referenceApi = `
  // --- REFERENCE ENGINE CACHE & API ---
  let referenceCache = null;
  let referenceCacheTime = 0;
  const CACHE_TTL = 60 * 1000 * 5; // 5 minutes

  const getReferenceData = async () => {
    if (referenceCache && (Date.now() - referenceCacheTime) < CACHE_TTL) {
      return referenceCache;
    }
    const groups = await db.select().from(schema.referenceGroups).orderBy(schema.referenceGroups.sortOrder);
    const values = await db.select().from(schema.referenceValues).orderBy(schema.referenceValues.sortOrder);
    referenceCache = { groups, values };
    referenceCacheTime = Date.now();
    return referenceCache;
  };

  const clearReferenceCache = () => {
    referenceCache = null;
    referenceCacheTime = 0;
  };

  // GET Groups
  app.get("/api/reference/groups", async (req, res) => {
    try {
      const data = await getReferenceData();
      res.json({ success: true, data: data.groups });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // GET Groups by ID
  app.get("/api/reference/groups/:id", async (req, res) => {
    try {
      const data = await getReferenceData();
      const group = data.groups.find(g => g.id === req.params.id);
      if (!group) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: group });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // GET Values
  app.get("/api/reference/values", async (req, res) => {
    try {
      const data = await getReferenceData();
      res.json({ success: true, data: data.values });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // GET Values by Group Code
  app.get("/api/reference/group/:code", async (req, res) => {
    try {
      const data = await getReferenceData();
      const group = data.groups.find(g => g.code === req.params.code);
      if (!group) return res.status(404).json({ success: false, error: 'Group not found' });
      const values = data.values.filter(v => v.groupId === group.id);
      res.json({ success: true, data: values });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // POST Group
  app.post("/api/reference/groups", async (req, res) => {
    try {
      const groupData = { ...req.body, id: req.body.id || 'RG-' + Date.now() };
      await db.insert(schema.referenceGroups).values(groupData);
      clearReferenceCache();
      res.json({ success: true, data: groupData });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // POST Value
  app.post("/api/reference/values", async (req, res) => {
    try {
      const valueData = { ...req.body, id: req.body.id || 'RV-' + Date.now() };
      await db.insert(schema.referenceValues).values(valueData);
      clearReferenceCache();
      res.json({ success: true, data: valueData });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // PUT Value
  app.put("/api/reference/values/:id", async (req, res) => {
    try {
      await db.update(schema.referenceValues).set(req.body).where(eq(schema.referenceValues.id, req.params.id));
      clearReferenceCache();
      res.json({ success: true });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  // DELETE Value
  app.delete("/api/reference/values/:id", async (req, res) => {
    try {
      await db.delete(schema.referenceValues).where(eq(schema.referenceValues.id, req.params.id));
      clearReferenceCache();
      res.json({ success: true });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

`;

serverCode = serverCode.replace("app.post('/api/auth/login',", referenceApi + "\n  app.post('/api/auth/login',");

fs.writeFileSync('server.ts', serverCode);
