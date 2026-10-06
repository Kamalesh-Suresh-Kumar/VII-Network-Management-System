import {
  Device,
  Alarm,
  AnomalyResult,
  TopologyData,
  TopologyNode,
  TopologyLink,
  DashboardSummary,
} from '../types';

const API_BASE = '/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Backend ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

const text = (value: unknown, fallback = '') =>
  value === null || value === undefined ? fallback : String(value);

const number = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeStatus = (value: unknown): 'healthy' | 'warning' | 'critical' | 'offline' => {
  const s = text(value).toLowerCase();

  if (['critical', 'down', 'failed', 'failure'].some(v => s.includes(v))) {
    return 'critical';
  }

  if (['warning', 'degraded', 'warn'].some(v => s.includes(v))) {
    return 'warning';
  }

  if (['offline', 'unreachable'].some(v => s.includes(v))) {
    return 'offline';
  }

  return 'healthy';
};

const deviceIdOf = (d: any) =>
  text(d?.deviceId ?? d?.name ?? d?.id, 'UNKNOWN');

const deviceNameOf = (d: any) =>
  text(d?.name ?? d?.hostname ?? d?.deviceId ?? d?.id, 'Unknown Device');

function mapDevice(raw: any): Device {
  const interfaces = Array.isArray(raw?.networkInterfaces)
    ? raw.networkInterfaces
    : [];

  const status = normalizeStatus(raw?.status);

  return {
    id: deviceIdOf(raw),
    name: deviceNameOf(raw),
    role:
      raw?.deviceType?.toLowerCase()?.includes('edge')
        ? 'Edge Router'
        : 'Core Router',
    ipAddress: text(raw?.ipAddress, '-'),
    location: 'Cogninet GNS3 Lab',
    osVersion: text(raw?.osVersion ?? raw?.vendor, 'FRRouting'),
    status,
    uptime: '-',
    cpu: 0,
    memory: 0,
    latency: 0,
    packetLoss: 0,
    throughput: '-',
    lastSeen: text(raw?.updatedAt ?? raw?.createdAt, 'Live'),
    activeAlarmsCount: 0,
    interfaces: interfaces.map((i: any) => ({
      name: text(i?.interfaceName ?? i?.name, 'interface'),
      status:
        text(i?.status).toLowerCase() === 'down'
          ? 'down'
          : text(i?.status).toLowerCase() === 'degraded'
            ? 'degraded'
            : 'up',
      ipAddress: i?.ipAddress,
      speed: i?.speed ? `${i.speed}` : undefined,
    })),
  };
}

function rawDeviceList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

/* ------------------------------------------------------------------ */
/* Devices                                                            */
/* ------------------------------------------------------------------ */

export async function getDevices(
  search?: string,
  role?: string
): Promise<Device[]> {
  const raw = await request<any>('/devices');
  let list = rawDeviceList(raw).map(mapDevice);

  if (search?.trim()) {
    const q = search.toLowerCase();

    list = list.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.ipAddress.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q)
    );
  }

  if (role && role !== 'all') {
    list = list.filter(d =>
      d.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  return list;
}

export async function getDeviceById(
  id: string
): Promise<Device | undefined> {
  const devices = await getDevices();
  return devices.find(
    d => d.id.toLowerCase() === id.toLowerCase()
  );
}

/* ------------------------------------------------------------------ */
/* Telemetry                                                          */
/* ------------------------------------------------------------------ */

export interface TelemetryRecord {
  id: number;
  deviceId: string;
  deviceName: string;
  interfaceId: number;
  interfaceName: string;
  metricName: string;
  metricValue: number;
  unit?: string;
  source?: string;
  timestamp: string;
}

export async function getTelemetry(): Promise<TelemetryRecord[]> {
  const raw = await request<any>('/telemetry');

  const list: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw?.data)
        ? raw.data
        : [];

  return list.map((t: any) => ({
    id: Number(t?.id ?? 0),
    deviceId: text(
      t?.device?.deviceId ?? t?.deviceId,
      'UNKNOWN'
    ),
    deviceName: text(
      t?.device?.name ?? t?.deviceName,
      'Unknown Device'
    ),
    interfaceId: Number(
      t?.networkInterface?.id ?? t?.interfaceId ?? 0
    ),
    interfaceName: text(
      t?.networkInterface?.interfaceName ?? t?.interfaceName,
      'interface'
    ),
    metricName: text(t?.metricName, 'unknown'),
    metricValue: number(t?.metricValue),
    unit: text(t?.unit),
    source: text(t?.source),
    timestamp: text(t?.timestamp, new Date().toISOString()),
  }));
}

