import { Router } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, like, or, and, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();
const randomUUID = () => crypto.randomUUID();

// Get CIs (with pagination, sorting, filtering)
router.get('/cis', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const customerId = req.query.customerId as string;
    const ciType = req.query.ciType as string;
    
    const conditions = [eq(schema.cis.isDeleted, false)];
    
    if (search) {
      conditions.push(
        or(
          like(schema.cis.ciCode, `%${search}%`),
          like(schema.cis.name, `%${search}%`)
        )!
      );
    }
    if (customerId) {
      conditions.push(eq(schema.cis.customerId, customerId));
    }
    if (ciType) {
      conditions.push(eq(schema.cis.ciType, ciType));
    }
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.cis).where(and(...conditions));
    const total = countResult[0].count;
    
    const data = await db.select({
      id: schema.cis.id,
      ciCode: schema.cis.ciCode,
      name: schema.cis.name,
      ciType: schema.cis.ciType,
      criticality: schema.cis.criticality,
      location: schema.cis.location
    })
      .from(schema.cis)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.cis.createdAt));
      
    res.json({ success: true, data, total, page, limit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Single CI with relationships
router.get('/cis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ci = await db.query.cis.findFirst({
      where: eq(schema.cis.id, id),
      with: {
        category: true,
        environment: true,
        status: true,
        customer: true,
        asset: true,
        parentRelationships: {
          where: eq(schema.ciRelationships.isDeleted, false),
          with: { childCi: true }
        },
        childRelationships: {
          where: eq(schema.ciRelationships.isDeleted, false),
          with: { parentCi: true }
        }
      }
    });
    
    if (!ci) {
      return res.status(404).json({ success: false, message: 'CI not found' });
    }
    
    res.json({ success: true, data: ci });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST CI
router.post('/cis', async (req, res) => {
  try {
    const data = req.body;
    const newId = randomUUID();
    
    await db.insert(schema.cis).values({
      ...data,
      id: newId,
      ciCode: data.ciCode || `CI-${Date.now()}`,
      createdBy: (req as any).user?.id
    });
    
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET CI Relationships Tree
router.get('/relationships', async (req, res) => {
  try {
    const data = await db.select().from(schema.ciRelationships).where(eq(schema.ciRelationships.isDeleted, false));
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
