import fs from 'fs';

let header = `import React, { useState } from 'react';
import { Search, Inbox, LayoutGrid, ChevronDown, User, Settings, Building, List, Phone, ArrowLeft, HelpCircle, LogOut, Plus, Sparkles, MessageSquare, Bell } from 'lucide-react';

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-[72px] bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-50 shrink-0 shadow-sm backdrop-blur-md bg-white/95">
      <div className="flex items-center gap-8">
        {/* Company Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#142338] to-slate-800 rounded-xl flex items-center justify-center text-white shadow-md border border-slate-700/50 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <span className="font-black text-sm tracking-wider relative z-10">IB</span>
          </div>
          <span className="font-black text-slate-800 tracking-tight text-xl group-hover:text-slate-900 transition-colors uppercase">ichangeboss</span>
        </div>

        {/* Core and Non-Core Tabs */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/50">
          <button className="px-5 py-1.5 bg-white shadow-sm rounded-md text-sm font-bold text-slate-800 transition-all duration-200 ring-1 ring-slate-200/50">Core</button>
          <button className="px-5 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-md transition-all duration-200">Non-Core</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Summarize data */}
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 text-indigo-600 hover:bg-indigo-100/80 transition-all duration-200 text-sm font-bold border border-indigo-100 hover:border-indigo-200 hover:shadow-sm group">
          <Sparkles className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
          <span>Summarize data</span>
        </button>

        {/* Quick action */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#142338] text-white hover:bg-slate-800 transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg active:scale-95 group">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Quick action</span>
        </button>

        <div className="h-8 w-px bg-slate-200/80 mx-2"></div>

        {/* Search */}
        <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm">
          <Search className="w-5 h-5" />
        </button>

        {/* Inbox */}
        <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm relative">
          <Inbox className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Switch app */}
        <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm">
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Profile Picture Icon */}
        <div className="relative ml-2">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-3.5 bg-slate-50/80 hover:bg-slate-100 rounded-full transition-all duration-200 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
              AZ
            </div>
            <span className="text-sm font-bold text-slate-700 hidden sm:block">Achmad Z Rizaldy</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 transform origin-top-right transition-all duration-200">
              <div className="px-5 py-4 border-b border-slate-100 mb-2">
                <p className="text-sm font-bold text-slate-800">Achmad Z Rizaldy</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">Super Admin</p>
              </div>
              
              <div className="px-2">
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Info</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account settings</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Company info</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <List className="w-4 h-4 text-slate-400" />
                  <span>Company list</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Request PIC contact</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  <span>Switch to old navigation</span>
                </a>
                
                <div className="h-px bg-slate-100 my-2 mx-3"></div>
                
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Support center</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Help</span>
                </a>
                
                <div className="h-px bg-slate-100 my-2 mx-3"></div>
                
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
`;

fs.writeFileSync('src/components/Header.tsx', header);
console.log('Updated');
