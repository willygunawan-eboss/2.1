import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Briefcase, X, ShoppingCart, ArrowDownToLine } from 'lucide-react';

export function PurchaseView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchVendors = async () => {
    const res = await fetch('/api/vendors');
    const data = await res.json();
    if (data.success) setVendors(data.data);
  };


  useEffect(() => {
    fetchData();
    window.addEventListener('refetch-purchase-orders', fetchData);
    return () => window.removeEventListener('refetch-purchase-orders', fetchData);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes] = await Promise.all([
        fetch('/api/purchase-orders').then(res => res.json()),
        fetch('/api/products').then(res => res.json())
      ]);
      if (ordRes.success) setOrders(ordRes.data || []);
      if (prodRes.success) setProducts(prodRes.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const totalSpent = orders.reduce((acc, o) => acc + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'Received').length;

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
      <div className="p-4 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Orders</h1>
            <p className="text-slate-500 mt-1 text-sm">Procurement and vendor management.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create PO
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total POs</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{orders.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Procurement Spent</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalSpent)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Pending Receiving</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{pendingOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Recent Purchase Orders</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-3">PO Number</th>
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No records found. Click "Create PO" to get started.</td></tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{order.vendor}</td>
                      <td className="px-6 py-4 text-slate-600">{order.date}</td>
                      <td className="px-6 py-4 text-slate-600">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 text-slate-900 font-medium text-right">{formatCurrency(order.amount)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${order.status === 'Received' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'}`}>
                          {order.status}
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
      {isAddModalOpen && <AddPOModal onClose={() => setIsAddModalOpen(false)} products={products} vendors={vendors} />}
    </div>
  );
}

function AddPOModal({ onClose, products, vendors }: { onClose: () => void, products: any[], vendors: any[] }) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [vendorId, setVendorId] = useState('');
  
  const addItem = () => {
    if (products.length === 0) return;
    setSelectedItems([...selectedItems, { productId: products[0].id, quantity: 1, price: products[0].price }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems];
    newItems[index][field] = value;
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      if (prod) newItems[index].price = prod.price; // or cost, assuming price for now
    }
    setSelectedItems(newItems);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const totalAmount = selectedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return alert("Vendor is required");
    if (selectedItems.length === 0) return alert("Please add at least one item");

    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          date: new Date().toISOString().split('T')[0],
          amount: totalAmount,
          status: 'Received', // Automatically receiving for ERP stock sync demo
          items: selectedItems
        })
      });
      if (res.ok) {
        window.dispatchEvent(new Event('refetch-purchase-orders'));
        onClose();
      } else {
        alert("Failed to create PO");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Create Purchase Order (Receiving)</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <form id="po-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Vendor Name</label>
              <select required value={vendorId} onChange={e => setVendorId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option value="">Select Vendor</option>{vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Order Items</label>
                <button type="button" onClick={addItem} className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md">+ Add Item</button>
              </div>
              
              {selectedItems.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">No items added.</div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <select className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none" value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)}>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                      </select>
                      <input type="number" min="1" className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-center" value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value))} />
                      <input type="number" className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-right" value={item.price} onChange={e => updateItem(idx, 'price', parseFloat(e.target.value))} />
                      <div className="w-32 text-right text-sm font-bold text-slate-700">
                        {(item.quantity * item.price).toLocaleString()}
                      </div>
                      <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-100 rounded-lg">
                    <span className="font-semibold text-slate-700">Total Purchase Value</span>
                    <span className="text-lg font-bold text-slate-900">IDR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button>
          <button type="submit" form="po-form" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Complete Purchase & Receive</button>
        </div>
      </div>
    </div>
  );
}
