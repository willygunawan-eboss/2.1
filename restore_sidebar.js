import fs from 'fs';

// Restore types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf-8');
typesContent = typesContent.replace(/export type ModuleId = .*/, "export type ModuleId = 'dashboard' | 'crm' | 'sales' | 'purchase' | 'inventory' | 'asset' | 'project' | 'field_service' | 'helpdesk' | 'finance' | 'invoicing' | 'hr' | 'bi' | 'dms' | 'kb' | 'settings';");
fs.writeFileSync('src/types.ts', typesContent);

// Restore Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace(/const navItems: \{ id: ModuleId;[\s\S]*?\];/, `const navItems: { id: ModuleId; label: string; icon: React.ElementType; hasSubmenu?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM & Leads', icon: Users, hasSubmenu: true },
  { id: 'sales', label: 'Penjualan (Sales)', icon: ShoppingCart, hasSubmenu: true },
  { id: 'purchase', label: 'Pengadaan (Purchase)', icon: Briefcase, hasSubmenu: true },
  { id: 'inventory', label: 'Inventaris (Inventory)', icon: Box, hasSubmenu: true },
  { id: 'asset', label: 'Manajemen Aset', icon: Database, hasSubmenu: true },
  { id: 'project', label: 'Manajemen Proyek', icon: Briefcase, hasSubmenu: true },
  { id: 'field_service', label: 'Layanan Lapangan', icon: Wrench, hasSubmenu: true },
  { id: 'helpdesk', label: 'Helpdesk & Tiket', icon: HeadphonesIcon, hasSubmenu: true },
  { id: 'finance', label: 'Keuangan & Akuntansi', icon: Calculator, hasSubmenu: true },
  { id: 'invoicing', label: 'Faktur (Invoicing)', icon: FileText, hasSubmenu: true },
  { id: 'hr', label: 'SDM & Payroll', icon: Users, hasSubmenu: true },
  { id: 'bi', label: 'Business Intelligence', icon: BarChart3, hasSubmenu: true },
  { id: 'dms', label: 'Document Management', icon: FileArchive, hasSubmenu: true },
  { id: 'kb', label: 'Knowledge Base', icon: BookOpen, hasSubmenu: true },
];`);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

// Restore App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// replace the imports
const newImports = `import { HRView } from './components/HRView';
import { FinanceView } from './components/FinanceView';
import { SalesView } from './components/SalesView';
import { InventoryView } from './components/InventoryView';
import { ProjectsView } from './components/ProjectsView';
import { SettingsView } from './components/SettingsView';
import { CRMView } from './components/CRMView';
import { PurchaseView } from './components/PurchaseView';
import { AssetView } from './components/AssetView';
import { FieldServiceView } from './components/FieldServiceView';
import { HelpdeskView } from './components/HelpdeskView';
import { InvoicingView } from './components/InvoicingView';
import { BIView } from './components/BIView';
import { DMSView } from './components/DMSView';
import { KBView } from './components/KBView';`;

appContent = appContent.replace(/import { SettingsView }[\s\S]*?import { FinanceView } from '.\/components\/FinanceView';/, newImports);

appContent = appContent.replace(/switch \(activeModule\) \{[\s\S]*?default:/, `switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'finance':
        return <FinanceView />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'hr':
        return <HRView />;
      case 'project':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      case 'crm':
        return <CRMView />;
      case 'purchase':
        return <PurchaseView />;
      case 'asset':
        return <AssetView />;
      case 'field_service':
        return <FieldServiceView />;
      case 'helpdesk':
        return <HelpdeskView />;
      case 'invoicing':
        return <InvoicingView />;
      case 'bi':
        return <BIView />;
      case 'dms':
        return <DMSView />;
      case 'kb':
        return <KBView />;
      default:`);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Restored');
