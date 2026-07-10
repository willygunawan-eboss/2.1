import { useReferences } from '../data';
import { PermissionGate } from './PermissionGate';
import React, { useState, useMemo } from 'react';
import { useEmployees } from '../data';
import { Search, Filter, Plus, Database, FileText, FileSpreadsheet, Download, X, Laptop, Building2, MonitorSmartphone, Wrench } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Types
interface Asset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  purchaseDate: string;
  currentValue: number;
  status: 'Active' | 'Maintenance' | 'Retired';
  serialNumber?: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  assignedTo?: string;
  assignedEmployeeName?: string;
}

export function AssetView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { data: employees } = useEmployees();

  React.useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const json = await res.json();
        setAssets(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const { getValuesByGroup: getRefs } = useReferences();
  const assetCategories = getRefs('asset_category');
  const assetStatuses = getRefs('asset_status');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    assetId: `AST-005`,
    name: '',
    category: 'Hardware',
    purchaseDate: new Date().toISOString().split('T')[0],
    currentValue: '',
    serialNumber: '',
    status: 'Active'
  });

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => 
      asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serialNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Asset Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ["Asset ID", "Name", "Category", "Purchase Date", "Assigned To", "Status", "Value (Rp)"];
    const tableRows = filteredAssets.map(asset => [
      asset.assetId,
      asset.name,
      asset.category,
      asset.purchaseDate,
      asset.assignedEmployeeName || '-',
      asset.status,
      asset.currentValue.toString()
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] } // Indigo 600
    });

    doc.save('asset_report.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAssets.map(asset => ({
      'Asset ID': asset.assetId,
      'Asset Name': asset.name,
      'Category': asset.category,
      'Purchase Date': asset.purchaseDate,
      'Assigned To': asset.assignedEmployeeName || '-',
      'Status': asset.status,
      'Current Value (Rp)': asset.currentValue
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');
    
    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Asset ID
      { wch: 30 }, // Asset Name
      { wch: 15 }, // Category
      { wch: 15 }, // Purchase Date
      { wch: 25 }, // Assigned To
      { wch: 15 }, // Status
      { wch: 20 }, // Current Value
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'asset_report.xlsx');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.currentValue) return;

    const newAsset = {
      id: 'AST-' + Date.now(),
      assetId: formData.assetId,
      name: formData.name,
      category: formData.category,
      serialNumber: formData.serialNumber,
      purchaseDate: formData.purchaseDate,
      currentValue: parseFloat(formData.currentValue as string) || 0,
      status: formData.status,
      assignedTo: (formData as any).assignedTo || null,
      assignedEmployeeName: (formData as any).assignedEmployeeName || null,
      lastModifiedBy: 'User',
      lastModifiedAt: new Date().toLocaleString()
    };

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset)
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (e) {
      console.error(e);
    }
    setIsFormOpen(false);
    
    // Reset form
    setFormData({
      assetId: `AST-00${assets.length + 2}`,
      name: '',
      category: 'Hardware',
      purchaseDate: new Date().toISOString().split('T')[0],
      currentValue: '',
      status: 'Active'
    });
  };

  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    
    const updatedAsset = {
      ...editingAsset,
      lastModifiedBy: 'User',
      lastModifiedAt: new Date().toLocaleString()
    };

    try {
      const res = await fetch(`/api/assets/${editingAsset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAsset)
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (e) {
      console.error(e);
    }
    setIsEditFormOpen(false);
    setEditingAsset(null);
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Asset Directory", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Asset ID', 'Name', 'Category', 'Serial Number', 'Purchase Date', 'Current Value (Rp)', 'Status', 'Last Modified']],
      body: filteredAssets.map(a => [
        a.assetId, 
        a.name, 
        a.category, 
        a.serialNumber || '-', 
        a.purchaseDate, 
        a.currentValue.toLocaleString("id-ID"), 
        a.status,
        a.lastModifiedBy ? `${a.lastModifiedBy} (${a.lastModifiedAt})` : '-'
      ]),
    });
    doc.save("Asset_Directory.pdf");
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const data = filteredAssets.map(a => ({
      'Asset ID': a.assetId,
      'Name': a.name,
      'Category': a.category,
      'Serial Number / Barcode': a.serialNumber || '-',
      'Purchase Date': a.purchaseDate,
      'Current Value (Rp)': a.currentValue,
      'Status': a.status,
      'Last Modified By': a.lastModifiedBy || '-',
      'Last Modified At': a.lastModifiedAt || '-'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
    XLSX.writeFile(workbook, "Asset_Directory.xlsx");
    setShowExportMenu(false);
  };

  const activeAssets = assets.filter(a => a.status === 'Active').length;
  const maintenanceRetiredAssets = assets.filter(a => a.status === 'Maintenance' || a.status === 'Retired').length;

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Asset Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage fixed assets, tracking, and depreciation.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleExportPDF}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 group"
            >
              <FileText className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              Export PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 group"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              Export Excel
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 pt-4 overflow-y-auto space-y-6 custom-scrollbar">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-blue-100 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Assets Value</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">Rp {totalValue.toLocaleString("id-ID")}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-emerald-100 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Laptop className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Active Assets</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{activeAssets}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-amber-100 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Maintenance & Retired</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{maintenanceRetiredAssets}</p>
            </div>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-800">Asset Directory</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by ID, name, category..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                Filter
              </button>
              
              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm w-full"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                    <button onClick={exportToPDF} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 font-medium">
                      <FileText className="w-4 h-4 text-rose-500" /> Export to PDF
                    </button>
                    <button onClick={exportToExcel} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left font-medium">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export to Excel
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4">Asset ID</th>
                  <th className="px-6 py-4">Serial / Barcode</th>
                  <th className="px-6 py-4">Asset Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Assigned To</th><th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Current Value</th>
                  <th className="px-6 py-4">Last Modified</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-bold text-blue-600">{asset.assetId}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{asset.serialNumber || "-"}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{asset.name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white shadow-sm text-slate-600 text-xs font-medium border border-slate-200">
                          {asset.category === 'Hardware' ? <Laptop className="w-3.5 h-3.5 text-blue-500" /> : <Building2 className="w-3.5 h-3.5 text-amber-500" />}
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {asset.assignedEmployeeName || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                          asset.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          asset.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        Rp {asset.currentValue.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {asset.lastModifiedBy ? (
                          <div>
                            <span className="font-semibold">{asset.lastModifiedBy}</span>
                            <div className="text-[10px]">{asset.lastModifiedAt}</div>
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <PermissionGate permission='DELETE_ASSET'>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingAsset(asset); setIsEditFormOpen(true); }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                        </PermissionGate>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Database className="w-12 h-12 text-slate-200 mb-3" />
                        <p className="text-base font-medium text-slate-600">No assets found</p>
                        <p className="text-sm mt-1">Try adjusting your search or create a new asset.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create New Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onClick={() => setIsFormOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 font-display">Create New Asset</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors bg-white shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Asset ID</label>
                  <input 
                    type="text" 
                    value={formData.assetId}
                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {assetCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Serial Number / Barcode</label>
                <input 
                  type="text" 
                  value={formData.serialNumber || ""}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  placeholder="e.g. SN-XYZ-123"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Asset Name / Description</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. MacBook Pro M3 Max 32GB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Purchase Date</label>
                  <input 
                    type="date" 
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Initial Value (Rp)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-slate-400 font-medium">Rp </span>
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.currentValue}
                      onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Assigned To (Employee)</label>
                <div className="relative">
                  <select 
                    value={formData.assignedToId || ''}
                    onChange={(e) => {
                      const emp = employees.find((emp: any) => emp.id === e.target.value);
                      setFormData({...formData, assignedToId: e.target.value});
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">-- Not Assigned --</option>
                    {employees?.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <div className="relative">
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Status</option>
                    {assetStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {isEditFormOpen && editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onClick={() => setIsEditFormOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 font-display">Edit Asset</h3>
              <button 
                onClick={() => setIsEditFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors bg-white shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Asset ID</label>
                  <input 
                    type="text" 
                    value={editingAsset.assetId}
                    onChange={(e) => setEditingAsset({...editingAsset, assetId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <div className="relative">
                    <select 
                      value={editingAsset.category}
                      onChange={(e) => setEditingAsset({...editingAsset, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {assetCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Serial Number / Barcode</label>
                <input 
                  type="text" 
                  value={editingAsset.serialNumber || ""}
                  onChange={(e) => setEditingAsset({...editingAsset, serialNumber: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Asset Name / Description</label>
                <input 
                  type="text" 
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Purchase Date</label>
                  <input 
                    type="date" 
                    value={editingAsset.purchaseDate}
                    onChange={(e) => setEditingAsset({...editingAsset, purchaseDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Current Value (Rp)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <span className="text-slate-400 font-medium">Rp</span>
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={editingAsset.currentValue}
                      onChange={(e) => setEditingAsset({...editingAsset, currentValue: parseFloat(e.target.value) || 0})}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Assigned To (Employee)</label>
                <div className="relative">
                  <select 
                    value={editingAsset.assignedTo || ''}
                    onChange={(e) => {
                      const emp = employees.find((emp: any) => emp.id === e.target.value);
                      setEditingAsset({...editingAsset, assignedTo: e.target.value, });
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">-- Not Assigned --</option>
                    {employees?.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <div className="relative">
                  <select 
                    value={editingAsset.status}
                    onChange={(e) => setEditingAsset({...editingAsset, status: e.target.value as 'Active' | 'Maintenance' | 'Retired'})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Status</option>
                    {assetStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditFormOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
