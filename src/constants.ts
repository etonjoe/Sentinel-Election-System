import { Candidate, PollingUnitResult, ChatMessage, BroadcastMessage, ServiceStatus, MobileDevice, AuditLog } from './types';

export const CANDIDATES: Candidate[] = [
  { id: 'party_a', name: 'Alliance for Progress', party: 'AFP', color: '#3b82f6' }, // Blue
  { id: 'party_b', name: 'National Democratic Union', party: 'NDU', color: '#ef4444' }, // Red
  { id: 'party_c', name: 'Liberal Green Party', party: 'LGP', color: '#22c55e' }, // Green
];

export const MOCK_RESULTS: PollingUnitResult[] = [
  {
    id: 'PU-101',
    unitName: 'Central Station Hall A',
    region: 'North District',
    registeredVoters: 500,
    accreditedVoters: 450,
    votes: { 'party_a': 200, 'party_b': 180, 'party_c': 60 },
    status: 'verified',
    timestamp: new Date(Date.now() - 100000).toISOString()
  },
  {
    id: 'PU-102',
    unitName: 'Community School Ward 4',
    region: 'North District',
    registeredVoters: 800,
    accreditedVoters: 300,
    votes: { 'party_a': 100, 'party_b': 150, 'party_c': 40 },
    status: 'pending',
    timestamp: new Date(Date.now() - 200000).toISOString()
  },
  {
    id: 'PU-103',
    unitName: 'Market Square Booth 2',
    region: 'East District',
    registeredVoters: 1200,
    accreditedVoters: 1150,
    votes: { 'party_a': 600, 'party_b': 500, 'party_c': 40 },
    status: 'flagged', // Suspiciously high turnout
    timestamp: new Date(Date.now() - 50000).toISOString()
  },
  {
    id: 'PU-104',
    unitName: 'Riverside Complex',
    region: 'South District',
    registeredVoters: 600,
    accreditedVoters: 550,
    votes: { 'party_a': 300, 'party_b': 200, 'party_c': 45 },
    status: 'verified',
    timestamp: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'PU-105',
    unitName: 'Hilltop Center',
    region: 'West District',
    registeredVoters: 400,
    accreditedVoters: 410, // Anomaly: Accredited > Registered
    votes: { 'party_a': 200, 'party_b': 200, 'party_c': 5 },
    status: 'pending',
    timestamp: new Date(Date.now() - 5000).toISOString()
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  { id: '1', sender: 'Field Agent Sarah', text: 'Unit 105 is reporting network issues. Switching to SMS upload.', timestamp: new Date(Date.now() - 3600000), isMe: false },
  { id: '2', sender: 'System', text: 'Unit 105 results received via SMS Gateway.', timestamp: new Date(Date.now() - 3500000), isMe: false },
  { id: '3', sender: 'Me', text: 'Copy that. Please verify the physical result sheet matches.', timestamp: new Date(Date.now() - 3400000), isMe: true },
  { id: '4', sender: 'Field Agent Sarah', text: 'On it. Sending photo now.', timestamp: new Date(Date.now() - 3300000), isMe: false },
];

export const BROADCAST_HISTORY: BroadcastMessage[] = [
  { id: 'bc-1', title: 'Polls Closing Soon', body: 'Attention all agents: Polls close in 30 minutes. Ensure queue management.', channels: ['sms', 'push'], status: 'sent', sentAt: '16:30' },
  { id: 'bc-2', title: 'Urgent: Upload Sync', body: 'Server maintenance complete. Retry failed uploads.', channels: ['push'], status: 'sent', sentAt: '14:00' },
];

export const BACKEND_SERVICES: ServiceStatus[] = [
  { name: 'Django API Gateway', status: 'operational', uptime: '99.98%', latency: 45, details: 'v2.4.1' },
  { name: 'PostgreSQL Database', status: 'operational', uptime: '99.99%', latency: 12, details: 'Primary Cluster' },
  { name: 'Redis Cache', status: 'operational', uptime: '100%', latency: 2, details: 'Cache Hit Ratio: 94%' },
  { name: 'Celery Workers', status: 'degraded', uptime: '98.50%', latency: 210, details: 'High Queue Load (SMS)' },
  { name: 'Twilio SMS Gateway', status: 'operational', uptime: '99.95%', latency: 150, details: 'API Connected' },
];

export const CONNECTED_DEVICES: MobileDevice[] = [
  { deviceId: 'DEV-8821', agentName: 'Agent Sarah', appVersion: '1.2.0', batteryLevel: 78, lastSync: '2 mins ago', status: 'online', location: 'North District' },
  { deviceId: 'DEV-9912', agentName: 'Agent Mike', appVersion: '1.1.9', batteryLevel: 15, lastSync: '1 hour ago', status: 'offline', location: 'East District' },
  { deviceId: 'DEV-7734', agentName: 'Agent John', appVersion: '1.2.0', batteryLevel: 92, lastSync: 'Just now', status: 'online', location: 'West District' },
  { deviceId: 'DEV-3321', agentName: 'Agent Lisa', appVersion: '1.2.0', batteryLevel: 45, lastSync: '5 mins ago', status: 'online', location: 'South District' },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', action: 'USER_LOGIN', user: 'admin@sentinel.com', role: 'Super Admin', ipAddress: '192.168.1.1', timestamp: new Date(Date.now() - 60000).toISOString(), status: 'success', details: 'MFA Verified' },
  { id: 'log-2', action: 'RESULT_UPLOAD', user: 'agent.sarah', role: 'Observer', ipAddress: '10.45.12.1', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success', details: 'Uploaded PU-105 Results' },
  { id: 'log-3', action: 'FAILED_LOGIN', user: 'unknown', role: 'N/A', ipAddress: '45.22.11.9', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'failure', details: 'Invalid Password (3 attempts)' },
  { id: 'log-4', action: 'CONFIG_CHANGE', user: 'admin.joe', role: 'Admin', ipAddress: '192.168.1.5', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'warning', details: 'Changed API Rate Limits' },
];