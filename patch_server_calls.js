import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const updates = [
  ['createGetRoute("/api/employees", schema.employees);', 'createGetRoute("/api/employees", schema.employees, "hr");'],
  ['createGetRoute("/api/transactions", schema.transactions);', 'createGetRoute("/api/transactions", schema.transactions, "finance");'],
  ['createGetRoute("/api/products", schema.products);', 'createGetRoute("/api/products", schema.products, "inventory");'],
  ['createGetRoute("/api/invoice-items", schema.invoiceItems);', 'createGetRoute("/api/invoice-items", schema.invoiceItems, "finance");'],
  ['createPostRoute("/api/employees", schema.employees);', 'createPostRoute("/api/employees", schema.employees, "hr");'],
  ['createPostRoute("/api/attendance", schema.attendance);', 'createPostRoute("/api/attendance", schema.attendance, "hr");'],
  ['createPostRoute("/api/payroll", schema.payroll);', 'createPostRoute("/api/payroll", schema.payroll, "hr");'],
  ['createPostRoute("/api/transactions", schema.transactions);', 'createPostRoute("/api/transactions", schema.transactions, "finance");'],
  ['createPostRoute("/api/production-orders", schema.productionOrders);', 'createPostRoute("/api/production-orders", schema.productionOrders, "inventory");'],
  ['createPostRoute("/api/tasks", schema.tasks);', 'createPostRoute("/api/tasks", schema.tasks, "dashboard");'],
  ['createGetRoute("/api/announcements", schema.announcements);', 'createGetRoute("/api/announcements", schema.announcements, "dashboard");'],
  ['createPostRoute("/api/announcements", schema.announcements);', 'createPostRoute("/api/announcements", schema.announcements, "dashboard");'],
  ['createGetRoute("/api/customers", schema.customers);', 'createGetRoute("/api/customers", schema.customers, "crm");'],
  ['createPostRoute("/api/customers", schema.customers);', 'createPostRoute("/api/customers", schema.customers, "crm");'],
  ['createPostRoute("/api/leads", schema.leads);', 'createPostRoute("/api/leads", schema.leads, "crm");'],
  ['createPostRoute("/api/activities", schema.activities);', 'createPostRoute("/api/activities", schema.activities, "crm");'],
];

updates.forEach(([oldStr, newStr]) => {
  code = code.replace(oldStr, newStr);
});

fs.writeFileSync('server.ts', code);
