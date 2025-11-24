
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { PollingUnitResult, Candidate } from '../types';
import { Users, Vote, AlertTriangle, CheckCircle2, TrendingUp, Map } from 'lucide-react';

interface DashboardProps {
  results: PollingUnitResult[];
  candidates: Candidate[];
}

const Dashboard: React.FC<DashboardProps> = ({ results, candidates }) => {
  // Compute Stats
  const totalRegistered = results.reduce((sum, r) => sum + r.registeredVoters, 0);
  const totalAccredited = results.reduce((sum, r) => sum + r.accreditedVoters, 0);
  const turnout = totalRegistered ? ((totalAccredited / totalRegistered) * 100).toFixed(1) : '0';
  
  const totalVotesByParty: Record<string, number> = {};
  candidates.forEach(c => totalVotesByParty[c.id] = 0);

  // Regional Breakdown
  const regionalStats: Record<string, number> = {};

  let pendingCount = 0;
  let verifiedCount = 0;
  let flaggedCount = 0;

  results.forEach(r => {
    if (r.status === 'pending') pendingCount++;
    if (r.status === 'verified') verifiedCount++;
    if (r.status === 'flagged') flaggedCount++;
    
    // Regional Data
    if (regionalStats[r.region]) {
        regionalStats[r.region] += r.accreditedVoters;
    } else {
        regionalStats[r.region] = r.accreditedVoters;
    }

    Object.entries(r.votes).forEach(([partyId, count]) => {
        if (totalVotesByParty[partyId] !== undefined) {
            totalVotesByParty[partyId] += count as number;
        }
    });
  });

  const chartData = candidates.map(c => ({
    name: c.party,
    votes: totalVotesByParty[c.id],
    fill: c.color
  }));

  const statusData = [
    { name: 'Verified', value: verifiedCount, color: '#22c55e' },
    { name: 'Pending', value: pendingCount, color: '#eab308' },
    { name: 'Flagged', value: flaggedCount, color: '#ef4444' },
  ];

  const regionalData = Object.keys(regionalStats).map((region, index) => ({
      name: region,
      value: regionalStats[region],
      fill: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]
  }));

  // Mock Time Data for Line Chart (Velocity)
  const timeData = [
      { time: '08:00', submissions: 12 },
      { time: '10:00', submissions: 45 },
      { time: '12:00', submissions: 120 },
      { time: '14:00', submissions: 210 },
      { time: '16:00', submissions: 350 },
      { time: '18:00', submissions: results.length }, // Current
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="Total Registered" 
            value={totalRegistered.toLocaleString()} 
            icon={Users} 
            trend="+2.5% vs 2020" 
            color="blue"
        />
        <StatCard 
            title="Accredited Voters" 
            value={totalAccredited.toLocaleString()} 
            subValue={`${turnout}% Turnout`}
            icon={Vote} 
            color="indigo"
        />
        <StatCard 
            title="Units Reported" 
            value={`${results.length}/500`} 
            subValue="Live Feed"
            icon={CheckCircle2} 
            color="green"
        />
        <StatCard 
            title="Active Alerts" 
            value={flaggedCount.toString()} 
            subValue="Requires Attention"
            icon={AlertTriangle} 
            color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Live Vote Count by Party</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Submission Status</h3>
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={statusData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
                <p className="text-sm text-slate-500">Total Units</p>
                <p className="text-2xl font-bold text-slate-800">{results.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Velocity (Line Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-slate-800">Submission Velocity</h3>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeData}>
                        <defs>
                            <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="#94a3b8" />
                        <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <Tooltip />
                        <Area type="monotone" dataKey="submissions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSub)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Regional Breakdown (Bar/List) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
                <Map className="text-indigo-600" size={20} />
                <h3 className="text-lg font-semibold text-slate-800">Regional Distribution</h3>
            </div>
            <div className="space-y-4">
                {regionalData.map((region, idx) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-slate-700">{region.name}</span>
                            <span className="text-sm font-bold text-slate-900">{region.value} Votes</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${(region.value / totalAccredited) * 100}%`, backgroundColor: region.fill }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Recent Activity Ticker */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h3 className="text-lg font-semibold mb-4 text-slate-800">Recent Submissions</h3>
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                         <th className="py-3 px-2">Time</th>
                         <th className="py-3 px-2">Polling Unit</th>
                         <th className="py-3 px-2">Region</th>
                         <th className="py-3 px-2">Status</th>
                         <th className="py-3 px-2 text-right">Turnout</th>
                     </tr>
                 </thead>
                 <tbody>
                     {results.slice(0, 5).map((r) => (
                         <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                             <td className="py-3 px-2 text-sm text-slate-600">{new Date(r.timestamp).toLocaleTimeString()}</td>
                             <td className="py-3 px-2 text-sm font-medium text-slate-800">{r.unitName}</td>
                             <td className="py-3 px-2 text-sm text-slate-600">{r.region}</td>
                             <td className="py-3 px-2">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                     ${r.status === 'verified' ? 'bg-green-100 text-green-800' : 
                                       r.status === 'flagged' ? 'bg-red-100 text-red-800' : 
                                       'bg-yellow-100 text-yellow-800'}`}>
                                     {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                 </span>
                             </td>
                             <td className="py-3 px-2 text-sm text-right text-slate-800">
                                 {((r.accreditedVoters / r.registeredVoters) * 100).toFixed(1)}%
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

// Helper Component for Stats
const StatCard = ({ title, value, icon: Icon, trend, subValue, color }: any) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
            </div>
            {(trend || subValue) && (
                <div className="flex items-center gap-2">
                    {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
                    {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
                </div>
            )}
        </div>
    )
}

export default Dashboard;
