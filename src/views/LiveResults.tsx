import React, { useState } from 'react';
import { PollingUnitResult, Candidate } from '../types';
import { Search, Filter, Check, X, AlertCircle, MapPin } from 'lucide-react';

interface LiveResultsProps {
  results: PollingUnitResult[];
  candidates: Candidate[];
  onVerify: (id: string, status: 'verified' | 'rejected') => void;
}

const LiveResults: React.FC<LiveResultsProps> = ({ results, candidates, onVerify }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredResults = results.filter(r => {
    const matchesSearch = r.unitName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search polling units..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            {['all', 'pending', 'verified', 'flagged'].map((status) => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border capitalize transition-colors ${
                        statusFilter === status 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Info</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stats</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Votes Breakdown</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredResults.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{r.unitName}</p>
                                        <p className="text-xs text-slate-500">ID: {r.id}</p>
                                        <p className="text-xs text-slate-500">{r.region}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-600">
                                        <span>Reg:</span> <span className="font-medium">{r.registeredVoters}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-600">
                                        <span>Acc:</span> <span className="font-medium">{r.accreditedVoters}</span>
                                    </div>
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                                        <div 
                                            className="h-full bg-blue-500" 
                                            style={{ width: `${Math.min(100, (r.accreditedVoters / r.registeredVoters) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="space-y-1.5">
                                    {candidates.map(c => (
                                        <div key={c.id} className="flex items-center gap-2 text-xs">
                                            <span className="w-8 font-bold text-slate-500">{c.party}</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full" 
                                                    style={{ width: `${Math.min(100, (r.votes[c.id] || 0) / r.accreditedVoters * 100)}%`, backgroundColor: c.color }} 
                                                />
                                            </div>
                                            <span className="w-8 text-right text-slate-700">{r.votes[c.id] || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                     ${r.status === 'verified' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                       r.status === 'flagged' ? 'bg-red-100 text-red-800 border border-red-200' : 
                                       'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                     {r.status === 'flagged' && <AlertCircle size={12} />}
                                     {r.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                {r.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => onVerify(r.id, 'verified')}
                                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                                            title="Verify"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button 
                                            onClick={() => onVerify(r.id, 'rejected')}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                                            title="Reject"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                                {r.status === 'flagged' && (
                                    <button className="text-xs text-red-600 underline font-medium hover:text-red-800">Review Anomaly</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredResults.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    <p>No results found matching criteria.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LiveResults;