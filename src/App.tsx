
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import UserDashboard from './views/UserDashboard'; 
import Login from './views/Login'; 
import LiveResults from './views/LiveResults';
import Communication from './views/Communication';
import AIInsights from './views/AIInsights';
import SystemHealth from './views/SystemHealth';
import AuditLogs from './views/AuditLogs';
import DeveloperResources from './views/DeveloperResources';
import Settings from './views/Settings';
import { ViewState, PollingUnitResult, User, Notification } from './types';
import { MOCK_RESULTS, CANDIDATES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [results, setResults] = useState<PollingUnitResult[]>(MOCK_RESULTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Simulate WebSocket Live Data Feed
  useEffect(() => {
    if (!user) return; // Only run feed if logged in

    const interval = setInterval(() => {
        // 1. Simulating random updates to existing or new units
        if (Math.random() > 0.7) {
            const randomId = `PU-${100 + Math.floor(Math.random() * 50)}`;
            const newResult: PollingUnitResult = {
                id: randomId,
                unitName: `Unit ${randomId} - Simulated`,
                region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)] + ' District',
                registeredVoters: 500,
                accreditedVoters: Math.floor(Math.random() * 450),
                votes: { 'party_a': Math.floor(Math.random() * 200), 'party_b': Math.floor(Math.random() * 200), 'party_c': Math.floor(Math.random() * 50) },
                status: 'pending',
                timestamp: new Date().toISOString()
            };
            setResults(prev => [newResult, ...prev]);
            
            // 2. Push Notification for New Result
            const newNotif: Notification = {
                id: Date.now().toString(),
                title: 'New Result Uploaded',
                message: `Polling Unit ${randomId} just submitted results.`,
                type: 'info',
                timestamp: new Date(),
                read: false
            };
            setNotifications(prev => [newNotif, ...prev]);
        }

        // 3. Random Anomaly Simulation
        if (Math.random() > 0.9) {
             const alertNotif: Notification = {
                id: `alert-${Date.now()}`,
                title: 'Anomaly Detected',
                message: 'AI Flagged: Turnout > 95% in West District.',
                type: 'warning',
                timestamp: new Date(),
                read: false
            };
            setNotifications(prev => [alertNotif, ...prev]);
        }

    }, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleVerify = (id: string, status: 'verified' | 'rejected') => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.DASHBOARD);
  };

  // Login Screen Guard
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        // Route based on Role
        if (user.role === 'admin') {
            return <Dashboard results={results} candidates={CANDIDATES} />;
        } else {
            return <UserDashboard user={user} />;
        }
      case ViewState.LIVE_RESULTS:
        return <LiveResults results={results} candidates={CANDIDATES} onVerify={handleVerify} />;
      case ViewState.COMMUNICATION:
        return <Communication />;
      case ViewState.AI_INSIGHTS:
        return <AIInsights results={results} />;
      case ViewState.SYSTEM_HEALTH:
        return <SystemHealth />;
      case ViewState.AUDIT_LOGS:
        return <AuditLogs />;
      case ViewState.DEVELOPER:
        return <DeveloperResources />;
      case ViewState.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard results={results} candidates={CANDIDATES} />;
    }
  };

  // Helper to get friendly title
  const getTitle = () => {
      if (currentView === ViewState.DASHBOARD && user.role === 'observer') {
          return 'My Polling Station';
      }
      switch(currentView) {
          case ViewState.DASHBOARD: return 'Command Center';
          case ViewState.LIVE_RESULTS: return 'Live Results Verification';
          case ViewState.COMMUNICATION: return 'Team Communication';
          case ViewState.AI_INSIGHTS: return 'AI Audit & Insights';
          case ViewState.SYSTEM_HEALTH: return 'System Health Monitor';
          case ViewState.AUDIT_LOGS: return 'Security Audit Logs';
          case ViewState.DEVELOPER: return 'Developer Source Code';
          case ViewState.SETTINGS: return 'System Configuration';
          default: return 'Dashboard';
      }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="flex-1 ml-64 flex flex-col h-screen">
        <Header 
            title={getTitle()} 
            notifications={notifications} 
            onClearNotifications={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
        />
        
        <div className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
