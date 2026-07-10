import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(), // 'admin', 'employee', 'manager'
  department: text('department'),
  refreshToken: text('refresh_token'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const dashboardStats = sqliteTable('dashboard_stats', {
  id: text('id').primaryKey(), // single row, id='main'
  activeEmployees: integer('active_employees').notNull().default(0),
  totalDepartments: integer('total_departments').notNull().default(0),
  openTickets: integer('open_tickets').notNull().default(0),
  monthlyRevenue: real('monthly_revenue').notNull().default(0),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const branches = sqliteTable('branches', {
  id: text('id').primaryKey(), // UUID
  companyId: text('company_id').notNull().references(() => companies.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const divisions = sqliteTable('divisions', {
  id: text('id').primaryKey(), // UUID
  companyId: text('company_id').notNull().references(() => companies.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const departments = sqliteTable('departments', {
  id: text('id').primaryKey(), // UUID
  divisionId: text('division_id').notNull().references(() => divisions.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const jobGrades = sqliteTable('job_grades', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(), // UUID
  departmentId: text('department_id').notNull().references(() => departments.id),
  jobGradeId: text('job_grade_id').notNull().references(() => jobGrades.id),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(), // UUID
  employeeNumber: text('employee_number').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  companyId: text('company_id').references(() => companies.id),
  branchId: text('branch_id').references(() => branches.id),
  departmentId: text('department_id').references(() => departments.id),
  positionId: text('position_id').references(() => positions.id),
  userId: text('user_id').references(() => users.id),
  status: text('status').notNull().default('Active'),
  joinDate: text('join_date'),
  avatar: text('avatar'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  branches: many(branches),
  divisions: many(divisions),
  employees: many(employees),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
  company: one(companies, { fields: [branches.companyId], references: [companies.id] }),
  employees: many(employees),
}));

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
  company: one(companies, { fields: [divisions.companyId], references: [companies.id] }),
  departments: many(departments),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  division: one(divisions, { fields: [departments.divisionId], references: [divisions.id] }),
  positions: many(positions),
  employees: many(employees),
}));

export const jobGradesRelations = relations(jobGrades, ({ many }) => ({
  positions: many(positions),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
  department: one(departments, { fields: [positions.departmentId], references: [departments.id] }),
  jobGrade: one(jobGrades, { fields: [positions.jobGradeId], references: [jobGrades.id] }),
  employees: many(employees),
}));





export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(), // UUID
  employeeId: text('employee_id').notNull().references(() => employees.id),
  date: text('date').notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  status: text('status').notNull(), // Present, Late, Absent, Half Day
  workHours: text('work_hours').notNull(),
});

export const payroll = sqliteTable('payroll', {
  id: text('id').primaryKey(), // UUID
  employeeId: text('employee_id').notNull().references(() => employees.id),
  period: text('period').notNull(),
  basicSalary: real('basic_salary').notNull(),
  allowances: real('allowances').notNull(),
  deductions: real('deductions').notNull(),
  netPay: real('net_pay').notNull(),
  status: text('status').notNull(), // Paid, Processing, Pending
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull(), // Income, Expense
  amount: real('amount').notNull(),
  status: text('status').notNull(), // Completed, Pending
});

export const salesOrders = sqliteTable('sales_orders', {
  id: text('id').primaryKey(), // UUID
  customerId: text('customer_id').notNull().references(() => customers.id),
  salespersonId: text('salesperson_id').references(() => employees.id),
  date: text('date').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull(), // Completed, Pending, Cancelled
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull(),
  status: text('status').notNull(), // In Stock, Low Stock, Out of Stock
});

export const productionOrders = sqliteTable('production_orders', {
  id: text('id').primaryKey(), // UUID
  productId: text('product_id').notNull().references(() => products.id),
  assignedToId: text('assigned_to_id').references(() => employees.id),
  quantity: integer('quantity').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').notNull(), // Planned, In Progress, Completed
  progress: integer('progress').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  managerId: text('manager_id').references(() => employees.id),
  dueDate: text('due_date').notNull(),
  budget: real('budget').notNull(),
  status: text('status').notNull(), // Active, Completed, Delayed
  progress: integer('progress').notNull(),
  contractId: text('contract_id'),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(), // UUID
  title: text('title').notNull(),
  assignedToId: text('assigned_to_id').notNull().references(() => employees.id),
  dueDate: text('due_date').notNull(),
  status: text('status').notNull(), // Pending, Approved, Completed
  type: text('type').notNull(),
});

export const announcements = sqliteTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
});


export const employeeContracts = sqliteTable('employee_contracts', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  contractType: text('contract_type').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  status: text('status').notNull(),
});

export const employeeFamilies = sqliteTable('employee_families', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  name: text('name').notNull(),
  relationship: text('relationship').notNull(),
  dateOfBirth: text('date_of_birth'),
});

export const employeeEmergencyContacts = sqliteTable('employee_emergency_contacts', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  name: text('name').notNull(),
  relationship: text('relationship').notNull(),
  phone: text('phone').notNull(),
});

export const employeeBanks = sqliteTable('employee_banks', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number').notNull(),
  accountHolder: text('account_holder').notNull(),
});

export const employeeTaxes = sqliteTable('employee_taxes', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  npwp: text('npwp').notNull(),
  ptkpStatus: text('ptkp_status').notNull(),
});

export const employeeBpjs = sqliteTable('employee_bpjs', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  bpjsKesehatan: text('bpjs_kesehatan'),
  bpjsKetenagakerjaan: text('bpjs_ketenagakerjaan'),
});

export const employeePositionHistories = sqliteTable('employee_position_histories', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  position: text('position').notNull(),
  department: text('department').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
});

export const employeeSalaryHistories = sqliteTable('employee_salary_histories', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  basicSalary: real('basic_salary').notNull(),
  effectiveDate: text('effective_date').notNull(),
});

export const employeePromotionHistories = sqliteTable('employee_promotion_histories', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  oldPosition: text('old_position').notNull(),
  newPosition: text('new_position').notNull(),
  promotionDate: text('promotion_date').notNull(),
});

export const employeeLeaves = sqliteTable('employee_leaves', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  leaveType: text('leave_type').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').notNull(), // Approved, Pending, Rejected
});

