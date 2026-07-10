import fs from "fs";
import express from "express";
import { requirePermission } from "./src/middleware/rbacMiddleware.js";
import { getUserPermissions, getUserRoles } from "./src/middleware/rbac-engine.js";
import crypto from "crypto";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { db } from "./src/db/index";
import * as schema from "./src/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import ticketRoutes from "./src/routes/ticketRoutes";
import rbacRoutes from "./src/routes/rbacRoutes";
import customerRoutes from "./src/routes/customerRoutes";
import contractRoutes from "./src/routes/contractRoutes";
import assetRoutes from "./src/routes/assetRoutes";
import cmdbRoutes from "./src/routes/cmdbRoutes";
import employeeRoutes from "./src/routes/employeeRoutes";
import { initRBAC, rbacCache } from "./src/middleware/rbac-engine.js";
import orgRoutes from "./src/routes/orgRoutes";
import { loginSchema, employeeSchema, salesOrderSchema, projectSchema } from "./src/validations";
import { mockEmployees, mockAttendance, mockPayroll, mockTransactions, mockSalesOrders, mockProducts, mockProductionOrders, mockProjects } from "./src/seedData";

import { runMigrations, getDbPath } from './src/db/index.js';
import { runSeeder } from './src/db/seeder.js';


let APP_VERSION = '1.0.0';
try {
  const pkgContent = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  APP_VERSION = JSON.parse(pkgContent).version || '1.0.0';
} catch(e) {
}



async function startServer() {
  const app = express();

  console.log('=============================================');
  console.log(`🚀 Starting ICHANGEBOSS ERP ${APP_VERSION}`);
  console.log(`📦 Database Path: ${getDbPath()}`);
  try { runMigrations(); } catch(e) { console.error('Migration failed:', e); }
  try { await runSeeder(); await initRBAC(); } catch(e) { console.error('Seeder failed:', e); }
  
  console.log('✅ RBAC Engine Initialized.');
  console.log('=============================================');

  // Di AI Studio, kita HARUS menggunakan port 3000 (DEFAULT_APP_PORT). 
  // Di server Ubuntu pengguna, akan menggunakan process.env.PORT (3010) sesuai ecosystem.config.cjs.
  const PORT = process.env.DEFAULT_APP_PORT ? 3000 : (process.env.PORT || 3010);

  app.use(cors());
  app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback-refresh-secret';

app.use(cookieParser());

const authMiddleware = async (req, res, next) => {
  if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health'].includes(req.path)) return next();
  console.log('Path:', req.path);
  if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'].includes(req.path) || req.path.startsWith('/api/health') || req.path.startsWith('/api/system/health')) return next();
  if (!req.path.startsWith('/api/')) return next();

  const { token, refreshToken } = req.cookies;
  
  if (!token && !refreshToken) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      return next();
    } catch (e) {
      // Token invalid or expired, fall through to refresh
    }
  }
  
  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
      const result = await db.select().from(schema.users).where(eq(schema.users.id, (decodedRefresh as jwt.JwtPayload).id));
      if (result.length > 0 && result[0].refreshToken === refreshToken) {
        const user = result[0];
        const newToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
        res.cookie('token', newToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 15 * 60 * 1000 });
        (req as any).user = { id: user.id, username: user.username, role: user.role };
        return next();
      }
    } catch (e) {
      // Refresh token invalid
    }
  }
  
  res.status(401).json({ success: false, message: 'Token invalid' });
};
app.use(authMiddleware);

app.get('/api/debug/me', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  const permissions = getUserPermissions(user.id);
  const roles = getUserRoles(user.id);
  const modules = [...new Set(permissions.map((p: string) => p.split('_')[1]?.toLowerCase()).filter(Boolean))];
  const employee = await db.select().from(schema.employees).where(eq(schema.employees.userId, user.id));
  
  res.json({
    success: true,
    user,
    employee: employee[0] || null,
    role: roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : roles[0] || user.role,
    permissions,
    modules,
    menu: getUserMenus(user.id),
    accessibleRoutes: []
  });
});




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


  app.post('/api/auth/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    if (result.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const user = result[0];
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    
    await db.update(schema.users).set({ refreshToken }).where(eq(schema.users.id, user.id));
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ success: false, message: e.issues[0].message });
    res.status(500).json({ success: false, error: String(e) });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
    const result = await db.select().from(schema.users).where(eq(schema.users.id, decoded.id));
    if (result.length === 0 || result[0].refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    
    const user = result[0];
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 15 * 60 * 1000 });
    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
      await db.update(schema.users).set({ refreshToken: null }).where(eq(schema.users.id, decoded.id));
    }
  } catch(e) {}
  
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

