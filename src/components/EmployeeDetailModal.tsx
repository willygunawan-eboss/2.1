import React, { useState, useEffect } from 'react';
import { 
  X, User, Briefcase, Network, Clock, Calendar, Monitor, Award, BookOpen, Star, Activity, FileText, LayoutList, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { cn } from '../lib/utils';

export function EmployeeDetailModal({ employee, onClose }: { employee: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'jobs', label: 'Informasi Pekerjaan', icon: Briefcase },
    { id: 'org', label: 'Struktur Organisasi', icon: Network },
    { id: 'attendance', label: 'Kehadiran', icon: Clock },
    { id: 'leaves', label: 'Cuti & Izin', icon: Calendar },
    { id: 'assets', label: 'Asset yang Dipinjam', icon: Monitor },
    { id: 'certifications', label: 'Sertifikasi', icon: Award },
    { id: 'trainings', label: 'Training', icon: BookOpen },
    { id: 'performance', label: 'Performance', icon: Star },
    { id: 'activities', label: 'Aktivitas', icon: Activity },
    { id: 'documents', label: 'Dokumen', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: LayoutList },
  ];

  useEffect(() => {
    fetchWorkspace();
  }, [employee.id]);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${employee.id}/workspace`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col space-y-4 animate-pulse p-8">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded w-full"></div>
          <div className="h-10 bg-slate-200 rounded w-full"></div>
          <div className="h-10 bg-slate-200 rounded w-full"></div>
        </div>
      );
    }

    if (!data) return <div className="p-8 text-slate-500">Failed to load data.</div>;

    switch (activeTab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Personal Info</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500">Employee Code</div><div className="font-medium">{data.employeeNumber || '-'}</div>
                  <div className="text-slate-500">Nama Lengkap</div><div className="font-medium">{data.name}</div>
                  <div className="text-slate-500">Email</div><div className="font-medium">{data.email}</div>
                  <div className="text-slate-500">Telepon</div><div className="font-medium">{data.phone || '-'}</div>
                  <div className="text-slate-500">Status</div>
                  <div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", data.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700")}>
                      {data.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Organizational Info</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500">Join Date</div><div className="font-medium">{data.joinDate || '-'}</div>
                  <div className="text-slate-500">Company</div><div className="font-medium">{data.company?.name || '-'}</div>
                  <div className="text-slate-500">Branch</div><div className="font-medium">{data.branch?.name || '-'}</div>
                  <div className="text-slate-500">Department</div><div className="font-medium">{data.department?.name || '-'}</div>
                  <div className="text-slate-500">Position</div><div className="font-medium">{data.position?.name || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'jobs':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contracts</h3>
            {data.contracts?.length ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.contracts.map((c: any) => (
                      <tr key={c.id}>
                        <td className="px-6 py-4">{c.contractType}</td>
                        <td className="px-6 py-4">{c.startDate}</td>
                        <td className="px-6 py-4">{c.endDate || '-'}</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No contract records found.</div>
            )}
          </div>
        );
      case 'org':
        return (
          <div className="flex justify-center items-center h-64 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <div className="text-center">
              <Network className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900">Organization Chart</h3>
              <p className="text-xs text-slate-500 mt-1">Visualization available in Org module</p>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Attendance</h3>
            {data.attendance?.length ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.attendance.map((a: any) => (
                      <tr key={a.id}>
                        <td className="px-6 py-4">{a.date}</td>
                        <td className="px-6 py-4">{a.checkIn}</td>
                        <td className="px-6 py-4">{a.checkOut}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", a.status === 'Present' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No recent attendance.</div>
            )}
          </div>
        );
      case 'leaves':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Leave Requests</h3>
            {data.leaves?.length ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Start</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">End</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.leaves.map((l: any) => (
                      <tr key={l.id}>
                        <td className="px-6 py-4">{l.leaveType}</td>
                        <td className="px-6 py-4">{l.startDate}</td>
                        <td className="px-6 py-4">{l.endDate}</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">{l.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No leave records.</div>
            )}
          </div>
        );
      case 'assets':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Assigned Assets</h3>
            {data.assetAssignments?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.assetAssignments.map((a: any) => (
                  <div key={a.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-start gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{a.asset?.name || 'Unknown Asset'}</h4>
                      <p className="text-sm text-slate-500 mt-1">SN: {a.asset?.serialNumber || '-'}</p>
                      <div className="mt-3 flex gap-2 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded">Assigned: {a.assignmentDate || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No assets assigned.</div>
            )}
          </div>
        );
      case 'certifications':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Certifications</h3>
            {data.certifications?.length ? (
              <div className="space-y-4">
                {data.certifications.map((c: any) => (
                  <div key={c.id} className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{c.certificationName}</h4>
                        <p className="text-sm text-slate-500">{c.institution} • {c.credentialId}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-slate-900 font-medium">Valid until</div>
                      <div className="text-slate-500">{c.expiryDate || 'Lifetime'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No certifications.</div>
            )}
          </div>
        );
      case 'trainings':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Training History</h3>
            {data.trainings?.length ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Training Name</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Result</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.trainings.map((t: any) => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 font-medium">{t.trainingName}</td>
                        <td className="px-6 py-4">{t.date}</td>
                        <td className="px-6 py-4 text-emerald-600 font-medium">{t.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No training records.</div>
            )}
          </div>
        );
      case 'performance':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Reviews</h3>
            {data.performances?.length ? (
              <div className="space-y-4">
                {data.performances.map((p: any) => (
                  <div key={p.id} className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-semibold text-slate-900">{p.reviewPeriod}</div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-current" /> {p.score} / 5.0
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">{p.comments}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No performance records.</div>
            )}
          </div>
        );
      case 'activities':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activities</h3>
            {data.timeline?.length ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.timeline.map((a: any) => (
                      <tr key={a.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(a.date).toLocaleString()}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{a.type}</span></td>
                        <td className="px-6 py-4">{a.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-lg bg-slate-50">No activities recorded.</div>
            )}
          </div>
        );
      case 'documents':
        return (
          <div className="flex justify-center items-center h-64 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <div className="text-center">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900">No Documents</h3>
              <p className="text-xs text-slate-500 mt-1">Upload HR documents like ID, contracts here.</p>
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Unified Timeline</h3>
            <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
              {data.timeline?.map((item: any) => (
                <div key={item.id} className="relative pl-6">
                  <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.type} <span className="text-slate-400 font-normal ml-2">{new Date(item.date).toLocaleString()}</span></h4>
                    <p className="text-sm text-slate-600 mt-1">{item.notes}</p>
                  </div>
                </div>
              ))}
              {(!data.timeline || data.timeline.length === 0) && (
                <div className="pl-6 text-sm text-slate-500">No events in timeline.</div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - CEO Summary */}
        <div className="bg-slate-900 text-white p-6 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-3xl font-bold">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{employee.name}</h2>
              <div className="text-slate-400 mt-1 flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-medium border border-blue-500/30">
                  {data?.employeeNumber || employee.employeeNumber || 'EMP'}
                </span>
                <span>{data?.position?.name || employee.role || 'Employee'}</span>
                <span>•</span>
                <span>{data?.department?.name || employee.department || 'Department'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 md:pb-0 hide-scrollbar pr-4">
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.projects?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Projects</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.tickets?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Tickets</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.assetAssignments?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Assets</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-white">{data?.trainings?.length || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Trainings</div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl font-bold text-emerald-400">{data?.performances?.[0]?.score || '-'}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">KPI Score</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto hidden md:block shrink-0">
            <nav className="p-4 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive 
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    {tab.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white relative">
            {/* Mobile Tab Selector */}
            <div className="md:hidden mb-6 border-b border-slate-200 pb-2 overflow-x-auto hide-scrollbar flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors",
                    activeTab === tab.id 
                      ? "bg-slate-900 text-white" 
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {renderTabContent()}
          </div>
        </div>

      </div>
    </div>
  );
}
