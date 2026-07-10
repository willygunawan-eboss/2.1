const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

let txBlock = `db.transaction((tx) => {
      // Insert employee
      tx.insert(schema.employees).values({ id: employeeId, ...validatedData, avatar: req.body.avatar || '' }).run();
      
      // Auto-insert attendance for today
      tx.insert(schema.attendance).values({
        id: 'ATT-' + Date.now(),
        employeeId: employeeId,
        employeeName: employeeName,
        date: joinDate,
        checkIn: '08:00',
        checkOut: '17:00',
        status: 'Present',
        workHours: '9h 0m'
      }).run();
      
      // Auto-insert payroll
      tx.insert(schema.payroll).values({
        id: 'PAY-' + Date.now(),
        employeeId: employeeId,
        employeeName: employeeName,
        period: joinDate.substring(0, 7), // YYYY-MM
        basicSalary: req.body.basicSalary || 5000000,
        allowances: req.body.allowances || 1000000,
        deductions: req.body.deductions || 200000,
        netPay: (req.body.basicSalary || 5000000) + (req.body.allowances || 1000000) - (req.body.deductions || 200000),
        status: 'Pending'
      }).run();
    });`;

content = content.replace(/db\.transaction\(\(tx\) => \{[\s\S]*?status: 'Pending'[\s\S]*?\}\);/g, txBlock);
// In case the first script left "db.transaction((tx) => {      // Insert employee      await tx.insert..."
fs.writeFileSync('server.ts', content);
