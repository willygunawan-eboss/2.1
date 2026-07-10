
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, RotateCcw, Eye, ChevronLeft, ChevronRight, RefreshCw, X, AlertTriangle, Clock, CheckCircle2, XCircle, Activity, Users, ShieldAlert, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export function HelpdeskView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ statusId: '', priorityId: '', categoryId: '', assignedTo: '' });

  const [dashboard, setDashboard] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    title: '', description: '', customerId: '', categoryId: '', subCategoryId: '', 
    priorityId: '', impactId: '', urgencyId: '', assetId: '', assignedTo: '', reportedBy: '', statusId: ''
  });

  const [references, setReferences] = useState<any>({
    customers: [], employees: [], assets: [], categories: [], subCategories: [], priorities: [], impacts: [], urgencies: [], statuses: []
  });

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchDashboard();
  }, [page, search, sortBy, sortOrder, filters]);

  const fetchReferences = async () => {
    try {
      const res = await fetch('/api/tickets/references/all');
      const data = await res.json();
      if (data.success) {
        setReferences(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/tickets/dashboard-stats');
      const data = await res.json();
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const filterQuery = new URLSearchParams(filters as any).toString();
      const res = await fetch(`/api/tickets?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&sortOrder=${sortOrder}&${filterQuery}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);
        setTotal(data.pagination.total);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getPriorityColor = (priorityName: string) => {
    switch (priorityName?.toLowerCase()) {
      case 'critical': return 'bg-rose-100 text-rose-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName?.toLowerCase()) {
      case 'new': return 'bg-sky-100 text-sky-700';
      case 'in progress': return 'bg-indigo-100 text-indigo-700';
      case 'pending customer': return 'bg-fuchsia-100 text-fuchsia-700';
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      case 'closed': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openCreateModal = () => {
    setFormMode('create');
    
    // Default values if exist
    const defCategory = references.categories[0]?.id || '';
    const defSubCategory = references.subCategories.find((s)=>s.categoryId === defCategory)?.id || '';
    
    setFormData({
      title: '', description: '', customerId: '', 
      categoryId: defCategory, 
      subCategoryId: defSubCategory, 
      priorityId: references.priorities[0]?.id || '', 
      impactId: references.impacts[0]?.id || '', 
      urgencyId: references.urgencies[0]?.id || '', 
      assetId: '', assignedTo: '', reportedBy: '', statusId: references.statuses[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ticket: any) => {
    setFormMode('edit');
    setCurrentTicket(ticket);
    setFormData({
      title: ticket.title || '',
      description: ticket.description || '',
      customerId: ticket.customerId || '',
      categoryId: ticket.categoryId || '',
      subCategoryId: ticket.subCategoryId || '',
      priorityId: ticket.priorityId || '',
      impactId: ticket.impactId || '',
      urgencyId: ticket.urgencyId || '',
      assetId: ticket.assetId || '',
      assignedTo: ticket.assignedTo || '',
      reportedBy: ticket.reportedBy || '',
      statusId: ticket.statusId || ''
    });
    setIsModalOpen(true);
  };

  const openDetailModal = (ticket: any) => {
    setCurrentTicket(ticket);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Are you sure you want to restore this ticket?')) return;
    try {
      const res = await fetch(`/api/tickets/${id}/restore`, { method: 'POST' });
      if (res.ok) fetchTickets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const url = formMode === 'create' ? '/api/tickets' : `/api/tickets/${currentTicket.id}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchTickets();
        fetchDashboard();
      } else {
        const error = await res.json();
        alert(`Validation Error: \n${error.error?.map ? error.error.map((e:any) => e.message).join('\n') : JSON.stringify(error.error)}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#0ea5e9'];

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full relative">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise IT Service Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage support tickets, incidents, and requests.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { fetchTickets(); fetchDashboard(); }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Ticket
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        
        {dashboard && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3">
              {[
                { label: 'Open Tickets', value: dashboard.kpi.openTickets, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Critical Tickets', value: dashboard.kpi.criticalTickets, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Waiting Customer', value: dashboard.kpi.waitingCustomerTickets, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Resolved Today', value: dashboard.kpi.resolvedToday, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Closed Today', value: dashboard.kpi.closedToday, icon: XCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
                { label: 'SLA Compliance', value: `${dashboard.kpi.slaCompliance}%`, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'SLA Breach', value: dashboard.kpi.slaBreach, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Avg Response', value: `${dashboard.kpi.avgResponseTime}h`, icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'Avg Resolution', value: `${dashboard.kpi.avgResolutionTime}h`, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
                { label: 'Engineer Utilization', value: `${dashboard.kpi.engineerUtilization}%`, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className={`p-1.5 rounded-lg mb-2 ${kpi.bg} ${kpi.color}`}>
                    <kpi.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">{kpi.label}</h3>
                  <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Trend Ticket */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-900">Trend Ticket (7 Days)</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.charts.trendTicket}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Ticket */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-900">Status Ticket</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard.charts.statusTicket} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {dashboard.charts.statusTicket.map((entry:any, index:number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Kategori Ticket */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-900">Kategori Ticket</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard.charts.categoryTicket} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {dashboard.charts.categoryTicket.map((entry:any, index:number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Prioritas Ticket */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-900">Prioritas Ticket</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard.charts.priorityTicket} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {dashboard.charts.priorityTicket.map((entry:any, index:number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Beban Kerja Engineer */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-900">Beban Kerja Engineer</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.charts.workloadEngineer} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                      <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </>
        )}
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Ticket Register</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-4 border-b border-slate-100 bg-slate-50 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.statusId} onChange={e => { setFilters({...filters, statusId: e.target.value}); setPage(1); }}>
                  <option value="">All Statuses</option>
                  {references.statuses.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Priority</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.priorityId} onChange={e => { setFilters({...filters, priorityId: e.target.value}); setPage(1); }}>
                  <option value="">All Priorities</option>
                  {references.priorities.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.categoryId} onChange={e => { setFilters({...filters, categoryId: e.target.value}); setPage(1); }}>
                  <option value="">All Categories</option>
                  {references.categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Engineer</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.assignedTo} onChange={e => { setFilters({...filters, assignedTo: e.target.value}); setPage(1); }}>
                  <option value="">All Engineers</option>
                  {references.employees.map((e:any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortBy('ticketNumber'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Ticket Number {sortBy === 'ticketNumber' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                  <th className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortBy('title'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Subject {sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortBy('priorityId'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Priority {sortBy === 'priorityId' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                  <th className="px-6 py-3">Engineer</th>
                  <th className="px-6 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortBy('statusId'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Status {sortBy === 'statusId' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No records found. Click "Create Ticket" to get started.</td></tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className={`hover:bg-slate-50 transition-colors ${ticket.deletedAt ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">{ticket.ticketNumber}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{ticket.title}</td>
                      <td className="px-6 py-4 text-slate-600">{references.customers.find((c:any) => c.id === ticket.customerId)?.name || '-'}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          const priorityName = references.priorities.find((p:any) => p.id === ticket.priorityId)?.name || 'Normal';
                          return (
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${getPriorityColor(priorityName)}`}>
                               {priorityName}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{references.employees.find((e:any) => e.id === ticket.assignedTo)?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          const statusName = references.statuses.find((s:any) => s.id === ticket.statusId)?.name || 'New';
                          return (
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${getStatusColor(statusName)}`}>
                               {statusName}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openDetailModal(ticket)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                          {!ticket.deletedAt && (
                            <>
                              <button onClick={() => openEditModal(ticket)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(ticket.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                          {ticket.deletedAt && (
                            <button onClick={() => handleRestore(ticket.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Restore"><RotateCcw className="w-4 h-4" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results</div>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              ><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-3 py-1 font-medium text-slate-700">Page {page} of {totalPages || 1}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              ><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{formMode === 'create' ? 'Create Ticket' : 'Edit Ticket'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={4} className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                    <option value="">Select Customer</option>
                    {references.customers.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PIC (Reported By)</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.reportedBy} onChange={e => setFormData({...formData, reportedBy: e.target.value})}>
                    <option value="">Select PIC</option>
                    {references.employees.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})}>
                    <option value="">Select Asset</option>
                    {references.assets.map((a:any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.categoryId} onChange={e => {
                      const newCat = e.target.value;
                      const defaultSub = references.subCategories.find((s:any)=>s.categoryId === newCat)?.id || '';
                      setFormData({...formData, categoryId: newCat, subCategoryId: defaultSub});
                    }}>
                    <option value="">Select Category</option>
                    {references.categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subcategory</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.subCategoryId} onChange={e => setFormData({...formData, subCategoryId: e.target.value})}>
                    <option value="">Select Subcategory</option>
                    {references.subCategories.filter((sc:any)=>sc.categoryId === formData.categoryId).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.priorityId} onChange={e => setFormData({...formData, priorityId: e.target.value})}>
                    <option value="">Select Priority</option>
                    {references.priorities.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Impact</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.impactId} onChange={e => setFormData({...formData, impactId: e.target.value})}>
                    <option value="">Select Impact</option>
                    {references.impacts.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.urgencyId} onChange={e => setFormData({...formData, urgencyId: e.target.value})}>
                    <option value="">Select Urgency</option>
                    {references.urgencies.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.statusId} onChange={e => setFormData({...formData, statusId: e.target.value})}>
                    <option value="">Select Status</option>
                    {references.statuses.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign To Engineer</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                    <option value="">Unassigned</option>
                    {references.employees.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSubmit} type="button" className="px-4 py-2 bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 rounded-lg transition-colors">Save Ticket</button>
            </div>
          </div>
        </div>
      )}

      {isDetailOpen && currentTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentTicket.ticketNumber}</h2>
                <p className="text-sm text-slate-500">{new Date(currentTicket.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{currentTicket.title}</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">{currentTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Customer</p>
                  <p className="font-semibold">{references.customers.find((c:any) => c.id === currentTicket.customerId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Asset</p>
                  <p className="font-semibold">{references.assets.find((c:any) => c.id === currentTicket.assetId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Category</p>
                  <p className="font-semibold">{references.categories.find((c:any) => c.id === currentTicket.categoryId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Subcategory</p>
                  <p className="font-semibold">{references.subCategories.find((c:any) => c.id === currentTicket.subCategoryId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">PIC (Reported By)</p>
                  <p className="font-semibold">{references.employees.find((c:any) => c.id === currentTicket.reportedBy)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Engineer</p>
                  <p className="font-semibold">{references.employees.find((c:any) => c.id === currentTicket.assignedTo)?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Priority</p>
                  <p className="font-semibold">{references.priorities.find((c:any) => c.id === currentTicket.priorityId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Impact</p>
                  <p className="font-semibold">{references.impacts.find((c:any) => c.id === currentTicket.impactId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Urgency</p>
                  <p className="font-semibold">{references.urgencies.find((c:any) => c.id === currentTicket.urgencyId)?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium mb-1">Status</p>
                  <p className="font-semibold">{references.statuses.find((c:any) => c.id === currentTicket.statusId)?.name || 'New'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
