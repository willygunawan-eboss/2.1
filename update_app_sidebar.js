import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(/import { HRView }.*?\n/g, '');
appContent = appContent.replace(/import { FinanceView }.*?\n/g, '');
appContent = appContent.replace(/import { SalesView }.*?\n/g, '');
appContent = appContent.replace(/import { InventoryView }.*?\n/g, '');
appContent = appContent.replace(/import { ProjectsView }.*?\n/g, '');
appContent = appContent.replace(/import { SettingsView }.*?\n/g, '');
appContent = appContent.replace(/import { CRMView }.*?\n/g, '');
appContent = appContent.replace(/import { PurchaseView }.*?\n/g, '');
appContent = appContent.replace(/import { AssetView }.*?\n/g, '');
appContent = appContent.replace(/import { FieldServiceView }.*?\n/g, '');
appContent = appContent.replace(/import { HelpdeskView }.*?\n/g, '');
appContent = appContent.replace(/import { InvoicingView }.*?\n/g, '');
appContent = appContent.replace(/import { BIView }.*?\n/g, '');
appContent = appContent.replace(/import { DMSView }.*?\n/g, '');
appContent = appContent.replace(/import { KBView }.*?\n/g, '');

const imports = `import { SettingsView } from './components/SettingsView';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { EmployeesView } from './components/EmployeesView';
import { RecruitmentView } from './components/RecruitmentView';
import { TimeView } from './components/TimeView';
import { PayrollView } from './components/PayrollView';
import { ProductivityView } from './components/ProductivityView';
import { CompanyView } from './components/CompanyView';
import { ApplicationsView } from './components/ApplicationsView';
import { IntegrationsView } from './components/IntegrationsView';
import { FinanceView } from './components/FinanceView';`;

appContent = appContent.replace(/import { ModuleId } from '.\/types';/, `${imports}\nimport { ModuleId } from './types';`);

appContent = appContent.replace(/switch \(activeModule\) \{[\s\S]*?default:/, `switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'employee_profile':
        return <EmployeeProfileView />;
      case 'employees':
        return <EmployeesView />;
      case 'recruitment':
        return <RecruitmentView />;
      case 'time':
        return <TimeView />;
      case 'finance':
        return <FinanceView />;
      case 'payroll':
        return <PayrollView />;
      case 'productivity':
        return <ProductivityView />;
      case 'company':
        return <CompanyView />;
      case 'applications':
        return <ApplicationsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'settings':
        return <SettingsView />;
      default:`);

fs.writeFileSync('src/App.tsx', appContent);

let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace(/const navItems[\s\S]*?\];/, `const navItems: { id: ModuleId; label: string; icon: React.ElementType; hasSubmenu?: boolean }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'employee_profile', label: 'Employee Profile', icon: Users },
  { id: 'employees', label: 'Employees', icon: Users, hasSubmenu: true },
  { id: 'recruitment', label: 'Recruitment', icon: Briefcase, hasSubmenu: true },
  { id: 'time', label: 'Time', icon: FileText, hasSubmenu: true },
  { id: 'finance', label: 'Finance', icon: Calculator, hasSubmenu: true },
  { id: 'payroll', label: 'Payroll', icon: CreditCard, hasSubmenu: true },
  { id: 'productivity', label: 'Productivity', icon: BarChart3, hasSubmenu: true },
  { id: 'company', label: 'Company', icon: Database, hasSubmenu: true },
  { id: 'applications', label: 'Applications', icon: FileArchive, hasSubmenu: true },
  { id: 'integrations', label: 'Integrations', icon: BookOpen, hasSubmenu: true },
];`);

fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);
console.log('Done');
