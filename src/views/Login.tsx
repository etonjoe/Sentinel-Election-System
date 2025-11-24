import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, User, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (role: 'admin' | 'observer') => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      const user: UserType = {
        id: role === 'admin' ? 'usr-1' : 'usr-2',
        name: role === 'admin' ? 'Admin User' : 'Sarah Jenkins',
        role: role,
        avatar: 'https://ui-avatars.com/api/?name=' + (role === 'admin' ? 'Admin' : 'Sarah'),
      };
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col">
        <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Sentinel Monitor</h2>
          <p className="text-slate-500 text-sm mt-1">Secure Election Management System</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="user@sentinel.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              Remember me
            </label>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Forgot password?
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs text-center text-slate-400 uppercase tracking-wider font-bold">Select Role to Demo</p>
            
            <button 
              onClick={() => handleLogin('admin')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 group disabled:opacity-70"
            >
              <Shield size={18} className="text-blue-400" />
              <span className="font-medium">Log in as Admin</span>
              <ArrowRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
              onClick={() => handleLogin('observer')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group disabled:opacity-70"
            >
              <User size={18} className="text-green-500" />
              <span className="font-medium">Log in as Field Agent</span>
              <ArrowRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Protected by <span className="font-bold text-slate-700">Gemini AI Security</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;