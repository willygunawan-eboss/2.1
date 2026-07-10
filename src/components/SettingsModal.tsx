import { useReferences } from '../data';
import React, { useState } from 'react';
import { X, Save, Edit2, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

export type SettingsTab = 'My Info' | 'Account settings' | 'Company info' | 'Company list' | 'Request PIC contact' | 'Switch to old navigation' | 'Support center' | 'Help' | null;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SettingsTab;
}

export function SettingsModal({ isOpen, onClose, activeTab }: SettingsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { getValuesByGroup: getRefs } = useReferences();
  const languages = getRefs('language') || [];
  const timezones = getRefs('timezone') || [];
  const [isAdmin] = useState(true); // Hardcoded to true for this demo

  const [formData, setFormData] = useState({
    myInfo: {
      name: 'Achmad Z Rizaldy',
      email: 'achmad@example.com',
      role: 'Super Admin',
      phone: '+62 812 3456 7890'
    },
    accountSettings: {
      language: 'English',
      timezone: 'Asia/Jakarta',
      twoFactorAuth: 'Enabled'
    },
    companyInfo: {
      name: 'Ichangeboss Corp',
      address: 'Sudirman Central Business District',
      registrationNumber: 'REG-123456',
      taxId: 'TAX-987654321'
    }
  });

  if (!isOpen || !activeTab) return null;

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to the backend here
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'My Info':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner border-4 border-white shadow-lg">
                AZ
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 font-display">Profile Picture</h4>
                <p className="text-sm text-slate-500">Update your profile picture and personal details.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing} 
                  value={formData.myInfo.name}
                  onChange={(e) => setFormData({...formData, myInfo: {...formData.myInfo, name: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  disabled={!isEditing} 
                  value={formData.myInfo.email}
                  onChange={(e) => setFormData({...formData, myInfo: {...formData.myInfo, email: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">System Role</label>
                <input 
                  type="text" 
                  disabled={!isEditing} 
                  value={formData.myInfo.role}
                  onChange={(e) => setFormData({...formData, myInfo: {...formData.myInfo, role: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input 
                  type="text" 
                  disabled={!isEditing} 
                  value={formData.myInfo.phone}
                  onChange={(e) => setFormData({...formData, myInfo: {...formData.myInfo, phone: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
            </div>
          </div>
        );
      case 'Account settings':
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">System Language</label>
                <select 
                  disabled={!isEditing} 
                  value={formData.accountSettings.language}
                  onChange={(e) => setFormData({...formData, accountSettings: {...formData.accountSettings, language: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all appearance-none", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                >
                  {languages.length > 0 ? languages.map(l => <option key={l.id} value={l.name}>{l.name}</option>) : <><option>English</option><option>Indonesian</option></>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Timezone</label>
                <select 
                  disabled={!isEditing} 
                  value={formData.accountSettings.timezone}
                  onChange={(e) => setFormData({...formData, accountSettings: {...formData.accountSettings, timezone: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all appearance-none", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                >
                  {timezones.length > 0 ? timezones.map(t => <option key={t.id} value={t.name}>{t.name}</option>) : <><option>Asia/Jakarta</option><option>UTC</option></>}
                </select>
              </div>
            </div>
          </div>
        );
      case 'Company info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing} 
                  value={formData.companyInfo.name}
                  onChange={(e) => setFormData({...formData, companyInfo: {...formData.companyInfo, name: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registered Address</label>
                <textarea 
                  disabled={!isEditing} 
                  value={formData.companyInfo.address}
                  onChange={(e) => setFormData({...formData, companyInfo: {...formData.companyInfo, address: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration Number</label>
                <input 
                  type="text" 
                  disabled={!isEditing} 
                  value={formData.companyInfo.registrationNumber}
                  onChange={(e) => setFormData({...formData, companyInfo: {...formData.companyInfo, registrationNumber: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
               <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tax ID</label>
                <input 
                  type="text" 
                  disabled={!isEditing} 
                  value={formData.companyInfo.taxId}
                  onChange={(e) => setFormData({...formData, companyInfo: {...formData.companyInfo, taxId: e.target.value}})}
                  className={cn("w-full px-4 py-2.5 rounded-xl text-sm transition-all", isEditing ? "border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 font-medium")}
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
              <Eye className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 font-display mb-2">Preview Layout</h3>
            <p className="text-sm text-slate-500 max-w-sm text-center">
              You are currently viewing a preview of the <span className="font-semibold text-slate-700">{activeTab}</span> module. 
              The accurate and beautiful layout will be shown here.
            </p>
          </div>
        );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 font-display">{activeTab}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing ? 'Make changes to this section below' : 'Viewing information'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm",
                  isEditing 
                    ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200 hover:shadow-md"
                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300"
                )}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 text-blue-600" />
                    Edit Form
                  </>
                )}
              </button>
            )}
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => {
                setIsEditing(false);
                onClose();
              }} 
              className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
