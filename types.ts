
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LIVE_RESULTS = 'LIVE_RESULTS',
  COMMUNICATION = 'COMMUNICATION',
  AI_INSIGHTS = 'AI_INSIGHTS',
  SYSTEM_HEALTH = 'SYSTEM_HEALTH',
  AUDIT_LOGS = 'AUDIT_LOGS',
  DEVELOPER = 'DEVELOPER',
  SETTINGS = 'SETTINGS',
  LOGIN = 'LOGIN'
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  color: string;
}

export interface PollingUnitResult {
  id: string;
  unitName: string;
  region: string;
  registeredVoters: number;
  accreditedVoters: number;
  votes: Record<string, number>; // partyId -> count
  status: 'pending' | 'verified' | 'rejected' | 'flagged';
  timestamp: string;
  imageUrl?: string; // Proof of result
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  read?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'observer' | 'analyst';
  avatar?: string;
}

export interface AnomalyReport {
  unitId: string;
  unitName: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  body: string;
  channels: ('sms' | 'email' | 'push')[];
  status: 'sent' | 'scheduled' | 'failed';
  sentAt: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
}

// Backend & Mobile Monitoring Types

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  latency: number;
  details: string;
}

export interface MobileDevice {
  deviceId: string;
  agentName: string;
  appVersion: string;
  batteryLevel: number;
  lastSync: string;
  status: 'online' | 'offline';
  location: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failure' | 'warning';
  details: string;
}
