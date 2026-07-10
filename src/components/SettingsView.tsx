import React from 'react';
import { Save, Building2, UserCircle, Bell, Shield, Database, Webhook } from 'lucide-react';
import { OrgMasterView } from './OrgMasterView';
import { SystemReadinessView } from './SystemReadinessView';

export function SettingsView() {
  const [activeTab, setActiveTab] = React.useState('company');
  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 mt-1 text-sm">Configure system preferences, company details, and integrations.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 space-y-1">
            <button onClick={() => setActiveTab('company')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'company' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <Building2 className="w-5 h-5 text-blue-600" />
              Company Details
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <UserCircle className="w-5 h-5 text-slate-400" />
              User Management
            </button>
            <button onClick={() => setActiveTab('readiness')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'readiness' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
              <Activity className="w-5 h-5 text-slate-400" />
              System Readiness
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Shield className="w-5 h-5 text-slate-400" />
              Security & Roles
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Database className="w-5 h-5 text-slate-400" />
              Database Backup
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
              <Webhook className="w-5 h-5 text-slate-400" />
              API Integrations
            </button>
          </div>

          {/* Settings Form */}
          <div className="flex-1 min-w-0">
             {activeTab === 'company' && <OrgMasterView />}
            {activeTab === 'readiness' && <SystemReadinessView />}
            {activeTab === 'users' && <div className="p-8 text-slate-500">User Management (Coming Soon)</div>}
          </div>
        </div>
      </div>
    </div>
  );
}