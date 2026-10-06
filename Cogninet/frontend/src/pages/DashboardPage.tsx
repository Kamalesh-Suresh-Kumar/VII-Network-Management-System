import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  getDashboardSummary,
  getTelemetry,
  getDevices,
  TelemetryRecord,
} from '../services/api';
import { RealTelemetryChart } from '../components/common/RealTelemetryChart';
import { DashboardSummary } from '../types';

const TIME_RANGE_CONFIG: Record<'1H' | '6H' | '24H' | '7D', {
  avgLatency: string;
  packetLoss: string;
  lossStatus: string;
  peakThroughput: string;
  peakTime: string;
  peakX: number;
  peakY: number;
  apexStyle: string;
  labels: string[];
  primaryPath: string;
  primaryArea: string;
  secondaryPath: string;
  secondaryArea: string;
}> = {
  '1H': {
    avgLatency: '14 ms',
    packetLoss: '0.01%',
    lossStatus: '(Nominal)',
    peakThroughput: '38.2 Gbps',
    peakTime: '18m ago Peak',
    peakX: 560,
    peakY: 35,
    apexStyle: 'left-[68%]',
    labels: ['60m ago', '45m ago', '30m ago', '18m (Peak)', '10m ago', '5m ago', 'Live (Now)'],
    primaryPath: 'M 0,110 C 60,105 120,130 180,115 C 240,100 300,75 380,85 C 460,95 510,40 560,35 C 610,30 680,80 740,70 C 770,65 790,60 800,65',
    primaryArea: 'M 0,110 C 60,105 120,130 180,115 C 240,100 300,75 380,85 C 460,95 510,40 560,35 C 610,30 680,80 740,70 C 770,65 790,60 800,65 L 800,190 L 0,190 Z',
    secondaryPath: 'M 0,150 Q 100,140 200,135 T 400,120 T 600,100 T 800,95',
    secondaryArea: 'M 0,150 Q 100,140 200,135 T 400,120 T 600,100 T 800,95 L 800,190 L 0,190 Z',
  },
  '6H': {
    avgLatency: '22 ms',
    packetLoss: '0.08%',
    lossStatus: '(Slight Jitter)',
    peakThroughput: '46.1 Gbps',
    peakTime: '2h ago Peak',
    peakX: 520,
    peakY: 20,
    apexStyle: 'left-[63%]',
    labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h (Peak)', '1h ago', 'Live'],
    primaryPath: 'M 0,130 C 80,120 140,80 220,95 C 300,110 360,140 440,80 C 480,50 500,20 520,20 C 560,20 620,105 700,85 C 750,70 780,90 800,85',
    primaryArea: 'M 0,130 C 80,120 140,80 220,95 C 300,110 360,140 440,80 C 480,50 500,20 520,20 C 560,20 620,105 700,85 C 750,70 780,90 800,85 L 800,190 L 0,190 Z',
    secondaryPath: 'M 0,155 Q 120,145 250,120 T 500,110 T 750,115 T 800,105',
    secondaryArea: 'M 0,155 Q 120,145 250,120 T 500,110 T 750,115 T 800,105 L 800,190 L 0,190 Z',
  },
  '24H': {
    avgLatency: '18 ms',
    packetLoss: '0.04%',
    lossStatus: '(Nominal)',
    peakThroughput: '42.8 Gbps',
    peakTime: '12:00 Peak',
    peakX: 500,
    peakY: 25,
    apexStyle: 'left-[58%]',
    labels: ['00:00', '04:00', '08:00', '12:00 (Apex)', '16:00', '20:00', '23:59'],
    primaryPath: 'M 0,140 C 70,130 110,50 170,65 C 240,80 280,130 350,115 C 420,95 450,20 500,25 C 550,30 600,115 670,95 C 730,80 760,55 800,60',
    primaryArea: 'M 0,140 C 70,130 110,50 170,65 C 240,80 280,130 350,115 C 420,95 450,20 500,25 C 550,30 600,115 670,95 C 730,80 760,55 800,60 L 800,190 L 0,190 Z',
    secondaryPath: 'M 0,160 Q 80,150 140,130 T 280,105 T 420,120 T 560,85 T 700,125 T 800,110',
    secondaryArea: 'M 0,160 Q 80,150 140,130 T 280,105 T 420,120 T 560,85 T 700,125 T 800,110 L 800,190 L 0,190 Z',
  },
  '7D': {
    avgLatency: '16 ms',
    packetLoss: '0.02%',
    lossStatus: '(Nominal)',
    peakThroughput: '51.4 Gbps',
    peakTime: 'Thu Peak',
    peakX: 460,
    peakY: 15,
    apexStyle: 'left-[54%]',
    labels: ['Mon', 'Tue', 'Wed', 'Thu (Apex)', 'Fri', 'Sat', 'Sun'],
    primaryPath: 'M 0,120 C 60,110 100,70 160,85 C 220,100 260,60 330,75 C 390,90 420,15 460,15 C 510,15 560,95 620,80 C 680,65 740,110 800,90',
    primaryArea: 'M 0,120 C 60,110 100,70 160,85 C 220,100 260,60 330,75 C 390,90 420,15 460,15 C 510,15 560,95 620,80 C 680,65 740,110 800,90 L 800,190 L 0,190 Z',
    secondaryPath: 'M 0,165 Q 110,150 230,135 T 460,115 T 690,120 T 800,105',
    secondaryArea: 'M 0,165 Q 110,150 230,135 T 460,115 T 690,120 T 800,105 L 800,190 L 0,190 Z',
  },
};

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const navigate = useNavigate();

  const activeTelemetry = TIME_RANGE_CONFIG[timeRange];

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, telemetryData, deviceData] = await Promise.all([
        getDashboardSummary(),
        getTelemetry(),
        getDevices(),
      ]);

      setSummary(data);
      setTelemetry(telemetryData);
      setDevices(deviceData);
    } catch (err) {
      setError('Could not retrieve NOC telemetry stream.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-3.5">
        <Header 
          title="Autonomous Dashboard" 
          subtitle="Real-time mesh telemetry, predictive anomalies & global health"
          icon="corporate_fare"
        />
        <LoadingState message="Loading Autonomous NOC Telemetry..." subMessage="Fetching telemetry streams from DC-East & Spine mesh routers" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex-1 flex flex-col gap-3.5">
        <Header 
          title="Autonomous Dashboard" 
          subtitle="Real-time mesh telemetry, predictive anomalies & global health"
          icon="corporate_fare"
        />
        <ErrorState message={error || 'Failed to load telemetry summary'} onRetry={fetchSummary} />
      </div>
    );
  }

  const realDevices = devices.filter(d =>
    ['R1', 'R2', 'R3'].includes(String(d.id).toUpperCase())
  );

  const deviceById = new Map(
    realDevices.map(d => [String(d.id).toUpperCase(), d])
  );

  const activeAlarms = summary.activeAlarms || [];
  const criticalCount = activeAlarms.filter(
    a => String(a.severity).toUpperCase() === 'P0' ||
         String(a.severity).toLowerCase() === 'critical'
  ).length;

  const warningCount = activeAlarms.filter(
    a => String(a.severity).toUpperCase() === 'P1' ||
         String(a.severity).toLowerCase() === 'warning'
  ).length;

