export const mockEmployees = [
  { id: 'EMP-001', name: 'Budi Santoso', role: 'Engineering Manager', department: 'IT', status: 'Active', joinDate: '2022-01-15', email: 'budi.s@ichangeboss.co.id' },
  { id: 'EMP-002', name: 'Siti Aminah', role: 'Senior Accountant', department: 'Finance', status: 'Active', joinDate: '2021-11-01', email: 'siti.a@ichangeboss.co.id' },
  { id: 'EMP-003', name: 'Agus Pratama', role: 'Sales Director', department: 'Sales', status: 'Active', joinDate: '2020-05-10', email: 'agus.p@ichangeboss.co.id' },
  { id: 'EMP-004', name: 'Dewi Lestari', role: 'HR Specialist', department: 'Human Resources', status: 'On Leave', joinDate: '2023-03-22', email: 'dewi.l@ichangeboss.co.id' },
  { id: 'EMP-005', name: 'Rizky Firmansyah', role: 'Production Supervisor', department: 'Manufacturing', status: 'Active', joinDate: '2019-08-05', email: 'rizky.f@ichangeboss.co.id' },
];

export const mockAttendance = [
  { id: 'ATT-101', employeeId: 'EMP-001', employeeName: 'Budi Santoso', date: '2026-06-29', checkIn: '07:55 AM', checkOut: '05:10 PM', status: 'Present', workHours: '9h 15m' },
  { id: 'ATT-102', employeeId: 'EMP-002', employeeName: 'Siti Aminah', date: '2026-06-29', checkIn: '08:15 AM', checkOut: '05:00 PM', status: 'Late', workHours: '8h 45m' },
  { id: 'ATT-103', employeeId: 'EMP-003', employeeName: 'Agus Pratama', date: '2026-06-29', checkIn: '07:45 AM', checkOut: '06:30 PM', status: 'Present', workHours: '10h 45m' },
  { id: 'ATT-104', employeeId: 'EMP-004', employeeName: 'Dewi Lestari', date: '2026-06-29', checkIn: '--:-- --', checkOut: '--:-- --', status: 'Absent', workHours: '0h 0m' },
  { id: 'ATT-105', employeeId: 'EMP-005', employeeName: 'Rizky Firmansyah', date: '2026-06-29', checkIn: '07:30 AM', checkOut: '04:00 PM', status: 'Present', workHours: '8h 30m' },
];

export const mockPayroll = [
  { id: 'PAY-2606-001', employeeId: 'EMP-001', employeeName: 'Budi Santoso', period: 'June 2026', basicSalary: 25000000, allowances: 5000000, deductions: 2500000, netPay: 27500000, status: 'Processing' },
  { id: 'PAY-2606-002', employeeId: 'EMP-002', employeeName: 'Siti Aminah', period: 'June 2026', basicSalary: 18000000, allowances: 3000000, deductions: 1800000, netPay: 19200000, status: 'Processing' },
  { id: 'PAY-2606-003', employeeId: 'EMP-003', employeeName: 'Agus Pratama', period: 'June 2026', basicSalary: 30000000, allowances: 15000000, deductions: 4500000, netPay: 40500000, status: 'Processing' },
  { id: 'PAY-2606-004', employeeId: 'EMP-004', employeeName: 'Dewi Lestari', period: 'June 2026', basicSalary: 12000000, allowances: 2000000, deductions: 1200000, netPay: 12800000, status: 'Processing' },
  { id: 'PAY-2606-005', employeeId: 'EMP-005', employeeName: 'Rizky Firmansyah', period: 'June 2026', basicSalary: 15000000, allowances: 4000000, deductions: 1500000, netPay: 17500000, status: 'Processing' },
];

export const dashboardRevenue = [
  { name: 'Jan', revenue: 450, profit: 120 },
  { name: 'Feb', revenue: 520, profit: 140 },
  { name: 'Mar', revenue: 480, profit: 130 },
  { name: 'Apr', revenue: 610, profit: 180 },
  { name: 'May', revenue: 590, profit: 170 },
  { name: 'Jun', revenue: 750, profit: 220 },
];

