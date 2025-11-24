
import React, { useState } from 'react';
import { Bell, Search, Wifi, CheckCircle2, X } from 'lucide-react';
import { Notification } from '../types';

interface HeaderProps {
  title: string;
  notifications: Notification[];
  onClearNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, notifications, onClearNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        
        {/* Real-Time WebSocket Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Live Socket</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Search Bar - hidden on small screens */}
        <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all w-64"
            />
        </div>

        {/* Notification Center */}
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-700">Notifications</h3>
                            <button onClick={onClearNotifications} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">No new notifications</p>
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group">
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                                n.type === 'error' ? 'bg-red-500' :
                                                n.type === 'warning' ? 'bg-orange-500' :
                                                n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                            }`} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{n.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2">{n.timestamp.toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
