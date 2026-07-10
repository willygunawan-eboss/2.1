import { Router } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, like, or, and, desc, sql, inArray } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();
const randomUUID = () => crypto.randomUUID();

// Get Customers (with pagination, sorting, filtering)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const industryId = req.query.industryId as string;
    const categoryId = req.query.categoryId as string;
    
    let baseQuery = db.select().from(schema.customers).where(eq(schema.customers.isDeleted, false));
    
    const conditions = [eq(schema.customers.isDeleted, false)];
    
    if (search) {
      conditions.push(
        or(
          like(schema.customers.name, `%${search}%`),
          like(schema.customers.code, `%${search}%`),
          like(schema.customers.email, `%${search}%`)
        )!
      );
    }
    if (industryId) {
      conditions.push(eq(schema.customers.industryId, industryId));
    }
    if (categoryId) {
      conditions.push(eq(schema.customers.categoryId, categoryId));
    }
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.customers).where(and(...conditions));
    const total = countResult[0].count;
    
    const data = await db.select({
      id: schema.customers.id,
      code: schema.customers.code,
      name: schema.customers.name,
      email: schema.customers.email,
      phone: schema.customers.phone,
      industryId: schema.customers.industryId,
      categoryId: schema.customers.categoryId,
      statusId: schema.customers.statusId,
      website: schema.customers.website
    })
      .from(schema.customers)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.customers.createdAt));
      
    res.json({ success: true, data, total, page, limit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Single Customer
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await db.query.customers.findFirst({
      where: eq(schema.customers.id, id),
      with: {
        contacts: { where: eq(schema.customerContacts.isDeleted, false) },
        addresses: { where: eq(schema.customerAddresses.isDeleted, false) },
        communications: { where: eq(schema.customerCommunications.isDeleted, false) },
        bankAccounts: { where: eq(schema.customerBankAccounts.isDeleted, false) },
        documents: { where: eq(schema.customerDocuments.isDeleted, false) }
      }
    });
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Customer
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newId = randomUUID();
    
    await db.insert(schema.customers).values({
      id: newId,
      code: data.code || `CUS-${Date.now()}`,
      name: data.name,
      legalName: data.legalName,
      npwp: data.npwp,
      email: data.email,
      website: data.website,
      phone: data.phone,
      industryId: data.industryId,
      categoryId: data.categoryId,
      groupId: data.groupId,
      statusId: data.statusId || 'Active',
      priorityId: data.priorityId,
      currencyId: data.currencyId,
      paymentTermId: data.paymentTermId,
      salespersonId: data.salespersonId,
      accountManagerId: data.accountManagerId,
      branchId: data.branchId,
      companyId: data.companyId,
      createdBy: (req as any).user?.id
    });
    
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    await db.update(schema.customers).set({
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.id
    }).where(eq(schema.customers.id, id));
    
    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Customer (Soft Delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(schema.customers).set({
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: (req as any).user?.id
    }).where(eq(schema.customers.id, id));
    
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Relations CRUD (Contacts) ---
router.post('/:id/contacts', async (req, res) => {
  try {
    const { id } = req.params;
    const newId = randomUUID();
    await db.insert(schema.customerContacts).values({
      ...req.body,
      id: newId,
      customerId: id,
      createdBy: (req as any).user?.id
    });
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/contacts/:contactId', async (req, res) => {
  try {
    await db.update(schema.customerContacts).set({
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.id
    }).where(eq(schema.customerContacts.id, req.params.contactId));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/contacts/:contactId', async (req, res) => {
  try {
    await db.update(schema.customerContacts).set({
      isDeleted: true,
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.id
    }).where(eq(schema.customerContacts.id, req.params.contactId));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Relations CRUD (Addresses) ---
router.post('/:id/addresses', async (req, res) => {
  try {
    const { id } = req.params;
    const newId = randomUUID();
    await db.insert(schema.customerAddresses).values({
      ...req.body,
      id: newId,
      customerId: id,
      createdBy: (req as any).user?.id
    });
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/addresses/:addressId', async (req, res) => {
  try {
    await db.update(schema.customerAddresses).set({
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.id
    }).where(eq(schema.customerAddresses.id, req.params.addressId));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/addresses/:addressId', async (req, res) => {
  try {
    await db.update(schema.customerAddresses).set({
      isDeleted: true,
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.id
    }).where(eq(schema.customerAddresses.id, req.params.addressId));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- Relations CRUD (Communications) ---
router.post('/:id/communications', async (req, res) => {
  try {
    const { id } = req.params;
    const newId = randomUUID();
    await db.insert(schema.customerCommunications).values({
      ...req.body,
      id: newId,
      customerId: id,
      createdBy: (req as any).user?.id
    });
    res.json({ success: true, data: { id: newId } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
