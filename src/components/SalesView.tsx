import React, { useState, useEffect } from 'react';
import { PermissionGate } from './PermissionGate';
import { Search, Filter, Plus, Briefcase, X, ShoppingCart, ArrowUpRight, TrendingUp } from 'lucide-react';

export function SalesView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    if (data.success) setCustomers(data.data);
  };


  useEffect(() => {
    fetchData();
    window.addEventListener('refetch-sales-orders', fetchData);
    return () => window.removeEventListener('refetch-sales-orders', fetchData);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes] = await Promise.all([
        fetch('/api/sales-orders').then(res => res.json()),
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

  const totalRevenue = orders.reduce((acc, o) => acc + (o.amount || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Shipped').length;

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
      <div className="p-4 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Orders</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage customer orders and fulfillment.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create SO
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
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Sales Orders</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{orders.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Completed / Shipped</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{completedOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Recent Sales Orders</h3>
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
                  <th className="px-6 py-3">SO Number</th>
                  <th className="px-6 py-3">Customer</th>
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
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No records found. Click "Create SO" to get started.</td></tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{order.customer}</td>
                      <td className="px-6 py-4 text-slate-600">{order.date}</td>
                      <td className="px-6 py-4 text-slate-600">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 text-slate-900 font-medium text-right">{formatCurrency(order.amount)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${order.status === 'Completed' || order.status === 'Shipped' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'}`}>
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
      {isAddModalOpen && <AddSOModal onClose={() => setIsAddModalOpen(false)} products={products} customers={customers} />}
    </div>
  );
}

function AddSOModal({ onClose, products, customers }: { onClose: () => void, products: any[], customers: any[] }) {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState('');
  
  const addItem = () => {
    if (products.length === 0) return;
    setSelectedItems([...selectedItems, { productId: products[0].id, quantity: 1, price: products[0].price }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems];
    newItems[index][field] = value;
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      if (prod) newItems[index].price = prod.price;
    }
    setSelectedItems(newItems);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const totalAmount = selectedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert("Customer is required");
    if (selectedItems.length === 0) return alert("Please add at least one item");

    // Check stock
    for (const item of selectedItems) {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.stock < item.quantity) {
         alert(`Not enough stock for ${prod.name}. Available: ${prod.stock}`);
         return;
      }
    }

    try {
      const res = await fetch('/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          date: new Date().toISOString().split('T')[0],
          amount: totalAmount,
          status: 'Shipped', // Automatically fulfilled for ERP demo purposes
          items: selectedItems
        })
      });
      if (res.ok) {
        window.dispatchEvent(new Event('refetch-sales-orders'));
        onClose();
      } else {
        alert("Failed to create SO");
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
          <h2 className="text-lg font-bold text-slate-900">Create Sales Order (Fulfillment)</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <form id="so-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Customer Name</label>
              <select required value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"><option value="">Select Customer</option>{customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
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
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku}) [Stock: {p.stock}]</option>)}
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
                    <span className="font-semibold text-slate-700">Total Sales Value</span>
                    <span className="text-lg font-bold text-slate-900">IDR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">Cancel</button>
          <PermissionGate permission="CREATE_SALES" disabledMode={true}><button type="submit" form="so-form" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Complete Sale & Ship</button></PermissionGate>
        </div>
      </div>
    </div>
  );
}
