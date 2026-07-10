import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Briefcase, Key, Database, ShieldCheck, 
  MapPin, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft 
} from 'lucide-react';

interface BootstrapWizardProps {
  onComplete: () => void;
}

export function BootstrapWizard({ onComplete }: BootstrapWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const steps = [
    { id: 1, title: 'Company', icon: Building2, desc: 'Setup your primary organization' },
    { id: 2, title: 'Branch', icon: MapPin, desc: 'Add your first branch or HQ' },
    { id: 3, title: 'Department', icon: Users, desc: 'Create your main department' },
    { id: 4, title: 'Position', icon: Briefcase, desc: 'Add a job position' },
    { id: 5, title: 'Employee', icon: Users, desc: 'Register your first employee' },
    { id: 6, title: 'Readiness', icon: ShieldCheck, desc: 'System verification' }
  ];

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/system/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data.data);
        if (data.data.systemReady) {
          onComplete();
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const res = await fetch('/api/system/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: currentStep, data })
        });
        const resData = await res.json();
        if (!res.ok || !resData.success) throw new Error(resData.message || "Failed to save");
      
        await fetchHealth();
        setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
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
              <p className="text-slate-500 mt-2">All master data has been initialized.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">Organization Data</span>
                 <span className="text-green-600 font-medium">{healthData?.status?.organization}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-600">HR Data</span>
                 <span className="text-green-600 font-medium">{healthData?.status?.hr}</span>
               </div>
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Enter Workspace
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
            <p className="text-slate-500">Initialize your ERP workspace</p>
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
                  <span className="text-blue-600 font-bold">{healthData.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000" 
                    style={{ width: `${healthData.progress}%` }} 
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
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{formError}</p>
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
