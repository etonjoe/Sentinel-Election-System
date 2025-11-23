import React, { useState } from 'react';
import { AUDIT_LOGS } from '../constants';
import { Search, ShieldAlert, Filter, Download } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = AUDIT_LOGS.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-md relative overflow-hidden">
          <div className="relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShieldAlert className="text-indigo-300" />
                  Security & Audit Trail
              </h2>
              <p className="text-indigo-200 text-sm mt-1">
                  Real-time immutable logs from PostgreSQL. Any suspicious activity is flagged by the Anomaly Detection Engine.
              </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-indigo-800/50 skew-x-12 transform translate-x-12"></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                      type="text" 
                      placeholder="Search user, IP, or action..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <Filter size={16} /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100">
                      <Download size={16} /> Export CSV
                  </button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Action</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">User</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">IP Address</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Status</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Details</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                      {filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-6 text-slate-500 font-mono text-xs">
                                  {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-6 font-medium text-slate-800">
                                  {log.action}
                              </td>
                              <td className="py-3 px-6">
                                  <div className="flex flex-col">
                                      <span className="text-slate-800">{log.user}</span>
                                      <span className="text-xs text-slate-400">{log.role}</span>
                                  </div>
                              </td>
                              <td className="py-3 px-6 font-mono text-slate-600 text-xs">
                                  {log.ipAddress}
                              </td>
                              <td className="py-3 px-6">
                                  {log.status === 'success' && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Success</span>}
                                  {log.status === 'failure' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Failure</span>}
                                  {log.status === 'warning' && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">Warning</span>}
                              </td>
                              <td className="py-3 px-6 text-slate-600 max-w-xs truncate" title={log.details}>
                                  {log.details}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              {filteredLogs.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                      No logs found matching your criteria.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default AuditLogs;