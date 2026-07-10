import { Router } from "express";
import { db } from "../db/index";
import * as schema from "../db/schema";
import { eq, like, desc, asc, and, isNull, sql } from "drizzle-orm";
import { ticketSchema } from "../validations";
import { z } from "zod";

const router = Router();

// Helper to generate HD-YYYYMMDD-XXXXXX
async function generateTicketNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `HD-${dateStr}-`;
  
  // Find the latest ticket for today
  const latestTicket = await db.select({ ticketNumber: schema.tickets.ticketNumber })
    .from(schema.tickets)
    .where(like(schema.tickets.ticketNumber, `${prefix}%`))
    .orderBy(desc(schema.tickets.ticketNumber))
    .limit(1);

  let seq = 1;
  if (latestTicket.length > 0) {
    const lastNumStr = latestTicket[0].ticketNumber.replace(prefix, '');
    seq = parseInt(lastNumStr, 10) + 1;
  }

  return `${prefix}${seq.toString().padStart(6, '0')}`;
}

// CREATE Ticket
router.post("/", async (req, res) => {
  try {
    // clean empty strings
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = ticketSchema.parse(req.body);
    const ticketNumber = await generateTicketNumber();
    const id = `TICKET-${Date.now()}`;
    
    await db.insert(schema.tickets).values({
      id,
      ticketNumber,
      ...validatedData,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: "Ticket created successfully", data: { id, ticketNumber } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.issues });
    }
    res.status(500).json({ success: false, error: String(error) });
  }
});

// READ All Tickets (with Pagination, Search, Filter, Sort)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    
    // Filters
    const statusId = req.query.statusId as string;
    const priorityId = req.query.priorityId as string;
    const categoryId = req.query.categoryId as string;
    const assignedTo = req.query.assignedTo as string;

    const offset = (page - 1) * limit;

    let conditions = [];
    conditions.push(isNull(schema.tickets.deletedAt)); // Only active tickets

    if (search) {
      conditions.push(like(schema.tickets.title, `%${search}%`));
      // You could add OR conditions for ticketNumber etc if needed
    }
    if (statusId) conditions.push(eq(schema.tickets.statusId, statusId));
    if (priorityId) conditions.push(eq(schema.tickets.priorityId, priorityId));
    if (categoryId) conditions.push(eq(schema.tickets.categoryId, categoryId));
    if (assignedTo) conditions.push(eq(schema.tickets.assignedTo, assignedTo));

    const whereClause = conditions.length > 0 ? and(...conditions) : isNull(schema.tickets.deletedAt);

    // Get total count
    const totalCountRes = await db.select({ count: sql<number>`count(*)` })
      .from(schema.tickets)
      .where(whereClause);
    const total = totalCountRes[0].count;

    // Build order by
    let orderClause = desc(schema.tickets.createdAt);
    if (sortBy === 'title') orderClause = sortOrder === 'asc' ? asc(schema.tickets.title) : desc(schema.tickets.title);
    if (sortBy === 'ticketNumber') orderClause = sortOrder === 'asc' ? asc(schema.tickets.ticketNumber) : desc(schema.tickets.ticketNumber);

    // Execute query
    const tickets = await db.select()
      .from(schema.tickets)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// READ Single Ticket Detail

