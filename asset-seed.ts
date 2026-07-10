import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import crypto from 'crypto';

const randomUUID = () => crypto.randomUUID();

async function seedAssets() {
  console.log("Seeding Enterprise Asset Domain...");
  
  // 1. Categories
  const categoryData = [
    { id: randomUUID(), name: 'Networking', description: 'Routers, Switches, Access Points' },
    { id: randomUUID(), name: 'Server & Storage', description: 'Physical Servers, NAS, SAN' },
    { id: randomUUID(), name: 'Virtualization & Cloud', description: 'VMs, Cloud Instances' },
    { id: randomUUID(), name: 'Security', description: 'Firewalls, VPN Gateways' },
    { id: randomUUID(), name: 'Infrastructure', description: 'UPS, PDU, Racks, Cabling' },
    { id: randomUUID(), name: 'Licenses & Subs', description: 'Software Licenses, SaaS, Domains' },
  ];
  await db.insert(schema.assetCategories).values(categoryData);
  const catMap = Object.fromEntries(categoryData.map(c => [c.name, c.id]));

  // 2. Manufacturers
  const mfrData = [
    { id: randomUUID(), name: 'MikroTik' },
    { id: randomUUID(), name: 'Fortinet' },
    { id: randomUUID(), name: 'Cisco' },
    { id: randomUUID(), name: 'Dell' },
    { id: randomUUID(), name: 'HPE' },
    { id: randomUUID(), name: 'Synology' },
    { id: randomUUID(), name: 'QNAP' },
    { id: randomUUID(), name: 'VMware' },
    { id: randomUUID(), name: 'Proxmox Server Solutions' },
    { id: randomUUID(), name: 'Canonical' },
    { id: randomUUID(), name: 'Microsoft' },
    { id: randomUUID(), name: 'Juniper Networks' },
    { id: randomUUID(), name: 'Ubiquiti' },
    { id: randomUUID(), name: 'APC' },
  ];
  await db.insert(schema.manufacturers).values(mfrData);
  const mfrMap = Object.fromEntries(mfrData.map(m => [m.name, m.id]));

  // 3. Models
  const modelData = [
    { id: randomUUID(), name: 'CCR1036-8G-2S+', manufacturerId: mfrMap['MikroTik'], categoryId: catMap['Networking'] },
    { id: randomUUID(), name: 'FortiGate 100F', manufacturerId: mfrMap['Fortinet'], categoryId: catMap['Security'] },
    { id: randomUUID(), name: 'Catalyst 9300', manufacturerId: mfrMap['Cisco'], categoryId: catMap['Networking'] },
    { id: randomUUID(), name: 'PowerEdge R740', manufacturerId: mfrMap['Dell'], categoryId: catMap['Server & Storage'] },
    { id: randomUUID(), name: 'ProLiant DL380 Gen10', manufacturerId: mfrMap['HPE'], categoryId: catMap['Server & Storage'] },
    { id: randomUUID(), name: 'RS3621xs+', manufacturerId: mfrMap['Synology'], categoryId: catMap['Server & Storage'] },
    { id: randomUUID(), name: 'TS-h1283XU-RP', manufacturerId: mfrMap['QNAP'], categoryId: catMap['Server & Storage'] },
    { id: randomUUID(), name: 'ESXi 8.0', manufacturerId: mfrMap['VMware'], categoryId: catMap['Virtualization & Cloud'] },
    { id: randomUUID(), name: 'Proxmox VE 8', manufacturerId: mfrMap['Proxmox Server Solutions'], categoryId: catMap['Virtualization & Cloud'] },
    { id: randomUUID(), name: 'Ubuntu Server 24.04', manufacturerId: mfrMap['Canonical'], categoryId: catMap['Virtualization & Cloud'] },
    { id: randomUUID(), name: 'Windows Server 2022', manufacturerId: mfrMap['Microsoft'], categoryId: catMap['Virtualization & Cloud'] },
    { id: randomUUID(), name: 'Hyper-V Server', manufacturerId: mfrMap['Microsoft'], categoryId: catMap['Virtualization & Cloud'] },
    { id: randomUUID(), name: 'SRX340', manufacturerId: mfrMap['Juniper Networks'], categoryId: catMap['Security'] },
    { id: randomUUID(), name: 'UniFi AP AC Pro', manufacturerId: mfrMap['Ubiquiti'], categoryId: catMap['Networking'] },
    { id: randomUUID(), name: 'Smart-UPS SRT 5000', manufacturerId: mfrMap['APC'], categoryId: catMap['Infrastructure'] },
  ];
  await db.insert(schema.assetModels).values(modelData);
  const modelMap = Object.fromEntries(modelData.map(m => [m.name, m.id]));

  // Ensure Customer Exists
  const customers = await db.select().from(schema.customers).limit(1);
  const customerId = customers[0]?.id;

  // 4. Assets
  const assetsToInsert = [
    {
      id: randomUUID(),
      assetCode: 'AST-RTR-001',
      name: 'Core Router MikroTik',
      categoryId: catMap['Networking'],
      manufacturerId: mfrMap['MikroTik'],
      modelId: modelMap['CCR1036-8G-2S+'],
      serialNumber: 'MTK-CCR-12345',
      status: 'Active',
      ipAddress: '10.0.0.1',
      hostname: 'rt-core-01',
      operatingSystem: 'RouterOS v7',
      locationId: null,
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-FW-001',
      name: 'Main Firewall FortiGate',
      categoryId: catMap['Security'],
      manufacturerId: mfrMap['Fortinet'],
      modelId: modelMap['FortiGate 100F'],
      serialNumber: 'FGT100F-67890',
      status: 'Active',
      ipAddress: '10.0.0.2',
      hostname: 'fw-main-01',
      operatingSystem: 'FortiOS 7.2',
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-SW-001',
      name: 'Switch Core Cisco Catalyst',
      categoryId: catMap['Networking'],
      manufacturerId: mfrMap['Cisco'],
      modelId: modelMap['Catalyst 9300'],
      serialNumber: 'CSC-9300-11111',
      status: 'Active',
      ipAddress: '10.0.0.3',
      hostname: 'sw-core-01',
      operatingSystem: 'Cisco IOS XE',
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-SRV-001',
      name: 'VMware ESXi Host 1 - Dell PowerEdge',
      categoryId: catMap['Server & Storage'],
      manufacturerId: mfrMap['Dell'],
      modelId: modelMap['PowerEdge R740'],
      serialNumber: 'DELL-R740-ABCDE',
      status: 'Active',
      ipAddress: '10.0.1.10',
      hostname: 'esxi-host-01',
      operatingSystem: 'ESXi 8.0',
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-SRV-002',
      name: 'Proxmox Host 1 - HPE ProLiant',
      categoryId: catMap['Server & Storage'],
      manufacturerId: mfrMap['HPE'],
      modelId: modelMap['ProLiant DL380 Gen10'],
      serialNumber: 'HPE-DL380-XYZ123',
      status: 'Active',
      ipAddress: '10.0.1.11',
      hostname: 'pve-node-01',
      operatingSystem: 'Proxmox VE 8',
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-NAS-001',
      name: 'Backup Storage Synology',
      categoryId: catMap['Server & Storage'],
      manufacturerId: mfrMap['Synology'],
      modelId: modelMap['RS3621xs+'],
      serialNumber: 'SYN-RS36-99999',
      status: 'Active',
      ipAddress: '10.0.2.20',
      hostname: 'nas-backup-01',
      operatingSystem: 'DSM 7.2',
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-UPS-001',
      name: 'Main Rack UPS',
      categoryId: catMap['Infrastructure'],
      manufacturerId: mfrMap['APC'],
      modelId: modelMap['Smart-UPS SRT 5000'],
      serialNumber: 'APC-SRT-55555',
      status: 'Active',
      ipAddress: '10.0.99.10',
      hostname: 'ups-main',
      customerId: customerId,
    },
    {
      id: randomUUID(),
      assetCode: 'AST-LIC-001',
      name: 'Microsoft 365 Tenant',
      categoryId: catMap['Licenses & Subs'],
      manufacturerId: mfrMap['Microsoft'],
      status: 'Active',
      customerId: customerId,
    },
  ];
  
  await db.insert(schema.assets).values(assetsToInsert);

  // 5. Relations (Networks, Configurations, Licenses)
  const esxiAsset = assetsToInsert.find(a => a.name.includes('ESXi'));
  if (esxiAsset) {
    await db.insert(schema.assetConfigurations).values({
      id: randomUUID(),
      assetId: esxiAsset.id,
      cpu: '2x Intel Xeon Gold 6248R',
      memory: '256GB ECC DDR4',
      storage: '4x 1.92TB SSD',
      raid: 'RAID 10',
      networkInterface: '4x 10GbE SFP+',
      virtualization: 'VMware vSphere',
    });
    
    await db.insert(schema.assetNetworks).values({
      id: randomUUID(),
      assetId: esxiAsset.id,
      privateIp: '10.0.1.10',
      subnet: '255.255.255.0',
      gateway: '10.0.1.1',
      vlan: 'VLAN 10',
      switchPort: 'Port 1-2',
    });
  }

  const m365Asset = assetsToInsert.find(a => a.name.includes('Microsoft 365'));
  if (m365Asset) {
    await db.insert(schema.assetLicenses).values({
      id: randomUUID(),
      assetId: m365Asset.id,
      licenseType: 'SaaS',
      licenseKey: 'M365-E5-100-USERS',
      licenseStart: '2025-01-01',
      licenseEnd: '2026-01-01',
      renewalReminder: '30 Days',
    });
  }

  const firewallAsset = assetsToInsert.find(a => a.name.includes('FortiGate'));
  if (firewallAsset) {
    await db.insert(schema.assetWarranties).values({
      id: randomUUID(),
      assetId: firewallAsset.id,
      vendor: 'Fortinet',
      warrantyType: 'FortiCare 24x7',
      warrantyExpiration: '2027-12-31',
      replacement: true,
      coverage: 'Hardware and Software',
    });
  }

  console.log("Enterprise Asset Domain Seeding Complete.");
  process.exit(0);
}

seedAssets().catch(console.error);
