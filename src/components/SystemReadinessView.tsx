import React, { useEffect, useState } from 'react';
import { ShieldCheck, Server, Settings, Users, Building2, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export function SystemReadinessView() {
  const [healthData, setHealthData] = useState<any>(null);
  
  useEffect(() => {
    fetch('/api/system/health').then(res => res.json()).then(data => setHealthData(data.data));
  }, []);

  if (!healthData) return <div className="p-8">Loading...</div>;

  const modules = [
    { name: 'Organization', icon: Building2, status: healthData.status.organization, score: healthData.status.organization === 'OK' ? 100 : 0 },
    { name: 'HR Master', icon: Users, status: healthData.status.hr, score: healthData.status.hr === 'OK' ? 100 : 0 },
    { name: 'RBAC', icon: ShieldCheck, status: healthData.status.rbac, score: healthData.status.rbac === 'OK' ? 100 : 0 },
    { name: 'Reference', icon: Database, status: healthData.status.reference, score: healthData.status.reference === 'OK' ? 100 : 0 },
    { name: 'Finance Master', icon: Server, status: 'PENDING', score: 0 },
    { name: 'CRM Master', icon: Server, status: 'PENDING', score: 0 },
    { name: 'Inventory Master', icon: Server, status: 'PENDING', score: 0 },
    { name: 'ITSM Master', icon: Server, status: 'PENDING', score: 0 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Readiness</h2>
          <p className="text-slate-500">Monitor enterprise initialization status</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-right">
            <p className="text-sm text-slate-500 font-medium">Overall Progress</p>
            <p className="text-2xl font-bold text-blue-600">{healthData.progress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center">
             <div className="text-blue-600 font-bold">{healthData.systemReady ? 'OK' : '!'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map(mod => (
          <div key={mod.name} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                <mod.icon className="w-5 h-5" />
              </div>
              {mod.status === 'OK' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <h4 className="font-semibold text-slate-800">{mod.name}</h4>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className={mod.status === 'OK' ? 'text-green-600' : 'text-amber-600'}>
                {mod.status}
              </span>
              <span className="font-medium text-slate-700">{mod.score}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className={`h-full ${mod.status === 'OK' ? 'bg-green-500' : 'bg-slate-300'}`} style={{ width: `${mod.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