export const employeeOvertimes = sqliteTable('employee_overtimes', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  date: text('date').notNull(),
  hours: real('hours').notNull(),
  status: text('status').notNull(),
});

export const employeeAssets = sqliteTable('employee_assets', {
  id: text('id').primaryKey(), // UUID
  employeeId: text('employee_id').notNull().references(() => employees.id),
  assetId: text('asset_id').notNull().references(() => assets.id),
  givenDate: text('given_date').notNull(),
  returnDate: text('return_date'),
});


export const employeeCertifications = sqliteTable('employee_certifications', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  certificationName: text('certification_name').notNull(),
  institution: text('institution'),
  issueDate: text('issue_date'),
  expiryDate: text('expiry_date'),
  credentialId: text('credential_id'),
});

export const employeeTrainings = sqliteTable('employee_trainings', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  trainingName: text('training_name').notNull(),
  date: text('date').notNull(),
  result: text('result'),
});

export const employeePerformances = sqliteTable('employee_performances', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  reviewPeriod: text('review_period').notNull(),
  score: real('score').notNull(),
  comments: text('comments'),
});

export const employeeDocuments = sqliteTable('employee_documents', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  documentType: text('document_type').notNull(), // e.g., KTP, KK, Ijazah
  fileUrl: text('file_url').notNull(),
});

export const employeeShifts = sqliteTable('employee_shifts', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  shiftName: text('shift_name').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
});


// ==========================================
// ENTERPRISE ASSET DOMAIN
// ==========================================