app.get('/api/auth/me', async (req, res) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  
  // get permissions from rbac engine
  const permissions = getUserPermissions(user.id);
  const roles = getUserRoles(user.id);
  const modules = [...new Set(permissions.map((p: string) => p.split('_')[1]?.toLowerCase()).filter(Boolean))];
  
  // attempt to fetch employee
  const employee = await db.select().from(schema.employees).where(eq(schema.employees.userId, user.id)).get() || null;
  
  res.json({ 
    success: true, 
    user,
    employee,
    role: roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : roles[0] || user.role,
    permissions,
    modules
  });
});





  

  app.get("/api/system/health", async (req, res) => {
console.log('HIT HEALTH ROUTE');
    try {
      const dbStatus = await db.select({ id: schema.dashboardStats.id }).from(schema.dashboardStats).limit(1);
      const isDbOk = dbStatus.length > 0;
      
      res.json({ 
        success: true,
        data: {
          applicationVersion: APP_VERSION,
          buildTime: new Date().toISOString(),
          gitCommit: process.env.GIT_COMMIT || 'unknown',
          databasePath: getDbPath(),
          migrationVersion: 'latest',
          seederVersion: '1.0',
          status: {
            database: isDbOk ? 'OK' : 'ERROR',
            rbac: Object.keys(rbacCache.userRolesList).length > 0 ? 'OK' : 'ERROR',
            reference: 'OK',
            organization: 'OK'
          },
          systemReady: isDbOk
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ICHANGEBOSS API is running", timestamp: new Date().toISOString() });
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const statsResult = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      res.json({ success: true, data: statsResult[0] });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  const createGetRoute = (path: string, table: any, moduleName?: string) => {
    const middleware = moduleName ? requirePermission(moduleName, 'read') : (req, res, next) => next();
    app.get(path, middleware, async (req, res) => {
      try {
        const result = await db.select().from(table);
        res.json({ success: true, message: 'Data fetched successfully', data: result, meta: { total: result.length } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to fetch data', errors: String(e) });
      }
    });
  };

  const createPostRoute = (path: string, table: any, moduleName?: string, zodSchema?: any) => {
    const middleware = moduleName ? requirePermission(moduleName, 'write') : (req, res, next) => next();
    app.post(path, middleware, async (req, res) => {
      try {
        const id = req.body.id || 'ID-' + crypto.randomUUID();
        let dataToInsert = { ...req.body };
        
        if (zodSchema) {
          try {
            dataToInsert = zodSchema.parse(req.body);
          } catch (validationError: any) {
            return res.status(400).json({ success: false, message: 'Validation Error', errors: validationError.issues });
          }
        }
        
        await db.insert(table).values({ id, ...dataToInsert });
        res.json({ success: true, message: 'Record created successfully', data: { id } });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to create record', errors: String(e) });
      }
    });
  };

  // Generic Get Routes
  app.get("/api/departments", async (req, res) => {
    try {
      const result = await db.select().from(schema.departments);
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/positions", async (req, res) => {
    try {
      const result = await db.select().from(schema.positions);
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/vendors", async (req, res) => {
    try {
      const result = await db.select().from(schema.vendors);
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });


  app.get("/api/attendance", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.attendance.id,
        employeeId: schema.attendance.employeeId,
        employeeName: schema.employees.name,
        date: schema.attendance.date,
        checkIn: schema.attendance.checkIn,
        checkOut: schema.attendance.checkOut,
        status: schema.attendance.status,
        workHours: schema.attendance.workHours,
      })
      .from(schema.attendance)
      .leftJoin(schema.employees, eq(schema.attendance.employeeId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/payroll", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.payroll.id,
        employeeId: schema.payroll.employeeId,
        employeeName: schema.employees.name,
        period: schema.payroll.period,
        basicSalary: schema.payroll.basicSalary,
        allowances: schema.payroll.allowances,
        deductions: schema.payroll.deductions,
        netPay: schema.payroll.netPay,
        status: schema.payroll.status,
      })
      .from(schema.payroll)
      .leftJoin(schema.employees, eq(schema.payroll.employeeId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/sales-orders", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.salesOrders.id,
        customerId: schema.salesOrders.customerId,
        customer: schema.customers.name,
        salespersonId: schema.salesOrders.salespersonId,
        date: schema.salesOrders.date,
        amount: schema.salesOrders.amount,
        status: schema.salesOrders.status,
      })
      .from(schema.salesOrders)
      .leftJoin(schema.customers, eq(schema.salesOrders.customerId, schema.customers.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/production-orders", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.productionOrders.id,
        productId: schema.productionOrders.productId,
        product: schema.products.name,
        assignedToId: schema.productionOrders.assignedToId,
        assignedTo: schema.employees.name,
        quantity: schema.productionOrders.quantity,
        startDate: schema.productionOrders.startDate,
        endDate: schema.productionOrders.endDate,
        status: schema.productionOrders.status,
        progress: schema.productionOrders.progress,
      })
      .from(schema.productionOrders)
      .leftJoin(schema.products, eq(schema.productionOrders.productId, schema.products.id))
      .leftJoin(schema.employees, eq(schema.productionOrders.assignedToId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.projects.id,
        name: schema.projects.name,
        customerId: schema.projects.customerId,
        client: schema.customers.name,
        managerId: schema.projects.managerId,
        manager: schema.employees.name,
        dueDate: schema.projects.dueDate,
        budget: schema.projects.budget,
        status: schema.projects.status,
        progress: schema.projects.progress,
      })
      .from(schema.projects)
      .leftJoin(schema.customers, eq(schema.projects.customerId, schema.customers.id))
      .leftJoin(schema.employees, eq(schema.projects.managerId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/tasks", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.tasks.id,
        title: schema.tasks.title,
        assignedToId: schema.tasks.assignedToId,
        assignedTo: schema.employees.name,
        dueDate: schema.tasks.dueDate,
        status: schema.tasks.status,
        type: schema.tasks.type,
      })
      .from(schema.tasks)
      .leftJoin(schema.employees, eq(schema.tasks.assignedToId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/employee-assets", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.employeeAssets.id,
        employeeId: schema.employeeAssets.employeeId,
        assetId: schema.employeeAssets.assetId,
        assetName: schema.assets.name,
        assetCode: schema.assets.assetId,
        givenDate: schema.employeeAssets.givenDate,
        returnDate: schema.employeeAssets.returnDate,
      })
      .from(schema.employeeAssets)
      .leftJoin(schema.assets, eq(schema.employeeAssets.assetId, schema.assets.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

// Legacy /api/assets GET removed in favor of assetRoutes

  app.get("/api/invoices", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.invoices.id,
        invoiceNumber: schema.invoices.invoiceNumber,
        date: schema.invoices.date,
        dueDate: schema.invoices.dueDate,
        salespersonId: schema.invoices.salespersonId,
        salesperson: schema.employees.name,
        customerId: schema.invoices.customerId,
        customerName: schema.customers.name,
        customerPhone: schema.customers.phone,
        customerEmail: schema.customers.email,
        subtotal: schema.invoices.subtotal,
        discountTotal: schema.invoices.discountTotal,
        additionalDiscount: schema.invoices.additionalDiscount,
        shippingCost: schema.invoices.shippingCost,
        taxTotal: schema.invoices.taxTotal,
        downPayment: schema.invoices.downPayment,
        total: schema.invoices.total,
        amountPaid: schema.invoices.amountPaid,
        amountDue: schema.invoices.amountDue,
        notes: schema.invoices.notes,
        terms: schema.invoices.terms,
        signatureDate: schema.invoices.signatureDate,
        signatureName: schema.invoices.signatureName,
        status: schema.invoices.status,
      })
      .from(schema.invoices)
      .leftJoin(schema.customers, eq(schema.invoices.customerId, schema.customers.id))
      .leftJoin(schema.employees, eq(schema.invoices.salespersonId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.purchaseOrders.id,
        vendorId: schema.purchaseOrders.vendorId,
        vendor: schema.vendors.name,
        date: schema.purchaseOrders.date,
        amount: schema.purchaseOrders.amount,
        status: schema.purchaseOrders.status,
      })
      .from(schema.purchaseOrders)
      .leftJoin(schema.vendors, eq(schema.purchaseOrders.vendorId, schema.vendors.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.leads.id,
        companyName: schema.leads.companyName,
        pic: schema.leads.pic,
        email: schema.leads.email,
        phone: schema.leads.phone,
        productInterest: schema.leads.productInterest,
        source: schema.leads.source,
        status: schema.leads.status,
        score: schema.leads.score,
        ownerId: schema.leads.ownerId,
        owner: schema.employees.name,
        estimatedValue: schema.leads.estimatedValue,
        createdAt: schema.leads.createdAt,
      })
      .from(schema.leads)
      .leftJoin(schema.employees, eq(schema.leads.ownerId, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const result = await db.select({
        id: schema.activities.id,
        type: schema.activities.type,
        referenceId: schema.activities.referenceId,
        referenceType: schema.activities.referenceType,
        date: schema.activities.date,
        notes: schema.activities.notes,
        performedById: schema.activities.performedById,
        performedBy: schema.employees.name,
        createdAt: schema.activities.createdAt,
      })
      .from(schema.activities)
      .leftJoin(schema.employees, eq(schema.activities.performedById, schema.employees.id));
      res.json({ success: true, data: result });
    } catch(e) { res.status(500).json({ success: false, error: String(e) }); }
  });

  createGetRoute("/api/employees", schema.employees, "hr");


  createGetRoute("/api/transactions", schema.transactions, "finance");

  createGetRoute("/api/products", schema.products, "inventory");






  createGetRoute("/api/invoice-items", schema.invoiceItems, "finance");
  
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
      
      db.transaction((tx) => {
        tx.insert(schema.invoices).values({ id: invoiceId, ...invoiceData }).run();
        if (items && items.length > 0) {
          const itemsToInsert = items.map((item) => ({
            id: 'INV-ITEM-' + Math.random().toString(36).substr(2, 9),
            invoiceId: invoiceId,
            ...item
          }));
          tx.insert(schema.invoiceItems).values(itemsToInsert).run();
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
      
      db.transaction((tx) => {
        tx.update(schema.invoices).set(invoiceData).where(eq(schema.invoices.id, invoiceId)).run();
        
        if (items) {
          tx.delete(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, invoiceId)).run();
          
          if (items.length > 0) {
            const itemsToInsert = items.map((item) => ({
              id: 'INV-ITEM-' + Math.random().toString(36).substr(2, 9),
              invoiceId: invoiceId,
              ...item
            }));
            tx.insert(schema.invoiceItems).values(itemsToInsert).run();
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
      db.transaction((tx) => {
        tx.delete(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, req.params.id)).run();
        tx.delete(schema.invoices).where(eq(schema.invoices.id, req.params.id)).run();
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  // createPostRoute("/api/assets", schema.assets);
  createPostRoute("/api/employees", schema.employees, "hr");
  
// Legacy /api/assets/:id PUT removed in favor of assetRoutes
  
  

  // Custom Employee POST Route
  
  // Generic Post Routes (except employees which is custom)
  createPostRoute("/api/attendance", schema.attendance, "hr");
  createPostRoute("/api/payroll", schema.payroll, "hr");
  createPostRoute("/api/transactions", schema.transactions, "finance");
  
  // Custom Sales Order POST Route
  app.get("/api/sales-orders", async (req, res) => {
    try {
      const orders = await db.select().from(schema.salesOrders);
      const items = await db.select().from(schema.salesOrderItems);
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(i => i.salesOrderId === order.id)
      }));
      res.json({ success: true, data: ordersWithItems });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.post("/api/sales-orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      const orderId = orderData.id || 'SO-' + Date.now();
      
      db.transaction((tx) => {
        tx.insert(schema.salesOrders).values({ id: orderId, ...orderData }).run();
        
        if (items && items.length > 0) {
          for (const item of items) {
            const itemId = 'SOI-' + Math.random().toString(36).substr(2, 9);
            tx.insert(schema.salesOrderItems).values({
              id: itemId,
              salesOrderId: orderId,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }).run();

            // Decrease inventory
            tx.insert(schema.inventoryTransactions).values({
              id: 'INV-TX-' + Math.random().toString(36).substr(2, 9),
              productId: item.productId,
              type: 'OUT',
              quantity: item.quantity,
              date: new Date().toISOString(),
              referenceId: orderId,
              referenceType: 'SO'
            }).run();

            // Update product stock
            const product = tx.select().from(schema.products).where(eq(schema.products.id, item.productId)).get();
            if (product) {
               tx.update(schema.products).set({ stock: product.stock - item.quantity }).where(eq(schema.products.id, item.productId)).run();
            }
          }
        }

        // Update dashboard stats revenue
        const stats = tx.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main')).get();
        if (stats && orderData.amount) {
          tx.update(schema.dashboardStats)
            .set({ monthlyRevenue: stats.monthlyRevenue + Number(orderData.amount) })
            .where(eq(schema.dashboardStats.id, 'main')).run();
        }
      });
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const orders = await db.select().from(schema.purchaseOrders);
      const items = await db.select().from(schema.purchaseOrderItems);
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(i => i.purchaseOrderId === order.id)
      }));
      res.json({ success: true, data: ordersWithItems });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      const orderId = orderData.id || 'PO-' + Date.now();
      
      db.transaction((tx) => {
        tx.insert(schema.purchaseOrders).values({ id: orderId, ...orderData }).run();
        
        if (items && items.length > 0) {
          for (const item of items) {
            const itemId = 'POI-' + Math.random().toString(36).substr(2, 9);
            tx.insert(schema.purchaseOrderItems).values({
              id: itemId,
              purchaseOrderId: orderId,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }).run();

            // Increase inventory
            tx.insert(schema.inventoryTransactions).values({
              id: 'INV-TX-' + Math.random().toString(36).substr(2, 9),
              productId: item.productId,
              type: 'IN',
              quantity: item.quantity,
              date: new Date().toISOString(),
              referenceId: orderId,
              referenceType: 'PO'
            }).run();

            // Update product stock
            const product = tx.select().from(schema.products).where(eq(schema.products.id, item.productId)).get();
            if (product) {
               tx.update(schema.products).set({ stock: product.stock + item.quantity }).where(eq(schema.products.id, item.productId)).run();
            }
          }
        }
      });
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.get("/api/inventory-transactions", async (req, res) => {
    try {
      const txs = await db.select().from(schema.inventoryTransactions);
      res.json({ success: true, data: txs });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await db.select().from(schema.products);
      res.json({ success: true, data: products });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      await db.insert(schema.products).values({ id: req.body.id || 'PRD-' + Date.now(), ...req.body });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  createPostRoute("/api/production-orders", schema.productionOrders, "inventory");

  createPostRoute("/api/tasks", schema.tasks, "dashboard");
  createGetRoute("/api/announcements", schema.announcements, "dashboard");
  createPostRoute("/api/announcements", schema.announcements, "dashboard");

  // CRM Routes
  createGetRoute("/api/customers", schema.customers, "crm");
  createPostRoute("/api/customers", schema.customers, "crm");

  createPostRoute("/api/leads", schema.leads, "crm");


  app.use("/api/tickets", ticketRoutes);
  app.use("/api/org", orgRoutes);
  app.use("/api/rbac", rbacRoutes);
  app.use("/api/customers", customerRoutes);
  app.use("/api/contracts", contractRoutes);
  app.use("/api/assets", assetRoutes);
  app.use("/api/cmdb", cmdbRoutes);
  app.use("/api/employees", employeeRoutes);
  createPostRoute("/api/activities", schema.activities, "crm");
  
  app.post("/api/tasks/:id/approve", async (req, res) => {
    try {
      await db.update(schema.tasks).set({ status: 'Approved' }).where(eq(schema.tasks.id, req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
  
  // Custom Project POST Route
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = projectSchema.parse(req.body);
      await db.insert(schema.projects).values({ id: req.body.id || 'PRJ-' + Date.now(), ...validatedData });
      // Update dashboard open tickets/projects
      const stats = await db.select().from(schema.dashboardStats).where(eq(schema.dashboardStats.id, 'main'));
      if (stats.length > 0) {
        await db.update(schema.dashboardStats)
          .set({ openTickets: stats[0].openTickets + 1 })
          .where(eq(schema.dashboardStats.id, 'main'));
      }
      res.json({ success: true });
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ success: false, message: e.issues[0].message });
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  fs.writeFileSync('crash.log', String(err.stack || err));
  process.exit(1);
});
