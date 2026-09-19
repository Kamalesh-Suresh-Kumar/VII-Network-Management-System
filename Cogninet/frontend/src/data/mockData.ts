import { 
  Device, 
  Alarm, 
  AnomalyResult, 
  TopologyData, 
  DashboardSummary 
} from '../types';

export const mockDevices: Device[] = [
  {
    id: 'R3',
    name: 'Router-Core-R3',
    role: 'Core Router',
    ipAddress: '10.240.0.18',
    location: 'DC-East Tier-1 (Rack A04)',
    osVersion: 'JunOS v22.4R1 • AS 64512',
    status: 'critical',
    uptime: '14d 06h 12m',
    cpu: 92,
    memory: 78,
    memoryUsedGb: 31.2,
    memoryTotalGb: 40.0,
    latency: 180,
    packetLoss: 12.4,
    throughput: '1.8 Gbps / 10.0 Gbps (-82%)',
    lastSeen: 'Just now',
    activeAlarmsCount: 2,
    interfaces: [
      { name: 'eth0', status: 'down', ipAddress: '10.240.12.1/30', speed: '10 Gbps', txRate: '0 Mbps', rxRate: '0 Mbps', errorsPerSec: 45, crcErrors: 1420 },
      { name: 'eth1', status: 'up', ipAddress: '10.240.12.5/30', speed: '10 Gbps', txRate: '1.2 Gbps', rxRate: '0.6 Gbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'eth2', status: 'up', ipAddress: '10.240.12.9/30', speed: '10 Gbps', txRate: '450 Mbps', rxRate: '320 Mbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'lo0', status: 'up', ipAddress: '10.240.0.18/32', speed: '1 Gbps', txRate: '2 Mbps', rxRate: '2 Mbps', errorsPerSec: 0, crcErrors: 0 },
    ]
  },
  {
    id: 'R1',
    name: 'Router-Core-R1',
    role: 'Core Router',
    ipAddress: '10.240.0.1',
    location: 'DC-East Tier-1 (Rack A01)',
    osVersion: 'JunOS v22.4R1 • AS 64512',
    status: 'healthy',
    uptime: '128d 14h 44m',
    cpu: 34,
    memory: 42,
    memoryUsedGb: 16.8,
    memoryTotalGb: 40.0,
    latency: 12,
    packetLoss: 0.01,
    throughput: '8.4 Gbps / 10.0 Gbps',
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    interfaces: [
      { name: 'eth0', status: 'up', ipAddress: '10.240.10.1/30', speed: '10 Gbps', txRate: '4.2 Gbps', rxRate: '4.2 Gbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'eth1', status: 'up', ipAddress: '10.240.10.5/30', speed: '10 Gbps', txRate: '4.0 Gbps', rxRate: '3.8 Gbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'lo0', status: 'up', ipAddress: '10.240.0.1/32', speed: '1 Gbps', txRate: '1 Mbps', rxRate: '1 Mbps', errorsPerSec: 0, crcErrors: 0 }
    ]
  },
  {
    id: 'R2',
    name: 'Router-Edge-R2',
    role: 'Edge Router',
    ipAddress: '10.240.0.14',
    location: 'DC-East Tier-1 (Rack B02)',
    osVersion: 'Cisco IOS-XE 17.9.3',
    status: 'warning',
    uptime: '84d 21h 05m',
    cpu: 58,
    memory: 64,
    memoryUsedGb: 20.4,
    memoryTotalGb: 32.0,
    latency: 38,
    packetLoss: 4.2,
    throughput: '6.1 Gbps / 10.0 Gbps',
    lastSeen: 'Just now',
    activeAlarmsCount: 1,
    interfaces: [
      { name: 'GigabitEthernet0/0/0', status: 'up', ipAddress: '10.240.11.1/30', speed: '10 Gbps', txRate: '3.1 Gbps', rxRate: '3.0 Gbps', errorsPerSec: 2, crcErrors: 12 },
      { name: 'GigabitEthernet0/0/1', status: 'degraded', ipAddress: '10.240.11.5/30', speed: '10 Gbps', txRate: '1.8 Gbps', rxRate: '1.2 Gbps', errorsPerSec: 8, crcErrors: 84 },
      { name: 'Loopback0', status: 'up', ipAddress: '10.240.0.14/32', speed: '1 Gbps', txRate: '1 Mbps', rxRate: '1 Mbps', errorsPerSec: 0, crcErrors: 0 }
    ]
  },
  {
    id: 'R4',
    name: 'Router-Spine-R4',
    role: 'Distribution Switch',
    ipAddress: '10.240.0.32',
    location: 'DC-East Tier-1 (Rack C01)',
    osVersion: 'Arista EOS 4.28.1F',
    status: 'warning',
    uptime: '92d 11h 18m',
    cpu: 66,
    memory: 52,
    memoryUsedGb: 16.6,
    memoryTotalGb: 32.0,
    latency: 54,
    packetLoss: 2.8,
    throughput: '4.8 Gbps / 10.0 Gbps',
    lastSeen: 'Just now',
    activeAlarmsCount: 1,
    interfaces: [
      { name: 'Ethernet1/1', status: 'up', ipAddress: '10.240.13.1/30', speed: '10 Gbps', txRate: '2.4 Gbps', rxRate: '2.4 Gbps', errorsPerSec: 1, crcErrors: 5 },
      { name: 'Ethernet1/2', status: 'up', ipAddress: '10.240.13.5/30', speed: '10 Gbps', txRate: '2.0 Gbps', rxRate: '1.9 Gbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'Management1', status: 'up', ipAddress: '10.240.0.32/32', speed: '1 Gbps', txRate: '1 Mbps', rxRate: '1 Mbps', errorsPerSec: 0, crcErrors: 0 }
    ]
  },
  {
    id: 'SRV-01',
    name: 'DC Server Cluster Alpha',
    role: 'DC Server Cluster',
    ipAddress: '10.250.4.50',
    location: 'DC-East Tier-1 (Compute Bay 01)',
    osVersion: 'Ubuntu 24.04 LTS / Kubernetes v1.30',
    status: 'healthy',
    uptime: '312d 08h 19m',
    cpu: 48,
    memory: 68,
    memoryUsedGb: 435.2,
    memoryTotalGb: 640.0,
    latency: 4,
    packetLoss: 0.0,
    throughput: '18.4 Gbps / 40.0 Gbps',
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    interfaces: [
      { name: 'bond0', status: 'up', ipAddress: '10.250.4.50/24', speed: '40 Gbps', txRate: '9.2 Gbps', rxRate: '9.2 Gbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'eth0', status: 'up', ipAddress: '10.250.4.51/24', speed: '25 Gbps', txRate: '4.6 Gbps', rxRate: '4.6 Gbps', errorsPerSec: 0, crcErrors: 0 },
      { name: 'eth1', status: 'up', ipAddress: '10.250.4.52/24', speed: '25 Gbps', txRate: '4.6 Gbps', rxRate: '4.6 Gbps', errorsPerSec: 0, crcErrors: 0 }
    ]
  },
  {
    id: 'R5',
    name: 'Router-Peer-GW-01',
    role: 'Peer Ingress',
    ipAddress: '10.240.0.99',
    location: 'Edge Meet-Me Room East',
    osVersion: 'Cisco IOS-XR 7.7.1',
    status: 'healthy',
    uptime: '190d 02h 10m',
    cpu: 28,
    memory: 38,
    memoryUsedGb: 12.1,
    memoryTotalGb: 32.0,
    latency: 8,
    packetLoss: 0.0,
    throughput: '9.4 Gbps / 20.0 Gbps',
    lastSeen: 'Just now',
    activeAlarmsCount: 0,
    interfaces: [
      { name: 'HundredGigE0/0/0/0', status: 'up', ipAddress: '198.51.100.1/30', speed: '100 Gbps', txRate: '4.7 Gbps', rxRate: '4.7 Gbps', errorsPerSec: 0, crcErrors: 0 }
    ]
  }
];

export const mockAlarms: Alarm[] = [
  {
    id: 'ALM-1092',
    severity: 'P0',
    severityLabel: 'Critical',
    deviceId: 'R3',
    deviceName: 'Router-Core-R3',
    interfaceName: 'eth0',
    title: 'R3 Interface Down (Port eth0)',
    description: 'Port eth0 carrier transition down. Optical transceiver power drop -21.4 dBm.',
    timestamp: '2026-09-11 10:31:00 UTC',
    timeAgo: '18m ago',
    status: 'active',
    isRootCause: true,
    correlationGroup: 'GRP-INC-001',
    incidentId: 'INC-001',
    metricsSnapshot: { cpu: 92, packetLoss: 12.4, latency: 180, errors: 45 }
  },
  {
    id: 'ALM-1088',
    severity: 'P1',
    severityLabel: 'Warning',
    deviceId: 'R2',
    deviceName: 'Router-Edge-R2',
    interfaceName: 'GigabitEthernet0/0/1',
    title: 'R2 High Packet Loss (Transit Ripple)',
    description: 'Transit congestion ripple effect due to rerouting from R3 down link.',
    timestamp: '2026-09-11 10:26:00 UTC',
    timeAgo: '23m ago',
    status: 'active',
    isRootCause: false,
    correlationGroup: 'GRP-INC-001',
    incidentId: 'INC-001',
    metricsSnapshot: { cpu: 58, packetLoss: 4.2, latency: 38, errors: 8 }
  },
  {
    id: 'ALM-1085',
    severity: 'P2',
    severityLabel: 'Warning',
    deviceId: 'R4',
    deviceName: 'Router-Spine-R4',
    interfaceName: 'Ethernet1/1',
    title: 'R4 High Latency (BGP Convergence)',
    description: 'Downstream BGP re-convergence causing elevated Round Trip Time to server cluster.',
    timestamp: '2026-09-11 10:24:00 UTC',
    timeAgo: '25m ago',
    status: 'active',
    isRootCause: false,
    correlationGroup: 'GRP-INC-001',
    incidentId: 'INC-001',
    metricsSnapshot: { cpu: 66, packetLoss: 2.8, latency: 54, errors: 1 }
  },
  {
    id: 'ALM-1076',
    severity: 'P2',
    severityLabel: 'Info',
    deviceId: 'R3',
    deviceName: 'Router-Core-R3',
    interfaceName: 'eth0',
    title: 'CRC Framing Errors Threshold Exceeded',
    description: 'Excessive CRC framing errors detected on physical interface prior to link teardown.',
    timestamp: '2026-09-11 10:28:00 UTC',
    timeAgo: '21m ago',
    status: 'active',
    isRootCause: false,
    correlationGroup: 'GRP-INC-001',
    incidentId: 'INC-001',
    metricsSnapshot: { cpu: 89, packetLoss: 8.5, latency: 120, errors: 45 }
  }
];

export const mockIncidents: AnomalyResult[] = [
  {
    incidentId: 'INC-001',
    title: 'R3 Interface Failure',
    severity: 'critical',
    severityCode: 'P0',
    affectedDeviceId: 'R3',
    affectedDeviceName: 'Router-Core-R3',
    affectedInterface: 'eth0',
    triggeredAgo: '18m ago',
    anomalyScore: 94,
    confidence: 91,
    similarityMatch: '91% match to INC-840',
    engineVersion: 'Engine v4.2.9',
    probableRootCause: 'R3 → eth0 Interface Physical Degradation',
    rootCauseDetails: 'Optical transceiver power drop (-21.4 dBm) on Router R3 port eth0 triggered continuous framing CRC errors, downstream buffer overflow, and carrier loss on core transit link.',
    deterministicCausalInferred: true,
    evidence: {
      cpu: 92,
      cpuBaseline: 38,
      packetLoss: 12.0,
      packetLossSla: 0.05,
      latency: 180,
      latencyNormal: 18,
      interfaceErrors: 45,
      interfaceErrorsNormal: 0,
      powerDropDbm: -21.4,
      transitCongestion: true
    },
    pipelineStages: [
      { step: '01. Telemetry', name: 'Telemetry Anomaly', status: 'critical', metric: 'CPU 92%, Loss 12%', icon: 'sensors' },
      { step: '02. Inference', name: 'Anomaly Detect', status: 'warning', metric: 'Waveform Surge', icon: 'show_chart' },
      { step: '03. Grouping', name: 'Alarm Correl.', status: 'normal', metric: '3 correlated alarms', icon: 'mediation' },
      { step: '04. Root Cause', name: 'Root Cause', status: 'critical', metric: 'R3 eth0 Down', icon: 'error' },
      { step: '05. Scope', name: 'Affected Devices', status: 'normal', metric: 'R4, Server cluster', icon: 'device_hub' },
    ],
    timeline: [
      { time: '10:24', event: 'Latency increased on spine trunk ring (+65ms)', value: '+65ms', severity: 'normal' },
      { time: '10:26', event: 'Packet loss detected (4.2% on R3 transit)', value: '4.2%', severity: 'warning' },
      { time: '10:28', event: 'Interface framing errors increased (45 err/s)', value: '45 err/s', severity: 'warning' },
      { time: '10:31', event: 'Interface failure detected on eth0 (Carrier Link Down)', value: 'Link Down', severity: 'critical' },
      { time: '10:32', event: 'AI identified probable root cause (Deterministic match)', value: '91% conf', severity: 'ai' },
    ],
    relatedAlarms: mockAlarms,
    affectedDevices: [
      { deviceId: 'R3', name: 'Router-Core-R3', ipAddress: '10.240.12.1', role: 'Spine Backbone', impactType: 'Direct Failure', severity: 'critical' },
      { deviceId: 'R4', name: 'Router-Spine-R4', ipAddress: '10.240.12.2', role: 'Peer Ingress', impactType: 'Path Congestion', severity: 'warning' },
      { deviceId: 'SRV-01', name: 'DC Server-01', ipAddress: '10.200.4.50', role: 'Workload Ingress', impactType: 'High RTT', severity: 'info' }
    ],
    mitigationStatus: 'pending',
    mitigationActionLabel: 'Apply AI Mitigation (Auto-Evacuate R3)'
  }
];

export const mockTopology: TopologyData = {
  nodes: [
    {
      id: 'R1',
      name: 'Router-Core-R1',
      label: 'Node R1 (Core Router)',
      type: 'core',
      ip: '10.240.0.1',
      status: 'healthy',
      xPercent: 50,
      yPercent: 12,
      cpu: 34,
      memory: 42,
      latency: 12,
      packetLoss: 0.01,
      activeInterface: 'eth0 (Up)',
      interfaceStatus: 'up',
      icon: 'account_tree'
    },
    {
      id: 'R2',
      name: 'Router-Edge-R2',
      label: 'Node R2 (Edge Router)',
      type: 'edge',
      ip: '10.240.0.14',
      status: 'healthy',
      xPercent: 28,
      yPercent: 38,
      cpu: 58,
      memory: 64,
      latency: 38,
      packetLoss: 4.2,
      activeInterface: 'GigabitEthernet0/0/0 (Up)',
      interfaceStatus: 'up',
      icon: 'router'
    },
    {
      id: 'R3',
      name: 'Router-Core-R3',
      label: 'Node R3 (Core Router)',
      type: 'core',
      ip: '10.240.0.18',
      status: 'critical',
      xPercent: 72,
      yPercent: 38,
      cpu: 92,
      memory: 78,
      latency: 180,
      packetLoss: 12.4,
      activeInterface: 'eth0 (Down)',
      interfaceStatus: 'down',
      faultAlert: 'CRC Framing Fault on SFP+ Port 1 • Optical -21.4 dBm',
      icon: 'router'
    },
    {
      id: 'R4',
      name: 'Router-Spine-R4',
      label: 'Node R4 (Dist. Switch)',
      type: 'dist',
      ip: '10.240.0.32',
      status: 'warning',
      xPercent: 72,
      yPercent: 64,
      cpu: 66,
      memory: 52,
      latency: 54,
      packetLoss: 2.8,
      activeInterface: 'Ethernet1/1 (Up)',
      interfaceStatus: 'up',
      icon: 'lan'
    },
    {
      id: 'SRV-01',
      name: 'DC Server Cluster',
      label: 'DC Server Cluster Alpha',
      type: 'server',
      ip: '10.250.0.0/16',
      status: 'healthy',
      xPercent: 72,
      yPercent: 86,
      cpu: 48,
      memory: 68,
      latency: 4,
      packetLoss: 0.0,
      activeInterface: 'bond0 (Up)',
      interfaceStatus: 'up',
      icon: 'storage'
    }
  ],
  links: [
    {
      id: 'L1',
      source: 'R1',
      target: 'R2',
      status: 'healthy',
      label: '12ms • 10 Gbps (Healthy)',
      latency: '12ms',
      bandwidth: '10 Gbps'
    },
    {
      id: 'L2',
      source: 'R1',
      target: 'R3',
      status: 'critical',
      label: '180ms Latency • Packet Drop Alert',
      latency: '180ms',
      bandwidth: '1.8 Gbps',
      packetLoss: '12.4%',
      animated: true
    },
    {
      id: 'L3',
      source: 'R2',
      target: 'R4',
      status: 'warning',
      label: 'BGP Alt Path (Warning)',
      latency: '38ms',
      bandwidth: '10 Gbps'
    },
    {
      id: 'L4',
      source: 'R3',
      target: 'R4',
      status: 'critical',
      label: '12.4% Loss • Route Flap',
      latency: '180ms',
      bandwidth: '1.8 Gbps',
      packetLoss: '12.4%'
    },
    {
      id: 'L5',
      source: 'R4',
      target: 'SRV-01',
      status: 'healthy',
      label: '4ms • Fiber LAN',
      latency: '4ms',
      bandwidth: '40 Gbps'
    }
  ]
};

export const mockDashboardSummary: DashboardSummary = {
  networkHealth: 94,
  networkHealthDelta: '+1.8% vs lw',
  totalDevices: 12,
  monitoredDevices: 6,
  activeAlarmsCount: 4,
  criticalAlarmsCount: 1,
  aiAnomaliesCount: 3,
  resolvedTodayCount: 7,
  autoResolvedPercent: 100,
  recentIncidents: mockIncidents,
  activeAlarms: mockAlarms,
  deviceStatuses: {
    healthy: 10,
    warning: 1,
    critical: 1
  }
};
