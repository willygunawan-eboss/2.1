const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const additionalTables = `
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
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  assetName: text('asset_name').notNull(),
  assetCode: text('asset_code').notNull(),
  givenDate: text('given_date').notNull(),
  returnDate: text('return_date'),
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
`;

if (!content.includes('employeeContracts')) {
  fs.writeFileSync('src/db/schema.ts', content + '\n' + additionalTables);
}
