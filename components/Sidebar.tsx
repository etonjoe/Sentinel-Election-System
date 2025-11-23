import React from 'react';
import { ViewState, User } from '../types';
import { LayoutDashboard, Activity, MessageSquare, BrainCircuit, Settings, LogOut, ShieldCheck, Server, FileText, Code2, Home } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  user?: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, user }) => {
  const isAdmin = user?.role === 'admin';

  const allNavItems = [
    { id: ViewState.DASHBOARD, label: isAdmin ? 'Dashboard' : 'My Unit', icon: isAdmin ? LayoutDashboard : Home, roles: ['admin', 'observer'] },
    { id: ViewState.LIVE_RESULTS, label: 'Live Results', icon: Activity, roles: ['admin'] },
    { id: ViewState.COMMUNICATION, label: 'Communication', icon: MessageSquare, roles: ['admin', 'observer'] },
    { id: ViewState.AI_INSIGHTS, label: 'AI Insights', icon: BrainCircuit, roles: ['admin'] },
    { id: ViewState.SYSTEM_HEALTH, label: 'System Health', icon: Server, roles: ['admin'] },
    { id: ViewState.AUDIT_LOGS, label: 'Audit Logs', icon: FileText, roles: ['admin'] },
    { id: ViewState.DEVELOPER, label: 'Source Code', icon: Code2, roles: ['admin'] },
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings, roles: ['admin'] }, // Updated roles to admin only
  ];

  // Filter items based on current user role
  const navItems = allNavItems.filter(item => 
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">Sentinel</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
            {user?.avatar ? (
                 <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    {user?.name.substring(0, 2).toUpperCase()}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
        </div>
        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;