import fs from 'fs';
let code = fs.readFileSync('src/contexts/RBACContext.tsx', 'utf8');

code = code.replace(/System Admin/g, 'SUPER_ADMIN');

// Also fix hasMenu logic to check both menus and modules
const oldHasMenu = `  const hasMenu = (menu: string) => {
    if (!rbac) return false;
    if (rbac.roles.includes('SUPER_ADMIN')) return true;
    // Map module ids to Menu names
    const menuMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'crm': 'CRM',
      'sales': 'Sales',
      'purchase': 'Purchase',
      'inventory': 'Inventory',
      'asset': 'Asset',
      'project': 'Project',
      'helpdesk': 'Helpdesk',
      'finance': 'Finance',
      'hr': 'HR',
      'kb': 'Knowledge Base',
      'dms': 'Document',
      'bi': 'BI',
      'settings': 'Settings'
    };
    const menuName = menuMap[menu] || menu;
    return rbac.menus.includes(menuName);
  };`;

const newHasMenu = `  const hasMenu = (menu: string) => {
    if (!rbac) return false;
    if (rbac.roles.includes('SUPER_ADMIN')) return true;
    
    // Also check if module is accessible via permissions
    // modules array was added to RBACData
    const hasModuleAccess = rbac.modules?.includes(menu.toLowerCase());
    
    const menuMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'crm': 'CRM',
      'sales': 'Sales',
      'purchase': 'Purchase',
      'inventory': 'Inventory',
      'asset': 'Asset',
      'project': 'Project',
      'helpdesk': 'Helpdesk',
      'finance': 'Finance',
      'hr': 'HR',
      'kb': 'Knowledge Base',
      'dms': 'Document',
      'bi': 'BI',
      'settings': 'Settings'
    };
    const menuName = menuMap[menu] || menu;
    return rbac.menus.includes(menuName) || hasModuleAccess;
  };`;

code = code.replace(oldHasMenu, newHasMenu);

// add modules to RBACData interface
if (!code.includes('modules?: string[];')) {
  code = code.replace('menus: string[];', 'menus: string[];\n  modules?: string[];');
}

fs.writeFileSync('src/contexts/RBACContext.tsx', code);
