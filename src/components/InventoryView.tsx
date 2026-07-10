import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Package, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export function InventoryView() {
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'transactions'>('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, txRes] = await Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/inventory-transactions').then(res => res.json())
      ]);
      if (prodRes.success) setProducts(prodRes.data || []);
      if (txRes.success) setTransactions(txRes.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
      <div className="p-4 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Track stock levels across products in real-time.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Products</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{products.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Stock Items</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalStock}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Low Stock Alerts</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 flex overflow-x-auto hide-scrollbar">
             <button 
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'products' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
             >
                Product Master List
             </button>
             <button 
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'transactions' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
             >
                Inventory Movement (IN/OUT)
             </button>
          </div>
          
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {activeTab === 'products' ? (
                  <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Current Stock</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                ) : (
                  <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Product ID</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3 text-right">Quantity</th>
                    <th className="px-6 py-3">Ref ID</th>
                    <th className="px-6 py-3">Ref Type</th>
                  </tr>
                )}
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                   <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading data...</td></tr>
                ) : activeTab === 'products' ? (
                  products.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No products found.</td></tr>
                  ) : (
                    products.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.sku}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                        <td className="px-6 py-4 text-slate-600">{p.category}</td>
                        <td className="px-6 py-4 text-slate-900 font-medium text-right">IDR {p.price.toLocaleString()}</td>
                        <td className={`px-6 py-4 font-bold text-right ${p.stock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>{p.stock}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                             p.stock > 10 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 
                             p.stock > 0 ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
                             'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                           }`}>
                              {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                           </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  transactions.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No transactions found.</td></tr>
                  ) : (
                    transactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{new Date(tx.date).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{tx.productId}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                             tx.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                           }`}>
                             {tx.type === 'IN' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                             {tx.type}
                           </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-700 text-right">{tx.quantity}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.referenceId}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{tx.referenceType}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
