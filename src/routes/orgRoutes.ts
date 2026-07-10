import { Router } from "express";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import { 
  companySchema, branchSchema, divisionSchema, 
  departmentSchema, jobGradeSchema, positionSchema, 
  orgEmployeeSchema 
} from "../validations.js";
import crypto from "crypto";

const router = Router();

// Helper for soft delete
const notDeleted = (table: any) => isNull(table.deletedAt);

// Generic CRUD Generator
const buildCrud = (path: string, table: any, validationSchema: any, searchFields: any[]) => {
  // List
  router.get(`/${path}`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = (req.query.search as string) || "";
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string) === "asc" ? asc : desc;

      const conditions = [notDeleted(table)];
      
      if (search && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => like(field, `%${search}%`));
        conditions.push(or(...searchConditions)!);
      }

      // We'll skip complex relations filtering in generic generic, just simple filter
      const data = await db
        .select()
        .from(table)
        .where(and(...conditions))
        .orderBy(sortOrder(table[sortBy] || table.createdAt))
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: table.id })
        .from(table)
        .where(and(...conditions));
        
      res.json({
        success: true,
        data,
        pagination: { total: totalResult.length, page, limit }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get by ID
  router.get(`/${path}/:id`, async (req, res) => {
    try {
      const data = await db.select().from(table).where(and(eq(table.id, req.params.id), notDeleted(table)));
      if (!data.length) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: data[0] });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create
  router.post(`/${path}`, async (req, res) => {
    try {
      // Clean empty strings
      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
      const validatedData = validationSchema.parse(req.body);
      const id = crypto.randomUUID();
      
      await db.insert(table).values({
        ...validatedData,
        id,
        // @ts-ignore
        createdBy: req.user?.username || "system"
      });
      res.status(201).json({ success: true, data: { id, ...validatedData } });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ success: false, error: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update
  router.put(`/${path}/:id`, async (req, res) => {
    try {
      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
      const validatedData = validationSchema.partial().parse(req.body);
      const existing = await db.select().from(table).where(and(eq(table.id, req.params.id), notDeleted(table)));
      if (!existing.length) return res.status(404).json({ success: false, message: "Not found" });

      await db.update(table)
        .set({
          ...validatedData,
          updatedAt: new Date().toISOString(),
          // @ts-ignore
          updatedBy: req.user?.username || "system"
        })
        .where(eq(table.id, req.params.id));
      res.json({ success: true, message: "Updated successfully" });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ success: false, error: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const existing = await db.select().from(table).where(and(eq(table.id, req.params.id), notDeleted(table)));
      if (!existing.length) return res.status(404).json({ success: false, message: "Not found" });

      await db.update(table)
        .set({
          deletedAt: new Date().toISOString(),
          // @ts-ignore
          deletedBy: req.user?.username || "system"
        })
        .where(eq(table.id, req.params.id));
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

buildCrud("companies", schema.companies, companySchema, [schema.companies.code, schema.companies.name]);
buildCrud("branches", schema.branches, branchSchema, [schema.branches.code, schema.branches.name]);
buildCrud("divisions", schema.divisions, divisionSchema, [schema.divisions.code, schema.divisions.name]);
buildCrud("departments", schema.departments, departmentSchema, [schema.departments.code, schema.departments.name]);
buildCrud("job-grades", schema.jobGrades, jobGradeSchema, [schema.jobGrades.code, schema.jobGrades.name]);
buildCrud("positions", schema.positions, positionSchema, [schema.positions.code, schema.positions.name]);
buildCrud("employees", schema.employees, orgEmployeeSchema, [schema.employees.employeeNumber, schema.employees.name, schema.employees.email]);

// References
router.get('/references/all', async (req, res) => {
  try {
    const companies = await db.select({ id: schema.companies.id, name: schema.companies.name }).from(schema.companies).where(notDeleted(schema.companies));
    const branches = await db.select({ id: schema.branches.id, name: schema.branches.name, companyId: schema.branches.companyId }).from(schema.branches).where(notDeleted(schema.branches));
    const divisions = await db.select({ id: schema.divisions.id, name: schema.divisions.name, companyId: schema.divisions.companyId }).from(schema.divisions).where(notDeleted(schema.divisions));
    const departments = await db.select({ id: schema.departments.id, name: schema.departments.name, divisionId: schema.departments.divisionId }).from(schema.departments).where(notDeleted(schema.departments));
    const jobGrades = await db.select({ id: schema.jobGrades.id, name: schema.jobGrades.name }).from(schema.jobGrades).where(notDeleted(schema.jobGrades));
    const positions = await db.select({ id: schema.positions.id, name: schema.positions.name, departmentId: schema.positions.departmentId }).from(schema.positions).where(notDeleted(schema.positions));
    
    res.json({
      success: true,
      data: {
        companies,
        branches,
        divisions,
        departments,
        jobGrades,
        positions
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
