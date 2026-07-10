import React, { useState, useEffect } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEmployees, useDashboardStats, useTasks, useAnnouncements, useAttendance, useReferences } from '../data';
import { X, Check } from 'lucide-react';
import { LayoutGrid, User, Clock, ArrowRight, Link, Settings, UserPlus, Users, FileText, ChevronDown, Bell, Briefcase, Calendar, CheckCircle2, ChevronRight, BarChart3, PieChart } from 'lucide-react';


function DashboardChart({ activeChart }: { activeChart: string }) {

  const { data: employees } = useEmployees();

  
  // Calculate stats based on real data (or fallback)
  let data = [];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  if (activeChart === 'Employment Status') {
    const active = employees.filter(e => e.status === 'Active').length || 1180;
    const inactive = employees.filter(e => e.status !== 'Active').length || 68;
    data = [
      { name: 'Active', value: active },
      { name: 'Inactive/On Leave', value: inactive }
    ];
  } else if (activeChart === 'Length of Service') {
    data = [
      { name: '< 1 Year', value: 340 },
      { name: '1-3 Years', value: 420 },
      { name: '3-5 Years', value: 250 },
      { name: '5+ Years', value: 238 }
    ];
  } else if (activeChart === 'Job Level') {
    data = [
      { name: 'Junior', value: 500 },
      { name: 'Mid-Level', value: 450 },
      { name: 'Senior', value: 200 },
      { name: 'Management', value: 98 }
    ];
  } else {
    data = [
      { name: 'Male', value: 650 },
      { name: 'Female', value: 598 }
    ];
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => new Intl.NumberFormat().format(value as number)} />
        <Legend verticalAlign="bottom" height={36} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function DashboardView({ onNavigate }: { onNavigate?: (id: any) => void }) {
  const { data: employees } = useEmployees();
  const { data: tasks } = useTasks();
  const { data: announcements } = useAnnouncements();
  const { data: attendance } = useAttendance();
  const [activeChart, setActiveChart] = useState('Employment Status');
  const { getValuesByGroup } = useReferences();
  const leaveTypes = getValuesByGroup('leave_type');
  const expenseCategories = getValuesByGroup('expense_category');
    const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (e: React.FormEvent, endpoint: string, payload: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Action successful!');
        setActiveModal(null);
        window.dispatchEvent(new Event('refetch-' + endpoint));
        window.dispatchEvent(new Event('refetch-dashboard-stats'));
      } else {
        alert('Failed to perform action.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const approveTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        alert("Task " + id + " Approved!");
        window.dispatchEvent(new Event('refetch-tasks'));
      } else {
        alert("Failed to approve task.");
      }
    } catch (e) {
      console.error(e);
    }
  };


  const [stats, setStats] = useState({
    activeEmployees: 0,
    totalDepartments: 0,
    openTickets: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    // Fetch real data from our backend
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.data);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/* Enterprise Overview Stats from Database */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Employees</span>
          <span className="text-2xl font-black text-blue-600">{stats.activeEmployees}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Departments</span>
          <span className="text-2xl font-black text-emerald-600">{stats.totalDepartments}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Open Tickets</span>
          <span className="text-2xl font-black text-amber-500">{stats.openTickets}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Rev</span>
          <span className="text-2xl font-black text-blue-600">Rp {stats.monthlyRevenue.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 10. Shortcut */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Shortcut</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button onClick={() => setActiveModal('attendance')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-100 transition-colors group">
                <Clock className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-xs font-semibold text-center text-slate-700 group-hover:text-blue-700">Live attendance</span>
              </button>
              <button onClick={() => setActiveModal('benefit')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-100 transition-colors group">
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-xs font-semibold text-center text-slate-700 group-hover:text-blue-700">Request benefit reimbursement</span>
              </button>
              <button onClick={() => setActiveModal('timeoff')} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-100 transition-colors group">
                <Calendar className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-xs font-semibold text-center text-slate-700 group-hover:text-blue-700">Request time off</span>
              </button>
              <div className="relative">
                <button onClick={() => setActiveModal('more')} className="w-full flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center mb-2">
                    <span className="text-2xl font-black text-slate-400 leading-none">...</span>
                  </div>
                  <span className="text-xs font-semibold text-center text-slate-700">More Request</span>
                </button>
              </div>
            </div>
          </div>

          
          {/* 11. Chart */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-800">Employment Insights</h3>
              <select 
                className="text-sm border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-blue-500"
                value={activeChart}
                onChange={(e) => setActiveChart(e.target.value)}
              >
                <option>Employment Status</option>
                <option>Length of Service</option>
                <option>Job Level</option>
                <option>Gender Diversity</option>
              </select>
            </div>
            
            <div className="h-64">
              <DashboardChart activeChart={activeChart} />
            </div>
          </div>

          {/* 14. Applications */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4">Applications</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              {[
                { name: 'Forms', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', nav: 'settings' },
                { name: 'Performance Review', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50', nav: 'hr' },
                { name: 'Talent management', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', nav: 'hr' },
                { name: 'Insight', icon: PieChart, color: 'text-amber-500', bg: 'bg-amber-50', nav: 'bi' },
                { name: 'Timesheet', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', nav: 'hr' },
                { name: 'Document template', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', nav: 'dms' },
                { name: 'Recruitment', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50', nav: 'hr' },
                { name: 'Talentics', icon: UserPlus, color: 'text-teal-500', bg: 'bg-teal-50', nav: 'hr' },
                { name: 'Marketplace', icon: LayoutGrid, color: 'text-orange-500', bg: 'bg-orange-50', nav: 'purchase' },
              ].map((app, i) => (
                <div key={i} onClick={() => { if(onNavigate) onNavigate(app.nav || 'hr'); }} className="flex flex-col items-center cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${app.bg}`}>
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{app.name}</span>
                </div>
              ))}
            </div>
          </div>

          
          
          {/* 17. Task */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Task</h3>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">View All</a>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Pending').map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
                      <p className="text-xs text-slate-500">Assigned to: {task.assignedTo} • Due {task.dueDate}</p>
                    </div>
                  </div>
                  <button onClick={() => approveTask(task.id)} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors">Approve</button>
                </div>
              ))}
              {tasks.filter(t => t.status === 'Pending').length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 font-medium">You have no pending tasks. Great job!</p>
                </div>
              )}
            </div>
          </div>

        </div>
        {/* Right Column (Sidebars) */}
        <div className="space-y-6">
          
          {/* 13. Balance Time Off */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4">Balance Time Off</h3>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Annual Leave</h4>
                  <p className="text-xs text-slate-500">Available balance</p>
                </div>
              </div>
              <div className="text-2xl font-black text-blue-600">
                12 <span className="text-sm font-semibold text-blue-400">Days</span>
              </div>
            </div>
          </div>

          {/* 12. Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { name: 'My Info', icon: User },
                { name: 'Add Employee', icon: UserPlus },
                { name: 'Employee Transfer', icon: Users },
                { name: 'Company Settings', icon: Settings },
                { name: 'Integration', icon: Link }
              ].map((link, i) => (
                <button key={i} onClick={() => { if (onNavigate) { if (link.name.includes("Employee") || link.name === "My Info") onNavigate("hr"); else onNavigate("settings"); } }} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400 group-hover:text-blue-600">
                      <link.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          
          {/* 15. Announcement */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Announcement</h3>
              <button className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800">
                Category <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            {announcements.map((ann, i) => (
              <div key={ann.id} className="p-4 bg-orange-50 border border-orange-100 rounded-lg mb-3 cursor-pointer hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] font-bold rounded-full uppercase tracking-wider">{ann.category}</span>
                  <span className="text-[11px] text-slate-500">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{ann.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
              </div>
            ))}
            <a href="#" className="text-sm font-semibold text-blue-600 hover:underline block text-center mt-2">View all announcements</a>
          </div>

          {/* 16. Contract & Probation */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Contract & Probation
                <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {employees.filter(e => e.status === 'Active').slice(0, 2).length}
                </span>
              </h3>
            </div>
            <div className="space-y-3">
              {employees.filter(e => e.status === 'Active').slice(0, 2).map((emp, i) => (
                <div key={emp.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                     <img src={emp.avatar || `https://i.pravatar.cc/100?img=${i+1}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-800">{emp.name}</h4>
                    <p className="text-[11px] text-rose-600 font-medium">Probation ends soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 18. Who's Off */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Who's Off</h3>
              <select className="text-[11px] font-semibold text-slate-500 bg-transparent focus:outline-none">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This Week</option>
              </select>
            </div>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=3" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Agus Pratama</h4>
                  <p className="text-[11px] text-slate-500">Annual Leave</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      {activeModal === 'attendance' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Live Attendance</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-slate-900 mb-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-sm text-slate-500 font-medium">{new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={(e) => handleAction(e, 'attendance', { employeeId: 'EMP-CURRENT', employeeName: 'Current User', date: new Date().toISOString().split('T')[0], checkIn: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), checkOut: '-', status: 'Present', workHours: '-' })}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                  Check In
                </button>
                <button 
                  onClick={(e) => handleAction(e, 'attendance', { employeeId: 'EMP-CURRENT', employeeName: 'Current User', date: new Date().toISOString().split('T')[0], checkIn: '-', checkOut: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'Present', workHours: '-' })}
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'timeoff' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Request Time Off</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              const formData = new FormData(e.currentTarget);
              handleAction(e, 'attendance', {
                employeeId: 'EMP-CURRENT',
                employeeName: 'Current User',
                date: formData.get('startDate'),
                checkIn: '-',
                checkOut: '-',
                status: 'Leave',
                workHours: '-'
              });
            }} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Leave Type</label>
                  <select required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    {leaveTypes.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Start Date</label>
                    <input required type="date" name="startDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">End Date</label>
                    <input required type="date" name="endDate" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason</label>
                  <textarea required rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"></textarea>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'benefit' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Request Reimbursement</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              const formData = new FormData(e.currentTarget);
              handleAction(e, 'transactions', {
                date: new Date().toISOString().split('T')[0],
                description: 'Reimbursement: ' + formData.get('type'),
                type: 'Expense',
                category: formData.get('type'),
                amount: Number(formData.get('amount')),
                status: 'Pending'
              });
            }} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Expense Type</label>
                  <select name="type" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    {expenseCategories.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                    <input name="amount" type="number" required placeholder="0" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Receipt / Document</label>
                  <input type="file" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'more' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">More Requests</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('finance'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">Cash Advance</div>
              </button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('inventory'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">Asset Request</div>
              </button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('hr'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">Shift Change</div>
              </button>
              <button onClick={() => { setActiveModal(null); if (onNavigate) onNavigate('helpdesk'); }} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <Link className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">IT Support</div>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
