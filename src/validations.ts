import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role is required"),
  department: z.string().min(2, "Department is required"),
  status: z.enum(['Active', 'On Leave', 'Terminated']),
  joinDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
});

export const salesOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"), salespersonId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  amount: z.number().positive("Amount must be positive"),
  status: z.enum(['Completed', 'Pending', 'Cancelled'])
});

export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  customerId: z.string().min(1, "Client is required"), managerId: z.string().optional().nullable(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  budget: z.number().positive("Budget must be positive"),
  status: z.enum(['Active', 'Completed', 'Delayed']),
  progress: z.number().min(0).max(100, "Progress must be between 0 and 100")
});

export const ticketCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

export const ticketSubCategorySchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

export const ticketPrioritySchema = z.object({
  name: z.string().min(2, "Name is required"),
  level: z.number().int(),
  color: z.string().optional(),
});

export const ticketImpactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  level: z.number().int(),
});

export const ticketUrgencySchema = z.object({
  name: z.string().min(2, "Name is required"),
  level: z.number().int(),
});

export const ticketStatusSchema = z.object({
  name: z.string().min(2, "Name is required"),
  isClosed: z.boolean().default(false),
  color: z.string().optional(),
});

export const slaSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  responseTimeMinutes: z.number().int().min(0),
  resolutionTimeMinutes: z.number().int().min(0),
  priorityId: z.string().optional(),
});

export const ticketSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(5, "Description is required"),
  customerId: z.string().nullable().optional(),
  assetId: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().nullable().optional(),
  priorityId: z.string().min(1, "Priority is required"),
  impactId: z.string().min(1, "Impact is required"),
  urgencyId: z.string().min(1, "Urgency is required"),
  statusId: z.string().nullable().optional(),
  slaId: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  reportedBy: z.string().nullable().optional(),
  expectedResolutionDate: z.string().nullable().optional(),
  actualResolutionDate: z.string().nullable().optional(),
  resolutionNotes: z.string().nullable().optional(),
});

export const ticketAttachmentSchema = z.object({
  ticketId: z.string().min(1),
  fileName: z.string().min(1),
  fileUrl: z.string().min(1),
  fileType: z.string().optional(),
  fileSize: z.number().int().optional(),
});

export const ticketCommentSchema = z.object({
  ticketId: z.string().min(1),
  comment: z.string().min(1),
  isInternal: z.boolean().default(false),
});

export const ticketWorklogSchema = z.object({
  ticketId: z.string().min(1),
  employeeId: z.string().min(1),
  timeSpentMinutes: z.number().int().min(1),
  workDate: z.string().min(1),
  description: z.string().min(1),
});

export const ticketTimelineSchema = z.object({
  ticketId: z.string().min(1),
  action: z.string().min(1),
  description: z.string().optional(),
});

export const ticketWatcherSchema = z.object({
  ticketId: z.string().min(1),
  employeeId: z.string().min(1),
});

export const tagSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

export const ticketTagSchema = z.object({
  ticketId: z.string().min(1),
  tagId: z.string().min(1),
});

export const ticketAuditSchema = z.object({
  ticketId: z.string().min(1),
  fieldName: z.string().min(1),
  oldValue: z.string().optional().nullable(),
  newValue: z.string().optional().nullable(),
});

// Company Organization Master
export const companySchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const branchSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const divisionSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().optional(),
});

export const departmentSchema = z.object({
  divisionId: z.string().min(1, "Division is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().optional(),
});

export const jobGradeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  level: z.number().int(),
  isActive: z.boolean().optional(),
});

export const positionSchema = z.object({
  departmentId: z.string().min(1, "Department is required"),
  jobGradeId: z.string().min(1, "Job Grade is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().optional(),
});

export const orgEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee number is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  positionId: z.string().optional().nullable(),
  status: z.string().optional(),
  joinDate: z.string().optional().nullable(),
});

export const referenceGroupSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  isSystem: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const referenceValueSchema = z.object({
  id: z.string().optional(),
  groupId: z.string().min(1, "Group is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  metadata: z.string().nullable().optional(),
  isDefault: z.boolean().default(false),
  isSystem: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// --- Enterprise Contract Domain Validations ---

export const contractSchema = z.object({
  contractNumber: z.string().min(1, "Contract number is required"),
  customerId: z.string().min(1, "Customer is required"),
  contractType: z.string().optional().nullable(),
  contractCategory: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  renewalType: z.string().optional().nullable(),
  autoRenewal: z.boolean().optional().nullable(),
  currency: z.string().optional().nullable(),
  paymentTerm: z.string().optional().nullable(),
  salespersonId: z.string().optional().nullable(),
  accountManagerId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const contractServiceSchema = z.object({
  contractId: z.string().min(1, "Contract is required"),
  serviceName: z.string().min(1, "Service name is required"),
  serviceCategory: z.string().optional().nullable(),
  serviceLevel: z.string().optional().nullable(),
  included: z.string().optional().nullable(),
  excluded: z.string().optional().nullable(),
  unlimitedSupport: z.boolean().optional().nullable(),
  remoteSupport: z.boolean().optional().nullable(),
  onsiteSupport: z.boolean().optional().nullable(),
  preventiveMaintenance: z.boolean().optional().nullable(),
  correctiveMaintenance: z.boolean().optional().nullable(),
  emergencySupport: z.boolean().optional().nullable()
});

export const contractSlaSchema = z.object({
  contractId: z.string().min(1, "Contract is required"),
  responseTime: z.string().optional().nullable(),
  resolutionTime: z.string().optional().nullable(),
  businessHours: z.string().optional().nullable(),
  is24x7: z.boolean().optional().nullable(),
  holidayCalendar: z.string().optional().nullable(),
  escalationLevel: z.string().optional().nullable(),
  maximumDowntime: z.string().optional().nullable(),
  penaltyRule: z.string().optional().nullable()
});

export const contractCoverageSchema = z.object({
  contractId: z.string().min(1, "Contract is required"),
  coveredAssetId: z.string().optional().nullable(),
  coveredBranchId: z.string().optional().nullable(),
  coveredLocation: z.string().optional().nullable(),
  coveredDeviceId: z.string().optional().nullable(),
  coveredUserId: z.string().optional().nullable(),
  coverageType: z.string().optional().nullable()
});

export const contractBillingSchema = z.object({
  contractId: z.string().min(1, "Contract is required"),
  billingCycle: z.string().optional().nullable(),
  nextBilling: z.string().optional().nullable(),
  lastBilling: z.string().optional().nullable(),
  monthlyFee: z.number().optional().nullable(),
  yearlyFee: z.number().optional().nullable()
});

// --- Enterprise Asset Domain Validations ---

export const assetCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable()
});

export const manufacturerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  supportContact: z.string().optional().nullable(),
  website: z.string().optional().nullable()
});

export const assetModelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturerId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const assetLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  branchId: z.string().optional().nullable(),
  address: z.string().optional().nullable()
});

