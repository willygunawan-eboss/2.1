const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.post\("\/api\/employees", async \(req, res\) => \{\s*try \{\s*const validatedData = employeeSchema\.parse\(req\.body\);\s*const employeeId = req\.body\.id \|\| 'EMP-' \+ Date\.now\(\);\s*const employeeName = validatedData\.name;\s*const joinDate = validatedData\.joinDate;\s*\/\/ Insert employee([\s\S]*?)\/\/ Auto-insert attendance([\s\S]*?)\/\/ Auto-insert payroll([\s\S]*?)res\.json\(\{ success: true \}\);\s*\} catch \(e\) \{/g;

const match = regex.exec(content);
if (match) {
  const replacement = `app.post("/api/employees", async (req, res) => {
  try {
    const validatedData = employeeSchema.parse(req.body);
    const employeeId = req.body.id || 'EMP-' + Date.now();
    const employeeName = validatedData.name;
    const joinDate = validatedData.joinDate;
    
    // Gunakan transaksi untuk memastikan semuanya berhasil atau dibatalkan (BEGIN, COMMIT, ROLLBACK)
    await db.transaction(async (tx) => {
      // Insert employee
      await tx.insert(schema.employees).values({ id: employeeId, ...validatedData, avatar: req.body.avatar || '' });
      
      // Auto-insert attendance for today
      await tx.insert(schema.attendance).values({
        id: 'ATT-' + Date.now(),
        employeeId: employeeId,
        employeeName: employeeName,
        date: joinDate,
        checkIn: '08:00',
        checkOut: '17:00',
        status: 'Present',
        workHours: '9h 0m'
      });
      
      // Auto-insert payroll
      await tx.insert(schema.payroll).values({
        id: 'PAY-' + Date.now(),
        employeeId: employeeId,
        employeeName: employeeName,
        period: joinDate.substring(0, 7), // YYYY-MM
        basicSalary: req.body.basicSalary || 5000000,
        allowances: req.body.allowances || 1000000,
        deductions: req.body.deductions || 200000,
        netPay: (req.body.basicSalary || 5000000) + (req.body.allowances || 1000000) - (req.body.deductions || 200000),
        status: 'Pending'
      });
    });

    res.json({ success: true, message: "Employee and related data created successfully" });
  } catch (e) {`;

  content = content.replace(regex, replacement);
  fs.writeFileSync('server.ts', content);
} else {
  console.log("Could not find the target block to replace");
}
