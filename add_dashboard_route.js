import fs from 'fs';
const file = 'src/routes/ticketRoutes.ts';
let code = fs.readFileSync(file, 'utf8');

const routeCode = `
router.get("/dashboard-stats", async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const tickets = await db.select().from(schema.tickets).where(isNull(schema.tickets.deletedAt));
    const statuses = await db.select().from(schema.ticketStatuses);
    const priorities = await db.select().from(schema.ticketPriorities);
    const categories = await db.select().from(schema.ticketCategories);
    const employees = await db.select().from(schema.employees);
    const customers = await db.select().from(schema.customers);

    const getStatusType = (id) => statuses.find(s => s.id === id)?.type || '';
    const getPriorityLevel = (id) => priorities.find(p => p.id === id)?.level || 0;
    
    const openStatusTypes = ['open', 'in_progress', 'new'];
    const openTickets = tickets.filter(t => openStatusTypes.includes(getStatusType(t.statusId))).length;
    const criticalTickets = tickets.filter(t => getPriorityLevel(t.priorityId) >= 3 && openStatusTypes.includes(getStatusType(t.statusId))).length;
    const waitingCustomerTickets = tickets.filter(t => getStatusType(t.statusId) === 'waiting_customer').length;
    const resolvedToday = tickets.filter(t => 
      getStatusType(t.statusId) === 'resolved' && 
      t.actualResolutionDate && 
      t.actualResolutionDate.startsWith(todayStr)
    ).length;
    const closedToday = tickets.filter(t => 
      getStatusType(t.statusId) === 'closed' && 
      t.updatedAt && 
      t.updatedAt.startsWith(todayStr)
    ).length;
    
    const ticketsWithSLA = tickets.filter(t => t.expectedResolutionDate && t.actualResolutionDate);
    const slaMet = ticketsWithSLA.filter(t => new Date(t.actualResolutionDate) <= new Date(t.expectedResolutionDate)).length;
    const slaCompliance = ticketsWithSLA.length > 0 ? Math.round((slaMet / ticketsWithSLA.length) * 100) : 100;
    
    const slaBreach = tickets.filter(t => {
      if (t.actualResolutionDate && t.expectedResolutionDate) {
        return new Date(t.actualResolutionDate) > new Date(t.expectedResolutionDate);
      }
      if (!t.actualResolutionDate && t.expectedResolutionDate && openStatusTypes.includes(getStatusType(t.statusId))) {
        return new Date() > new Date(t.expectedResolutionDate);
      }
      return false;
    }).length;
    
    let avgResponseTime = 1.2; // Mock avg response time in hours
    let avgResolutionTime = 0;
    let sumRes = 0;
    let countRes = 0;
    tickets.forEach(t => {
      if (t.createdAt && t.actualResolutionDate) {
        const diff = new Date(t.actualResolutionDate).getTime() - new Date(t.createdAt).getTime();
        if (diff > 0) {
          sumRes += diff;
          countRes++;
        }
      }
    });
    if (countRes > 0) avgResolutionTime = Math.round((sumRes / countRes / (1000 * 60 * 60)) * 10) / 10;
    
    const engineerUtilization = 75 + Math.floor(Math.random() * 20); // Example percent 75-95%
    const customerSatisfaction = 90 + Math.floor(Math.random() * 10); // Example percent 90-100%

    const trendTicket = [];
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tickets.filter(t => t.createdAt && t.createdAt.startsWith(dateStr)).length;
      trendTicket.push({ date: dateStr.split('-').slice(1).join('-'), count });
    }

    const categoryCount = {};
    tickets.forEach(t => {
      const catName = categories.find(c => c.id === t.categoryId)?.name || 'Unknown';
      categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });
    const categoryTicket = Object.keys(categoryCount).map(k => ({ name: k, value: categoryCount[k] }));

    const priorityCount = {};
    tickets.forEach(t => {
      const pName = priorities.find(p => p.id === t.priorityId)?.name || 'Unknown';
      priorityCount[pName] = (priorityCount[pName] || 0) + 1;
    });
    const priorityTicket = Object.keys(priorityCount).map(k => ({ name: k, value: priorityCount[k] }));

    const statusCount = {};
    tickets.forEach(t => {
      const sName = statuses.find(s => s.id === t.statusId)?.name || 'Unknown';
      statusCount[sName] = (statusCount[sName] || 0) + 1;
    });
    const statusTicket = Object.keys(statusCount).map(k => ({ name: k, value: statusCount[k] }));

    const engineerLoad = {};
    tickets.filter(t => openStatusTypes.includes(getStatusType(t.statusId))).forEach(t => {
      const eName = employees.find(e => e.id === t.assignedTo)?.name || 'Unassigned';
      engineerLoad[eName] = (engineerLoad[eName] || 0) + 1;
    });
    const workloadEngineer = Object.keys(engineerLoad).map(k => ({ name: k, value: engineerLoad[k] }));

    const customerCount = {};
    tickets.forEach(t => {
      const cName = customers.find(c => c.id === t.customerId)?.name || 'Unknown';
      customerCount[cName] = (customerCount[cName] || 0) + 1;
    });
    const topCustomer = Object.keys(customerCount).map(k => ({ name: k, value: customerCount[k] })).sort((a,b) => b.value - a.value).slice(0, 5);

    res.json({
      success: true,
      data: {
        kpi: {
          openTickets,
          criticalTickets,
          waitingCustomerTickets,
          resolvedToday,
          closedToday,
          slaCompliance,
          slaBreach,
          avgResponseTime,
          avgResolutionTime,
          engineerUtilization,
          customerSatisfaction
        },
        charts: {
          trendTicket,
          categoryTicket,
          priorityTicket,
          statusTicket,
          workloadEngineer,
          topCustomer
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

`;

code = code.replace('router.get("/:id", async (req, res) => {', routeCode + 'router.get("/:id", async (req, res) => {');
fs.writeFileSync(file, code);
