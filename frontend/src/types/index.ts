// Cogninet Data Types & AI/RCA Data Contract

export type Severity = 'critical' | 'warning' | 'info' | 'healthy' | 'resolved';

export type DeviceStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export type AlarmSeverity = 'P0' | 'P1' | 'P2' | 'P3';

export type AlarmStatus = 'active' | 'acknowledged' | 'suppressed' | 'resolved';

export interface DeviceInterface {
  name: string;
  status: 'up' | 'down' | 'degraded';
  ipAddress?: string;
  speed?: string;
  txRate?: string;
  rxRate?: string;
  errorsPerSec?: number;
  crcErrors?: number;
}

export interface Device {
  id: string; // e.g. "R1", "R2", "R3", "R4", "SRV-01"
  name: string;
  role: 'Core Router' | 'Edge Router' | 'Distribution Switch' | 'DC Server Cluster' | 'Spine Backbone' | 'Peer Ingress';
  ipAddress: string;
  location: string;
  osVersion: string;
  status: DeviceStatus;
  uptime: string;
  cpu: number; // percentage e.g. 92
  memory: number; // percentage e.g. 78
  memoryUsedGb?: number;
  memoryTotalGb?: number;
  latency: number; // ms e.g. 180
  packetLoss: number; // percentage e.g. 12.4
  throughput: string; // e.g. "1.8 Gbps / 10.0 Gbps"
  interfaces: DeviceInterface[];
  lastSeen: string;
  activeAlarmsCount: number;
}

export interface Alarm {
  id: string; // e.g. "ALM-1092"
  severity: AlarmSeverity;
  severityLabel: 'Critical' | 'Warning' | 'Info';
  deviceId: string;
  deviceName: string;
  interfaceName?: string;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  status: AlarmStatus;
  isRootCause?: boolean;
  correlationGroup?: string;
  incidentId?: string;
  metricsSnapshot?: {
    cpu?: number;
    packetLoss?: number;
    latency?: number;
    errors?: number;
  };
}

export interface AIIncidentEvidence {
  cpu: number; // %
  cpuBaseline?: number;
  packetLoss: number; // %
  packetLossSla?: number;
  latency: number; // ms
  latencyNormal?: number;
  interfaceErrors: number; // CRC/s
  interfaceErrorsNormal?: number;
  powerDropDbm?: number; // e.g. -21.4
  transitCongestion?: boolean;
}

export interface CausalPipelineStage {
  step: string; // "01. Telemetry", "02. Inference", etc.
  name: string;
  status: 'active' | 'warning' | 'critical' | 'completed' | 'normal';
  metric: string;
  icon: string;
}

export interface IncidentTimelineItem {
  time: string; // "10:24", "10:26", etc.
  event: string;
  value?: string;
  severity: 'normal' | 'warning' | 'critical' | 'ai';
}

export interface BlastRadiusNode {
  deviceId: string;
  name: string;
  ipAddress: string;
  role: string;
  impactType: 'Direct Failure' | 'Path Congestion' | 'High RTT' | 'Elevated RTT';
  severity: 'critical' | 'warning' | 'info';
}

export interface AnomalyResult {
  incidentId: string; // "INC-001"
  title: string;
  severity: 'critical' | 'warning' | 'info';
  severityCode: 'P0' | 'P1' | 'P2';
  affectedDeviceId: string;
  affectedDeviceName: string;
  affectedInterface: string;
  triggeredAgo: string;
  anomalyScore: number; // e.g. 94%
  confidence: number; // e.g. 91%
  similarityMatch?: string; // e.g. "91% match to INC-840"
  engineVersion: string; // e.g. "Engine v4.2.9"
  probableRootCause: string; // "R3 → eth0 Interface Physical Degradation"
  rootCauseDetails: string;
  deterministicCausalInferred: boolean;
  evidence: AIIncidentEvidence;
  pipelineStages: CausalPipelineStage[];
  timeline: IncidentTimelineItem[];
  relatedAlarms: Alarm[];
  affectedDevices: BlastRadiusNode[];
  mitigationStatus: 'pending' | 'in_progress' | 'applied';
  mitigationActionLabel: string;
  mitigatedTime?: string;
}

export interface TopologyNode {
  id: string; // "R1", "R2", "R3", "R4", "SRV-01"
  name: string;
  label: string;
  type: 'core' | 'edge' | 'dist' | 'server';
  ip: string;
  status: DeviceStatus;
  xPercent: number;
  yPercent: number;
  cpu: number;
  memory: number;
  latency: number;
  packetLoss: number;
  activeInterface: string;
  interfaceStatus: 'up' | 'down' | 'degraded';
  faultAlert?: string;
  icon: string;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  status: 'healthy' | 'warning' | 'critical' | 'secondary';
  label: string;
  latency: string;
  bandwidth: string;
  packetLoss?: string;
  animated?: boolean;
}

export interface TopologyData {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export interface DashboardSummary {
  networkHealth: number; // 94
  networkHealthDelta: string; // "+1.8% vs lw"
  totalDevices: number; // 12
  monitoredDevices: number; // 6
  activeAlarmsCount: number; // 4 or 8
  criticalAlarmsCount: number; // 1
  aiAnomaliesCount: number; // 3
  resolvedTodayCount: number; // 7
  autoResolvedPercent: number; // 100
  recentIncidents: AnomalyResult[];
  activeAlarms: Alarm[];
  deviceStatuses: {
    healthy: number;
    warning: number;
    critical: number;
  };
}