const interfaceTelemetry = telemetry.filter(
    t => t.metricName === 'interface_oper_status'
  );

  const totalTelemetrySamples = interfaceTelemetry.length;

  const upTelemetrySamples = interfaceTelemetry.filter(
    t => t.metricValue === 1
  ).length;

  const downTelemetrySamples = interfaceTelemetry.filter(
    t => t.metricValue === 0
  ).length;

  const telemetryHealth =
    totalTelemetrySamples > 0
      ? Math.round(
          (upTelemetrySamples / totalTelemetrySamples) * 100
        )
      : 100;

  const upPercent =
    totalTelemetrySamples > 0
      ? Math.round(
          (upTelemetrySamples / totalTelemetrySamples) * 100
        )
      : 0;

  const downPercent =
    totalTelemetrySamples > 0
      ? Math.round(
          (downTelemetrySamples / totalTelemetrySamples) * 100
        )
      : 0;

  const clearedCount = Math.max(
    0,
    (summary.resolvedTodayCount ?? 0)
  );

  return (
    <div className="flex-1 flex flex-col gap-3.5 min-w-0">
      {/* Top Header */}
      <Header 
        breadcrumbCategory="COGNINET AI"
        breadcrumbSub="CORE TELEMETRY"
        title="Cognitive NetOps Dashboard" 
        subtitle="Real-time mesh telemetry, predictive anomalies & global health"
        icon="corporate_fare"
        onSearch={(q) => {
          if (q) navigate(`/devices?q=${encodeURIComponent(q)}`);
        }}
      />

      {/* Row 1: 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* KPI 1: Network Health */}
        <div 
          onClick={() => navigate('/topology')}
          className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60 cursor-pointer hover:shadow-card-hover transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider block font-semibold">Network Health</span>
              <span className="font-body-sm text-[11px] text-secondary truncate">Autonomous Core Status</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-tertiary-container/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-title-kpi text-[26px] text-on-surface tracking-tight font-bold">{summary.networkHealth}%</span>
            <span className="flex items-center gap-1 font-code-telemetry text-[11px] text-tertiary bg-tertiary-container/15 px-2 py-0.5 rounded-full font-bold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              {summary.networkHealthDelta}
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full transition-all duration-700" style={{ width: `${summary.networkHealth}%` }}></div>
          </div>
        </div>

        {/* KPI 2: Total Devices */}
        <div 
          onClick={() => navigate('/devices')}
          className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60 cursor-pointer hover:shadow-card-hover transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider block font-semibold">Total Fleet</span>
              <span className="font-body-sm text-[11px] text-secondary truncate">Active Nodes Monitored</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">router</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-title-kpi text-[26px] text-on-surface tracking-tight font-bold">{summary.totalDevices}</span>
            <div className="flex items-center gap-1.5 font-code-telemetry text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-bold">{summary.deviceStatuses.healthy} OK</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">{summary.deviceStatuses.warning} Warn</span>
              <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-bold">{summary.deviceStatuses.critical} Crit</span>
            </div>
          </div>
          <div className="flex w-full h-1.5 rounded-full mt-2.5 overflow-hidden gap-0.5">
            <div className="bg-tertiary h-full" style={{ width: '83%' }}></div>
            <div className="bg-amber-400 h-full" style={{ width: '8.5%' }}></div>
            <div className="bg-primary h-full" style={{ width: '8.5%' }}></div>
          </div>
        </div>

        {/* KPI 3: Active Alarms */}
        <div 
          onClick={() => navigate('/alarms')}
          className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60 cursor-pointer hover:shadow-card-hover transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider block font-semibold">Active Alarms</span>
              <span className="font-body-sm text-[11px] text-secondary truncate">Urgency Escalation Pool</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-title-kpi text-[26px] text-on-surface tracking-tight font-bold">{summary.activeAlarmsCount}</span>
            <div className="flex items-center gap-1 font-code-telemetry text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-bold shadow-[0_2px_8px_rgba(186,26,26,0.3)]">
                {criticalCount} P0
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">
                {warningCount} P1
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-secondary">
                {Math.max(0, activeAlarms.length - criticalCount - warningCount)} P2
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2.5 overflow-hidden relative">
            <div
              className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  activeAlarms.length * 20
                )}%`
              }}
            ></div>
          </div>
        </div>

        {/* KPI 4: Historical Anomalies */}
        <div 
          onClick={() => navigate('/ai-rca')}
          className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60 cursor-pointer hover:shadow-card-hover transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider block font-semibold">Historical Anomalies</span>
              <span className="font-body-sm text-[11px] text-secondary truncate">Root Cause Engine</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="font-title-kpi text-[26px] text-on-surface tracking-tight font-bold">{summary.aiAnomaliesCount}</span>
            <span className="px-2 py-0.5 rounded-md bg-error-container text-on-error-container font-code-telemetry text-[11px] font-semibold tracking-tight">
              {summary.recentIncidents[0]?.incidentId || 'No active incident'}
            </span>
          </div>
          <div className="w-full flex items-center justify-between text-secondary font-label-caps text-[10px] mt-2.5">
            <span>Inference Confidence</span>
            <span className="font-code-telemetry text-primary font-bold">
              {summary.recentIncidents[0]
                ? `${Math.round(summary.recentIncidents[0].confidence)}%`
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Middle Waveform (8 cols) + Integrity Radial Gauge (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-w-0">
        {/* Left 8 Cols: Network Performance Telemetry Waveform */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-4 flex flex-col shadow-card border border-surface-container-high/60">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-container-high/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-[16px] font-bold text-on-surface">Network Performance Telemetry</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-[9px] uppercase font-bold">Live Stream</span>
              </div>
              <span className="font-body-sm text-[12px] text-secondary">Real-time Mesh Waveforms &amp; Throughput Spectra</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high/40">
              {(['1H', '6H', '24H', '7D'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded-lg font-code-telemetry text-[11px] transition-colors ${
                    timeRange === t
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <RealTelemetryChart
            telemetry={telemetry}
            timeRange={timeRange}
          />
        </div>

        {/* Right 4 Cols: Integrity Index Donut Gauge */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/50">
            <div>
              <h2 className="font-headline-md text-[16px] font-bold text-on-surface">Integrity Index</h2>
              <span className="font-body-sm text-[12px] text-secondary">Network Health Distribution</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">donut_large</span>
          </div>

          <div className="relative flex items-center justify-center my-3">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" fill="none" r="48" stroke="#eceef2" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke="#006947"
                strokeDasharray={`${(upPercent / 100) * 301.6} 301.6`}
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                fill="none"
                r="48"
                stroke="#ba1a1a"
                strokeDasharray={`${(downPercent / 100) * 301.6} 301.6`}
                strokeDashoffset={`${-((upPercent / 100) * 301.6)}`}
                strokeLinecap="round"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest font-semibold">Global Score</span>
              <span className="font-title-kpi text-[26px] text-on-surface font-extrabold leading-none my-0.5">
                {telemetryHealth}%
              </span>
              <span className="font-code-telemetry text-[11px] text-tertiary font-bold tracking-tight">
                SNMP Telemetry
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-surface-container-high/50">
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span className="text-on-surface font-medium">Interface UP</span>
              </div>
              <div className="flex items-center gap-1.5 font-code-telemetry">
                <span className="text-on-surface font-semibold">
                  {upPercent}%
                </span>
                <span className="text-secondary text-[11px]">
                  · {upTelemetrySamples} samples
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                <span className="text-on-surface font-medium">No jitter metric</span>
              </div>
              <div className="flex items-center gap-1.5 font-code-telemetry">
                <span className="text-on-surface font-semibold">—</span>
                <span className="text-secondary text-[11px]">not collected</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                <span className="text-on-surface font-medium">Interface DOWN</span>
              </div>
              <div className="flex items-center gap-1.5 font-code-telemetry">
                <span className="text-error font-bold">
                  {downPercent}%
                </span>
                <span className="text-secondary text-[11px]">
                  · {downTelemetrySamples} DOWN samples
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: 3 Columns (Device Matrix, Correlated Incidents, Interface Traffic) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-w-0">
        {/* Col 1 (5 cols): Device Health Matrix */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-4 flex flex-col shadow-card border border-surface-container-high/60">
          <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/50">
            <div>
              <h2 className="font-headline-md text-[15px] font-bold text-on-surface">Device Health Matrix</h2>
              <span className="font-body-sm text-[11px] text-secondary">Dynamic Node State &amp; Load Telemetry</span>
            </div>
            <button 
              onClick={() => navigate('/devices')}
              className="text-primary font-body-sm text-[12px] hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left font-body-sm text-[12px]">
              <thead>
                <tr className="text-secondary font-label-caps text-[10px] uppercase border-b border-surface-container-high/50">
                  <th className="pb-2">Node</th>
                  <th className="pb-2">State</th>
                  <th className="pb-2">CPU</th>
                  <th className="pb-2">RAM</th>
                  <th className="pb-2 text-right">RTT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/40 font-code-telemetry text-[11px]">
                {realDevices.map((device) => {
                  const id = String(device.id).toUpperCase();
                  const status = String(device.status || 'healthy').toLowerCase();
                  const isCritical = status === 'critical';
                  const isWarning = status === 'warning';

                  return (
                    <tr
                      key={id}
                      onClick={() => navigate(`/devices/${id}`)}
                      className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                        isCritical ? 'bg-error-container/20' : ''
                      }`}
                    >
                      <td className={`py-2 font-bold flex items-center gap-1.5 ${
                        isCritical ? 'text-error' : 'text-on-surface'
                      }`}>
                        <span className={`material-symbols-outlined text-[15px] ${
                          isCritical ? 'text-error' :
                          isWarning ? 'text-amber-500' :
                          'text-tertiary'
                        }`}>
                          router
                        </span>
                        <span>{device.name || id}</span>
                      </td>

                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded-full font-semibold text-[10px] ${
                          isCritical
                            ? 'bg-error text-on-error'
                            : isWarning
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-tertiary-container/20 text-tertiary'
                        }`}>
                          {status === 'critical'
                            ? 'Critical'
                            : status === 'warning'
                              ? 'Warning'
                              : 'Online'}
                        </span>
                      </td>

                      <td className="py-2 text-secondary">
                        {device.cpu != null ? `${Math.round(device.cpu)}%` : 'N/A'}
                      </td>

                      <td className="py-2 text-secondary">
                        {device.memory != null ? `${Math.round(device.memory)}%` : 'N/A'}
                      </td>

                      <td className="py-2 text-right font-semibold text-on-surface">
                        {device.latency != null ? `${device.latency}ms` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Col 2 (4 cols): Recent Correlated Incidents */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60">
          <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/50">
            <div>
              <h2 className="font-headline-md text-[15px] font-bold text-on-surface">Correlated Incidents</h2>
              <span className="font-body-sm text-[11px] text-secondary">Cognitive RCA Diagnostics</span>
            </div>
            <button 
              onClick={() => navigate('/ai-rca')}
              className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-code-telemetry text-[11px] hover:bg-surface-container-high"
            >
              {summary.recentIncidents.filter(i =>
                String(i.severity).toLowerCase() === 'critical'
              ).length} Critical
            </button>
          </div>

          <div className="flex flex-col gap-2.5 my-2">
            {summary.recentIncidents.map((inc) => (
              <div 
                key={inc.incidentId}
                onClick={() => navigate('/ai-rca')}
                className="p-3 rounded-xl bg-surface-container-low border border-primary/20 hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-error text-on-error font-code-telemetry text-[10px] font-bold">
                      {inc.severityCode}
                    </span>
                    <span className="font-code-telemetry text-[11px] font-bold text-on-surface">{inc.incidentId}</span>
                  </div>
                  <span className="font-code-telemetry text-[10px] text-primary font-bold">{inc.anomalyScore}% Score</span>
                </div>
                <div className="font-headline-md text-[13px] font-bold text-on-surface">{inc.title}</div>
                <div className="font-body-sm text-[11px] text-secondary line-clamp-2">
                  {inc.probableRootCause}
                </div>
                <div className="flex items-center justify-between text-[10px] font-code-telemetry text-secondary pt-1 border-t border-surface-container-high/30">
                  <span className="text-tertiary font-semibold">91% AI Confidence</span>
                  <span>{inc.triggeredAgo}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/ai-rca')}
            className="w-full py-2 rounded-xl bg-primary text-on-primary font-headline-md text-[12px] font-semibold shadow-primary-glow hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Open Root Cause Analysis</span>
          </button>
        </div>

        {/* Col 3 (3 cols): Interface Activity & Auto-Healer */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-card border border-surface-container-high/60">
          <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/50">
            <div>
              <h2 className="font-headline-md text-[15px] font-bold text-on-surface">Correlation & Recovery</h2>
              <span className="font-body-sm text-[11px] text-secondary">Incident Correlation</span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">healing</span>
          </div>

          <div className="flex flex-col gap-2 my-2 text-[12px]">
            <div className="p-2.5 rounded-xl bg-tertiary-container/10 border border-tertiary/20 flex flex-col gap-1">
              <div className="flex items-center justify-between font-code-telemetry text-[10px]">
                <span className="text-tertiary font-bold">Correlation Engine</span>
                <span className="text-tertiary">Armed</span>
              </div>
              <p className="font-body-sm text-[11px] text-secondary leading-snug">
                Cogninet correlates telemetry, alarms and topology evidence for explainable RCA.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-1">
              <div className="flex items-center justify-between font-code-telemetry text-[10px]">
                <span className="font-semibold text-on-surface">Recent Resolutions</span>
                <span className="text-secondary font-bold">{clearedCount} Resolved</span>
              </div>
              <div className="space-y-1 font-code-telemetry text-[10px] text-secondary">
                <div className="flex justify-between">
                  <span>Interface-down alarms</span>
                  <span className="text-tertiary font-semibold">{clearedCount} resolved</span>
                </div>
                <div className="flex justify-between">
                  <span>R1 ↔ R2 link correlation</span>
                  <span className="text-tertiary font-semibold">
                    {summary.recentIncidents.length ? 'Correlated' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/topology')}
            className="w-full py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-[12px] font-semibold border border-surface-container-high/60 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
            <span>View Topology Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
