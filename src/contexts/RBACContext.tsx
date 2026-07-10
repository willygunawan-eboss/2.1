import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RBACData {
  roles: string[];
  permissions: string[];
  menus: string[];
}

interface RBACContextType {
  rbac: RBACData | null;
  loading: boolean;
  hasPermission: (perm: string) => boolean;
  hasRole: (role: string) => boolean;
  hasMenu: (menu: string) => boolean;
  refresh: () => void;
}

const RBACContext = createContext<RBACContextType>({
  rbac: null,
  loading: true,
  hasPermission: () => false,
  hasRole: () => false,
  hasMenu: () => false,
  refresh: () => {}
});

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const [rbac, setRbac] = useState<RBACData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRBAC = async () => {
    try {
      const res = await fetch('/api/rbac/context');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRbac(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch RBAC context', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRBAC();
  }, []);

  const hasPermission = (perm: string) => {
    if (!rbac) return false;
    if (rbac.roles.includes('System Admin')) return true;
    return rbac.permissions.includes(perm);
  };

  const hasRole = (role: string) => {
    if (!rbac) return false;
    if (rbac.roles.includes('System Admin')) return true;
    return rbac.roles.includes(role);
  };

  const hasMenu = (menu: string) => {
    if (!rbac) return false;
    if (rbac.roles.includes('System Admin')) return true;
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
  };

  return (
    <RBACContext.Provider value={{ rbac, loading, hasPermission, hasRole, hasMenu, refresh: fetchRBAC }}>
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  return useContext(RBACContext);
}
