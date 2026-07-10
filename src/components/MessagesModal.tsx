import React, { useState } from 'react';
import { X, Send, Inbox as InboxIcon, Paperclip, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function MessagesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const mockInbox = [
    {
      id: 'msg-1',
      sender: 'Sarah Jenkins',
      senderAvatar: 'SJ',
      subject: 'Monthly Sales Report Data',
      preview: 'Hi Achmad, I just compiled the sales report for this month. Please let me know if...',
      time: '10:45 AM',
      date: '05 Jul 2026',
      read: false,
      content: 'Hi Achmad,\n\nI just compiled the sales report for this month. Please let me know if you need any additional data points for the presentation to the board.\n\nBest,\nSarah Jenkins\nSales Manager'
    },
    {
      id: 'msg-2',
      sender: 'David Chen',
      senderAvatar: 'DC',
      subject: 'IT Infrastructure Update',
      preview: 'The server migration has been completed successfully. We are now monitoring...',
      time: '09:12 AM',
      date: '04 Jul 2026',
      read: true,
      content: 'The server migration has been completed successfully. We are now monitoring the systems to ensure stability. Expect a brief downtime report by end of day.\n\nRegards,\nDavid'
    }
  ];

  const mockSent = [
    {
      id: 'msg-3',
      receiver: 'Michael Roberts',
      receiverAvatar: 'MR',
      subject: 'Approval: Budget Request Q3',
      preview: 'I have approved the budget request. You may proceed with the acquisitions...',
      time: '14:30 PM',
      date: '03 Jul 2026',
      content: 'I have approved the budget request. You may proceed with the acquisitions. Make sure everything aligns with our new compliance guidelines.\n\nAchmad Z Rizaldy'
    }
  ];

  if (!isOpen) return null;

  const currentList = activeTab === 'inbox' ? mockInbox : mockSent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-5xl overflow-hidden flex h-[85vh] relative z-10 animate-in zoom-in-95 duration-200 border border-slate-200/60">
        
        {/* Left Sidebar (List) */}
        <div className="w-1/3 min-w-[320px] bg-slate-50/50 border-r border-slate-200 flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 font-display">Messages</h3>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors" title="New Message">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex p-3 gap-2 bg-white border-b border-slate-100">
            <button 
              onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors", activeTab === 'inbox' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}
            >
              <InboxIcon className="w-4 h-4" />
              Inbox
            </button>
            <button 
              onClick={() => { setActiveTab('sent'); setSelectedMessage(null); }}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors", activeTab === 'sent' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}
            >
              <Send className="w-4 h-4" />
              Sent
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {currentList.map((msg: any) => (
              <button 
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all duration-200 border group",
                  selectedMessage?.id === msg.id 
                    ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/10" 
                    : "bg-transparent border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm",
                  activeTab === 'inbox' && !msg.read && selectedMessage?.id !== msg.id ? "bg-blue-50/40" : ""
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm truncate max-w-[120px]">
                      {activeTab === 'inbox' ? msg.sender : msg.receiver}
                    </span>
                    {activeTab === 'inbox' && !msg.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{msg.time}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-700 truncate mb-1">{msg.subject}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{msg.preview}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Sidebar (Detail) */}
        <div className="flex-1 bg-white flex flex-col relative h-full">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Message Header */}
              <div className="p-8 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 font-display">{selectedMessage.subject}</h2>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {activeTab === 'inbox' ? selectedMessage.senderAvatar : selectedMessage.receiverAvatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {activeTab === 'inbox' ? selectedMessage.sender : 'You'}
                      </p>
                      <p className="text-sm text-slate-500">
                        to {activeTab === 'inbox' ? 'You' : selectedMessage.receiver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">{selectedMessage.time}</p>
                    <p className="text-xs font-medium text-slate-500">{selectedMessage.date}</p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-8 overflow-y-auto text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                {selectedMessage.content}
              </div>

              {/* Reply Area (if Inbox) */}
              {activeTab === 'inbox' && (
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
                    <textarea 
                      placeholder="Write a reply..." 
                      className="w-full p-4 min-h-[100px] border-none resize-none focus:ring-0 text-sm"
                    ></textarea>
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100">
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all">
                        <Send className="w-4 h-4" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
              <InboxIcon className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-lg font-medium text-slate-500">Select a message to view</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
