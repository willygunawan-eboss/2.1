import Database from 'better-sqlite3';
const db = new Database('./data/erp.db');
console.log('dashboard_stats:', db.prepare('SELECT * FROM dashboard_stats').all());
console.log('users:', db.prepare('SELECT id, username FROM users').all());
