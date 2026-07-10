import React from 'react';
import { useRBAC } from '../contexts/RBACContext';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  disabledMode?: boolean;
}

export function PermissionGate({ permission, children, fallback = null, disabledMode = false }: PermissionGateProps) {
  const { hasPermission } = useRBAC();
  const allowed = hasPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  if (disabledMode) {
    // If disabledMode is true, we need to clone the child and set it to disabled
    if (React.isValidElement(children)) {
      return React.cloneElement(children as any, { 
        disabled: true, 
        className: `${(children.props as any).className || ''} opacity-50 cursor-not-allowed`,
        title: `Requires ${permission} permission`
      });
    }
  }

  return <>{fallback}</>;
}
