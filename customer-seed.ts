import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import crypto from 'crypto';

const randomUUID = () => crypto.randomUUID();

async function seedCustomers() {
  console.log("Seeding Customer Domain...");
  
  const customerId1 = randomUUID();
  const customerId2 = randomUUID();
  
  // Customers
  await db.insert(schema.customers).values([
    {
      id: customerId1,
      code: 'CUS-1001',
      name: 'PT Maju Bersama',
      legalName: 'PT Maju Bersama Tbk',
      email: 'contact@majubersama.co.id',
      phone: '+62-21-555-0101',
      website: 'www.majubersama.co.id',
      npwp: '01.234.567.8-091.000',
      industryId: 'Technology',
      categoryId: 'Enterprise',
      statusId: 'Active'
    },
    {
      id: customerId2,
      code: 'CUS-1002',
      name: 'CV Karya Bangsa',
      legalName: 'CV Karya Bangsa Mandiri',
      email: 'info@karyabangsa.com',
      phone: '+62-22-555-0202',
      website: 'www.karyabangsa.com',
      npwp: '02.345.678.9-092.000',
      industryId: 'Manufacturing',
      categoryId: 'SME',
      statusId: 'Active'
    }
  ]);
  
  // Contacts
  await db.insert(schema.customerContacts).values([
    {
      id: randomUUID(),
      customerId: customerId1,
      name: 'Budi Santoso',
      title: 'IT Director',
      contactType: 'Technical PIC',
      email: 'budi@majubersama.co.id',
      phone: '081234567890',
      isPrimary: true
    },
    {
      id: randomUUID(),
      customerId: customerId1,
      name: 'Siti Aminah',
      title: 'Finance Manager',
      contactType: 'Finance PIC',
      email: 'siti@majubersama.co.id',
      phone: '081298765432',
      isPrimary: false
    }
  ]);
  
  // Addresses
  await db.insert(schema.customerAddresses).values([
    {
      id: randomUUID(),
      customerId: customerId1,
      addressType: 'Head Office',
      addressLine1: 'Jl. Sudirman Kav 1',
      city: 'Jakarta',
      state: 'DKI Jakarta',
      country: 'Indonesia',
      postalCode: '10220',
      isPrimary: true
    },
    {
      id: randomUUID(),
      customerId: customerId1,
      addressType: 'Branch Office',
      addressLine1: 'Jl. Pemuda No. 10',
      city: 'Surabaya',
      state: 'Jawa Timur',
      country: 'Indonesia',
      postalCode: '60271',
      isPrimary: false
    }
  ]);
  
  console.log("Customer Domain Seeding Complete.");
  process.exit(0);
}

seedCustomers().catch(console.error);