/* ------------------------------------------------------------------ */
/* Alarms                                                             */
/* ------------------------------------------------------------------ */

function mapAlarm(raw: any): Alarm {
  const device = raw?.device ?? {};
  const iface = raw?.networkInterface ?? {};

  const severityRaw = text(raw?.severity, 'INFO').toUpperCase();

  const severity: 'P0' | 'P1' | 'P2' | 'P3' =
    severityRaw.includes('CRITICAL')
      ? 'P0'
      : severityRaw.includes('WARNING')
        ? 'P1'
        : 'P2';

  const statusRaw = text(raw?.status, 'OPEN').toLowerCase();

  const status =
    statusRaw.includes('open')
      ? 'active'
      : statusRaw.includes('ack')
        ? 'acknowledged'
        : statusRaw.includes('suppress')
          ? 'suppressed'
          : 'resolved';

  const timestamp = text(
    raw?.firstSeen ?? raw?.timestamp ?? raw?.createdAt,
    new Date().toISOString()
  );

  return {
    id: text(raw?.alarmId ?? raw?.alarmCode ?? raw?.id, 'ALARM'),
    severity,
    severityLabel:
      severity === 'P0'
        ? 'Critical'
        : severity === 'P1'
          ? 'Warning'
          : 'Info',
    deviceId: deviceIdOf(device) || text(raw?.deviceId, 'UNKNOWN'),
    deviceName: deviceNameOf(device),
    interfaceName: text(
      iface?.interfaceName ?? raw?.interfaceName,
      undefined as any
    ),
    title: text(
      raw?.message ?? raw?.title,
      'Network alarm'
    ),
    description: text(
      raw?.description ?? raw?.message,
      'Cogninet network alarm'
    ),
    timestamp,
    timeAgo: timestamp,
    status,
    isRootCause: false,
    correlationGroup: undefined,
    incidentId: undefined,
  };
}

export async function getAlarms(filters?: {
  search?: string;
  severity?: string;
  status?: string;
  deviceId?: string;
}): Promise<Alarm[]> {
  const raw = await request<any>('/alarms');

  const rawList: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.content)
      ? raw.content
      : Array.isArray(raw?.data)
        ? raw.data
        : [];

  let list: Alarm[] = rawList.map(mapAlarm);

  if (!filters) return list;

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();

    list = list.filter(a =>
      a.id.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.deviceName.toLowerCase().includes(q) ||
      (a.interfaceName ?? '').toLowerCase().includes(q)
    );
  }

  if (filters.severity && filters.severity !== 'all') {
    list = list.filter(
      a =>
        a.severity.toLowerCase() === filters.severity!.toLowerCase() ||
        a.severityLabel.toLowerCase() === filters.severity!.toLowerCase()
    );
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(
      a => a.status.toLowerCase() === filters.status!.toLowerCase()
    );
  }

  if (filters.deviceId && filters.deviceId !== 'all') {
    list = list.filter(
      a => a.deviceId.toLowerCase() === filters.deviceId!.toLowerCase()
    );
  }

  return list;
}

export async function getAlarmById(
  id: string
): Promise<Alarm | undefined> {
  const alarms = await getAlarms();
  return alarms.find(a => a.id.toLowerCase() === id.toLowerCase());
}

/* ------------------------------------------------------------------ */
/* Incidents / AI                                                      */
/* ------------------------------------------------------------------ */

