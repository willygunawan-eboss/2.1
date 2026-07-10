import { Router } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, like, or, and, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();
const randomUUID = () => crypto.randomUUID();

// Get Assets (with pagination, sorting, filtering)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const customerId = req.query.customerId as string;
    const categoryId = req.query.categoryId as string;
    
    const conditions = [eq(schema.assets.isDeleted, false)];
    
    if (search) {
      conditions.push(
        or(
          like(schema.assets.assetCode, `%${search}%`),
          like(schema.assets.name, `%${search}%`),
          like(schema.assets.serialNumber, `%${search}%`)
        )!
      );
    }
    if (status) {
      conditions.push(eq(schema.assets.status, status));
    }
    if (customerId) {
      conditions.push(eq(schema.assets.customerId, customerId));
    }
    if (categoryId) {
      conditions.push(eq(schema.assets.categoryId, categoryId));
    }
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.assets).where(and(...conditions));
    const total = countResult[0].count;
    
    const data = await db.select({
      id: schema.assets.id,
      assetCode: schema.assets.assetCode,
      name: schema.assets.name,
      status: schema.assets.status,
      serialNumber: schema.assets.serialNumber,
      categoryId: schema.assets.categoryId,
      manufacturerId: schema.assets.manufacturerId
    })
      .from(schema.assets)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.assets.createdAt));
      
    res.json({ success: true, data, total, page, limit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Single Asset with deep relations
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await db.query.assets.findFirst({
      where: eq(schema.assets.id, id),
      with: {
        category: true,
        model: true,
        manufacturer: true,
        location: true,
        customer: true,
        contract: true,
        project: true,
        assignments: { where: eq(schema.assetAssignments.isDeleted, false) },
        warranties: { where: eq(schema.assetWarranties.isDeleted, false) },
        maintenances: { where: eq(schema.assetMaintenances.isDeleted, false) },
        licenses: { where: eq(schema.assetLicenses.isDeleted, false) },
        configurations: { where: eq(schema.assetConfigurations.isDeleted, false) },
        networks: { where: eq(schema.assetNetworks.isDeleted, false) },
        documents: { where: eq(schema.assetDocuments.isDeleted, false) },
        attachments: { where: eq(schema.assetAttachments.isDeleted, false) }
      }
    });
    
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    
    res.json({ success: true, data: asset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Basic POST for Asset
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = randomUUID();
    
    await db.insert(schema.assets).values({
      ...data,
      id: newId,
      assetCode: data.assetCode || `AST-${Date.now()}`,
      createdBy: (req as any).user?.id
    });
    
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
