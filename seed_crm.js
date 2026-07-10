import Database from 'better-sqlite3';
const db = new Database('data/erp.db');

const customers = [
  { id: 'CUST-001', name: 'PT ABC Nusantara', pic: 'Budi Santoso', email: 'budi@abc.co.id', phone: '081234567890', address: 'Jl. Sudirman No. 1, Jakarta', npwp: '01.234.567.8-091.000', status: 'Active' },
  { id: 'CUST-002', name: 'CV Makmur Jaya', pic: 'Siti Aminah', email: 'siti@makmur.com', phone: '081987654321', address: 'Jl. Thamrin No. 10, Jakarta', npwp: '02.345.678.9-012.000', status: 'Active' },
];

const leads = [
  { id: 'LD-001', company_name: 'PT Media Indonesia', pic: 'Andi Saputra', email: 'andi@media.id', phone: '08551234567', product_interest: 'VPN Dedicated', source: 'Website', status: 'New', score: 45, owner: 'Sales 1', estimated_value: 120000000 },
  { id: 'LD-002', company_name: 'PT Data Sentosa', pic: 'Rina', email: 'rina@data.com', phone: '0811999888', product_interest: 'Server Build', source: 'Referral', status: 'Qualified', score: 85, owner: 'Sales 2', estimated_value: 450000000 },
  { id: 'LD-003', company_name: 'CV Teknik Abadi', pic: 'Joko', email: 'joko@teknik.com', phone: '0822333444', product_interest: 'ERP System', source: 'Exhibition', status: 'Proposal', score: 75, owner: 'Sales 1', estimated_value: 300000000 },
  { id: 'LD-004', company_name: 'PT Inovasi Digital', pic: 'Maya', email: 'maya@inovasi.id', phone: '0813111222', product_interest: 'Managed Services', source: 'Website', status: 'Negotiation', score: 90, owner: 'Sales 3', estimated_value: 600000000 },
  { id: 'LD-005', company_name: 'PT Sukses Selalu', pic: 'Hendra', email: 'hendra@sukses.com', phone: '0856777888', product_interest: 'Network Setup', source: 'Cold Call', status: 'Won', score: 100, owner: 'Sales 2', estimated_value: 150000000 },
  { id: 'LD-006', company_name: 'CV Bintang Terang', pic: 'Dewi', email: 'dewi@bintang.com', phone: '0812444555', product_interest: 'IT Audit', source: 'Website', status: 'Lost', score: 20, owner: 'Sales 1', estimated_value: 50000000 },
];

const activities = [
  { id: 'ACT-001', type: 'Call', reference_id: 'LD-001', reference_type: 'Lead', date: new Date().toISOString(), notes: 'First contact, interested in VPN but needs more details.', performed_by: 'Sales 1' },
  { id: 'ACT-002', type: 'Meeting', reference_id: 'LD-002', reference_type: 'Lead', date: new Date(Date.now() - 86400000).toISOString(), notes: 'Presented server architecture. Very positive feedback.', performed_by: 'Sales 2' },
  { id: 'ACT-003', type: 'Email', reference_id: 'LD-003', reference_type: 'Lead', date: new Date(Date.now() - 172800000).toISOString(), notes: 'Sent proposal v1. Waiting for response.', performed_by: 'Sales 1' },
  { id: 'ACT-004', type: 'WhatsApp', reference_id: 'CUST-001', reference_type: 'Customer', date: new Date(Date.now() - 3600000).toISOString(), notes: 'Followed up on renewal. Said they will process next week.', performed_by: 'Account Manager' },
];

try {
  db.transaction(() => {
    // Check if empty before inserting
    const cCount = db.prepare('SELECT COUNT(*) as c FROM customers').get().c;
    if (cCount === 0) {
      const insertCustomer = db.prepare('INSERT INTO customers (id, name, pic, email, phone, address, npwp, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      customers.forEach(c => insertCustomer.run(c.id, c.name, c.pic, c.email, c.phone, c.address, c.npwp, c.status));
    }
    
    const lCount = db.prepare('SELECT COUNT(*) as c FROM leads').get().c;
    if (lCount === 0) {
      const insertLead = db.prepare('INSERT INTO leads (id, company_name, pic, email, phone, product_interest, source, status, score, owner, estimated_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      leads.forEach(l => insertLead.run(l.id, l.company_name, l.pic, l.email, l.phone, l.product_interest, l.source, l.status, l.score, l.owner, l.estimated_value));
    }

    const aCount = db.prepare('SELECT COUNT(*) as c FROM activities').get().c;
    if (aCount === 0) {
      const insertActivity = db.prepare('INSERT INTO activities (id, type, reference_id, reference_type, date, notes, performed_by) VALUES (?, ?, ?, ?, ?, ?, ?)');
      activities.forEach(a => insertActivity.run(a.id, a.type, a.reference_id, a.reference_type, a.date, a.notes, a.performed_by));
    }
  })();
  console.log('CRM Seed successful');
} catch (e) {
  console.error('Seed failed', e);
}