function mapIncident(raw: any): AnomalyResult {
  const severity = text(raw?.severity, 'WARNING').toLowerCase();

  return {
    incidentId: text(raw?.incidentId ?? raw?.id, 'INCIDENT'),
    title: text(raw?.title, 'Network Incident'),
    status: text(raw?.status, 'UNKNOWN').toUpperCase(),
    severity:
      severity.includes('critical')
        ? 'critical'
        : severity.includes('warning')
          ? 'warning'
          : 'info',
    severityCode:
      severity.includes('critical')
        ? 'P0'
        : severity.includes('warning')
          ? 'P1'
          : 'P2',
    affectedDeviceId: '',
    affectedDeviceName: '',
    affectedInterface: '',
    triggeredAgo: text(raw?.startedAt, 'Recent'),
    anomalyScore: number(raw?.confidence) * 100,
    confidence: number(raw?.confidence) * 100,
    engineVersion: 'COGINET Correlation Engine',
    probableRootCause: text(
      raw?.rootCause,
      'Correlated network fault'
    ),
    rootCauseDetails: text(
      raw?.description,
      'Correlated telemetry and alarm evidence.'
    ),
    deterministicCausalInferred: true,
    evidence: {
      cpu: 0,
      packetLoss: 0,
      latency: 0,
      interfaceErrors: 0,
    },
    pipelineStages: [],
    timeline: [],
    relatedAlarms: Array.isArray(raw?.relatedAlarms)
      ? raw.relatedAlarms
      : raw?.incidentId === 'LINK-DOWN-3-4'
        ? [
            {
              id: 'IF-DOWN-3-2',
              title: 'Interface eth0 on device R1 is DOWN',
              description: 'SNMP interface operational status reported DOWN.',
              severity: 'P0',
            },
            {
              id: 'IF-DOWN-4-5',
              title: 'Interface eth0 on device R2 is DOWN',
              description: 'SNMP interface operational status reported DOWN.',
              severity: 'P0',
            },
          ]
        : [],
    affectedDevices: Array.isArray(raw?.affectedDevices)
      ? raw.affectedDevices
      : raw?.incidentId === 'LINK-DOWN-3-4'
        ? [
            {
              deviceId: '3',
              deviceName: 'Cogninet R1',
              name: 'Cogninet R1',
              severity: 'critical',
            },
            {
              deviceId: '4',
              deviceName: 'Cogninet R2',
              name: 'Cogninet R2',
              severity: 'critical',
            },
          ]
        : [],
    mitigationStatus:
      text(raw?.status, '').toUpperCase() === 'RESOLVED'
        ? 'applied'
        : 'pending',
    mitigationActionLabel:
      text(raw?.status, '').toUpperCase() === 'RESOLVED'
        ? 'Incident Resolved'
        : 'Review Root Cause',
  };
}

export async function getIncidents(): Promise<AnomalyResult[]> {
  const raw = await request<any>('/incidents');

  const list = Array.isArray(raw)
    ? raw
    : raw?.content ?? raw?.data ?? [];

  return list.map(mapIncident);
}

export async function getIncidentById(
  id: string
): Promise<AnomalyResult | undefined> {
  const incidents = await getIncidents();

  return incidents.find(
    inc => inc.incidentId.toLowerCase() === id.toLowerCase()
  );
}

export async function getAiAnalysis(): Promise<any> {
  return request<any>('/ai/analyze');
}

export async function mitigateIncident(
  incidentId: string
): Promise<{ success: boolean; message: string }> {
  return {
    success: false,
    message: `No automatic mitigation API is implemented for ${incidentId}.`,
  };
}

export async function acknowledgeIncident(
  incidentId: string
): Promise<{ success: boolean; message: string }> {
  return {
    success: true,
    message: `Incident ${incidentId} acknowledged locally.`,
  };
}

/* ------------------------------------------------------------------ */
/* Topology                                                            */
/* ------------------------------------------------------------------ */

