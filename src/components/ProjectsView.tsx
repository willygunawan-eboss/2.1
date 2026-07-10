import { PermissionGate } from './PermissionGate';
import React from 'react';
import { Search, Filter, FolderKanban, ArrowUpRight, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { useProjects } from '../data';
import { cn } from '../lib/utils';

export function ProjectsView() {
  const { data: projects } = useProjects();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage client projects, budgets, and milestones.</p>
          </div>
          <PermissionGate permission="CREATE_PROJECT" disabledMode={true}><button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </button></PermissionGate>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                +2 New
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Active Projects</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">12</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                98% On Time
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Completed (YTD)</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">24</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-rose-50 text-rose-700">
                <ArrowUpRight className="w-3 h-3" />
                Requires Attention
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Delayed Projects</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Project Portfolio</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-3">Project Name</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3 text-right">Budget</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-sm">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  projects.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.id}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">{p.client}</td>
                      <td className="px-6 py-4 text-slate-600">{p.dueDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: p.progress + '%' }}></div>
                          </div>
                          <span className="text-xs text-slate-500 w-8">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
