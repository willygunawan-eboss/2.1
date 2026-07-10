import { PermissionGate } from './PermissionGate';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, Wallet, DollarSign, Activity } from 'lucide-react';
import { useTransactions } from '../data';
import { cn } from '../lib/utils';

export function FinanceView() {
  const { data: transactions } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance & Accounting</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage transactions, invoices, and financial reports.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:bg-slate-50">
              New Invoice
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20">
              Record Expense
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                +15.2%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Total Balance</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">Rp 12.5B</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                +8.4%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Monthly Income</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">Rp 4.2B</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-rose-50 text-rose-700">
                <ArrowDownRight className="w-3 h-3" />
                +2.1%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Monthly Expenses</h3>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">Rp 1.8B</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{t.id}</td>
                      <td className="px-6 py-4 text-slate-600">{t.date}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{t.description}</td>
                      <td className="px-6 py-4 text-slate-600">{t.category}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{formatCurrency(t.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={"px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                          {t.status}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Record Expense</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form 
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newTx = {
                    date: (formData.get('date') as string) || new Date().toISOString().split('T')[0],
                    description: (formData.get('description') as string),
                    category: (formData.get('category') as string),
                    amount: parseFloat((formData.get('amount') as string)),
                    status: 'Completed'
                  };
                  try {
                    const res = await fetch('/api/transactions', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newTx)
                    });
                    if (res.ok) {
                      setIsAddModalOpen(false);
                      alert('Expense recorded successfully!');
                      window.dispatchEvent(new Event('refetch-transactions'));
                    } else {
                      alert('Error recording expense');
                    }
                  } catch (err) {
                    alert('Network error');
                  }
                }}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</label>
                  <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" name="description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount (IDR)</label>
                    <input required type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" name="amount" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
                    <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" name="category" defaultValue="Operational Expense" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</label>
                  <input required type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" name="date" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <PermissionGate permission="CREATE_FINANCE" disabledMode={true}><button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Save Expense
                  </button></PermissionGate>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
