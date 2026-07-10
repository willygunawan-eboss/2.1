const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const marker = 'createGetRoute("/api/assets", schema.assets);';
if (content.includes(marker)) {
  const injection = `
  createGetRoute("/api/invoices", schema.invoices);
  createGetRoute("/api/invoice-items", schema.invoiceItems);
  
  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const inv = await db.select().from(schema.invoices).where(eq(schema.invoices.id, req.params.id));
      if (inv.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
      const items = await db.select().from(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, req.params.id));
      res.json({ success: true, data: { ...inv[0], items } });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const { items, ...invoiceData } = req.body;
      const invoiceId = invoiceData.id || 'INV-' + Date.now();
      
      await db.transaction(async (tx) => {
        await tx.insert(schema.invoices).values({ id: invoiceId, ...invoiceData });
        if (items && items.length > 0) {
          const itemsToInsert = items.map((item) => ({
            id: 'INV-ITEM-' + Math.random().toString(36).substr(2, 9),
            invoiceId: invoiceId,
            ...item
          }));
          await tx.insert(schema.invoiceItems).values(itemsToInsert);
        }
      });
      
      res.json({ success: true, id: invoiceId });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const { items, ...invoiceData } = req.body;
      const invoiceId = req.params.id;
      
      await db.transaction(async (tx) => {
        await tx.update(schema.invoices).set(invoiceData).where(eq(schema.invoices.id, invoiceId));
        
        if (items) {
          await tx.delete(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, invoiceId));
          
          if (items.length > 0) {
            const itemsToInsert = items.map((item) => ({
              id: 'INV-ITEM-' + Math.random().toString(36).substr(2, 9),
              invoiceId: invoiceId,
              ...item
            }));
            await tx.insert(schema.invoiceItems).values(itemsToInsert);
          }
        }
      });
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
  
  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      await db.transaction(async (tx) => {
        await tx.delete(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, req.params.id));
        await tx.delete(schema.invoices).where(eq(schema.invoices.id, req.params.id));
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
`;
  content = content.replace(marker, marker + '\n' + injection);
  fs.writeFileSync('server.ts', content);
}
