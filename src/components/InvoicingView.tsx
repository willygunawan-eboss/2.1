import { useReferences } from '../data';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Search, Filter, Download, X, FileText, Check, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  price: number;
  discountPercent: number;
  taxType: string;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  salesperson: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  subtotal: number;
  discountTotal: number;
  additionalDiscount: number;
  shippingCost: number;
  taxTotal: number;
  downPayment: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes: string;
  terms: string;
  signatureDate: string;
  signatureName: string;
  status: string;
  createdAt: string;
  items?: InvoiceItem[];
}

export function InvoicingView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getValuesByGroup: getRefs } = useReferences();
  const invoiceStatuses = getRefs('invoice_status');
  const taxTypes = getRefs('tax_type');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: `INV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    
customerId: '', customerName: '',
    
    
    salesperson: '',
    subtotal: 0,
    discountTotal: 0,
    additionalDiscount: 0,
    shippingCost: 0,
    taxTotal: 0,
    downPayment: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,
    notes: 'harga sesuai harga tokopedia tanggal 11 May 2026\npajak sudah termasuk dalam E-commerce\nestimasi pengiriman ongkir sameday',
    terms: 'garansi semua barang sesuai deskripsi produk di E-commerce',
    signatureDate: new Date().toISOString().split('T')[0],
    signatureName: 'Ichang',
    status: 'Unpaid'
  });

  const [formItems, setFormItems] = useState<Partial<InvoiceItem>[]>([
    { productName: '', description: '', quantity: 1, price: 0, discountPercent: 0, taxType: 'No Tax Selected', total: 0 }
  ]);

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    if (data.success) setCustomers(data.data);
  };
  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      if (res.ok) {
        const json = await res.json();
        setInvoices(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (inv: Invoice) => {
    try {
      const res = await fetch(`/api/invoices/${inv.id}`);
      if (res.ok) {
        const json = await res.json();
        const fullInvoice = json.data;
        setFormData(fullInvoice);
        setFormItems(fullInvoice.items || []);
        setEditingInvoice(fullInvoice);
        setIsFormOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  // Recalculate totals
  useEffect(() => {
    let subtotal = 0;
    let taxTotal = 0;

    const newItems = formItems.map(item => {
      const q = item.quantity || 0;
      const p = item.price || 0;
      const d = item.discountPercent || 0;
      
      const itemSub = q * p;
      const itemDisc = itemSub * (d / 100);
      let itemTotal = itemSub - itemDisc;
      
      let itemTax = 0;
      if (item.taxType === 'PPN 11% INCLUSIVE') {
         // Tax is included, we calculate tax amount from total
         // total = base + (base * 0.11) => base = total / 1.11 => tax = total - base
         itemTax = itemTotal - (itemTotal / 1.11);
      } else if (item.taxType === 'PPN 11% EXCLUSIVE') {
         itemTax = itemTotal * 0.11;
         itemTotal += itemTax;
      }
      
      subtotal += (itemSub - itemDisc);
      taxTotal += itemTax;
      
      return { ...item, total: itemTotal };
    });

    const addDisc = parseFloat(formData.additionalDiscount as any) || 0;
    const ship = parseFloat(formData.shippingCost as any) || 0;
    const dp = parseFloat(formData.downPayment as any) || 0;
    
    // In this basic version we assume tax is on top of items but not shipping
    const total = subtotal - addDisc + ship + taxTotal;
    const amountDue = total - dp;

    // only update if changed to avoid infinite loop
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxTotal,
      total,
      amountDue
    }));
  }, [formItems, formData.additionalDiscount, formData.shippingCost, formData.downPayment]);

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...formItems];
    updated[index] = { ...updated[index], [field]: value };
    setFormItems(updated);
  };

  const addItem = () => {
    setFormItems([...formItems, { productName: '', description: '', quantity: 1, price: 0, discountPercent: 0, taxType: 'No Tax Selected', total: 0 }]);
  };

  const removeItem = (index: number) => {
    const updated = [...formItems];
    updated.splice(index, 1);
    setFormItems(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      items: formItems
    };

    try {
      const url = editingInvoice ? `/api/invoices/${editingInvoice.id}` : '/api/invoices';
      const method = editingInvoice ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsFormOpen(false);
        setEditingInvoice(null);
        fetchInvoices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generatePDF = (inv: Invoice) => {
    const doc = new jsPDF();
    
    // Add Logo placeholder
    doc.setFillColor(240, 248, 255); // light blue
    doc.rect(14, 15, 30, 30, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 102, 204);
    doc.text("ICHANGEBOSS", 15, 30);
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(50, 100, 180);
    doc.text("Invoice", 150, 25);
    
    // Invoice info
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Referensi", 130, 40); doc.text(inv.invoiceNumber, 170, 40, { align: 'right' });
    doc.text("Tanggal", 130, 45); doc.text(new Date(inv.date).toLocaleDateString('id-ID'), 170, 45, { align: 'right' });
    doc.text("Tgl. Jatuh Tempo", 130, 50); doc.text(new Date(inv.dueDate).toLocaleDateString('id-ID'), 170, 50, { align: 'right' });

    // Company Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Info Perusahaan", 14, 65);
    doc.line(14, 67, 90, 67);
    doc.setFontSize(10);
    doc.text("ichangeboss", 14, 75);
    doc.setFont("helvetica", "normal");
    doc.text("Jalan Tebet Timur 12820,\nKota Jakarta Selatan,\nDKI Jakarta,\nTelp: 081282283600\nEmail: achmad.rizaldy@transvision.co.id", 14, 82);

    // Customer Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Tagihan Untuk", 110, 65);
    doc.line(110, 67, 190, 67);
    doc.setFontSize(10);
    doc.text(inv.customerName, 110, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Telp: ${inv.customerPhone || '-'}\nEmail: ${inv.customerEmail || '-'}`, 110, 82);

    // Fetch items for this invoice
    fetch(`/api/invoices/${inv.id}`)
      .then(res => res.json())
      .then(json => {
        const fullInv = json.data;
        const items = fullInv.items || [];
        
        autoTable(doc, {
          startY: 110,
          head: [['Produk', 'Deskripsi', 'Kuantitas', 'Harga (Rp)', 'Diskon', 'Pajak', 'Jumlah (Rp)']],
          body: items.map((it: any) => [
            it.productName,
            it.description || '-',
            it.quantity.toString(),
            it.price.toLocaleString('id-ID'),
            it.discountPercent.toString(),
            it.taxType === 'No Tax Selected' ? '-' : it.taxType,
            it.total.toLocaleString('id-ID')
          ]),
          headStyles: { fillColor: [50, 70, 90], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 50 },
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'center' },
            6: { halign: 'right' },
          }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 110;
        
        // Summary box
        doc.text("Subtotal", 130, finalY + 10); doc.text(fullInv.subtotal.toLocaleString('id-ID'), 190, finalY + 10, { align: 'right' });
        doc.text("Total Diskon", 130, finalY + 15); doc.text(fullInv.discountTotal.toLocaleString('id-ID'), 190, finalY + 15, { align: 'right' });
        doc.text("Pajak", 130, finalY + 20); doc.text(fullInv.taxTotal.toLocaleString('id-ID'), 190, finalY + 20, { align: 'right' });
        doc.setFont("helvetica", "bold");
        doc.text("Total", 130, finalY + 30); doc.text(fullInv.total.toLocaleString('id-ID'), 190, finalY + 30, { align: 'right' });
        
        if (fullInv.downPayment > 0) {
          doc.text("Uang Muka", 130, finalY + 40); doc.text(fullInv.downPayment.toLocaleString('id-ID'), 190, finalY + 40, { align: 'right' });
          doc.text("Sisa Tagihan", 130, finalY + 50); doc.text(fullInv.amountDue.toLocaleString('id-ID'), 190, finalY + 50, { align: 'right' });
        }

        // Notes and terms
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Keterangan", 14, finalY + 20);
        doc.line(14, finalY + 22, 100, finalY + 22);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(fullInv.notes || '', 80);
        doc.text(splitNotes, 14, finalY + 27);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Syarat & Ketentuan", 14, finalY + 50);
        doc.line(14, finalY + 52, 100, finalY + 52);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const splitTerms = doc.splitTextToSize(fullInv.terms || '', 80);
        doc.text(splitTerms, 14, finalY + 57);

        // Signature
        doc.text(new Date(fullInv.signatureDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 150, finalY + 80, { align: 'center' });
        doc.text(fullInv.signatureName || '-', 150, finalY + 110, { align: 'center' });

        doc.save(`${fullInv.invoiceNumber}.pdf`);
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoicing</h1>
          <p className="text-slate-500 text-sm mt-1">Manage sales invoices, tracking, and payments.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              invoiceNumber: `INV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
customerId: '', customerName: '',
              
              
              salesperson: '',
              subtotal: 0,
              discountTotal: 0,
              additionalDiscount: 0,
              shippingCost: 0,
              taxTotal: 0,
              downPayment: 0,
              total: 0,
              amountPaid: 0,
              amountDue: 0,
              notes: 'harga sesuai harga tokopedia tanggal 11 May 2026\npajak sudah termasuk dalam E-commerce\nestimasi pengiriman ongkir sameday',
              terms: 'garansi semua barang sesuai deskripsi produk di E-commerce',
              signatureDate: new Date().toISOString().split('T')[0],
              signatureName: 'Ichang',
              status: 'Unpaid'
            });
            setFormItems([{ productName: '', description: '', quantity: 1, price: 0, discountPercent: 0, taxType: 'No Tax Selected', total: 0 }]);
            setEditingInvoice(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Invoice No</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Amount Due</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(inv.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{inv.customerName}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    Rp {inv.amountDue.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                      inv.status === 'Unpaid' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => generatePDF(inv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(inv)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(inv.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No invoices found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="inline-block w-full max-w-5xl my-8 text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-8">
                {/* Header Information */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">No. Invoice *</label>
                      <input 
                        type="text" 
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Pelanggan *</label>
                      <input 
                        type="text" 
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        placeholder="Nama Pelanggan / Perusahaan"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Email Pelanggan</label>
                      <input 
                        type="email" 
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Tgl. Invoice *</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Tgl. Jatuh Tempo *</label>
                      <input 
                        type="date" 
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      >
                        <option value="">Select Status</option>
                        {invoiceStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#1f2937] text-white">
                        <tr>
                          <th className="px-4 py-3 font-semibold w-64">Produk *</th>
                          <th className="px-4 py-3 font-semibold">Deskripsi *</th>
                          <th className="px-4 py-3 font-semibold w-24">Kuantitas *</th>
                          <th className="px-4 py-3 font-semibold w-36">Harga *</th>
                          <th className="px-4 py-3 font-semibold w-24">Diskon %</th>
                          <th className="px-4 py-3 font-semibold w-40">Pajak</th>
                          <th className="px-4 py-3 font-semibold text-right">Jumlah</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {formItems.map((item, idx) => (
                          <tr key={idx} className="bg-white">
                            <td className="px-4 py-3">
                              <input 
                                type="text"
                                value={item.productName}
                                onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <textarea 
                                value={item.description}
                                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[80px]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem(idx, 'price', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                required
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={item.discountPercent}
                                onChange={(e) => updateItem(idx, 'discountPercent', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select 
                                value={item.taxType}
                                onChange={(e) => updateItem(idx, 'taxType', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                              >
                                <option value="No Tax Selected">No Tax</option>
                                {taxTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {(item.total || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                                <X className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-4">
                    <button type="button" onClick={addItem} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">
                      + Tambah Baris
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-96 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">{(formData.subtotal || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-600">Diskon Tambahan (Rp)</span>
                      <input 
                        type="number"
                        value={formData.additionalDiscount}
                        onChange={(e) => setFormData({...formData, additionalDiscount: parseInt(e.target.value) || 0})}
                        className="w-32 p-1.5 border border-slate-200 rounded-md text-right text-sm"
                      />
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-600">Biaya Kirim</span>
                      <input 
                        type="number"
                        value={formData.shippingCost}
                        onChange={(e) => setFormData({...formData, shippingCost: parseInt(e.target.value) || 0})}
                        className="w-32 p-1.5 border border-slate-200 rounded-md text-right text-sm"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Pajak</span>
                      <span className="font-medium">{(formData.taxTotal || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-600">Uang Muka</span>
                      <input 
                        type="number"
                        value={formData.downPayment}
                        onChange={(e) => setFormData({...formData, downPayment: parseInt(e.target.value) || 0})}
                        className="w-32 p-1.5 border border-slate-200 rounded-md text-right text-sm"
                      />
                    </div>
                    <div className="flex justify-between text-base font-bold pt-4 border-t border-slate-200">
                      <span className="text-slate-900">Total</span>
                      <span className="text-slate-900">{(formData.total || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-blue-600">
                      <span>Sisa Tagihan</span>
                      <span>{(formData.amountDue || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Keterangan</label>
                      <textarea 
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Syarat & Ketentuan</label>
                      <textarea 
                        value={formData.terms}
                        onChange={(e) => setFormData({...formData, terms: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6 flex flex-col items-center justify-start pt-6">
                    <div className="text-center w-full">
                      <h4 className="text-sm font-bold text-slate-700 mb-2">Tanda Tangan dan Meterai (Opsional)</h4>
                      <input 
                        type="date"
                        value={formData.signatureDate}
                        onChange={(e) => setFormData({...formData, signatureDate: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm text-center bg-slate-50 mb-4"
                      />
                      <div className="w-48 h-32 border-2 border-dashed border-slate-300 rounded-xl mx-auto flex items-center justify-center text-slate-400 text-xs text-center p-4">
                        Unggah Tanda Tangan<br/>Maksimal ukuran of 20MB JPEG, PNG<br/>Rekomendasi ukuran 300x200
                      </div>
                      <input 
                        type="text"
                        value={formData.signatureName}
                        onChange={(e) => setFormData({...formData, signatureName: e.target.value})}
                        className="w-full mt-4 p-2 border border-slate-200 rounded-lg text-sm text-center bg-slate-50 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Simpan Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
