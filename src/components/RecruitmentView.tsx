import React from 'react';
import { Search, Filter, Plus, UserPlus } from 'lucide-react';

export function RecruitmentView() {
  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage job postings, applicants, and interviews.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-slate-500 text-sm font-medium mb-1">Metric {i}</h3>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">0</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Recent Records</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
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
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Applicants</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Closing Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No records found. Click "Create New" to get started.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
