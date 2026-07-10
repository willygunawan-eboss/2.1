import { Router } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();
const randomUUID = () => crypto.randomUUID();

router.get('/:id/workspace', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await db.query.employees.findFirst({
      where: eq(schema.employees.id, id),
      with: {
        department: true,
        position: true,
        branch: true,
        company: true,
        contracts: { orderBy: [desc(schema.employeeContracts.startDate)] },
        leaves: { orderBy: [desc(schema.employeeLeaves.startDate)] },
        attendance: { orderBy: [desc(schema.attendance.date)], limit: 30 },
        assetAssignments: {
          with: {
            asset: true
          }
        },
        certifications: true,
        trainings: true,
        performances: { orderBy: [desc(schema.employeePerformances.reviewPeriod)] },
        documents: true,
      }
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Additional data for Workspace:
    // Activities (Timeline)
    const activities = await db.query.activities.findMany({
      where: eq(schema.activities.performedById, id),
      orderBy: [desc(schema.activities.date)],
      limit: 50
    });

    // Tickets
    const tickets = await db.query.tickets.findMany({
      where: eq(schema.tickets.assignedToId, id),
      orderBy: [desc(schema.tickets.createdAt)],
      limit: 50
    });

    // Projects
    const projects = await db.query.projects.findMany({
      where: eq(schema.projects.managerId, id)
    });

    res.json({
      success: true,
      data: {
        ...employee,
        timeline: activities,
        tickets,
        projects
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
