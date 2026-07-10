import React from 'react';
import { LayoutDashboard, Users, ShoppingCart, Briefcase, CreditCard, Box, MoreHorizontal, ChevronRight, Settings, FileText, Database, HeadphonesIcon, BarChart3, BookOpen, Wrench, FileArchive, Calculator } from 'lucide-react';
import { ModuleId } from '../types';
import { useRBAC } from '../contexts/RBACContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeModule: ModuleId;
  onNavigate: (moduleId: ModuleId) => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const navItems: { id: ModuleId; label: string; icon: React.ElementType; hasSubmenu?: boolean }[] = [
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
  { id: 'hr', label: 'HR & Payroll', icon: Users, hasSubmenu: true },
  { id: 'bi', label: 'Business Intelligence', icon: BarChart3, hasSubmenu: true },
  { id: 'dms', label: 'Document Management', icon: FileArchive, hasSubmenu: true },
  { id: 'kb', label: 'Knowledge Base', icon: BookOpen, hasSubmenu: true },
];

export function Sidebar({ activeModule, onNavigate, isOpen = false, setIsOpen }: SidebarProps) {
  const { hasMenu } = useRBAC();
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <aside className={cn(
        "w-64 bg-[#142338] text-slate-300 h-screen fixed left-0 top-0 flex flex-col z-50 font-sans transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
      {/* Subtle background texture/stars to mimic the image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1.5px, transparent 1.5px)', backgroundSize: '150px 150px' }}></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex justify-center items-center">
         <div className="w-96 h-96 bg-blue-400 rounded-full blur-[100px]"></div>
      </div>

      <div className="h-20 flex items-center px-6 relative z-10 pt-4 mb-2">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ichangeboss" className="h-10 object-contain" onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('fallback-sidebar-logo');
            if (fallback) fallback.style.display = 'flex';
          }} />
          <div id="fallback-sidebar-logo" style={{display: 'none'}} className="items-center gap-2">
             <div className="flex items-center justify-center text-sky-400">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                 <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" />
               </svg>
             </div>
             <div>
               <h1 className="font-bold tracking-tight text-xl truncate"><span className="text-[#A3C293]">i</span><span className="text-white">changeboss</span></h1>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar relative z-10">
        <nav className="space-y-1">
          {navItems.map((item) => {
            if (!hasMenu(item.id)) return null;
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group",
                  isActive 
                    ? "bg-white/10 text-white font-semibold" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300")} />
                  <span className="text-[13px]">{item.label}</span>
                </div>
                {item.hasSubmenu && (
                   <ChevronRight className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-6 mb-4">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Administration
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
              activeModule === 'settings'
                ? "bg-white/10 text-white font-semibold" 
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className={cn("w-[18px] h-[18px]", activeModule === 'settings' ? "text-white" : "text-slate-400 group-hover:text-slate-300")} />
            <span className="text-[13px]">System Settings</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
