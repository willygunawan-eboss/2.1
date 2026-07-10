import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import crypto from 'crypto';

const randomUUID = () => crypto.randomUUID();

async function seedEmployeeWorkspace() {
  console.log("Seeding Employee Workspace Data...");

  // Assume we have EMP-001 (Budi Santoso) from generic seeds, but let's just grab the first employee

  let employees = await db.select().from(schema.employees).limit(1);
  if (!employees.length) {
    const defaultEmpId = randomUUID();
    await db.insert(schema.employees).values({
      id: defaultEmpId,
      employeeNumber: 'EMP-001',
      name: 'Budi Santoso',
      email: 'budi.s@ichangeboss.co.id',
      status: 'Active',
      joinDate: '2022-01-15'
    });
    employees = await db.select().from(schema.employees).limit(1);
  }

  const emp = employees[0];

  // Certifications
  await db.insert(schema.employeeCertifications).values([
    {
      id: randomUUID(),
      employeeId: emp.id,
      certificationName: 'AWS Certified Solutions Architect',
      institution: 'Amazon Web Services',
      issueDate: '2024-05-10',
      expiryDate: '2027-05-10',
      credentialId: 'AWS-123456789'
    },
    {
      id: randomUUID(),
      employeeId: emp.id,
      certificationName: 'PMP Project Management Professional',
      institution: 'PMI',
      issueDate: '2022-11-20',
      expiryDate: '2025-11-20',
      credentialId: 'PMP-987654321'
    }
  ]);

  // Trainings
  await db.insert(schema.employeeTrainings).values([
    {
      id: randomUUID(),
      employeeId: emp.id,
      trainingName: 'Leadership Excellence Workshop',
      date: '2025-02-15',
      result: 'Passed - Distinction'
    },
    {
      id: randomUUID(),
      employeeId: emp.id,
      trainingName: 'Cybersecurity Advanced Threats',
      date: '2025-08-10',
      result: 'Passed'
    }
  ]);

  // Assets Assignment - Find an asset or create one
  const assets = await db.select().from(schema.assets).limit(1);
  if (assets.length) {
    await db.insert(schema.assetAssignments).values({
      id: randomUUID(),
      assetId: assets[0].id,
      assignedToId: emp.id,
      assignmentDate: '2024-01-10',
      notes: 'MacBook Pro M3 Max for Engineering'
    });
  }

  // Leaves
  await db.insert(schema.employeeLeaves).values([
    {
      id: randomUUID(),
      employeeId: emp.id,
      leaveType: 'Annual Leave',
      startDate: '2025-12-20',
      endDate: '2025-12-31',
      status: 'Approved'
    },
    {
      id: randomUUID(),
      employeeId: emp.id,
      leaveType: 'Sick Leave',
      startDate: '2025-06-15',
      endDate: '2025-06-16',
      status: 'Approved'
    }
  ]);

  // Performance
  await db.insert(schema.employeePerformances).values([
    {
      id: randomUUID(),
      employeeId: emp.id,
      reviewPeriod: '2025 H1',
      score: 4.8,
      comments: 'Exceptional performance leading the new ERP rollout.'
    },
    {
      id: randomUUID(),
      employeeId: emp.id,
      reviewPeriod: '2024 H2',
      score: 4.5,
      comments: 'Strong technical delivery, needs to improve delegation.'
    }
  ]);

  // Activities
  await db.insert(schema.activities).values([
    {
      id: randomUUID(),
      type: 'Approval',
      referenceId: 'PO-10023',
      referenceType: 'PurchaseOrder',
      date: new Date().toISOString(),
      notes: 'Approved Purchase Order for new servers.',
      performedById: emp.id
    },
    {
      id: randomUUID(),
      type: 'Login',
      referenceId: 'SYS-AUTH',
      referenceType: 'System',
      date: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Logged in from IP 192.168.1.55',
      performedById: emp.id
    }
  ]);

  console.log("Employee Workspace Seeded Successfully!");
  process.exit(0);
}

seedEmployeeWorkspace().catch(console.error);
