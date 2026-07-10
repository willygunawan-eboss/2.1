import Database from 'better-sqlite3';
const db = new Database('data/erp.db');

try {
  db.transaction(() => {
    // Ticket Categories
    const insertCat = db.prepare('INSERT OR IGNORE INTO ticket_categories (id, name, description) VALUES (?, ?, ?)');
    insertCat.run('CAT-001', 'Network Issue', 'Issues related to network connectivity');
    insertCat.run('CAT-002', 'Hardware Failure', 'Issues related to physical devices');
    insertCat.run('CAT-003', 'Software Bug', 'Issues related to software applications');

    // Ticket Sub Categories
    const insertSubCat = db.prepare('INSERT OR IGNORE INTO ticket_sub_categories (id, category_id, name) VALUES (?, ?, ?)');
    insertSubCat.run('SCAT-001', 'CAT-001', 'VPN Down');
    insertSubCat.run('SCAT-002', 'CAT-001', 'Slow Internet');
    insertSubCat.run('SCAT-003', 'CAT-002', 'Server Overheating');
    insertSubCat.run('SCAT-004', 'CAT-003', 'ERP Login Failed');

    // Ticket Priorities
    const insertPri = db.prepare('INSERT OR IGNORE INTO ticket_priorities (id, name, level) VALUES (?, ?, ?)');
    insertPri.run('PRI-001', 'Low', 1);
    insertPri.run('PRI-002', 'Medium', 2);
    insertPri.run('PRI-003', 'High', 3);
    insertPri.run('PRI-004', 'Critical', 4);

    // Ticket Impacts
    const insertImp = db.prepare('INSERT OR IGNORE INTO ticket_impacts (id, name, level) VALUES (?, ?, ?)');
    insertImp.run('IMP-001', 'Single User', 1);
    insertImp.run('IMP-002', 'Department', 2);
    insertImp.run('IMP-003', 'Enterprise', 3);

    // Ticket Urgencies
    const insertUrg = db.prepare('INSERT OR IGNORE INTO ticket_urgencies (id, name, level) VALUES (?, ?, ?)');
    insertUrg.run('URG-001', 'Low', 1);
    insertUrg.run('URG-002', 'Medium', 2);
    insertUrg.run('URG-003', 'High', 3);

    // Ticket Statuses
    const insertStat = db.prepare('INSERT OR IGNORE INTO ticket_statuses (id, name, is_closed) VALUES (?, ?, ?)');
    insertStat.run('STAT-001', 'New', 0);
    insertStat.run('STAT-002', 'In Progress', 0);
    insertStat.run('STAT-003', 'Pending Customer', 0);
    insertStat.run('STAT-004', 'Resolved', 1);
    insertStat.run('STAT-005', 'Closed', 1);

    console.log('Ticket references seeded successfully');
  })();
} catch (e) {
  console.error('Seed failed:', e);
}
