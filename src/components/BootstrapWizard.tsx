import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Briefcase, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, RefreshCcw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const steps = [
  { id: 1, title: 'Company', icon: Building2, desc: 'Setup your primary organization', path: 'companies' },
  { id: 2, title: 'Branch', icon: MapPin, desc: 'Add your first branch or HQ', path: 'branches' },
  { id: 3, title: 'Department', icon: Users, desc: 'Create your main department', path: 'departments' },
  { id: 4, title: 'Position', icon: Briefcase, desc: 'Add a job position', path: 'positions' },
  { id: 5, title: 'Employee', icon: Users, desc: 'Register your first employee', path: 'employees' },
  { id: 6, title: 'Readiness', icon: CheckCircle2, desc: 'System verification', path: 'verify' }
];

// Error Boundary Component for the Wizard
class WizardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, logId: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Bootstrap Error:", error, errorInfo);
    this.setState({ errorInfo, logId: `ERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}` });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Bootstrap Execution Error</h1>
            <p className="text-slate-600 mb-4">An unexpected error occurred in the orchestration layer.</p>
            <div className="bg-slate-100 p-4 rounded-lg text-sm text-red-600 font-mono overflow-auto mb-6 max-h-40">
              <p className="font-bold mb-1">Log ID: {this.state.logId}</p>
              {this.state.error?.toString()}
            </div>
            <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors">
                <RefreshCcw className="w-4 h-4" /> Retry Bootstrap
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function BootstrapWizardContent({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [healthData, setHealthData] = useState<any>(null);
  const [orgState, setOrgState] = useState<Record<string, string>>({});
  const [prerequisites, setPrerequisites] = useState<{ divisionId?: string, jobGradeId?: string }>({});

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/bootstrap/status');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data.data);
        if (data.data.erpReady) {
          onComplete();
        }
      }
    } catch (e) {
      console.error("Failed to fetch bootstrap status", e);
    }
  };

  const checkPrerequisites = async () => {
    try {
      const [divRes, jgRes] = await Promise.all([
        fetch('/api/org/divisions?limit=1'),
        fetch('/api/org/job-grades?limit=1')
      ]);
      const divData = await divRes.json();
      const jgData = await jgRes.json();
      
      setPrerequisites({
        divisionId: divData.data?.[0]?.id,
        jobGradeId: jgData.data?.[0]?.id
      });
    } catch (e) {
      console.error("Failed to fetch prerequisites", e);
    }
  };

  useEffect(() => {
    fetchHealth();
    checkPrerequisites();
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      const stepConfig = steps[currentStep - 1];
      let endpoint = `/api/org/${stepConfig.path}`;
      let payload: any = { ...data };

      // Dependency Injection Layer
      if (currentStep === 2) { // Branch
        if (!orgState.companyId) throw new Error("Dependency Error: Company ID is missing from previous step.");
        payload.companyId = orgState.companyId;
      } else if (currentStep === 3) { // Department
        if (!prerequisites.divisionId) throw new Error("Reference Error: Master Division belum tersedia. Pastikan seeder telah berjalan.");
        payload.divisionId = prerequisites.divisionId;
      } else if (currentStep === 4) { // Position
        if (!orgState.departmentId) throw new Error("Dependency Error: Department ID is missing.");
        if (!prerequisites.jobGradeId) throw new Error("Reference Error: Master Job Grade belum tersedia.");
        payload.departmentId = orgState.departmentId;
        payload.jobGradeId = prerequisites.jobGradeId;
      } else if (currentStep === 5) { // Employee
        if (!orgState.companyId || !orgState.branchId || !orgState.departmentId || !orgState.positionId) {
           throw new Error("Dependency Error: Required organizational elements are missing. Ensure all previous steps completed.");
        }
        payload.companyId = orgState.companyId;
        payload.branchId = orgState.branchId;
        payload.departmentId = orgState.departmentId;
        payload.positionId = orgState.positionId;
        // Default values for employee missing from simple form
        payload.status = 'Active';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      
      if (!res.ok || !resData.success) {
         // Standardize error message from REST API validation
         let errorMsg = resData.message || "Failed to save data.";
         if (resData.error && Array.isArray(resData.error)) {
             errorMsg = resData.error.map((e: any) => e.message).join(", ");
         } else if (resData.error) {
             errorMsg = resData.error;
         }
         throw new Error(errorMsg);
      }
      
      // Store IDs for orchestration
      if (currentStep === 1) setOrgState(prev => ({ ...prev, companyId: resData.data?.id || resData.id }));
      if (currentStep === 2) setOrgState(prev => ({ ...prev, branchId: resData.data?.id || resData.id }));
      if (currentStep === 3) setOrgState(prev => ({ ...prev, departmentId: resData.data?.id || resData.id }));
      if (currentStep === 4) setOrgState(prev => ({ ...prev, positionId: resData.data?.id || resData.id }));

      await fetchHealth();
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } catch (err: any) {
      setFormError(err.message || "An orchestration error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Code</label>
              <input type="text" name="code" required defaultValue="HQ-01" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input type="text" name="name" required placeholder="e.g. PT Maju Bersama" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" name="email" required placeholder="contact@company.com" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Code</label>
              <input type="text" name="code" required defaultValue="BR-01" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name</label>
              <input type="text" name="name" required placeholder="e.g. Head Office" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department Code</label>
              <input type="text" name="code" required defaultValue="MGT" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
              <input type="text" name="name" required placeholder="e.g. Management" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position Code</label>
              <input type="text" name="code" required defaultValue="DIR" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position Name</label>
              <input type="text" name="name" required placeholder="e.g. Director" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee Number</label>
              <input type="text" name="employeeNumber" required defaultValue="EMP-001" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required placeholder="e.g. Budi Santoso" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" name="email" required placeholder="budi@example.com" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">System Ready!</h3>
              <p className="text-slate-500 mt-2">Bootstrap Orchestration successfully initialized master data.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
               <div className="flex justify-between text-sm border-b border-slate-200 pb-2">
                 <span className="text-slate-600">Organization Data</span>
                 <span className={healthData?.organizationReady ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                   {healthData?.organizationReady ? 'Ready' : 'Pending'}
                 </span>
               </div>
               <div className="flex justify-between text-sm border-b border-slate-200 pb-2">
                 <span className="text-slate-600">HR Data</span>
                 <span className={healthData?.employeeReady ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                   {healthData?.employeeReady ? 'Ready' : 'Pending'}
                 </span>
               </div>
               <div className="flex justify-between text-sm border-b border-slate-200 pb-2">
                 <span className="text-slate-600">Reference Engine</span>
                 <span className={healthData?.referenceReady ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                   {healthData?.referenceReady ? 'Ready' : 'Pending'}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">RBAC Engine</span>
                 <span className={healthData?.rbacReady ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                   {healthData?.rbacReady ? 'Ready' : 'Pending'}
                 </span>
               </div>
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              Enter Workspace
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Progress Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">System Bootstrap</h1>
            <p className="text-slate-500 text-sm">Orchestration Layer initializing your ERP workspace components sequentially.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isPast = step.id < currentStep;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className={`flex items-start gap-4 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
                      ${isPast ? 'bg-green-500 border-green-500 text-white' : 
                        isActive ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-400'}
                    `}>
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>{step.title}</h4>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {healthData && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Setup Progress</span>
                  <span className="text-blue-600 font-bold">{healthData.progress || 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${healthData.progress || 0}%` }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wizard Form */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                Step {currentStep}: {steps[currentStep-1].title}
              </h2>
            </div>
            
            <div className="p-6 sm:p-8 flex-1">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                     <p className="font-bold mb-1">Validation Error</p>
                     <p>{formError}</p>
                  </div>
                </div>
              )}
              
              <form id="wizard-form" onSubmit={handleNext}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderFormContent()}
                  </motion.div>
                </AnimatePresence>
              </form>
            </div>
            
            {currentStep < 6 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                  className={`px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2
                    ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'}
                  `}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  form="wizard-form"
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? 'Processing...' : 'Save & Continue'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BootstrapWizard({ onComplete }: { onComplete: () => void }) {
  return (
    <WizardErrorBoundary>
      <BootstrapWizardContent onComplete={onComplete} />
    </WizardErrorBoundary>
  );
}