export const assetSchema = z.object({
  assetCode: z.string().min(1, "Asset Code is required"),
  name: z.string().min(1, "Name is required"),
  serialNumber: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  qrCode: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  ownerCompanyId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  modelId: z.string().optional().nullable(),
  manufacturerId: z.string().optional().nullable(),
  vendor: z.string().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  warrantyStart: z.string().optional().nullable(),
  warrantyEnd: z.string().optional().nullable(),
  installationDate: z.string().optional().nullable(),
  commissionDate: z.string().optional().nullable(),
  endOfSupport: z.string().optional().nullable(),
  endOfLife: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  rack: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  gps: z.string().optional().nullable(),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  macAddress: z.string().optional().nullable(),
  hostname: z.string().optional().nullable(),
  operatingSystem: z.string().optional().nullable(),
  firmware: z.string().optional().nullable(),
  modelNumber: z.string().optional().nullable(),
  assetValue: z.number().optional().nullable(),
  residualValue: z.number().optional().nullable(),
  description: z.string().optional().nullable()
});

export const assetAssignmentSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  assignedToId: z.string().min(1, "Assigned To ID is required"),
  assignmentDate: z.string().optional().nullable(),
  returnDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const assetWarrantySchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  vendor: z.string().optional().nullable(),
  warrantyNumber: z.string().optional().nullable(),
  warrantyType: z.string().optional().nullable(),
  responseTime: z.string().optional().nullable(),
  coverage: z.string().optional().nullable(),
  replacement: z.boolean().optional().nullable(),
  rma: z.string().optional().nullable(),
  warrantyExpiration: z.string().optional().nullable()
});

export const assetMaintenanceSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  type: z.string().optional().nullable(),
  scheduleDate: z.string().optional().nullable(),
  engineerId: z.string().optional().nullable(),
  worklog: z.string().optional().nullable(),
  checklist: z.string().optional().nullable(),
  downtime: z.string().optional().nullable(),
  maintenanceResult: z.string().optional().nullable()
});

export const assetLicenseSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  licenseType: z.string().optional().nullable(),
  licenseKey: z.string().optional().nullable(),
  licenseStart: z.string().optional().nullable(),
  licenseEnd: z.string().optional().nullable(),
  renewalReminder: z.string().optional().nullable()
});

export const assetConfigurationSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  cpu: z.string().optional().nullable(),
  memory: z.string().optional().nullable(),
  storage: z.string().optional().nullable(),
  raid: z.string().optional().nullable(),
  networkInterface: z.string().optional().nullable(),
  operatingSystem: z.string().optional().nullable(),
  virtualization: z.string().optional().nullable(),
  database: z.string().optional().nullable(),
  application: z.string().optional().nullable(),
  dependencies: z.string().optional().nullable(),
  configurationVersion: z.string().optional().nullable(),
  backupConfiguration: z.string().optional().nullable()
});

export const assetNetworkSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  publicIp: z.string().optional().nullable(),
  privateIp: z.string().optional().nullable(),
  subnet: z.string().optional().nullable(),
  gateway: z.string().optional().nullable(),
  dns: z.string().optional().nullable(),
  vlan: z.string().optional().nullable(),
  switchPort: z.string().optional().nullable(),
  router: z.string().optional().nullable(),
  firewall: z.string().optional().nullable(),
  vpn: z.string().optional().nullable(),
  internetProvider: z.string().optional().nullable()
});

export const assetDocumentSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  documentType: z.string().optional().nullable(),
  documentName: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable()
});


// --- Enterprise CMDB Domain Validations ---

export const ciCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable()
});

export const ciEnvironmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable()
});

export const ciStatusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable()
});

export const ciSchema = z.object({
  ciCode: z.string().min(1, "CI Code is required"),
  name: z.string().min(1, "Name is required"),
  ciType: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  assetId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  environmentId: z.string().optional().nullable(),
  statusId: z.string().optional().nullable(),
  criticality: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  businessOwnerId: z.string().optional().nullable(),
  technicalOwnerId: z.string().optional().nullable(),
  supportGroupId: z.string().optional().nullable(),
  monitoringProfile: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const ciRelationshipSchema = z.object({
  parentCiId: z.string().min(1, "Parent CI is required"),
  childCiId: z.string().min(1, "Child CI is required"),
  dependencyType: z.string().optional().nullable(),
  impactLevel: z.string().optional().nullable(),
  priority: z.number().optional().nullable(),
  relationshipDirection: z.string().optional().nullable()
});
