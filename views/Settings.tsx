
import React, { useState } from 'react';
import { Settings as SettingsIcon, User, MapPin, Bell, Save, Plus, Trash2, Edit2 } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'units' | 'system'>('system');

  // Mock Data for CRUD
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@sentinel.com', role: 'Admin' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah@sentinel.com', role: 'Observer' },
    { id: 3, name: 'Mike Ross', email: 'mike@sentinel.com', role: 'Analyst' },
  ]);

  const [units, setUnits] = useState([
      { id: 'PU-101', name: 'Central Station', region: 'North' },
      { id: 'PU-102', name: 'Community School', region: 'North' },
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
            {/* Settings Sidebar */}
            <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <SettingsIcon size={20} /> Configuration
                </h2>
                <div className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('system')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'system' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        <Bell size={18} /> System & Alerts
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'users' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        <User size={18} /> User Management
                    </button>
                    <button 
                        onClick={() => setActiveTab('units')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'units' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        <MapPin size={18} /> Polling Units
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
                {activeTab === 'system' && (
                    <div className="space-y-6 max-w-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Notification & System Settings</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                <div>
                                    <h4 className="font-medium text-slate-800">Email Notifications</h4>
                                    <p className="text-sm text-slate-500">Receive daily digests and critical alerts.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                <div>
                                    <h4 className="font-medium text-slate-800">SMS Alerts (Twilio)</h4>
                                    <p className="text-sm text-slate-500">Send urgent broadcasts to field agents.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="p-4 border border-slate-200 rounded-xl bg-white">
                                <h4 className="font-medium text-slate-800 mb-3">API Configuration</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Google Gemini API Key</label>
                                        <input type="password" value="AIzaSy******************" disabled className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Twilio SID</label>
                                        <input type="password" value="AC8392******************" disabled className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">User Management</h3>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">
                                <Plus size={16} /> Add User
                            </button>
                         </div>

                         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                             <table className="w-full text-left">
                                 <thead className="bg-slate-50 border-b border-slate-200">
                                     <tr>
                                         <th className="p-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                                         <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                         <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {users.map(u => (
                                         <tr key={u.id}>
                                             <td className="p-4">
                                                 <div className="flex flex-col">
                                                     <span className="font-medium text-slate-800">{u.name}</span>
                                                     <span className="text-xs text-slate-400">{u.email}</span>
                                                 </div>
                                             </td>
                                             <td className="p-4">
                                                 <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{u.role}</span>
                                             </td>
                                             <td className="p-4 text-right space-x-2">
                                                 <button className="p-1 text-slate-400 hover:text-blue-600"><Edit2 size={16}/></button>
                                                 <button className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>
                )}

                {activeTab === 'units' && (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <h3 className="text-xl font-bold text-slate-800">Polling Units</h3>
                           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">
                               <Plus size={16} /> Add Unit
                           </button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Unit ID</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Region</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {units.map(u => (
                                        <tr key={u.id}>
                                            <td className="p-4 font-mono text-xs text-slate-500">{u.id}</td>
                                            <td className="p-4 font-medium text-slate-800">{u.name}</td>
                                            <td className="p-4 text-slate-600">{u.region}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button className="p-1 text-slate-400 hover:text-blue-600"><Edit2 size={16}/></button>
                                                <button className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                   </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Settings;
