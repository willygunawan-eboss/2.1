import React, { useState, useEffect } from 'react';
import { useReferences } from '../data';
import { useEmployees } from '../data';
import { PermissionGate } from './PermissionGate';
import { Search, Filter, Plus, Edit2, MapPin, Phone, Mail, Building, Landmark, Link, FileText, Activity, Trash2, X, ChevronRight, Users, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function CustomerMasterView() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { getValuesByGroup } = useReferences();
  const { data: employees } = useEmployees();
  
  const industries = getValuesByGroup('industry') || [];
  const categories = getValuesByGroup('customer_category') || [];
  const priorities = getValuesByGroup('priority') || [];
  const statuses = getValuesByGroup('customer_status') || [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }];

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?search=${searchTerm}`);
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadCustomerDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedCustomer(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const method = data.id ? 'PUT' : 'POST';
      const url = data.id ? `/api/customers/${data.id}` : '/api/customers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setIsFormOpen(false);
        fetchCustomers();
        if (data.id && selectedCustomer?.id === data.id) {
          loadCustomerDetail(data.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      fetchCustomers();
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* List Panel */}
      <div className={cn("flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300", selectedCustomer ? "w-1/3" : "w-full")}>
        <div className="p-4 border-b border-slate-200 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Customers</h2>
            <PermissionGate permission="CREATE_CUSTOMER">
              <button 
                onClick={() => { setSelectedCustomer(null); setIsFormOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </PermissionGate>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
          ) : customers.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No customers found.</div>
          ) : (
            customers.map(c => (
              <button 
                key={c.id} 
                onClick={() => loadCustomerDetail(c.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                  selectedCustomer?.id === c.id 
                    ? "bg-blue-50 border-blue-200" 
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                )}
              >
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span className="font-mono">{c.code}</span>
                    {c.industryId && <span>• {c.industryId}</span>}
                  </div>
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-colors", selectedCustomer?.id === c.id ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400")} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCustomer && (
        <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <CustomerDetail 
            customer={selectedCustomer} 
            onClose={() => setSelectedCustomer(null)}
            onEdit={() => setIsFormOpen(true)}
            onDelete={() => handleDelete(selectedCustomer.id)}
            onRefresh={() => loadCustomerDetail(selectedCustomer.id)}
          />
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <CustomerForm 
          customer={selectedCustomer} 
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          industries={industries}
          categories={categories}
          statuses={statuses}
          employees={employees}
        />
      )}
    </div>
  );
}

// Subcomponents for Detail and Form
function CustomerDetail({ customer, onClose, onEdit, onDelete, onRefresh }: any) {
  const [activeTab, setActiveTab] = useState('info');
  const tabs = [
    { id: 'info', label: 'Information', icon: Building },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'communications', label: 'Communications', icon: MessageCircle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'bank', label: 'Bank Accounts', icon: Landmark },
  ];

  return (
    <>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{customer.code}</span>
                {customer.legalName && <span>{customer.legalName}</span>}
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", customer.statusId === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700')}>
                  {customer.statusId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PermissionGate permission="UPDATE_CUSTOMER">
              <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </PermissionGate>
            <PermissionGate permission="DELETE_CUSTOMER">
              <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </PermissionGate>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex overflow-x-auto border-b border-slate-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {/* Optional Badges for counts */}
              {tab.id === 'contacts' && customer.contacts?.length > 0 && (
                <span className="ml-1.5 bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full">{customer.contacts.length}</span>
              )}
              {tab.id === 'addresses' && customer.addresses?.length > 0 && (
                <span className="ml-1.5 bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full">{customer.addresses.length}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {activeTab === 'info' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Building className="w-4 h-4 text-slate-400"/> Company Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Industry</div>
                  <div className="font-medium text-slate-900">{customer.industryId || '-'}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Category</div>
                  <div className="font-medium text-slate-900">{customer.categoryId || '-'}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">NPWP / Tax ID</div>
                  <div className="font-mono text-slate-900">{customer.npwp || '-'}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Website</div>
                  <div className="font-medium text-blue-600 hover:underline cursor-pointer">{customer.website || '-'}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Phone className="w-4 h-4 text-slate-400"/> Primary Contact Info</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="col-span-2">
                  <div className="text-slate-500 mb-1">Email</div>
                  <div className="font-medium text-slate-900">{customer.email || '-'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-500 mb-1">Phone</div>
                  <div className="font-medium text-slate-900">{customer.phone || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Contact Persons</h3>
              <button className="text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Contact
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {customer.contacts?.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50 hover:bg-blue-50"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-slate-50 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-sm text-slate-500 mb-3">{c.title} • {c.contactType}</div>
                  <div className="space-y-1.5 text-sm">
                    {c.email && <div className="flex items-center gap-2 text-slate-600"><Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}</div>}
                    {c.phone && <div className="flex items-center gap-2 text-slate-600"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}</div>}
                    {c.mobile && <div className="flex items-center gap-2 text-slate-600"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.mobile} (Mobile)</div>}
                  </div>
                </div>
              ))}
              {!customer.contacts?.length && (
                <div className="col-span-2 text-center p-8 bg-white border border-dashed border-slate-300 rounded-xl text-slate-500">
                  No contacts added yet.
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Addresses</h3>
              <button className="text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {customer.addresses?.map((a: any) => (
                <div key={a.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50 hover:bg-blue-50"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-slate-50 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    {a.addressType} {a.isPrimary && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Primary</span>}
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    {a.addressLine1} <br/>
                    {a.addressLine2 && <>{a.addressLine2}<br/></>}
                    {a.city}, {a.state} {a.postalCode} <br/>
                    {a.country}
                  </div>
                  {a.mapsUrl && (
                    <a href={a.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                      <MapPin className="w-3.5 h-3.5" /> View on Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Just a basic form for brevity. The real one would use RHF or state.
function CustomerForm({ customer, onClose, onSave, industries, categories, statuses, employees }: any) {
  const [formData, setFormData] = useState(customer || {
    name: '',
    legalName: '',
    code: '',
    industryId: '',
    categoryId: '',
    statusId: 'Active',
    email: '',
    phone: '',
    website: '',
    npwp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Customer Code</label>
              <input 
                type="text" 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                placeholder="Auto-generated if left blank"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company Name *</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Legal Name</label>
              <input 
                type="text" 
                value={formData.legalName}
                onChange={e => setFormData({...formData, legalName: e.target.value})}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Industry</label>
              <select 
                value={formData.industryId}
                onChange={e => setFormData({...formData, industryId: e.target.value})}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select Industry...</option>
                {industries.map((r: any) => <option key={r.id} value={r.value}>{r.label}</option>)}
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </form>
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}

// We need a dummy Users/MessageCircle icon imports in the actual file. 
// I have imported them.