export const assetCategories = sqliteTable('asset_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const manufacturers = sqliteTable('manufacturers', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  supportContact: text('support_contact'),
  website: text('website'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetModels = sqliteTable('asset_models', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  manufacturerId: text('manufacturer_id').references(() => manufacturers.id),
  categoryId: text('category_id').references(() => assetCategories.id),
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetLocations = sqliteTable('asset_locations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  branchId: text('branch_id').references(() => branches.id),
  address: text('address'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  assetCode: text('asset_code').notNull().unique(), // Replacing old assetId
  name: text('name').notNull(),
  serialNumber: text('serial_number'),
  barcode: text('barcode'),
  qrCode: text('qr_code'),
  customerId: text('customer_id').references(() => customers.id),
  contractId: text('contract_id').references(() => contracts.id),
  projectId: text('project_id').references(() => projects.id),
  ownerCompanyId: text('owner_company_id').references(() => companies.id),
  branchId: text('branch_id').references(() => branches.id),
  categoryId: text('category_id').references(() => assetCategories.id),
  modelId: text('model_id').references(() => assetModels.id),
  manufacturerId: text('manufacturer_id').references(() => manufacturers.id),
  vendor: text('vendor'),
  purchaseDate: text('purchase_date'),
  warrantyStart: text('warranty_start'),
  warrantyEnd: text('warranty_end'),
  installationDate: text('installation_date'),
  commissionDate: text('commission_date'),
  endOfSupport: text('end_of_support'),
  endOfLife: text('end_of_life'),
  status: text('status').notNull().default('Active'),
  condition: text('condition'),
  locationId: text('location_id').references(() => assetLocations.id),
  rack: text('rack'),
  room: text('room'),
  gps: text('gps'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  ipAddress: text('ip_address'),
  macAddress: text('mac_address'),
  hostname: text('hostname'),
  operatingSystem: text('operating_system'),
  firmware: text('firmware'),
  modelNumber: text('model_number'),
  assetValue: real('asset_value'),
  residualValue: real('residual_value'),
  description: text('description'),
  
  // Legacy fields to not break existing queries completely if possible
  // Old queries may ask for 'category' (text), 'currentValue' (integer), 'assetId' (text)
  // Re-adding them here as optional/nullable to satisfy old relations and queries
  category: text('legacy_category'),
  currentValue: integer('current_value'),
  assetId: text('legacy_asset_id'),
  assignedToId: text('assigned_to_id').references(() => employees.id),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
}, (table) => {
  return {
    assetCodeIdx: index("asset_code_idx").on(table.assetCode),
    customerIdx: index("asset_customer_idx").on(table.customerId),
    contractIdx: index("asset_contract_idx").on(table.contractId),
    statusIdx: index("asset_status_idx").on(table.status)
  };
});

export const assetAssignments = sqliteTable('asset_assignments', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  assignedToId: text('assigned_to_id').notNull().references(() => employees.id),
  assignmentDate: text('assignment_date'),
  returnDate: text('return_date'),
  notes: text('notes'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetWarranties = sqliteTable('asset_warranties', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  vendor: text('vendor'),
  warrantyNumber: text('warranty_number'),
  warrantyType: text('warranty_type'),
  responseTime: text('response_time'),
  coverage: text('coverage'),
  replacement: integer('replacement', { mode: 'boolean' }).default(false),
  rma: text('rma'),
  warrantyExpiration: text('warranty_expiration'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetMaintenances = sqliteTable('asset_maintenances', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  type: text('type'), // Preventive, Corrective, Emergency
  scheduleDate: text('schedule_date'),
  engineerId: text('engineer_id').references(() => employees.id),
  worklog: text('worklog'),
  checklist: text('checklist'),
  downtime: text('downtime'), // e.g. "2 hours"
  maintenanceResult: text('maintenance_result'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetMaintenanceSchedules = sqliteTable('asset_maintenance_schedules', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  frequency: text('frequency'),
  nextScheduleDate: text('next_schedule_date'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetLicenses = sqliteTable('asset_licenses', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  licenseType: text('license_type'), // Windows, VMware, etc.
  licenseKey: text('license_key'),
  licenseStart: text('license_start'),
  licenseEnd: text('license_end'),
  renewalReminder: text('renewal_reminder'), // e.g. 30 days
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetConfigurations = sqliteTable('asset_configurations', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  cpu: text('cpu'),
  memory: text('memory'),
  storage: text('storage'),
  raid: text('raid'),
  networkInterface: text('network_interface'),
  operatingSystem: text('operating_system'),
  virtualization: text('virtualization'),
  database: text('database'),
  application: text('application'),
  dependencies: text('dependencies'),
  configurationVersion: text('configuration_version'),
  backupConfiguration: text('backup_configuration'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetNetworks = sqliteTable('asset_networks', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  publicIp: text('public_ip'),
  privateIp: text('private_ip'),
  subnet: text('subnet'),
  gateway: text('gateway'),
  dns: text('dns'),
  vlan: text('vlan'),
  switchPort: text('switch_port'),
  router: text('router'),
  firewall: text('firewall'),
  vpn: text('vpn'),
  internetProvider: text('internet_provider'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetMonitorings = sqliteTable('asset_monitorings', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  alertType: text('alert_type'),
  alertMessage: text('alert_message'),
  severity: text('severity'),
  timestamp: text('timestamp'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetDocuments = sqliteTable('asset_documents', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  documentType: text('document_type'), // Manual, Invoice, etc.
  documentName: text('document_name'),
  fileUrl: text('file_url'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetAttachments = sqliteTable('asset_attachments', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  fileName: text('file_name'),
  fileUrl: text('file_url'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetHistories = sqliteTable('asset_histories', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  action: text('action'),
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const assetDisposals = sqliteTable('asset_disposals', {
  id: text('id').primaryKey(),
  assetId: text('asset_id').notNull().references(() => assets.id),
  disposalDate: text('disposal_date'),
  disposalMethod: text('disposal_method'),
  disposalReason: text('disposal_reason'),
  approvedBy: text('approved_by').references(() => employees.id),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});


export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(), // UUID
  invoiceNumber: text('invoice_number').notNull().unique(),
  date: text('date').notNull(),
  dueDate: text('due_date').notNull(),
  salespersonId: text('salesperson_id').references(() => employees.id),
  customerId: text('customer_id').notNull().references(() => customers.id),
  subtotal: integer('subtotal').notNull(),
  discountTotal: integer('discount_total').notNull().default(0),
  additionalDiscount: integer('additional_discount').notNull().default(0),
  shippingCost: integer('shipping_cost').notNull().default(0),
  taxTotal: integer('tax_total').notNull().default(0),
  downPayment: integer('down_payment').notNull().default(0),
  total: integer('total').notNull(),
  amountPaid: integer('amount_paid').notNull().default(0),
  amountDue: integer('amount_due').notNull(),
  notes: text('notes'),
  terms: text('terms'),
  signatureDate: text('signature_date'),
  signatureName: text('signature_name'),
  status: text('status').notNull().default('Unpaid'),
});

export const invoiceItems = sqliteTable('invoice_items', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull(),
  productName: text('product_name').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  price: integer('price').notNull(),
  discountPercent: integer('discount_percent').notNull().default(0),
  taxType: text('tax_type').default('No Tax Selected'),
  total: integer('total').notNull(),
});

export const purchaseOrders = sqliteTable('purchase_orders', {
  id: text('id').primaryKey(), // UUID
  vendorId: text('vendor_id').notNull().references(() => vendors.id),
  date: text('date').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull(), // Pending, Received, Cancelled
});

export const purchaseOrderItems = sqliteTable('purchase_order_items', {
  id: text('id').primaryKey(),
  purchaseOrderId: text('purchase_order_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

export const salesOrderItems = sqliteTable('sales_order_items', {
  id: text('id').primaryKey(),
  salesOrderId: text('sales_order_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

export const inventoryTransactions = sqliteTable('inventory_transactions', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  type: text('type').notNull(), // IN, OUT
  quantity: integer('quantity').notNull(),
  date: text('date').notNull(),
  referenceId: text('reference_id').notNull(), // PO or SO ID
  referenceType: text('reference_type').notNull(), // PO, SO, MANUAL
});


export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  pic: text('pic').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  npwp: text('npwp'),
  status: text('status').notNull().default('Active'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  legalName: text('legal_name'),
  npwp: text('npwp'),
  email: text('email'),
  website: text('website'),
  phone: text('phone'),
  industryId: text('industry_id'),
  categoryId: text('category_id'),
  groupId: text('group_id'),
  statusId: text('status_id').default('Active'),
  priorityId: text('priority_id'),
  currencyId: text('currency_id'),
  paymentTermId: text('payment_term_id'),
  salespersonId: text('salesperson_id').references(() => employees.id),
  accountManagerId: text('account_manager_id').references(() => employees.id),
  branchId: text('branch_id').references(() => branches.id),
  companyId: text('company_id').references(() => companies.id),
  
  // Legacy fields for compatibility if needed, or we can drop them. We keep pic just in case.
  pic: text('pic'),
  address: text('address'),

  // Audit
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
}, (table) => {
  return {
    nameIdx: index("name_idx").on(table.name),
    codeIdx: index("code_idx").on(table.code),
    industryIdx: index("industry_idx").on(table.industryId),
    categoryIdx: index("category_idx").on(table.categoryId)
  };
});

export const customerContacts = sqliteTable('customer_contacts', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  name: text('name').notNull(),
  title: text('title'),
  contactType: text('contact_type'), // Technical PIC, Finance PIC, Management PIC, Emergency Contact
  email: text('email'),
  phone: text('phone'),
  mobile: text('mobile'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  notes: text('notes'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const customerAddresses = sqliteTable('customer_addresses', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  addressType: text('address_type'), // Head Office, Billing Address, Shipping Address, Branch Office
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  country: text('country'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  mapsUrl: text('maps_url'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const customerCommunications = sqliteTable('customer_communications', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  contactId: text('contact_id').references(() => customerContacts.id),
  employeeId: text('employee_id').references(() => employees.id),
  channel: text('channel'), // Email, Phone, WhatsApp, Telegram, Meeting, Call
  direction: text('direction'), // Inbound, Outbound
  communicationDate: text('communication_date').notNull(),
  subject: text('subject'),
  notes: text('notes'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const customerBankAccounts = sqliteTable('customer_bank_accounts', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  bankName: text('bank_name').notNull(),
  accountName: text('account_name').notNull(),
  accountNumber: text('account_number').notNull(),
  swiftCode: text('swift_code'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const customerDocuments = sqliteTable('customer_documents', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  documentType: text('document_type'), // NPWP, NIB, Contract, Other
  documentName: text('document_name').notNull(),
  fileUrl: text('file_url'),
  expiryDate: text('expiry_date'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const customerRelations = relations(customers, ({ many, one }) => ({
  contracts: many(contracts),
  contacts: many(customerContacts),
  addresses: many(customerAddresses),
  communications: many(customerCommunications),
  bankAccounts: many(customerBankAccounts),
  documents: many(customerDocuments),
  salesperson: one(employees, { fields: [customers.salespersonId], references: [employees.id] }),
  accountManager: one(employees, { fields: [customers.accountManagerId], references: [employees.id] }),
  branch: one(branches, { fields: [customers.branchId], references: [branches.id] }),
  company: one(companies, { fields: [customers.companyId], references: [companies.id] }),
  // Invoices, Orders, Projects, Assets, Tickets will be linked if not already
}));

export const customerContactsRelations = relations(customerContacts, ({ one, many }) => ({
  customer: one(customers, { fields: [customerContacts.customerId], references: [customers.id] }),
  communications: many(customerCommunications),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, { fields: [customerAddresses.customerId], references: [customers.id] })
}));

export const customerCommunicationsRelations = relations(customerCommunications, ({ one }) => ({
  customer: one(customers, { fields: [customerCommunications.customerId], references: [customers.id] }),
  contact: one(customerContacts, { fields: [customerCommunications.contactId], references: [customerContacts.id] }),
  employee: one(employees, { fields: [customerCommunications.employeeId], references: [employees.id] })
}));

export const customerBankAccountsRelations = relations(customerBankAccounts, ({ one }) => ({
  customer: one(customers, { fields: [customerBankAccounts.customerId], references: [customers.id] })
}));

export const customerDocumentsRelations = relations(customerDocuments, ({ one }) => ({
  customer: one(customers, { fields: [customerDocuments.customerId], references: [customers.id] })
}));

// We also need to add relations in existing tables to customer if we want.
// Drizzle supports multiple definitions or we can just keep them as is.


export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(), // UUID
  companyName: text('company_name').notNull(),
  pic: text('pic').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  productInterest: text('product_interest'),
  source: text('source').notNull(), // Website, Referral, etc.
  status: text('status').notNull(), // New, Contacted, Qualified, Proposal, Negotiation, Won, Lost
  score: integer('score').default(0),
  ownerId: text('owner_id').references(() => employees.id),
  estimatedValue: integer('estimated_value').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(), // UUID
  type: text('type').notNull(), // Call, Email, Meeting, WhatsApp
  referenceId: text('reference_id').notNull(), // leadId or customerId
  referenceType: text('reference_type').notNull(), // Lead, Customer
  date: text('date').notNull(),
  notes: text('notes').notNull(),
  performedById: text('performed_by_id').notNull().references(() => employees.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});


// --- REFERENCE ENGINE ---
export const referenceGroups = sqliteTable('reference_groups', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const referenceValues = sqliteTable('reference_values', {
  id: text('id').primaryKey(), // UUID
  groupId: text('group_id').notNull().references(() => referenceGroups.id),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0),
  metadata: text('metadata'), // JSON
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const referenceGroupsRelations = relations(referenceGroups, ({ many }) => ({
  values: many(referenceValues),
}));

export const referenceValuesRelations = relations(referenceValues, ({ one }) => ({
  group: one(referenceGroups, {
    fields: [referenceValues.groupId],
    references: [referenceGroups.id],
  }),
}));

// --- ENTERPRISE ITSM (HELPDESK & SUPPORT) SCHEMA ---

export const ticketCategories = sqliteTable('ticket_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketSubCategories = sqliteTable('ticket_sub_categories', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => ticketCategories.id),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketPriorities = sqliteTable('ticket_priorities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // Low, Medium, High, Critical
  level: integer('level').notNull(), 
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketImpacts = sqliteTable('ticket_impacts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketUrgencies = sqliteTable('ticket_urgencies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketStatuses = sqliteTable('ticket_statuses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  isClosed: integer('is_closed', { mode: 'boolean' }).default(false),
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const slas = sqliteTable('slas', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  responseTimeMinutes: integer('response_time_minutes').notNull(),
  resolutionTimeMinutes: integer('resolution_time_minutes').notNull(),
  priorityId: text('priority_id').references(() => ticketPriorities.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const tickets = sqliteTable('tickets', {
  id: text('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  customerId: text('customer_id').references(() => customers.id),
  contractId: text('contract_id'),
  assetId: text('asset_id').references(() => assets.id),
  categoryId: text('category_id').references(() => ticketCategories.id),
  subCategoryId: text('sub_category_id').references(() => ticketSubCategories.id),
  priorityId: text('priority_id').references(() => ticketPriorities.id),
  impactId: text('impact_id').references(() => ticketImpacts.id),
  urgencyId: text('urgency_id').references(() => ticketUrgencies.id),
  statusId: text('status_id').references(() => ticketStatuses.id),
  slaId: text('sla_id').references(() => slas.id),
  assignedTo: text('assigned_to').references(() => employees.id),
  reportedBy: text('reported_by'), 
  expectedResolutionDate: text('expected_resolution_date'),
  actualResolutionDate: text('actual_resolution_date'),
  resolutionNotes: text('resolution_notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketAttachments = sqliteTable('ticket_attachments', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type'),
  fileSize: integer('file_size'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketComments = sqliteTable('ticket_comments', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  comment: text('comment').notNull(),
  isInternal: integer('is_internal', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketWorklogs = sqliteTable('ticket_worklogs', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  employeeId: text('employee_id').notNull().references(() => employees.id),
  timeSpentMinutes: integer('time_spent_minutes').notNull(),
  workDate: text('work_date').notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketTimelines = sqliteTable('ticket_timelines', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  action: text('action').notNull(), 
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketWatchers = sqliteTable('ticket_watchers', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  employeeId: text('employee_id').notNull().references(() => employees.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketTags = sqliteTable('ticket_tags', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  tagId: text('tag_id').notNull().references(() => tags.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const ticketAudits = sqliteTable('ticket_audits', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  fieldName: text('field_name').notNull(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

// --- ENTERPRISE ITSM RELATIONS ---
import { relations } from 'drizzle-orm';

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  contract: one(contracts, { fields: [tickets.contractId], references: [contracts.id] }),
  customer: one(customers, { fields: [tickets.customerId], references: [customers.id] }),
  asset: one(assets, { fields: [tickets.assetId], references: [assets.id] }),
  category: one(ticketCategories, { fields: [tickets.categoryId], references: [ticketCategories.id] }),
  subCategory: one(ticketSubCategories, { fields: [tickets.subCategoryId], references: [ticketSubCategories.id] }),
  priority: one(ticketPriorities, { fields: [tickets.priorityId], references: [ticketPriorities.id] }),
  impact: one(ticketImpacts, { fields: [tickets.impactId], references: [ticketImpacts.id] }),
  urgency: one(ticketUrgencies, { fields: [tickets.urgencyId], references: [ticketUrgencies.id] }),
  status: one(ticketStatuses, { fields: [tickets.statusId], references: [ticketStatuses.id] }),
  sla: one(slas, { fields: [tickets.slaId], references: [slas.id] }),
  assignedEmployee: one(employees, { fields: [tickets.assignedTo], references: [employees.id] }),
  reportedEmployee: one(employees, { fields: [tickets.reportedBy], references: [employees.id] }),
  comments: many(ticketComments),
  worklogs: many(ticketWorklogs),
  attachments: many(ticketAttachments),
  timelines: many(ticketTimelines),
  watchers: many(ticketWatchers),
  tags: many(ticketTags),
  audits: many(ticketAudits),
}));

export const ticketCategoriesRelations = relations(ticketCategories, ({ many }) => ({
  subCategories: many(ticketSubCategories),
  tickets: many(tickets),
}));

export const ticketSubCategoriesRelations = relations(ticketSubCategories, ({ one, many }) => ({
  category: one(ticketCategories, { fields: [ticketSubCategories.categoryId], references: [ticketCategories.id] }),
  tickets: many(tickets),
}));

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketComments.ticketId], references: [tickets.id] }),
  createdByEmployee: one(employees, { fields: [ticketComments.createdBy], references: [employees.id] }),
}));

export const ticketWorklogsRelations = relations(ticketWorklogs, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketWorklogs.ticketId], references: [tickets.id] }),
  employee: one(employees, { fields: [ticketWorklogs.employeeId], references: [employees.id] }),
}));

export const ticketAttachmentsRelations = relations(ticketAttachments, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketAttachments.ticketId], references: [tickets.id] }),
  createdByEmployee: one(employees, { fields: [ticketAttachments.createdBy], references: [employees.id] }),
}));

export const ticketTimelinesRelations = relations(ticketTimelines, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketTimelines.ticketId], references: [tickets.id] }),
  createdByEmployee: one(employees, { fields: [ticketTimelines.createdBy], references: [employees.id] }),
}));

export const ticketWatchersRelations = relations(ticketWatchers, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketWatchers.ticketId], references: [tickets.id] }),
  employee: one(employees, { fields: [ticketWatchers.employeeId], references: [employees.id] }),
}));

export const ticketTagsRelations = relations(ticketTags, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketTags.ticketId], references: [tickets.id] }),
  tag: one(tags, { fields: [ticketTags.tagId], references: [tags.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  ticketTags: many(ticketTags),
}));

export const slasRelations = relations(slas, ({ one, many }) => ({
  priority: one(ticketPriorities, { fields: [slas.priorityId], references: [ticketPriorities.id] }),
  tickets: many(tickets),
}));


// --- ENTERPRISE RBAC & PERMISSION ENGINE ---
export const roleGroups = sqliteTable('role_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => roleGroups.id),
  name: text('name').notNull().unique(),
  description: text('description'),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});

export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  module: text('module').notNull(), // e.g., Dashboard, Ticket, Invoice
  action: text('action').notNull(), // e.g., View, Create, Update, Delete, Approve
  name: text('name').notNull(),
  description: text('description'),
  isSystem: integer('is_system', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const rolePermissions = sqliteTable('role_permissions', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  permissionId: text('permission_id').notNull().references(() => permissions.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const userRoles = sqliteTable('user_roles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  roleId: text('role_id').notNull().references(() => roles.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const dataScopes = sqliteTable('data_scopes', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g., Self, Department, Division, Branch, Company, Global
  description: text('description'),
  level: integer('level').notNull(), // lower means more restricted
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const roleDataScopes = sqliteTable('role_data_scopes', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  module: text('module').notNull(),
  scopeId: text('scope_id').notNull().references(() => dataScopes.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const menuPermissions = sqliteTable('menu_permissions', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => roles.id),
  menu: text('menu').notNull(), // e.g., Dashboard, CRM, Sales, etc.
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const approvalLevels = sqliteTable('approval_levels', {
  id: text('id').primaryKey(),
  module: text('module').notNull(), // e.g., Purchase, Invoice
  minAmount: integer('min_amount').notNull(),
  maxAmount: integer('max_amount'),
  roleId: text('role_id').notNull().references(() => roles.id),
  levelOrder: integer('level_order').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const auditPermissions = sqliteTable('audit_permissions', {
  id: text('id').primaryKey(),
  action: text('action').notNull(), // e.g., GRANT_PERMISSION, REVOKE_PERMISSION, CHANGE_APPROVAL
  entityType: text('entity_type').notNull(), // e.g., Role, ApprovalLevel
  entityId: text('entity_id').notNull(),
  details: text('details'), // JSON string
  performedBy: text('performed_by').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// RBAC Relations
export const roleGroupsRelations = relations(roleGroups, ({ many }) => ({
  roles: many(roles),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  group: one(roleGroups, { fields: [roles.groupId], references: [roleGroups.id] }),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
  menuPermissions: many(menuPermissions),
  roleDataScopes: many(roleDataScopes),
  approvalLevels: many(approvalLevels),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const dataScopesRelations = relations(dataScopes, ({ many }) => ({
  roleDataScopes: many(roleDataScopes),
}));

export const roleDataScopesRelations = relations(roleDataScopes, ({ one }) => ({
  role: one(roles, { fields: [roleDataScopes.roleId], references: [roles.id] }),
  scope: one(dataScopes, { fields: [roleDataScopes.scopeId], references: [dataScopes.id] }),
}));

export const menuPermissionsRelations = relations(menuPermissions, ({ one }) => ({
  role: one(roles, { fields: [menuPermissions.roleId], references: [roles.id] }),
}));

export const approvalLevelsRelations = relations(approvalLevels, ({ one }) => ({
  role: one(roles, { fields: [approvalLevels.roleId], references: [roles.id] }),
}));



// ==========================================
// ENTERPRISE CONTRACT DOMAIN
// ==========================================

export const contracts = sqliteTable('contracts', {
  id: text('id').primaryKey(),
  contractNumber: text('contract_number').notNull().unique(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  contractType: text('contract_type'),
  contractCategory: text('contract_category'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  status: text('status').default('Draft'),
  renewalType: text('renewal_type'),
  autoRenewal: integer('auto_renewal', { mode: 'boolean' }).default(false),
  currency: text('currency'),
  paymentTerm: text('payment_term'),
  salespersonId: text('salesperson_id').references(() => employees.id),
  accountManagerId: text('account_manager_id').references(() => employees.id),
  branchId: text('branch_id').references(() => branches.id),
  companyId: text('company_id').references(() => companies.id),
  description: text('description'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
}, (table) => {
  return {
    contractNumberIdx: index("contract_number_idx").on(table.contractNumber),
    customerIdx: index("contract_customer_idx").on(table.customerId),
    statusIdx: index("contract_status_idx").on(table.status)
  };
});

export const contractServices = sqliteTable('contract_services', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  serviceName: text('service_name').notNull(),
  serviceCategory: text('service_category'),
  serviceLevel: text('service_level'),
  included: text('included'),
  excluded: text('excluded'),
  unlimitedSupport: integer('unlimited_support', { mode: 'boolean' }).default(false),
  remoteSupport: integer('remote_support', { mode: 'boolean' }).default(false),
  onsiteSupport: integer('onsite_support', { mode: 'boolean' }).default(false),
  preventiveMaintenance: integer('preventive_maintenance', { mode: 'boolean' }).default(false),
  correctiveMaintenance: integer('corrective_maintenance', { mode: 'boolean' }).default(false),
  emergencySupport: integer('emergency_support', { mode: 'boolean' }).default(false),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractSlas = sqliteTable('contract_slas', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  responseTime: text('response_time'),
  resolutionTime: text('resolution_time'),
  businessHours: text('business_hours'),
  is24x7: integer('is_24x7', { mode: 'boolean' }).default(false),
  holidayCalendar: text('holiday_calendar'),
  escalationLevel: text('escalation_level'),
  maximumDowntime: text('maximum_downtime'),
  penaltyRule: text('penalty_rule'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractCoverages = sqliteTable('contract_coverages', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  coveredAssetId: text('covered_asset_id').references(() => assets.id),
  coveredBranchId: text('covered_branch_id').references(() => branches.id),
  coveredLocation: text('covered_location'),
  coveredDeviceId: text('covered_device_id'), // Might refer to another table, string for now
  coveredUserId: text('covered_user_id'),
  coverageType: text('coverage_type'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractDevices = sqliteTable('contract_devices', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  maximumDevice: integer('maximum_device'),
  currentDevice: integer('current_device'),
  maximumUser: integer('maximum_user'),
  currentUser: integer('current_user'),
  maximumServer: integer('maximum_server'),
  currentServer: integer('current_server'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractDocuments = sqliteTable('contract_documents', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  documentName: text('document_name').notNull(),
  documentType: text('document_type'),
  fileUrl: text('file_url'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractAttachments = sqliteTable('contract_attachments', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url'),
  fileSize: integer('file_size'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const contractBillings = sqliteTable('contract_billings', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  billingCycle: text('billing_cycle'), // Monthly, Quarterly, Yearly
  nextBilling: text('next_billing'),
  lastBilling: text('last_billing'),
  monthlyFee: real('monthly_fee'),
  yearlyFee: real('yearly_fee'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractRenewals = sqliteTable('contract_renewals', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  renewalDate: text('renewal_date'),
  reminderDate: text('reminder_date'),
  autoRenewal: integer('auto_renewal', { mode: 'boolean' }).default(false),
  renewalStatus: text('renewal_status'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
});

export const contractApprovals = sqliteTable('contract_approvals', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  approvalWorkflow: text('approval_workflow'),
  approvalLevel: integer('approval_level'),
  approvalDate: text('approval_date'),
  approvedBy: text('approved_by').references(() => employees.id),
  status: text('status'),
  notes: text('notes'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const contractHistories = sqliteTable('contract_histories', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  action: text('action'),
  description: text('description'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

// Relations

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  customer: one(customers, { fields: [contracts.customerId], references: [customers.id] }),
  salesperson: one(employees, { fields: [contracts.salespersonId], references: [employees.id] }),
  accountManager: one(employees, { fields: [contracts.accountManagerId], references: [employees.id] }),
  branch: one(branches, { fields: [contracts.branchId], references: [branches.id] }),
  company: one(companies, { fields: [contracts.companyId], references: [companies.id] }),
  
  services: many(contractServices),
  slas: many(contractSlas),
  coverages: many(contractCoverages),
  devices: many(contractDevices),
  documents: many(contractDocuments),
  attachments: many(contractAttachments),
  billings: many(contractBillings),
  renewals: many(contractRenewals),
  approvals: many(contractApprovals),
  histories: many(contractHistories),
  assets: many(assets),
  projects: many(projects),
  tickets: many(tickets)
}));

export const contractServicesRelations = relations(contractServices, ({ one }) => ({
  contract: one(contracts, { fields: [contractServices.contractId], references: [contracts.id] })
}));

export const contractSlasRelations = relations(contractSlas, ({ one }) => ({
  contract: one(contracts, { fields: [contractSlas.contractId], references: [contracts.id] })
}));

export const contractCoveragesRelations = relations(contractCoverages, ({ one }) => ({
  contract: one(contracts, { fields: [contractCoverages.contractId], references: [contracts.id] }),
  asset: one(assets, { fields: [contractCoverages.coveredAssetId], references: [assets.id] }),
  branch: one(branches, { fields: [contractCoverages.coveredBranchId], references: [branches.id] })
}));

export const contractDevicesRelations = relations(contractDevices, ({ one }) => ({
  contract: one(contracts, { fields: [contractDevices.contractId], references: [contracts.id] })
}));

export const contractDocumentsRelations = relations(contractDocuments, ({ one }) => ({
  contract: one(contracts, { fields: [contractDocuments.contractId], references: [contracts.id] })
}));

export const contractAttachmentsRelations = relations(contractAttachments, ({ one }) => ({
  contract: one(contracts, { fields: [contractAttachments.contractId], references: [contracts.id] })
}));

export const contractBillingsRelations = relations(contractBillings, ({ one }) => ({
  contract: one(contracts, { fields: [contractBillings.contractId], references: [contracts.id] })
}));

export const contractRenewalsRelations = relations(contractRenewals, ({ one }) => ({
  contract: one(contracts, { fields: [contractRenewals.contractId], references: [contracts.id] })
}));

export const contractApprovalsRelations = relations(contractApprovals, ({ one }) => ({
  contract: one(contracts, { fields: [contractApprovals.contractId], references: [contracts.id] }),
  approver: one(employees, { fields: [contractApprovals.approvedBy], references: [employees.id] })
}));

export const contractHistoriesRelations = relations(contractHistories, ({ one }) => ({
  contract: one(contracts, { fields: [contractHistories.contractId], references: [contracts.id] })
}));



export const assetsRelations = relations(assets, ({ one, many }) => ({
  contract: one(contracts, { fields: [assets.contractId], references: [contracts.id] }),
  customer: one(customers, { fields: [assets.customerId], references: [customers.id] }),
  project: one(projects, { fields: [assets.projectId], references: [projects.id] }),
  category: one(assetCategories, { fields: [assets.categoryId], references: [assetCategories.id] }),
  model: one(assetModels, { fields: [assets.modelId], references: [assetModels.id] }),
  manufacturer: one(manufacturers, { fields: [assets.manufacturerId], references: [manufacturers.id] }),
  location: one(assetLocations, { fields: [assets.locationId], references: [assetLocations.id] }),
  ownerCompany: one(companies, { fields: [assets.ownerCompanyId], references: [companies.id] }),
  branch: one(branches, { fields: [assets.branchId], references: [branches.id] }),
  assignedEmployee: one(employees, { fields: [assets.assignedToId], references: [employees.id] }),
  
  assignments: many(assetAssignments),
  warranties: many(assetWarranties),
  maintenances: many(assetMaintenances),
  maintenanceSchedules: many(assetMaintenanceSchedules),
  licenses: many(assetLicenses),
  configurations: many(assetConfigurations),
  networks: many(assetNetworks),
  monitorings: many(assetMonitorings),
  documents: many(assetDocuments),
  attachments: many(assetAttachments),
  histories: many(assetHistories),
  disposals: many(assetDisposals),
  tickets: many(tickets), // from existing tickets relation
  cis: many(cis),
}));

export const assetCategoriesRelations = relations(assetCategories, ({ many }) => ({
  assets: many(assets),
  models: many(assetModels)
}));

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  assets: many(assets),
  models: many(assetModels)
}));

export const assetModelsRelations = relations(assetModels, ({ one, many }) => ({
  manufacturer: one(manufacturers, { fields: [assetModels.manufacturerId], references: [manufacturers.id] }),
  category: one(assetCategories, { fields: [assetModels.categoryId], references: [assetCategories.id] }),
  assets: many(assets)
}));

export const assetLocationsRelations = relations(assetLocations, ({ one, many }) => ({
  branch: one(branches, { fields: [assetLocations.branchId], references: [branches.id] }),
  assets: many(assets)
}));

export const assetAssignmentsRelations = relations(assetAssignments, ({ one }) => ({
  asset: one(assets, { fields: [assetAssignments.assetId], references: [assets.id] }),
  assignee: one(employees, { fields: [assetAssignments.assignedToId], references: [employees.id], relationName: 'employeeAssignments' })
}));

export const assetWarrantiesRelations = relations(assetWarranties, ({ one }) => ({
  asset: one(assets, { fields: [assetWarranties.assetId], references: [assets.id] })
}));


export const assetMaintenancesRelations = relations(assetMaintenances, ({ one }) => ({
  asset: one(assets, { fields: [assetMaintenances.assetId], references: [assets.id] }),
  engineer: one(employees, { fields: [assetMaintenances.engineerId], references: [employees.id] })
}));

export const assetMaintenanceSchedulesRelations = relations(assetMaintenanceSchedules, ({ one }) => ({
  asset: one(assets, { fields: [assetMaintenanceSchedules.assetId], references: [assets.id] })
}));

export const assetLicensesRelations = relations(assetLicenses, ({ one }) => ({
  asset: one(assets, { fields: [assetLicenses.assetId], references: [assets.id] })
}));

export const assetConfigurationsRelations = relations(assetConfigurations, ({ one }) => ({
  asset: one(assets, { fields: [assetConfigurations.assetId], references: [assets.id] })
}));

export const assetNetworksRelations = relations(assetNetworks, ({ one }) => ({
  asset: one(assets, { fields: [assetNetworks.assetId], references: [assets.id] })
}));

export const assetMonitoringsRelations = relations(assetMonitorings, ({ one }) => ({
  asset: one(assets, { fields: [assetMonitorings.assetId], references: [assets.id] })
}));

export const assetDocumentsRelations = relations(assetDocuments, ({ one }) => ({
  asset: one(assets, { fields: [assetDocuments.assetId], references: [assets.id] })
}));

export const assetAttachmentsRelations = relations(assetAttachments, ({ one }) => ({
  asset: one(assets, { fields: [assetAttachments.assetId], references: [assets.id] })
}));

export const assetHistoriesRelations = relations(assetHistories, ({ one }) => ({
  asset: one(assets, { fields: [assetHistories.assetId], references: [assets.id] })
}));

export const assetDisposalsRelations = relations(assetDisposals, ({ one }) => ({
  asset: one(assets, { fields: [assetDisposals.assetId], references: [assets.id] }),
  approver: one(employees, { fields: [assetDisposals.approvedBy], references: [employees.id] })
}));


export const projectsRelations = relations(projects, ({ one }) => ({ contract: one(contracts, { fields: [projects.contractId], references: [contracts.id] }) }));

// ==========================================
// ENTERPRISE CMDB DOMAIN
// ==========================================

export const ciCategories = sqliteTable('ci_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const ciEnvironments = sqliteTable('ci_environments', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(), // Production, Staging, Dev, Test
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const ciStatuses = sqliteTable('ci_statuses', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(), // Active, Maintenance, Retired
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const cis = sqliteTable('cis', {
  id: text('id').primaryKey(),
  ciCode: text('ci_code').notNull().unique(),
  name: text('name').notNull(),
  ciType: text('ci_type'), // Business Service, Application Service, Infrastructure Service, Database Service, Virtual Machine, Container, Cloud Resource
  categoryId: text('category_id').references(() => ciCategories.id),
  customerId: text('customer_id').references(() => customers.id),
  contractId: text('contract_id').references(() => contracts.id),
  assetId: text('asset_id').references(() => assets.id),
  projectId: text('project_id').references(() => projects.id),
  environmentId: text('environment_id').references(() => ciEnvironments.id),
  statusId: text('status_id').references(() => ciStatuses.id),
  criticality: text('criticality'), // High, Medium, Low
  ownerId: text('owner_id').references(() => employees.id),
  businessOwnerId: text('business_owner_id').references(() => employees.id),
  technicalOwnerId: text('technical_owner_id').references(() => employees.id),
  supportGroupId: text('support_group_id').references(() => departments.id),
  monitoringProfile: text('monitoring_profile'),
  location: text('location'),
  description: text('description'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
  updatedAt: text('updated_at'),
  updatedBy: text('updated_by'),
}, (table) => {
  return {
    ciCodeIdx: index("ci_code_idx").on(table.ciCode),
    customerIdx: index("ci_customer_idx").on(table.customerId),
    assetIdx: index("ci_asset_idx").on(table.assetId)
  };
});

export const ciRelationships = sqliteTable('ci_relationships', {
  id: text('id').primaryKey(),
  parentCiId: text('parent_ci_id').notNull().references(() => cis.id),
  childCiId: text('child_ci_id').notNull().references(() => cis.id),
  dependencyType: text('dependency_type'), // Runs on, Depends on, Connected to, Contains
  impactLevel: text('impact_level'), // High, Medium, Low
  priority: integer('priority'),
  relationshipDirection: text('relationship_direction'), // Parent-to-Child, Child-to-Parent, Bi-directional
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const ciHistories = sqliteTable('ci_histories', {
  id: text('id').primaryKey(),
  ciId: text('ci_id').notNull().references(() => cis.id),
  action: text('action'),
  description: text('description'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const ciDocuments = sqliteTable('ci_documents', {
  id: text('id').primaryKey(),
  ciId: text('ci_id').notNull().references(() => cis.id),
  documentName: text('document_name'),
  fileUrl: text('file_url'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

export const ciTags = sqliteTable('ci_tags', {
  id: text('id').primaryKey(),
  ciId: text('ci_id').notNull().references(() => cis.id),
  tag: text('tag').notNull(),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});


export const cisRelations = relations(cis, ({ one, many }) => ({
  category: one(ciCategories, { fields: [cis.categoryId], references: [ciCategories.id] }),
  customer: one(customers, { fields: [cis.customerId], references: [customers.id] }),
  contract: one(contracts, { fields: [cis.contractId], references: [contracts.id] }),
  asset: one(assets, { fields: [cis.assetId], references: [assets.id] }),
  project: one(projects, { fields: [cis.projectId], references: [projects.id] }),
  environment: one(ciEnvironments, { fields: [cis.environmentId], references: [ciEnvironments.id] }),
  status: one(ciStatuses, { fields: [cis.statusId], references: [ciStatuses.id] }),
  owner: one(employees, { fields: [cis.ownerId], references: [employees.id] }),
  businessOwner: one(employees, { fields: [cis.businessOwnerId], references: [employees.id] }),
  technicalOwner: one(employees, { fields: [cis.technicalOwnerId], references: [employees.id] }),
  supportGroup: one(departments, { fields: [cis.supportGroupId], references: [departments.id] }),

  parentRelationships: many(ciRelationships, { relationName: 'childRelations' }),
  childRelationships: many(ciRelationships, { relationName: 'parentRelations' }),
  
  histories: many(ciHistories),
  documents: many(ciDocuments),
  tags: many(ciTags)
}));

export const ciRelationshipsRelations = relations(ciRelationships, ({ one }) => ({
  parentCi: one(cis, { fields: [ciRelationships.parentCiId], references: [cis.id], relationName: 'parentRelations' }),
  childCi: one(cis, { fields: [ciRelationships.childCiId], references: [cis.id], relationName: 'childRelations' })
}));

export const ciHistoriesRelations = relations(ciHistories, ({ one }) => ({
  ci: one(cis, { fields: [ciHistories.ciId], references: [cis.id] })
}));

export const ciDocumentsRelations = relations(ciDocuments, ({ one }) => ({
  ci: one(cis, { fields: [ciDocuments.ciId], references: [cis.id] })
}));

export const ciTagsRelations = relations(ciTags, ({ one }) => ({
  ci: one(cis, { fields: [ciTags.ciId], references: [cis.id] })
}));

// === MOVED RELATIONS ===
export const employeesRelations = relations(employees, ({ one, many }) => ({
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
  
  contracts: many(employeeContracts),
  leaves: many(employeeLeaves),
  attendance: many(attendance),
  assetAssignments: many(assetAssignments, { relationName: 'employeeAssignments' }),
  certifications: many(employeeCertifications),
  trainings: many(employeeTrainings),
  performances: many(employeePerformances),
  documents: many(employeeDocuments),
}));

export const employeeContractsRelations = relations(employeeContracts, ({ one }) => ({
  employee: one(employees, { fields: [employeeContracts.employeeId], references: [employees.id] })
}));
export const employeeLeavesRelations = relations(employeeLeaves, ({ one }) => ({
  employee: one(employees, { fields: [employeeLeaves.employeeId], references: [employees.id] })
}));
export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, { fields: [attendance.employeeId], references: [employees.id] })
}));
export const employeeCertificationsRelations = relations(employeeCertifications, ({ one }) => ({
  employee: one(employees, { fields: [employeeCertifications.employeeId], references: [employees.id] })
}));
export const employeeTrainingsRelations = relations(employeeTrainings, ({ one }) => ({
  employee: one(employees, { fields: [employeeTrainings.employeeId], references: [employees.id] })
}));
export const employeePerformancesRelations = relations(employeePerformances, ({ one }) => ({
  employee: one(employees, { fields: [employeePerformances.employeeId], references: [employees.id] })
}));
export const employeeDocumentsRelations = relations(employeeDocuments, ({ one }) => ({
  employee: one(employees, { fields: [employeeDocuments.employeeId], references: [employees.id] })
}));
