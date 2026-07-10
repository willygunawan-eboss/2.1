import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, CheckCircle2, AlertCircle, Clock, Users, X } from 'lucide-react';
import { useAttendance, usePayroll, useEmployees } from '../data';
import { HRTab } from '../types';
import { cn } from '../lib/utils';
import { EmployeeDetailModal } from './EmployeeDetailModal';

export function HRView() {
  const [activeTab, setActiveTab] = useState<HRTab>('overview');
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/departments').then(r => r.json()).then(d => { if(d.success) setDepartments(d.data); });
    fetch('/api/positions').then(r => r.json()).then(d => { if(d.success) setPositions(d.data); });
  }, []);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs: { id: HRTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'directory', label: 'Employee Directory' },
    { id: 'attendance', label: 'Attendance & Time' },
    { id: 'payroll', label: 'Payroll Processing' },
    { id: 'leave', label: 'Leave Management' },
  ];

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto w-full">
      <div className="p-8 pb-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Human Resources</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage employees, attendance, payroll, and benefits.</p>
          </div>
          <button 
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        <div className="flex gap-6 border-b border-slate-200 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors whitespace-nowrap relative",
                activeTab === tab.id 
                  ? "text-blue-600 font-semibold" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'directory' && <EmployeeDirectoryTab />}
        {activeTab === 'attendance' && <AttendanceTab />}
        {activeTab === 'payroll' && <PayrollTab />}
        {/* Other tabs can be implemented similarly */}
        {(activeTab !== 'overview' && activeTab !== 'directory' && activeTab !== 'attendance' && activeTab !== 'payroll') && (
           <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center shadow-sm">
             <h3 className="text-lg font-semibold text-slate-800">Select a detailed module</h3>
             <p className="text-slate-500 mt-2 text-sm">Currently showcasing Attendance and Payroll modules.</p>
           </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add New Employee</h2>
              <button 
                onClick={() => { setIsAddEmployeeModalOpen(false); setFormError(''); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {formError && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">{formError}</div>}
              <form 
                className="space-y-4" 
                
                onSubmit={async (e) => { 
                  e.preventDefault();
                  setFormError('');
                  setIsSubmitting(true); 
                  const formData = new FormData(e.currentTarget);
                  
                  const newEmployee = {
                    id: (formData.get('id') as string),
                    employeeNumber: (formData.get('id') as string),
                    name: (formData.get('name') as string),
                    email: (formData.get('email') as string),
                    departmentId: (formData.get('departmentId') as string),
                    positionId: (formData.get('positionId') as string),
                    status: 'Active',
                    joinDate: (formData.get('joinDate') as string) || new Date().toISOString().split('T')[0],
                    avatar: (formData.get('avatar') as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.get('name')}`,
                  };

                  try {
                    const res = await fetch('/api/employees', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newEmployee)
                    });
                    if (res.ok) {
                      setIsAddEmployeeModalOpen(false);
                       window.dispatchEvent(new Event('refetch-employees')); window.dispatchEvent(new Event('refetch-attendance')); window.dispatchEvent(new Event('refetch-payroll')); window.dispatchEvent(new Event('refetch-dashboard-stats')); setIsSubmitting(false);
                    }
                    else {
                      
                      const data = await res.json();
                      setFormError('Failed to add employee: ' + (data.message || data.error || 'Unknown error'));

                    }
                  } catch (err) {
                    setFormError('Error adding employee: ' + String(err)); console.error(err);
                  }
                  setIsSubmitting(false);
                }}

              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. Budi Santoso" name="name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Employee ID</label>
                    <input required type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. EMP-100" name="id" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                    <input required type="email" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. budi@company.com" name="email" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Department</label>
                    <select required name="departmentId" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                      <option value="">Select Department</option>
                      {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Position</label>
                    <select required name="positionId" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                      <option value="">Select Position</option>
                      {positions.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Join Date</label>
                    <input required type="date" name="joinDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Photo URL (Optional)</label>
                    <input type="url" name="avatar" placeholder="https://..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddEmployeeModalOpen(false); setFormError(''); }} 
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Employee"}
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

function AttendanceTab() {
  const { data: attendance } = useAttendance();
  const { data: employees } = useEmployees();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Workforce</p>
            <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{employees.length > 0 ? employees.length : 1248}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</p>
            <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{employees.length > 0 ? Math.floor(employees.length * 0.95) : 1180}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late Arrivals</p>
            <p className="text-2xl font-bold text-slate-900 leading-none mt-1">42</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
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
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Work Hours</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">{record.employeeName.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{record.employeeName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{record.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{record.date}</td>
                  <td className="px-6 py-3 text-slate-700 font-medium">{record.checkIn}</td>
                  <td className="px-6 py-3 text-slate-700 font-medium">{record.checkOut}</td>
                  <td className="px-6 py-3 text-slate-600">{record.workHours}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md",
                      record.status === 'Present' && "bg-emerald-50 text-emerald-700",
                      record.status === 'Late' && "bg-amber-50 text-amber-700",
                      record.status === 'Absent' && "bg-rose-50 text-rose-700",
                    )}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      );
}

function PayrollTab() {
  const { data: payroll } = usePayroll();
  const { data: employees } = useEmployees();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-5 rounded-xl">
        <div>
          <h3 className="text-blue-900 font-bold">June 2026 Payroll Cycle</h3>
          <p className="text-blue-700 text-sm mt-1">Processing payroll for {employees.length > 0 ? employees.length : 1248} active employees.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Run Payroll
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-base">Salary Details</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download Slips
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3 text-right">Basic Salary</th>
                <th className="px-6 py-3 text-right">Allowances</th>
                <th className="px-6 py-3 text-right">Deductions</th>
                <th className="px-6 py-3 text-right">Net Pay</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payroll.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900">{record.employeeName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.employeeId}</div>
                  </td>
                  <td className="px-6 py-3 text-right text-slate-600">{formatCurrency(record.basicSalary)}</td>
                  <td className="px-6 py-3 text-right text-emerald-600">{formatCurrency(record.allowances)}</td>
                  <td className="px-6 py-3 text-right text-rose-600">-{formatCurrency(record.deductions)}</td>
                  <td className="px-6 py-3 text-right font-semibold text-slate-900">{formatCurrency(record.netPay)}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md",
                      record.status === 'Paid' && "bg-emerald-50 text-emerald-700",
                      record.status === 'Processing' && "bg-blue-50 text-blue-700",
                      record.status === 'Pending' && "bg-amber-50 text-amber-700",
                    )}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




function OverviewTab() {
  const { data: employees } = useEmployees();
  const { data: attendance } = useAttendance();
  const { data: payroll } = usePayroll();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600"><Users className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Total Employees</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{employees.length > 0 ? employees.length : 1248}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Present Today</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{attendance.length > 0 ? Array.from(new Set(attendance.map(a => a.employeeId))).length : 1180}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Leave Requests</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">12</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600"><AlertCircle className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Pending Payrolls</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{payroll.filter(p => p.status !== 'Paid').length || 15}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Recent Hires</h3>
          <div className="space-y-4">
            {employees.slice(-5).reverse().map((emp, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {emp.avatar ? (
                    <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">{emp.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.role}</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-500">{emp.joinDate}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Company Culture</h3>
          <p className="text-slate-500 text-sm max-w-sm">Build a stronger workforce by reviewing employee performance and setting clear OKRs in the next cycle.</p>
          <button className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">Start Review Cycle</button>
        </div>
      </div>
    </div>
  );
}

function EmployeeDirectoryTab() {
  const { data: employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  return (
    <>
      {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</p>
          <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{employees.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-900 text-base">Employee Directory</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Role & Dept</th>
                <th className="px-6 py-3">Join Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {employees.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No employees found. Add one.</td></tr>
              ) : employees.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {record.avatar ? (
                         <img src={record.avatar} alt={record.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                      ) : (
                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{record.name.charAt(0)}</div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">{record.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{record.email} &bull; {record.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900">{record.role}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{record.department}</div>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{record.joinDate}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md",
                      record.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => setSelectedEmployee(record)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