export const mockTransactions = [
  { id: 'TRX-1001', date: '2026-06-28', description: 'Client Payment - PT Mega Bangun', category: 'Sales', type: 'Income', amount: 450000000, status: 'Completed' },
  { id: 'TRX-1002', date: '2026-06-28', description: 'Vendor Payment - Office Supplies', category: 'Operations', type: 'Expense', amount: 15000000, status: 'Completed' },
  { id: 'TRX-1003', date: '2026-06-29', description: 'Software Licenses Subscription', category: 'IT', type: 'Expense', amount: 35000000, status: 'Pending' },
  { id: 'TRX-1004', date: '2026-06-29', description: 'Consulting Fees - June', category: 'Services', type: 'Income', amount: 120000000, status: 'Completed' },
];

export const mockSalesOrders = [
  { id: 'SO-9924', customer: 'PT Mega Bangun', date: '2026-06-28', amount: 450000000, status: 'Completed' },
  { id: 'SO-9925', customer: 'CV Global Indo', date: '2026-06-28', amount: 125000000, status: 'Pending' },
  { id: 'SO-9926', customer: 'PT Sejahtera', date: '2026-06-29', amount: 85000000, status: 'Pending' },
  { id: 'SO-9927', customer: 'UD Karya Bersama', date: '2026-06-29', amount: 35000000, status: 'Cancelled' },
];

export const mockProducts = [
  { id: 'PRD-001', name: 'Aluminum Grade A', sku: 'AL-GR-A', category: 'Raw Material', price: 150000, stock: 450, status: 'In Stock' },
  { id: 'PRD-002', name: 'Steel Beams 5m', sku: 'ST-BM-5', category: 'Construction', price: 850000, stock: 120, status: 'Low Stock' },
  { id: 'PRD-003', name: 'Cement Sack 50kg', sku: 'CM-SK-50', category: 'Construction', price: 65000, stock: 0, status: 'Out of Stock' },
  { id: 'PRD-004', name: 'Copper Wiring 100m', sku: 'CP-WR-100', category: 'Electrical', price: 1200000, stock: 35, status: 'In Stock' },
];

export const mockProductionOrders = [
  { id: 'PO-2001', product: 'Assembled Framework X', quantity: 50, startDate: '2026-06-20', endDate: '2026-06-30', status: 'In Progress', progress: 75 },
  { id: 'PO-2002', product: 'Standard Panel Y', quantity: 200, startDate: '2026-06-25', endDate: '2026-07-05', status: 'In Progress', progress: 20 },
  { id: 'PO-2003', product: 'Custom Fitting Z', quantity: 150, startDate: '2026-06-15', endDate: '2026-06-22', status: 'Completed', progress: 100 },
  { id: 'PO-2004', product: 'Modular Base Unit', quantity: 100, startDate: '2026-07-01', endDate: '2026-07-15', status: 'Planned', progress: 0 },
];

export const mockProjects = [
  { id: 'PRJ-5001', name: 'Jakarta Tower Foundation', client: 'PT Mega Bangun', dueDate: '2026-12-31', budget: 5500000000, status: 'Active', progress: 45 },
  { id: 'PRJ-5002', name: 'Surabaya Office Renovation', client: 'CV Global Indo', dueDate: '2026-08-15', budget: 850000000, status: 'Active', progress: 80 },
  { id: 'PRJ-5003', name: 'Bandung Factory Setup', client: 'PT Sejahtera', dueDate: '2026-05-30', budget: 2100000000, status: 'Completed', progress: 100 },
  { id: 'PRJ-5004', name: 'Bali Resort Phase 1', client: 'UD Karya Bersama', dueDate: '2027-03-01', budget: 12000000000, status: 'Delayed', progress: 15 },
];