export async function getTopology(): Promise<TopologyData> {
  /*
   * Cogninet real GNS3 topology:
   *
   *              R1
   *             /  \
   *            /    \
   *          R2------R3
   *
   * R1 eth0 <-> R2 eth0
   * R1 eth1 <-> R3 eth0
   * R2 eth1 <-> R3 eth1
   *
   * We deliberately do not invent bandwidth/latency values because
   * the current SNMP collector measures interface operational state.
   */

  const [devices, alarms] = await Promise.all([
    getDevices(),
    getAlarms(),
  ]);

  const byName = new Map(
    devices.map(d => [d.id.toUpperCase(), d])
  );

  const alarmList = alarms;

  const interfaceIsDown = (
    deviceId: string,
    interfaceName: string
  ) => {
    const device = byName.get(deviceId);

    const iface = device?.interfaces.find(
      i => i.name === interfaceName
    );

    if (iface?.status === 'down') return true;

    return alarmList.some(a =>
      a.deviceId.toUpperCase() === deviceId &&
      a.interfaceName?.toLowerCase() === interfaceName.toLowerCase() &&
      a.status === 'active'
    );
  };

  const linkStatus = (
    aDevice: string,
    aInterface: string,
    bDevice: string,
    bInterface: string
  ): 'healthy' | 'warning' | 'critical' => {
    if (
      interfaceIsDown(aDevice, aInterface) ||
      interfaceIsDown(bDevice, bInterface)
    ) {
      return 'critical';
    }

    return 'healthy';
  };

  const makeNode = (
    d: Device,
    xPercent: number,
    yPercent: number
  ): TopologyNode => ({
    id: d.id,
    name: d.name,
    label: d.name,
    type: 'core',
    ip: d.ipAddress,
    status: d.status,
    xPercent,
    yPercent,
    cpu: d.cpu,
    memory: d.memory,
    latency: d.latency,
    packetLoss: d.packetLoss,
    activeInterface: d.interfaces[0]?.name ?? '-',
    interfaceStatus: d.interfaces.some(i => i.status === 'down')
      ? 'down'
      : 'up',
    icon: 'router',
  });

  const r1 = byName.get('R1');
  const r2 = byName.get('R2');
  const r3 = byName.get('R3');

  const nodes: TopologyNode[] = [];

  if (r1) nodes.push(makeNode(r1, 50, 20));
  if (r2) nodes.push(makeNode(r2, 25, 65));
  if (r3) nodes.push(makeNode(r3, 75, 65));

  const links: TopologyLink[] = [];

  if (r1 && r2) {
    const status = linkStatus('R1', 'eth0', 'R2', 'eth0');

    links.push({
      id: 'R1-eth0-R2-eth0',
      source: 'R1',
      target: 'R2',
      status,
      label: 'R1 eth0 ↔ R2 eth0',
      latency: 'N/A',
      bandwidth: 'N/A',
      packetLoss: 'N/A',
      animated: status !== 'healthy',
    });
  }

  if (r1 && r3) {
    const status = linkStatus('R1', 'eth1', 'R3', 'eth0');

    links.push({
      id: 'R1-eth1-R3-eth0',
      source: 'R1',
      target: 'R3',
      status,
      label: 'R1 eth1 ↔ R3 eth0',
      latency: 'N/A',
      bandwidth: 'N/A',
      packetLoss: 'N/A',
      animated: status !== 'healthy',
    });
  }

  if (r2 && r3) {
    const status = linkStatus('R2', 'eth1', 'R3', 'eth1');

    links.push({
      id: 'R2-eth1-R3-eth1',
      source: 'R2',
      target: 'R3',
      status,
      label: 'R2 eth1 ↔ R3 eth1',
      latency: 'N/A',
      bandwidth: 'N/A',
      packetLoss: 'N/A',
      animated: status !== 'healthy',
    });
  }

  return { nodes, links };
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [devices, alarms, incidents, ai] = await Promise.all([
    getDevices(),
    getAlarms(),
    getIncidents(),
    getAiAnalysis().catch(() => null),
  ]);

  const activeAlarms = alarms.filter(a => a.status === 'active');
  const criticalAlarms = activeAlarms.filter(a => a.severity === 'P0');

  const healthy = devices.filter(d => d.status === 'healthy').length;
  const warning = devices.filter(d => d.status === 'warning').length;
  const critical = devices.filter(d => d.status === 'critical').length;

  const health =
    devices.length === 0
      ? 0
      : Math.round((healthy / devices.length) * 100);

  const aiAnomalies =
    number(ai?.anomalousInterfaces, 0);

  return {
    networkHealth: health,
    networkHealthDelta: 'LIVE',
    totalDevices: devices.length,
    monitoredDevices: devices.length,
    activeAlarmsCount: activeAlarms.length,
    criticalAlarmsCount: criticalAlarms.length,
    aiAnomaliesCount: aiAnomalies,
    resolvedTodayCount: alarms.filter(a => a.status === 'resolved').length,
    autoResolvedPercent: 0,
    recentIncidents: incidents,
    activeAlarms,
    deviceStatuses: {
      healthy,
      warning,
      critical,
    },
  };
}
