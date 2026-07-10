import fs from 'fs';
let serverCode = fs.readFileSync('server.ts', 'utf8');

const referenceSeedCode = `
  const referenceGroupsCount = await db.select().from(schema.referenceGroups);
  if (referenceGroupsCount.length === 0) {
    const referenceGroups = [
      { code: 'country', name: 'Country' },
      { code: 'province', name: 'Province' },
      { code: 'city', name: 'City' },
      { code: 'timezone', name: 'Timezone' },
      { code: 'currency', name: 'Currency' },
      { code: 'language', name: 'Language' },
      { code: 'gender', name: 'Gender' },
      { code: 'religion', name: 'Religion' },
      { code: 'blood_type', name: 'Blood Type' },
      { code: 'nationality', name: 'Nationality' },
      { code: 'marital_status', name: 'Marital Status' },
      { code: 'employment_type', name: 'Employment Type' },
      { code: 'employment_status', name: 'Employment Status' },
      { code: 'department_type', name: 'Department Type' },
      { code: 'position_level', name: 'Position Level' },
      { code: 'job_grade', name: 'Job Grade' },
      { code: 'customer_category', name: 'Customer Category' },
      { code: 'customer_industry', name: 'Customer Industry' },
      { code: 'customer_type', name: 'Customer Type' },
      { code: 'vendor_category', name: 'Vendor Category' },
      { code: 'vendor_type', name: 'Vendor Type' },
      { code: 'warehouse_type', name: 'Warehouse Type' },
      { code: 'warehouse_status', name: 'Warehouse Status' },
      { code: 'inventory_category', name: 'Inventory Category' },
      { code: 'inventory_unit', name: 'Inventory Unit' },
      { code: 'inventory_brand', name: 'Inventory Brand' },
      { code: 'inventory_condition', name: 'Inventory Condition' },
      { code: 'asset_category', name: 'Asset Category' },
      { code: 'asset_type', name: 'Asset Type' },
      { code: 'asset_status', name: 'Asset Status' },
      { code: 'asset_ownership', name: 'Asset Ownership' },
      { code: 'project_status', name: 'Project Status' },
      { code: 'project_priority', name: 'Project Priority' },
      { code: 'project_type', name: 'Project Type' },
      { code: 'task_status', name: 'Task Status' },
      { code: 'task_priority', name: 'Task Priority' },
      { code: 'ticket_category', name: 'Ticket Category' },
      { code: 'ticket_priority', name: 'Ticket Priority' },
      { code: 'ticket_impact', name: 'Ticket Impact' },
      { code: 'ticket_urgency', name: 'Ticket Urgency' },
      { code: 'ticket_status', name: 'Ticket Status' },
      { code: 'ticket_source', name: 'Ticket Source' },
      { code: 'resolution_code', name: 'Resolution Code' },
      { code: 'sla_level', name: 'SLA Level' },
      { code: 'invoice_status', name: 'Invoice Status' },
      { code: 'payment_status', name: 'Payment Status' },
      { code: 'payment_method', name: 'Payment Method' },
      { code: 'expense_category', name: 'Expense Category' },
      { code: 'tax_type', name: 'Tax Type' },
      { code: 'attendance_status', name: 'Attendance Status' },
      { code: 'leave_type', name: 'Leave Type' },
      { code: 'shift_type', name: 'Shift Type' },
      { code: 'training_category', name: 'Training Category' },
      { code: 'performance_category', name: 'Performance Category' }
    ];
    
    for (const group of referenceGroups) {
      await db.insert(schema.referenceGroups).values({
        id: 'RG-' + Math.random().toString(36).substr(2, 9),
        code: group.code,
        name: group.name,
        isSystem: true
      });
    }

    // Insert some default values for some common ones
    // We fetch groups to get their IDs
    const groups = await db.select().from(schema.referenceGroups);
    const getGroupId = (code) => groups.find(g => g.code === code)?.id;

    const defaultValues = [];
    
    // Gender
    const genderId = getGroupId('gender');
    if (genderId) {
      defaultValues.push({ id: 'RV-G1', groupId: genderId, code: 'MALE', name: 'Male', sortOrder: 1 });
      defaultValues.push({ id: 'RV-G2', groupId: genderId, code: 'FEMALE', name: 'Female', sortOrder: 2 });
    }

    // Asset Category
    const assetCatId = getGroupId('asset_category');
    if (assetCatId) {
      defaultValues.push({ id: 'RV-AC1', groupId: assetCatId, code: 'HARDWARE', name: 'Hardware', sortOrder: 1 });
      defaultValues.push({ id: 'RV-AC2', groupId: assetCatId, code: 'SOFTWARE', name: 'Software', sortOrder: 2 });
      defaultValues.push({ id: 'RV-AC3', groupId: assetCatId, code: 'FURNITURE', name: 'Furniture', sortOrder: 3 });
      defaultValues.push({ id: 'RV-AC4', groupId: assetCatId, code: 'VEHICLE', name: 'Vehicle', sortOrder: 4 });
      defaultValues.push({ id: 'RV-AC5', groupId: assetCatId, code: 'OTHER', name: 'Other', sortOrder: 5 });
    }

    // Asset Status
    const assetStatId = getGroupId('asset_status');
    if (assetStatId) {
      defaultValues.push({ id: 'RV-AS1', groupId: assetStatId, code: 'ACTIVE', name: 'Active', sortOrder: 1 });
      defaultValues.push({ id: 'RV-AS2', groupId: assetStatId, code: 'MAINTENANCE', name: 'Maintenance', sortOrder: 2 });
      defaultValues.push({ id: 'RV-AS3', groupId: assetStatId, code: 'RETIRED', name: 'Retired', sortOrder: 3 });
    }

    // Project Status
    const projStatId = getGroupId('project_status');
    if (projStatId) {
      defaultValues.push({ id: 'RV-PS1', groupId: projStatId, code: 'ACTIVE', name: 'Active', sortOrder: 1 });
      defaultValues.push({ id: 'RV-PS2', groupId: projStatId, code: 'COMPLETED', name: 'Completed', sortOrder: 2 });
      defaultValues.push({ id: 'RV-PS3', groupId: projStatId, code: 'DELAYED', name: 'Delayed', sortOrder: 3 });
      defaultValues.push({ id: 'RV-PS4', groupId: projStatId, code: 'PLANNING', name: 'Planning', sortOrder: 4 });
    }
    
    // Ticket Status
    const ticketStatId = getGroupId('ticket_status');
    if (ticketStatId) {
      defaultValues.push({ id: 'RV-TS1', groupId: ticketStatId, code: 'OPEN', name: 'Open', sortOrder: 1 });
      defaultValues.push({ id: 'RV-TS2', groupId: ticketStatId, code: 'IN_PROGRESS', name: 'In Progress', sortOrder: 2 });
      defaultValues.push({ id: 'RV-TS3', groupId: ticketStatId, code: 'RESOLVED', name: 'Resolved', sortOrder: 3 });
      defaultValues.push({ id: 'RV-TS4', groupId: ticketStatId, code: 'CLOSED', name: 'Closed', sortOrder: 4 });
    }

    // Ticket Priority
    const ticketPrioId = getGroupId('ticket_priority');
    if (ticketPrioId) {
      defaultValues.push({ id: 'RV-TP1', groupId: ticketPrioId, code: 'LOW', name: 'Low', sortOrder: 1 });
      defaultValues.push({ id: 'RV-TP2', groupId: ticketPrioId, code: 'MEDIUM', name: 'Medium', sortOrder: 2 });
      defaultValues.push({ id: 'RV-TP3', groupId: ticketPrioId, code: 'HIGH', name: 'High', sortOrder: 3 });
      defaultValues.push({ id: 'RV-TP4', groupId: ticketPrioId, code: 'CRITICAL', name: 'Critical', sortOrder: 4 });
    }

    // Payment Status
    const paymentStatId = getGroupId('payment_status');
    if (paymentStatId) {
      defaultValues.push({ id: 'RV-PAYS1', groupId: paymentStatId, code: 'UNPAID', name: 'Unpaid', sortOrder: 1 });
      defaultValues.push({ id: 'RV-PAYS2', groupId: paymentStatId, code: 'PARTIAL', name: 'Partial', sortOrder: 2 });
      defaultValues.push({ id: 'RV-PAYS3', groupId: paymentStatId, code: 'PAID', name: 'Paid', sortOrder: 3 });
    }

    if (defaultValues.length > 0) {
      await db.insert(schema.referenceValues).values(defaultValues);
    }
  }
`;

serverCode = serverCode.replace("const usersCount = await db.select().from(schema.users);", referenceSeedCode + "\n\n  const usersCount = await db.select().from(schema.users);");

fs.writeFileSync('server.ts', serverCode);
