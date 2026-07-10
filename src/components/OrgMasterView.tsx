import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Building2, MapPin, Network, Layers, Star, Briefcase, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export function OrgMasterView() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'branches', label: 'Branch', icon: MapPin },
    { id: 'divisions', label: 'Division', icon: Network },
    { id: 'departments', label: 'Department', icon: Layers },
    { id: 'job-grades', label: 'Job Grade', icon: Star },
    { id: 'positions', label: 'Position', icon: Briefcase },
    { id: 'employees', label: 'Employee', icon: Users },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 p-2">
        <div className="flex space-x-1 overflow-x-auto custom-scrollbar pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
        <GenericCrud endpoint={activeTab} />
      </div>
    </div>
  );
}

function GenericCrud({ endpoint }: { endpoint: string }) {
  const [data, setData] = useState<any[]>([]);
  const [references, setReferences] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create'|'edit'>('create');
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    fetchData();
  }, [endpoint, page, search]);

  const fetchReferences = async () => {
    try {
      const res = await fetch('/api/org/references/all');
      const json = await res.json();
      if (json.success) {
        setReferences(json.data);
      }
    } catch (e) {}
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/org/${endpoint}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setTotal(json.pagination.total);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/org/${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {}
  };

  const openCreateModal = () => {
    setFormMode('create');
    setFormData({ isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setFormMode('edit');
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const url = formMode === 'create' ? `/api/org/${endpoint}` : `/api/org/${endpoint}/${formData.id}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        fetchReferences(); // Refresh dropdowns
      } else {
        const error = await res.json();
        alert(`Error: \n${JSON.stringify(error.error || error.message)}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev:any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData((prev:any) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev:any) => ({ ...prev, [name]: value }));
    }
  };

  const getColumns = () => {
    switch (endpoint) {
      case 'company': return ['code', 'name', 'phone', 'email', 'isActive'];
      case 'branches': return ['code', 'name', 'companyId', 'phone', 'isActive'];
      case 'divisions': return ['code', 'name', 'companyId', 'isActive'];
      case 'departments': return ['code', 'name', 'divisionId', 'isActive'];
      case 'job-grades': return ['code', 'name', 'level', 'isActive'];
      case 'positions': return ['code', 'name', 'departmentId', 'jobGradeId', 'isActive'];
      case 'employees': return ['employeeNumber', 'name', 'email', 'positionId', 'status'];
      default: return [];
    }
  };

  const columns = getColumns();
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
          />
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {columns.map(c => <th key={c} className="px-6 py-3">{c.replace(/Id$/, '')}</th>)}
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
              ) : data.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map(c => {
                    let val = row[c];
                    if (c === 'isActive') val = val ? <span className="text-emerald-600 font-medium">Yes</span> : <span className="text-rose-600 font-medium">No</span>;
                    if (c === 'companyId') val = references.companies?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'divisionId') val = references.divisions?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'departmentId') val = references.departments?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'jobGradeId') val = references.jobGrades?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'positionId') val = references.positions?.find((x:any) => x.id === val)?.name || val;
                    if (c === 'branchId') val = references.branches?.find((x:any) => x.id === val)?.name || val;
                    return <td key={c} className="px-6 py-3 text-slate-700">{val}</td>
                  })}
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing page {page} of {totalPages || 1}</div>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 capitalize">{formMode} Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-5 overflow-y-auto custom-scrollbar">
              <form id="crud-form" onSubmit={handleSubmit} className="space-y-4">
                {columns.map(c => {
                  if (c === 'isActive') {
                    return (
                      <div key={c} className="flex items-center gap-2">
                         <input type="checkbox" name={c} id={c} checked={formData[c] || false} onChange={handleChange} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                         <label htmlFor={c} className="text-sm font-medium text-slate-700">Is Active</label>
                      </div>
                    )
                  }
                  if (c.endsWith('Id')) {
                    let opts = [];
                    if (c === 'companyId') opts = references.companies || [];
                    if (c === 'divisionId') opts = references.divisions || [];
                    if (c === 'departmentId') opts = references.departments || [];
                    if (c === 'jobGradeId') opts = references.jobGrades || [];
                    if (c === 'positionId') opts = references.positions || [];
                    if (c === 'branchId') opts = references.branches || [];
                    return (
                      <div key={c} className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 capitalize">{c.replace(/Id$/, '')}</label>
                        <select name={c} value={formData[c] || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                          <option value="">Select...</option>
                          {opts.map((o:any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                      </div>
                    )
                  }
                  return (
                    <div key={c} className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700 capitalize">{c.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input 
                        type={c === 'level' ? 'number' : 'text'} 
                        name={c} 
                        value={formData[c] || ''} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                      />
                    </div>
                  );
                })}
              </form>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" form="crud-form" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
