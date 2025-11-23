import React from 'react';
import { BACKEND_SERVICES, CONNECTED_DEVICES } from '../constants';
import { Activity, Smartphone, Battery, Wifi, WifiOff, Server, Clock, AlertTriangle } from 'lucide-react';

const SystemHealth: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Backend Services Grid */}
      <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Server size={20} className="text-blue-600"/>
              Backend Infrastructure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BACKEND_SERVICES.map((service, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                        service.status === 'operational' ? 'bg-green-500' : 
                        service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800">{service.name}</h4>
                        {service.status === 'operational' ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase bg-green-50 px-2 py-1 rounded">
                                <Activity size={12} /> Operational
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-yellow-600 text-xs font-bold uppercase bg-yellow-50 px-2 py-1 rounded">
                                <AlertTriangle size={12} /> {service.status}
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mt-4">
                        <div className="flex justify-between">
                            <span>Uptime</span>
                            <span className="font-mono font-medium">{service.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Latency</span>
                            <span className="font-mono font-medium">{service.latency}ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Details</span>
                            <span className="font-mono text-xs">{service.details}</span>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      </div>

      {/* Mobile Devices Section */}
      <div>
          <div className="flex justify-between items-center mb-4 mt-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Smartphone size={20} className="text-purple-600"/>
                Mobile Agents (React Native)
            </h3>
            <span className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                {CONNECTED_DEVICES.filter(d => d.status === 'online').length} Online
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Agent / Device</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Status</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Battery</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">App Version</th>
                          <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Last Sync</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {CONNECTED_DEVICES.map((device) => (
                          <tr key={device.deviceId} className="hover:bg-slate-50/50">
                              <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                          <Smartphone size={16} />
                                      </div>
                                      <div>
                                          <p className="font-medium text-slate-800">{device.agentName}</p>
                                          <p className="text-xs text-slate-400">{device.deviceId} • {device.location}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="py-4 px-6">
                                  {device.status === 'online' ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                          <Wifi size={12} /> Online
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                          <WifiOff size={12} /> Offline
                                      </span>
                                  )}
                              </td>
                              <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                      <Battery size={16} className={`${
                                          device.batteryLevel < 20 ? 'text-red-500' : 
                                          device.batteryLevel < 50 ? 'text-yellow-500' : 'text-green-500'
                                      }`} />
                                      <span className="text-sm text-slate-700">{device.batteryLevel}%</span>
                                  </div>
                              </td>
                              <td className="py-4 px-6">
                                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">v{device.appVersion}</span>
                              </td>
                              <td className="py-4 px-6">
                                  <div className="flex items-center gap-1 text-sm text-slate-500">
                                      <Clock size={14} />
                                      {device.lastSync}
                                  </div>
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

export default SystemHealth;