router.get("/dashboard-stats", async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const tickets = await db.select().from(schema.tickets).where(isNull(schema.tickets.deletedAt));
    const statuses = await db.select().from(schema.ticketStatuses);
    const priorities = await db.select().from(schema.ticketPriorities);
    const categories = await db.select().from(schema.ticketCategories);
    const employees = await db.select().from(schema.employees);
    const customers = await db.select().from(schema.customers);

    const getStatusIsClosed = (id: string | null) => statuses.find(s => s.id === id)?.isClosed || false;
    const getStatusName = (id: string | null) => statuses.find(s => s.id === id)?.name?.toLowerCase() || '';
    const getPriorityLevel = (id: string | null) => priorities.find(p => p.id === id)?.level || 0;
    
    const openTickets = tickets.filter(t => !getStatusIsClosed(t.statusId)).length;
    const criticalTickets = tickets.filter(t => getPriorityLevel(t.priorityId) >= 3 && !getStatusIsClosed(t.statusId)).length;
    const waitingCustomerTickets = tickets.filter(t => getStatusName(t.statusId).includes('wait') || getStatusName(t.statusId).includes('pending')).length;
    const resolvedToday = tickets.filter(t => 
      (getStatusName(t.statusId).includes('resolv') || getStatusName(t.statusId).includes('selesai')) && 
      t.actualResolutionDate && 
      t.actualResolutionDate.startsWith(todayStr)
    ).length;
    const closedToday = tickets.filter(t => 
      getStatusIsClosed(t.statusId) && 
      t.updatedAt && 
      t.updatedAt.startsWith(todayStr)
    ).length;
    
    const ticketsWithSLA = tickets.filter(t => t.expectedResolutionDate && t.actualResolutionDate);
    const slaMet = ticketsWithSLA.filter(t => new Date(t.actualResolutionDate!) <= new Date(t.expectedResolutionDate!)).length;
    const slaCompliance = ticketsWithSLA.length > 0 ? Math.round((slaMet / ticketsWithSLA.length) * 100) : 100;
    
    const slaBreach = tickets.filter(t => {
      if (t.actualResolutionDate && t.expectedResolutionDate) {
        return new Date(t.actualResolutionDate) > new Date(t.expectedResolutionDate);
      }
      if (!t.actualResolutionDate && t.expectedResolutionDate && !getStatusIsClosed(t.statusId)) {
        return new Date() > new Date(t.expectedResolutionDate);
      }
      return false;
    }).length;
    
    let avgResponseTime = 1.2; // Mock avg response time in hours
    let avgResolutionTime = 0;
    let sumRes = 0;
    let countRes = 0;
    tickets.forEach(t => {
      if (t.createdAt && t.actualResolutionDate) {
        const diff = new Date(t.actualResolutionDate).getTime() - new Date(t.createdAt).getTime();
        if (diff > 0) {
          sumRes += diff;
          countRes++;
        }
      }
    });
    if (countRes > 0) avgResolutionTime = Math.round((sumRes / countRes / (1000 * 60 * 60)) * 10) / 10;
    
    const engineerUtilization = 75 + Math.floor(Math.random() * 20); // Example percent 75-95%
    const customerSatisfaction = 90 + Math.floor(Math.random() * 10); // Example percent 90-100%

    const trendTicket = [];
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tickets.filter(t => t.createdAt && t.createdAt.startsWith(dateStr)).length;
      trendTicket.push({ date: dateStr.split('-').slice(1).join('-'), count });
    }

    const categoryCount = {};
    tickets.forEach(t => {
      const catName = categories.find(c => c.id === t.categoryId)?.name || 'Unknown';
      categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });
    const categoryTicket = Object.keys(categoryCount).map(k => ({ name: k, value: categoryCount[k] }));

    const priorityCount = {};
    tickets.forEach(t => {
      const pName = priorities.find(p => p.id === t.priorityId)?.name || 'Unknown';
      priorityCount[pName] = (priorityCount[pName] || 0) + 1;
    });
    const priorityTicket = Object.keys(priorityCount).map(k => ({ name: k, value: priorityCount[k] }));

    const statusCount = {};
    tickets.forEach(t => {
      const sName = statuses.find(s => s.id === t.statusId)?.name || 'Unknown';
      statusCount[sName] = (statusCount[sName] || 0) + 1;
    });
    const statusTicket = Object.keys(statusCount).map(k => ({ name: k, value: statusCount[k] }));

    const engineerLoad = {};
    tickets.filter(t => !getStatusIsClosed(t.statusId)).forEach(t => {
      const eName = employees.find(e => e.id === t.assignedTo)?.name || 'Unassigned';
      engineerLoad[eName] = (engineerLoad[eName] || 0) + 1;
    });
    const workloadEngineer = Object.keys(engineerLoad).map(k => ({ name: k, value: engineerLoad[k] }));

    const customerCount = {};
    tickets.forEach(t => {
      const cName = customers.find(c => c.id === t.customerId)?.name || 'Unknown';
      customerCount[cName] = (customerCount[cName] || 0) + 1;
    });
    const topCustomer = Object.keys(customerCount).map(k => ({ name: k, value: customerCount[k] })).sort((a,b) => b.value - a.value).slice(0, 5);

    res.json({
      success: true,
      data: {
        kpi: {
          openTickets,
          criticalTickets,
          waitingCustomerTickets,
          resolvedToday,
          closedToday,
          slaCompliance,
          slaBreach,
          avgResponseTime,
          avgResolutionTime,
          engineerUtilization,
          customerSatisfaction
        },
        charts: {
          trendTicket,
          categoryTicket,
          priorityTicket,
          statusTicket,
          workloadEngineer,
          topCustomer
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ticket = await db.select().from(schema.tickets).where(and(eq(schema.tickets.id, req.params.id), isNull(schema.tickets.deletedAt)));
    if (ticket.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.json({ success: true, data: ticket[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// UPDATE Ticket
router.put("/:id", async (req, res) => {
  try {
    // Validate partial data for update
    // clean empty strings
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = ticketSchema.partial().parse(req.body);
    
    const existing = await db.select().from(schema.tickets).where(and(eq(schema.tickets.id, req.params.id), isNull(schema.tickets.deletedAt)));
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    await db.update(schema.tickets)
      .set({ ...validatedData, updatedAt: new Date().toISOString() })
      .where(eq(schema.tickets.id, req.params.id));

    res.json({ success: true, message: "Ticket updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.issues });
    }
    res.status(500).json({ success: false, error: String(error) });
  }
});

// DELETE Ticket (Soft Delete)
router.delete("/:id", async (req, res) => {
  try {
    const existing = await db.select().from(schema.tickets).where(and(eq(schema.tickets.id, req.params.id), isNull(schema.tickets.deletedAt)));
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    await db.update(schema.tickets)
      .set({ deletedAt: new Date().toISOString() }) // Also set deletedBy if you have user context
      .where(eq(schema.tickets.id, req.params.id));

    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// RESTORE Ticket
router.post("/:id/restore", async (req, res) => {
  try {
    const existing = await db.select().from(schema.tickets).where(eq(schema.tickets.id, req.params.id));
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    if (!existing[0].deletedAt) {
      return res.status(400).json({ success: false, message: "Ticket is not deleted" });
    }

    await db.update(schema.tickets)
      .set({ deletedAt: null, deletedBy: null })
      .where(eq(schema.tickets.id, req.params.id));

    res.json({ success: true, message: "Ticket restored successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// REFERENCE DATA ROUTES (for dropdowns in the UI)
router.get("/references/all", async (req, res) => {
  try {
    const customers = await db.select({ id: schema.customers.id, name: schema.customers.name }).from(schema.customers);
    const employees = await db.select({ id: schema.employees.id, name: schema.employees.name }).from(schema.employees);
    const assets = await db.select({ id: schema.assets.id, name: schema.assets.name }).from(schema.assets);
    const categories = await db.select().from(schema.ticketCategories);
    const subCategories = await db.select().from(schema.ticketSubCategories);
    const priorities = await db.select().from(schema.ticketPriorities);
    const impacts = await db.select().from(schema.ticketImpacts);
    const urgencies = await db.select().from(schema.ticketUrgencies);
    const statuses = await db.select().from(schema.ticketStatuses);

    res.json({
      success: true,
      data: { customers, employees, assets, categories, subCategories, priorities, impacts, urgencies, statuses }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;
