import React from 'react';
import { User, PollingUnitResult } from '../types';
import { MapPin, UploadCloud, CheckCircle, AlertTriangle, Clock, FileText, Camera } from 'lucide-react';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  // Mock data for a specific agent
  const assignedUnit: PollingUnitResult = {
    id: 'PU-105',
    unitName: 'Hilltop Center',
    region: 'West District',
    registeredVoters: 400,
    accreditedVoters: 0, // Not yet submitted in this view context simulation
    votes: {},
    status: 'pending',
    timestamp: new Date().toISOString()
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-blue-100">Field Agent • West District Team</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
          <MapPin size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks & Unit Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Assigned Unit Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="text-red-500" size={20} />
                Assigned Polling Unit
              </h3>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                ACTIVE
              </span>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Unit Name</p>
                    <p className="text-xl font-bold text-slate-900">{assignedUnit.unitName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Unit ID</p>
                      <p className="font-mono text-slate-700">{assignedUnit.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Region</p>
                      <p className="text-slate-700">{assignedUnit.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Registered Voters</p>
                      <p className="text-slate-700 font-semibold">{assignedUnit.registeredVoters}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-2 w-full md:w-48 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20">
                    <UploadCloud size={18} />
                    Upload Results
                  </button>
                  <button className="flex items-center justify-center gap-2 w-full md:w-48 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                    <AlertTriangle size={18} />
                    Report Incident
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submission History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="text-slate-400" size={20} />
                Submission History
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${i === 1 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Accreditation Report {i === 1 ? 'Final' : 'Mid-day'}</p>
                      <p className="text-xs text-slate-500">Submitted at {i === 1 ? '14:30' : '11:00'}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                    i === 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {i === 1 ? 'Verified' : 'Processing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Status & Guidance */}
        <div className="space-y-6">
           {/* Status Card */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-800 mb-4">Agent Status</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm text-slate-600">Connection</span>
                 <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   Online
                 </span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm text-slate-600">Battery</span>
                 <span className="text-xs font-bold text-slate-800">85%</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm text-slate-600">Location</span>
                 <span className="text-xs font-bold text-blue-600">Tracking Active</span>
               </div>
             </div>
           </div>

           {/* Checklist */}
           <div className="bg-indigo-900 rounded-xl shadow-sm p-6 text-white">
             <h3 className="font-bold mb-4 flex items-center gap-2">
               <CheckCircle size={18} className="text-indigo-300"/>
               Election Day Checklist
             </h3>
             <ul className="space-y-3">
               {[
                 { text: "Arrive at Polling Unit", done: true },
                 { text: "Verify Materials", done: true },
                 { text: "Accreditation Start", done: true },
                 { text: "Report Turnout (Mid-day)", done: true },
                 { text: "Voting Ended", done: false },
                 { text: "Count & Result Upload", done: false },
               ].map((item, idx) => (
                 <li key={idx} className="flex items-start gap-3 text-sm opacity-90">
                   <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                     item.done ? 'bg-green-500 border-green-500' : 'border-indigo-400'
                   }`}>
                     {item.done && <CheckCircle size={12} className="text-white" />}
                   </div>
                   <span className={item.done ? 'line-through text-indigo-300' : ''}>{item.text}</span>
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;