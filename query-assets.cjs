const Database = require('better-sqlite3');
const db = new Database('data/erp.db');
console.log(db.prepare('SELECT * FROM assets').all());
