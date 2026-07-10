import React, { useState, useEffect, useRef } from 'react';
import { Search, Inbox, LayoutGrid, ChevronDown, User, Settings, Building, List, Phone, ArrowLeft, HelpCircle, LogOut, Plus, Sparkles, MessageSquare, Bell } from 'lucide-react';
import { SettingsModal, SettingsTab } from './SettingsModal';
import { MessagesModal } from './MessagesModal';

export function Header({ onMenuClick, onLogout, onLogoClick }: { onMenuClick?: () => void, onLogout?: () => void, onLogoClick?: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>(null);
  
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
    <header className="h-[72px] bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0 shadow-sm backdrop-blur-md bg-white/95">

      <div className="flex items-center gap-2 sm:gap-8">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl md:hidden">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Company Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onLogoClick}>
          <img src="/logo.png" alt="ichangeboss" className="h-8 sm:h-10 object-contain hidden sm:block" onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('fallback-header-logo');
            if (fallback) fallback.style.display = 'flex';
          }} />
          <div id="fallback-header-logo" style={{display: 'none'}} className="items-center gap-2">
            <div className="flex items-center justify-center text-sky-400">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                 <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" />
               </svg>
            </div>
            <h2 className="font-bold tracking-tight text-xl hidden sm:block">
              <span className="text-[#A3C293]">i</span><span className="text-[#1E5A95]">changeboss</span>
            </h2>
          </div>
        </div>

        {/* Core and Non-Core Tabs */}
        <div className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/50">
          <button className="px-5 py-1.5 bg-white shadow-sm rounded-md text-sm font-bold text-slate-800 transition-all duration-200 ring-1 ring-slate-200/50">Core</button>
          <button className="px-5 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-md transition-all duration-200">Non-Core</button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4">
        {/* Summarize data */}
        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 text-blue-600 hover:bg-blue-100/80 transition-all duration-200 text-sm font-bold border border-blue-100 hover:border-blue-200 hover:shadow-sm group">
          <Sparkles className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
          <span>Summarize data</span>
        </button>

        {/* Quick action */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#142338] text-white hover:bg-slate-800 transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg active:scale-95 group">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Quick action</span>
        </button>

        <div className="hidden sm:block h-8 w-px bg-slate-200/80 mx-2"></div>

        {/* Search */}
        <button className="flex p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm">
          <Search className="w-5 h-5" />
        </button>

        {/* Inbox */}
        <button onClick={() => setIsMessagesOpen(true)} className="flex p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm relative">
          <Inbox className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Switch app */}
        <button className="flex p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all duration-200 hover:shadow-sm">
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Profile Picture Icon */}
        <div className="relative ml-2" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-3.5 bg-slate-50/80 hover:bg-slate-100 rounded-full transition-all duration-200 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
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
                <button onClick={() => { setActiveSettingsTab('My Info'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Info</span>
                </button>
                <button onClick={() => { setActiveSettingsTab('Account settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account settings</span>
                </button>
                <button onClick={() => { setActiveSettingsTab('Company info'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Company info</span>
                </button>
                <button onClick={() => { setActiveSettingsTab('Company list'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <List className="w-4 h-4 text-slate-400" />
                  <span>Company list</span>
                </button>
                <button onClick={() => { setActiveSettingsTab('Request PIC contact'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Request PIC contact</span>
                </button>
                <button onClick={() => { setActiveSettingsTab('Switch to old navigation'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  <span>Switch to old navigation</span>
                </button>
                
                <div className="h-px bg-slate-100 my-2 mx-3"></div>
                
                <button onClick={() => { setActiveSettingsTab('Support center'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Support center</span>
                </button>
                <button onClick={() => { setActiveSettingsTab('Help'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Help</span>
                </button>
                
                <div className="h-px bg-slate-100 my-2 mx-3"></div>
                
                <button onClick={(e) => { e.preventDefault(); if (onLogout) onLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
    <SettingsModal 
        isOpen={activeSettingsTab !== null} 
        onClose={() => setActiveSettingsTab(null)} 
        activeTab={activeSettingsTab} 
    />
    <MessagesModal 
        isOpen={isMessagesOpen} 
        onClose={() => setIsMessagesOpen(false)} 
    />
    </>
  );
}
