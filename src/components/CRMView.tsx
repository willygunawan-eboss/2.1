import React, { useState, useEffect } from 'react';
import { 
  Users, Target, BarChart3, Search, Filter, Plus, Phone, Mail, 
  MessageCircle, Briefcase, Calendar, ChevronRight, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { CustomerMasterView } from './CustomerMasterView';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export function CRMView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'leads' | 'customers' | 'activities'>('dashboard');
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    window.addEventListener('refetch-crm', fetchData);
    return () => window.removeEventListener('refetch-crm', fetchData);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, custRes, actRes] = await Promise.all([
        fetch('/api/leads').then(res => res.json()),
        fetch('/api/customers').then(res => res.json()),
        fetch('/api/activities').then(res => res.json())
      ]);
      if (leadsRes.success) setLeads(leadsRes.data || []);
      if (custRes.success) setCustomers(custRes.data || []);
      if (actRes.success) setActivities(actRes.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'dashboard', label: 'CRM Dashboard', icon: BarChart3 },
    { id: 'pipeline', label: 'Sales Pipeline', icon: Target },
    { id: 'leads', label: 'Leads Management', icon: Users },
    { id: 'customers', label: 'Customers', icon: Briefcase },
    { id: 'activities', label: 'Activities & Follow-ups', icon: Calendar },
  ] as const;

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
      <div className="p-4 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CRM & Leads</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage customer relationships and sales pipeline.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchData}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              onClick={() => {
                 // Should open a new Lead or Customer modal based on active tab.
                 alert("Functionality to be implemented.");
              }}
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'customers' ? 'New Customer' : 'New Lead'}
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 gap-6">
          {tabs.map(tab => {
             const Icon = tab.icon;
             return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
             );
          })}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
        {loading && <div className="text-center p-8 text-slate-500">Loading CRM data...</div>}
        {!loading && activeTab === 'dashboard' && <CRMDashboard leads={leads} customers={customers} activities={activities} />}
        {!loading && activeTab === 'pipeline' && <SalesPipeline leads={leads} />}
        {!loading && activeTab === 'leads' && <LeadsList leads={leads} />}
        {!loading && activeTab === 'customers' && <CustomerMasterView />}
        {!loading && activeTab === 'activities' && <ActivitiesList activities={activities} />}
      </div>
    </div>
  );
}

function CRMDashboard({ leads, customers, activities }: { leads: any[], customers: any[], activities: any[] }) {
  const formatCurrency = (val: number) => `Rp ${(val / 1000000).toFixed(1)} Jt`;
  
  const pipelineValue = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const wonDealsCount = leads.filter(l => l.status === 'Won').length;
  const lostDealsCount = leads.filter(l => l.status === 'Lost').length;
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((wonDealsCount / totalLeads) * 100) : 0;

  const funnelData = [
    { name: 'New Leads', value: newLeadsCount },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length },
    { name: 'Proposal', value: leads.filter(l => l.status === 'Proposal').length },
    { name: 'Negotiation', value: leads.filter(l => l.status === 'Negotiation').length },
    { name: 'Won', value: wonDealsCount },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">New Leads</h3>
          <p className="text-2xl font-bold text-slate-900">{newLeadsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Pipeline Value</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(pipelineValue)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Won Deals</h3>
          <p className="text-2xl font-bold text-emerald-600">{wonDealsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Lost Deals</h3>
          <p className="text-2xl font-bold text-rose-600">{lostDealsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium mb-1">Conversion Rate</h3>
          <p className="text-2xl font-bold text-indigo-600">{conversionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Funnel</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 50, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#10b981'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {activities.length === 0 ? (
               <p className="text-slate-500 text-sm text-center py-4">No recent activities.</p>
            ) : (
               activities.slice(0, 6).map((act, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className={`p-2 rounded-full ${
                    act.type === 'Call' ? 'bg-blue-100 text-blue-600' :
                    act.type === 'Email' ? 'bg-purple-100 text-purple-600' :
                    act.type === 'Meeting' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {act.type === 'Call' && <Phone className="w-4 h-4" />}
                    {act.type === 'Email' && <Mail className="w-4 h-4" />}
                    {act.type === 'Meeting' && <Users className="w-4 h-4" />}
                    {act.type === 'WhatsApp' && <MessageCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{act.type} with {act.referenceType} ({act.referenceId})</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{act.notes}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(act.date).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesPipeline({ leads }: { leads: any[] }) {
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
  
  return (
    <div className="h-full min-h-[600px] flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {stages.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage);
        return (
          <div key={stage} className="min-w-[300px] w-[300px] flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
            <div className="p-3 border-b border-slate-200 bg-slate-100/80 rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{stage}</h3>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-semibold text-slate-500 shadow-sm border border-slate-200">
                {stageLeads.length}
              </span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
              {stageLeads.map(lead => (
                <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{lead.companyName}</h4>
                    {lead.score > 70 && <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Hot</span>}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{lead.pic} • {lead.productInterest}</p>
                  <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-emerald-600">
                      Rp {(lead.estimatedValue / 1000000).toFixed(1)} Jt
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{lead.id}</span>
                  </div>
                </div>
              ))}
              {stageLeads.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  No deals
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeadsList({ leads }: { leads: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-base font-bold text-slate-900">All Leads</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
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
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Contact (PIC)</th>
              <th className="px-6 py-3">Interest</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Value (IDR)</th>
              <th className="px-6 py-3 text-center">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No leads found. Create one.</td></tr>
            ) : (
              leads.map((lead, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{lead.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{lead.companyName}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-medium text-slate-900">{lead.pic}</div>
                    <div className="text-xs">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.productInterest}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                      lead.status === 'Won' ? 'bg-emerald-100 text-emerald-700' :
                      lead.status === 'Lost' ? 'bg-rose-100 text-rose-700' :
                      lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 text-right">{lead.estimatedValue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{lead.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersList({ customers }: { customers: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-base font-bold text-slate-900">Customer Master Data</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Customer Name</th>
              <th className="px-6 py-3">Contact Person</th>
              <th className="px-6 py-3">Contact Info</th>
              <th className="px-6 py-3">NPWP</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {customers.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No customers found.</td></tr>
            ) : (
              customers.map((cust, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{cust.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{cust.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{cust.pic}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="text-xs">{cust.email}</div>
                    <div className="text-xs">{cust.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">{cust.npwp || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                      cust.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivitiesList({ activities }: { activities: any[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-base font-bold text-slate-900">Activity Logs</h3>
        <div className="flex gap-2 w-full sm:w-auto">
           <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors w-full sm:w-auto">
             <Plus className="w-4 h-4" /> Log Activity
           </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Related To</th>
              <th className="px-6 py-3">Notes</th>
              <th className="px-6 py-3">Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {activities.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No activities logged.</td></tr>
            ) : (
              activities.map((act, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">{new Date(act.date).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                      act.type === 'Call' ? 'bg-blue-100 text-blue-700' :
                      act.type === 'Email' ? 'bg-purple-100 text-purple-700' :
                      act.type === 'Meeting' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {act.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{act.referenceType}</div>
                    <div className="text-xs text-slate-500 font-mono">{act.referenceId}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-md">{act.notes}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{act.performedBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
