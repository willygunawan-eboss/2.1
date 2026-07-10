import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import crypto from 'crypto';

const randomUUID = () => crypto.randomUUID();

async function seedCMDB() {
  console.log("Seeding Enterprise CMDB Domain...");

  // Ensure Customer Exists
  const customers = await db.select().from(schema.customers).limit(1);
  const customerId = customers[0]?.id;

  // 1. Base Reference Data
  const categories = [
    { id: randomUUID(), name: 'Business Service' },
    { id: randomUUID(), name: 'Application Service' },
    { id: randomUUID(), name: 'Infrastructure Service' },
    { id: randomUUID(), name: 'Database Service' },
    { id: randomUUID(), name: 'Hardware' },
    { id: randomUUID(), name: 'Virtualization' }
  ];
  await db.insert(schema.ciCategories).values(categories);
  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

  const environments = [
    { id: randomUUID(), name: 'Production' },
    { id: randomUUID(), name: 'Staging' },
    { id: randomUUID(), name: 'Development' }
  ];
  await db.insert(schema.ciEnvironments).values(environments);
  const envMap = Object.fromEntries(environments.map(e => [e.name, e.id]));

  const statuses = [
    { id: randomUUID(), name: 'Active' },
    { id: randomUUID(), name: 'Maintenance' },
    { id: randomUUID(), name: 'Retired' }
  ];
  await db.insert(schema.ciStatuses).values(statuses);
  const statusMap = Object.fromEntries(statuses.map(s => [s.name, s.id]));

  // 2. Configuration Items
  const cisToInsert = [
    {
      id: randomUUID(), ciCode: 'CI-BS-ERP', name: 'ERP Business Service',
      ciType: 'Business Service', categoryId: catMap['Business Service'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-APP-ERP', name: 'ERP Application',
      ciType: 'Application Service', categoryId: catMap['Application Service'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-DB-PG', name: 'PostgreSQL Database',
      ciType: 'Database Service', categoryId: catMap['Database Service'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-CONT-DOCKER', name: 'Docker Engine',
      ciType: 'Container', categoryId: catMap['Virtualization'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-VM-UBUNTU', name: 'Ubuntu Server VM',
      ciType: 'Virtual Machine', categoryId: catMap['Virtualization'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-HW-DELL', name: 'Dell PowerEdge Server',
      ciType: 'Physical Server', categoryId: catMap['Hardware'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-HYP-VMWARE', name: 'VMware ESXi',
      ciType: 'Hypervisor', categoryId: catMap['Virtualization'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-NET-CORE', name: 'Cisco Core Switch',
      ciType: 'Network Switch', categoryId: catMap['Hardware'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-SEC-FW', name: 'FortiGate Firewall',
      ciType: 'Firewall', categoryId: catMap['Hardware'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-ISP-MAIN', name: 'Main ISP Link',
      ciType: 'Infrastructure Service', categoryId: catMap['Infrastructure Service'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    
    // VPN Stack
    {
      id: randomUUID(), ciCode: 'CI-BS-VPN', name: 'VPN Business Service',
      ciType: 'Business Service', categoryId: catMap['Business Service'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-NET-MTK', name: 'MikroTik CCR',
      ciType: 'Router', categoryId: catMap['Hardware'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    },
    {
      id: randomUUID(), ciCode: 'CI-SRV-CF', name: 'Cloudflare Tunnel',
      ciType: 'Infrastructure Service', categoryId: catMap['Infrastructure Service'], environmentId: envMap['Production'],
      statusId: statusMap['Active'], criticality: 'High', customerId
    }
  ];

  await db.insert(schema.cis).values(cisToInsert);
  const ciMap = Object.fromEntries(cisToInsert.map(ci => [ci.ciCode, ci.id]));

  // 3. Relationships (Dependencies)
  const relsToInsert = [
    // ERP Stack
    { id: randomUUID(), parentCiId: ciMap['CI-BS-ERP'], childCiId: ciMap['CI-APP-ERP'], dependencyType: 'Depends On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-APP-ERP'], childCiId: ciMap['CI-DB-PG'], dependencyType: 'Depends On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-DB-PG'], childCiId: ciMap['CI-CONT-DOCKER'], dependencyType: 'Runs On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-CONT-DOCKER'], childCiId: ciMap['CI-VM-UBUNTU'], dependencyType: 'Runs On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-VM-UBUNTU'], childCiId: ciMap['CI-HYP-VMWARE'], dependencyType: 'Runs On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-HYP-VMWARE'], childCiId: ciMap['CI-HW-DELL'], dependencyType: 'Runs On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-HW-DELL'], childCiId: ciMap['CI-NET-CORE'], dependencyType: 'Connected To', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-NET-CORE'], childCiId: ciMap['CI-SEC-FW'], dependencyType: 'Connected To', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-SEC-FW'], childCiId: ciMap['CI-ISP-MAIN'], dependencyType: 'Connected To', relationshipDirection: 'Parent-to-Child' },

    // VPN Stack
    { id: randomUUID(), parentCiId: ciMap['CI-BS-VPN'], childCiId: ciMap['CI-NET-MTK'], dependencyType: 'Depends On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-NET-MTK'], childCiId: ciMap['CI-SRV-CF'], dependencyType: 'Depends On', relationshipDirection: 'Parent-to-Child' },
    { id: randomUUID(), parentCiId: ciMap['CI-SRV-CF'], childCiId: ciMap['CI-ISP-MAIN'], dependencyType: 'Depends On', relationshipDirection: 'Parent-to-Child' }
  ];

  await db.insert(schema.ciRelationships).values(relsToInsert);

  console.log("CMDB Seeded successfully.");
  process.exit(0);
}

seedCMDB().catch(console.error);
