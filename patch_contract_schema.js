import fs from 'fs';

const newSchema = `

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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  createdBy: text('created_by'),
});

export const contractHistories = sqliteTable('contract_histories', {
  id: text('id').primaryKey(),
  contractId: text('contract_id').notNull().references(() => contracts.id),
  action: text('action'),
  description: text('description'),
  
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
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
  histories: many(contractHistories)
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

`;

let code = fs.readFileSync('src/db/schema.ts', 'utf8');
code += newSchema;
fs.writeFileSync('src/db/schema.ts', code);
