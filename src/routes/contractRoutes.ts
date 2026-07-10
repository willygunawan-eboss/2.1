import { Router } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, like, or, and, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();
const randomUUID = () => crypto.randomUUID();

// Get Contracts (with pagination, sorting, filtering)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const customerId = req.query.customerId as string;
    
    const conditions = [eq(schema.contracts.isDeleted, false)];
    
    if (search) {
      conditions.push(
        or(
          like(schema.contracts.contractNumber, `%${search}%`),
          like(schema.contracts.description, `%${search}%`)
        )!
      );
    }
    if (status) {
      conditions.push(eq(schema.contracts.status, status));
    }
    if (customerId) {
      conditions.push(eq(schema.contracts.customerId, customerId));
    }
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.contracts).where(and(...conditions));
    const total = countResult[0].count;
    
    const data = await db.select({
      id: schema.contracts.id,
      contractNumber: schema.contracts.contractNumber,
      customerId: schema.contracts.customerId,
      contractType: schema.contracts.contractType,
      startDate: schema.contracts.startDate,
      endDate: schema.contracts.endDate,
      status: schema.contracts.status
    })
      .from(schema.contracts)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.contracts.createdAt));
      
    res.json({ success: true, data, total, page, limit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Single Contract with details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await db.query.contracts.findFirst({
      where: eq(schema.contracts.id, id),
      with: {
        services: { where: eq(schema.contractServices.isDeleted, false) },
        slas: { where: eq(schema.contractSlas.isDeleted, false) },
        coverages: { where: eq(schema.contractCoverages.isDeleted, false) },
        devices: { where: eq(schema.contractDevices.isDeleted, false) },
        billings: { where: eq(schema.contractBillings.isDeleted, false) },
        renewals: { where: eq(schema.contractRenewals.isDeleted, false) },
        approvals: { where: eq(schema.contractApprovals.isDeleted, false) },
        customer: true
      }
    });
    
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    res.json({ success: true, data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Basic POST for Contract
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = randomUUID();
    
    await db.insert(schema.contracts).values({
      ...data,
      id: newId,
      contractNumber: data.contractNumber || `CTR-${Date.now()}`,
      createdBy: (req as any).user?.id
    });
    
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
