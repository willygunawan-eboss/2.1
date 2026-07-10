import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Package, Briefcase, Activity, 
  ArrowUpRight, ArrowDownRight, Target, AlertCircle
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

// Mock Data based on requirements
const salesTrendData = [
  { month: 'Jan', sales: 2000000000, target: 2000000000 },
  { month: 'Feb', sales: 2200000000, target: 2300000000 },
  { month: 'Mar', sales: 2400000000, target: 2500000000 },
  { month: 'Apr', sales: 2500000000, target: 2500000000 },
  { month: 'May', sales: 2600000000, target: 2700000000 }, // Forecast
  { month: 'Jun', sales: 2800000000, target: 2800000000 }, // Forecast
];

const topProductsData = [
  { name: 'Laptop Pro', sales: 5000000000 },
  { name: 'Smartphone X', sales: 2000000000 },
  { name: 'Wireless Earbuds', sales: 500000000 },
  { name: 'Mechanical Keyboard', sales: 300000000 },
];

const hrData = [
  { name: 'Present', value: 98 },
  { name: 'Absent/Leave', value: 2 },
];

const supplierData = [
  { name: 'Supplier A', onTime: 98 },
  { name: 'Supplier B', onTime: 65 },
  { name: 'Supplier C', onTime: 85 },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)} M`;
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)} Jt`;
  return `Rp ${value.toLocaleString()}`;
};

export function BIView() {
  const [activeTab, setActiveTab] = useState<'executive' | 'sales' | 'finance' | 'inventory' | 'hr'>('executive');

  const tabs = [
    { id: 'executive', label: 'Executive Dashboard' },
    { id: 'sales', label: 'Sales & Forecast' },
    { id: 'finance', label: 'Financial' },
    { id: 'inventory', label: 'Inventory & Purchasing' },
    { id: 'hr', label: 'HR & Production' },
  ] as const;

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
      <div className="p-4 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Intelligence</h1>
            <p className="text-slate-500 mt-1 text-sm">Strategic insights and analytics dashboard.</p>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200 gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
        {activeTab === 'executive' && <ExecutiveDashboard />}
        {activeTab === 'sales' && <SalesDashboard />}
        {activeTab === 'finance' && <FinanceDashboard />}
        {activeTab === 'inventory' && <InventoryDashboard />}
        {activeTab === 'hr' && <HRDashboard />}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, trendValue, color }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 
            trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
             trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
            {trendValue}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Revenue" 
          value="Rp 150 M" 
          subtitle="Year to Date"
          icon={DollarSign} 
          trend="up" trendValue="+12%"
          color="bg-blue-50 text-blue-600" 
        />
        <MetricCard 
          title="Net Profit" 
          value="Rp 35 M" 
          subtitle="Margin: 23.3%"
          icon={TrendingUp} 
          trend="up" trendValue="+5%"
          color="bg-emerald-50 text-emerald-600" 
        />
        <MetricCard 
          title="Cash Flow" 
          value="Rp 22 M" 
          subtitle="Available Cash"
          icon={Activity} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <MetricCard 
          title="Outstanding Invoice" 
          value="Rp 3.2 M" 
          subtitle="Accounts Receivable"
          icon={AlertCircle} 
          trend="down" trendValue="-2%"
          color="bg-amber-50 text-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend & Forecast</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis tickFormatter={(val) => `Rp ${val / 1000000000}M`} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="sales" name="Actual Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Line type="monotone" dataKey="target" name="Target / Forecast" stroke="#f59e0b" strokeWidth={2} dot={{r: 4, strokeWidth: 2}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performers</h3>
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Top Product</span>
              <span className="text-base font-bold text-slate-900">Laptop Pro Series</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Top Branch</span>
              <span className="text-base font-bold text-slate-900">Jakarta Central</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Top Salesperson</span>
              <span className="text-base font-bold text-slate-900">Andi Saputra</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Customer Satisfaction</span>
              <span className="text-2xl font-bold text-emerald-600">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Selling Products</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(val) => `Rp ${val / 1000000000}M`} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="sales" name="Sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Forecast</h3>
          <p className="text-sm text-slate-600 mb-6">AI-driven projection based on historical data.</p>
          <div className="space-y-4">
            {[
              { month: 'Jan (Actual)', val: '2.0 Miliar', trend: 'up' },
              { month: 'Feb (Actual)', val: '2.2 Miliar', trend: 'up' },
              { month: 'Mar (Actual)', val: '2.4 Miliar', trend: 'up' },
              { month: 'Apr (Actual)', val: '2.5 Miliar', trend: 'up' },
              { month: 'May (Forecast)', val: '≈ 2.6 Miliar', trend: 'up', highlight: true },
              { month: 'Jun (Forecast)', val: '≈ 2.8 Miliar', trend: 'up', highlight: true },
            ].map((item, i) => (
              <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${item.highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                <span className={`font-medium ${item.highlight ? 'text-indigo-900' : 'text-slate-700'}`}>{item.month}</span>
                <span className={`font-bold ${item.highlight ? 'text-indigo-700' : 'text-slate-900'}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Revenue" value="Rp 120 M" icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
        <MetricCard title="COGS" value="Rp 85 M" icon={Briefcase} color="bg-rose-50 text-rose-600" />
        <MetricCard title="Gross Profit" value="Rp 35 M" icon={TrendingUp} color="bg-blue-50 text-blue-600" />
        <MetricCard title="Net Profit" value="Rp 18 M" icon={Target} color="bg-indigo-50 text-indigo-600" />
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Financial Overview</h3>
        <p className="text-slate-600 text-sm">Detailed financial charts would go here.</p>
      </div>
    </div>
  );
}

function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Inventory Analysis</h3>
           <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 font-semibold mb-2 block">Fast Moving</span>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Kabel LAN</li>
                  <li>• Mouse Wireless</li>
                </ul>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-amber-800 font-semibold mb-2 block">Slow Moving</span>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Printer X</li>
                  <li>• Scanner Pro</li>
                </ul>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-rose-800 font-semibold mb-2 block">Dead Stock</span>
                <ul className="text-sm text-rose-700 space-y-1">
                  <li>• Monitor Lama (2018)</li>
                  <li>• Kabel VGA</li>
                </ul>
              </div>
           </div>
           
           <div className="mt-8 flex items-center justify-between p-4 bg-slate-50 rounded-lg">
             <span className="font-semibold text-slate-700">Stock Turnover Ratio</span>
             <span className="text-xl font-bold text-indigo-600">7.8 kali / tahun</span>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Supplier Performance</h3>
          <div className="space-y-6">
             {supplierData.map((sup, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{sup.name}</span>
                    <span className="font-bold text-slate-900">{sup.onTime}% On-Time</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${sup.onTime >= 90 ? 'bg-emerald-500' : sup.onTime >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${sup.onTime}%` }}
                    ></div>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HRDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Total Employees" value="540" icon={Users} color="bg-blue-50 text-blue-600" />
        <MetricCard title="Turnover Rate" value="3%" icon={Activity} color="bg-emerald-50 text-emerald-600" />
        <MetricCard title="Average Attendance" value="98%" icon={Target} color="bg-indigo-50 text-indigo-600" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Machine Utilization (Production)</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Mesin A (CNC)</span>
                <span className="font-bold text-emerald-600">95%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Mesin B (Packaging)</span>
                <span className="font-bold text-rose-600">40%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-rose-600 mt-1">Requires evaluation: Underutilized</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance Distribution</h3>
          <div className="h-[250px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hrData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {hrData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
