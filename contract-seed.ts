import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import crypto from 'crypto';

const randomUUID = () => crypto.randomUUID();

async function seedContracts() {
  console.log("Seeding Enterprise Contract Domain...");
  
  // Try to find a customer
  const customers = await db.select().from(schema.customers).limit(2);
  let customerId1 = customers[0]?.id;
  let customerId2 = customers[1]?.id;

  if (!customerId1) {
    customerId1 = randomUUID();
    await db.insert(schema.customers).values({
      id: customerId1,
      name: 'PT Dummy Corp',
      code: 'CUS-DUMMY1',
      email: 'dummy1@test.com',
      phone: '000'
    });
  }

  if (!customerId2) {
    customerId2 = customerId1;
  }

  const contract1Id = randomUUID();
  const contract2Id = randomUUID();

  // 1. Managed Service - Platinum
  await db.insert(schema.contracts).values({
    id: contract1Id,
    contractNumber: 'CTR-MS-PLATINUM-001',
    customerId: customerId1,
    contractType: 'Managed Service',
    contractCategory: 'Platinum',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'Active',
    renewalType: 'Yearly',
    autoRenewal: true,
    currency: 'IDR',
    description: 'Comprehensive IT Managed Services - Platinum Level'
  });

  // Services for Platinum
  await db.insert(schema.contractServices).values([
    {
      id: randomUUID(),
      contractId: contract1Id,
      serviceName: 'Network Support',
      serviceCategory: 'Infrastructure',
      serviceLevel: 'Platinum',
      included: 'Router, Switches, Firewalls',
      unlimitedSupport: true,
      remoteSupport: true,
      onsiteSupport: true,
      preventiveMaintenance: true
    },
    {
      id: randomUUID(),
      contractId: contract1Id,
      serviceName: 'Server Maintenance',
      serviceCategory: 'Infrastructure',
      serviceLevel: 'Platinum',
      included: 'Windows Server, Linux Server',
      unlimitedSupport: true,
      preventiveMaintenance: true,
      emergencySupport: true
    },
    {
      id: randomUUID(),
      contractId: contract1Id,
      serviceName: 'Monitoring Service',
      serviceCategory: 'Security & Ops',
      serviceLevel: 'Platinum',
      included: '24x7 NOC',
      remoteSupport: true
    }
  ]);

  // SLA for Platinum
  await db.insert(schema.contractSlas).values({
    id: randomUUID(),
    contractId: contract1Id,
    responseTime: '15 Minutes',
    resolutionTime: '4 Hours',
    businessHours: '24x7',
    is24x7: true,
    escalationLevel: 'Level 3',
    maximumDowntime: '99.9%',
    penaltyRule: '5% refund per hour of excess downtime'
  });

  // Coverage for Platinum
  await db.insert(schema.contractCoverages).values({
    id: randomUUID(),
    contractId: contract1Id,
    coveredLocation: 'HQ and All Branches',
    coverageType: 'All Devices'
  });
  
  // Billing for Platinum
  await db.insert(schema.contractBillings).values({
    id: randomUUID(),
    contractId: contract1Id,
    billingCycle: 'Monthly',
    monthlyFee: 15000000,
    nextBilling: '2026-08-01'
  });

  // 2. Cloud Service - Gold
  await db.insert(schema.contracts).values({
    id: contract2Id,
    contractNumber: 'CTR-CS-GOLD-002',
    customerId: customerId2,
    contractType: 'Cloud Service',
    contractCategory: 'Gold',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    status: 'Active',
    renewalType: 'Yearly',
    autoRenewal: false,
    currency: 'IDR',
    description: 'Cloud Hosting and ERP Maintenance'
  });

  // Services for Gold
  await db.insert(schema.contractServices).values([
    {
      id: randomUUID(),
      contractId: contract2Id,
      serviceName: 'ERP Maintenance',
      serviceCategory: 'Application',
      serviceLevel: 'Gold',
      included: 'Bug fixes, minor updates',
      remoteSupport: true,
      onsiteSupport: false
    },
    {
      id: randomUUID(),
      contractId: contract2Id,
      serviceName: 'Backup Service',
      serviceCategory: 'Infrastructure',
      serviceLevel: 'Gold',
      included: 'Daily Incremental, Weekly Full',
      remoteSupport: true
    }
  ]);

  // SLA for Gold
  await db.insert(schema.contractSlas).values({
    id: randomUUID(),
    contractId: contract2Id,
    responseTime: '1 Hour',
    resolutionTime: '12 Hours',
    businessHours: '8x5',
    is24x7: false,
    escalationLevel: 'Level 2',
    maximumDowntime: '99.5%',
    penaltyRule: '2% refund per hour of excess downtime'
  });

  console.log("Enterprise Contract Domain Seeding Complete.");
  process.exit(0);
}

seedContracts().catch(console.error);
