import { 
  Device, 
  Alarm, 
  AnomalyResult, 
  TopologyData, 
  DashboardSummary 
} from '../types';
import { 
  mockDevices, 
  mockAlarms, 
  mockIncidents, 
  mockTopology, 
  mockDashboardSummary 
} from '../data/mockData';

// Simulated API Latency helper to verify loading states cleanly
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Dashboard API
export async function getDashboardSummary(): Promise<DashboardSummary> {
  await delay(150);
  return { ...mockDashboardSummary };
}

// Devices API
export async function getDevices(search?: string, role?: string): Promise<Device[]> {
  await delay(150);
  let list = [...mockDevices];
  if (search && search.trim() !== '') {
    const q = search.toLowerCase();
    list = list.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.ipAddress.toLowerCase().includes(q) || 
      d.id.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q)
    );
  }
  if (role && role !== 'all') {
    list = list.filter(d => d.role.toLowerCase().includes(role.toLowerCase()));
  }
  return list;
}

export async function getDeviceById(id: string): Promise<Device | undefined> {
  await delay(150);
  return mockDevices.find(d => d.id.toLowerCase() === id.toLowerCase());
}

// Alarms API
export async function getAlarms(filters?: { 
  search?: string; 
  severity?: string; 
  status?: string; 
  deviceId?: string; 
}): Promise<Alarm[]> {
  await delay(150);
  let list = [...mockAlarms];
  if (!filters) return list;

  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase();
    list = list.filter(a => 
      a.id.toLowerCase().includes(q) || 
      a.title.toLowerCase().includes(q) || 
      a.deviceName.toLowerCase().includes(q) ||
      (a.interfaceName && a.interfaceName.toLowerCase().includes(q))
    );
  }
  if (filters.severity && filters.severity !== 'all') {
    list = list.filter(a => a.severity.toLowerCase() === filters.severity?.toLowerCase() || a.severityLabel.toLowerCase() === filters.severity?.toLowerCase());
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter(a => a.status.toLowerCase() === filters.status?.toLowerCase());
  }
  if (filters.deviceId && filters.deviceId !== 'all') {
    list = list.filter(a => a.deviceId.toLowerCase() === filters.deviceId?.toLowerCase());
  }
  return list;
}

export async function getAlarmById(id: string): Promise<Alarm | undefined> {
  await delay(150);
  return mockAlarms.find(a => a.id.toLowerCase() === id.toLowerCase());
}

// AI / RCA Incidents API (Primary integration point for Kumaran's ML Pipeline)
export async function getIncidents(): Promise<AnomalyResult[]> {
  await delay(150);
  return [...mockIncidents];
}

export async function getIncidentById(id: string): Promise<AnomalyResult | undefined> {
  await delay(150);
  return mockIncidents.find(inc => inc.incidentId.toLowerCase() === id.toLowerCase());
}

export async function mitigateIncident(incidentId: string): Promise<{ success: boolean; message: string }> {
  await delay(600);
  const inc = mockIncidents.find(i => i.incidentId === incidentId);
  if (inc) {
    inc.mitigationStatus = 'applied';
    inc.mitigatedTime = 'Just now';
    return { success: true, message: `Mitigation applied: Traffic shifted away from ${inc.affectedDeviceId}` };
  }
  return { success: false, message: `Incident ${incidentId} not found` };
}

export async function acknowledgeIncident(incidentId: string): Promise<{ success: boolean; message: string }> {
  await delay(300);
  return { success: true, message: `Incident ${incidentId} acknowledged by NOC Operator` };
}

// Topology API
export async function getTopology(): Promise<TopologyData> {
  await delay(150);
  return JSON.parse(JSON.stringify(mockTopology));
}
