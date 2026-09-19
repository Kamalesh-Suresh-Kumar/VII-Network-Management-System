import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { getDeviceById } from '../services/api';
import { Device } from '../types';

export const DeviceDetailPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDevice = async () => {
    if (!deviceId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getDeviceById(deviceId);
      if (data) {
        setDevice(data);
      } else {
        setError(`Device with ID "${deviceId}" not found.`);
      }
    } catch (err) {
      setError('Failed to fetch device details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, [deviceId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-3.5">
        <Header 
          title="Device Telemetry" 
          subtitle="Loading real-time router counters"
          icon="router"
        />
        <LoadingState message={`Fetching telemetry for ${deviceId}...`} />
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="flex-1 flex flex-col gap-3.5">
        <Header 
          title="Device Telemetry" 
          subtitle="Node inspection"
          icon="router"
        />
        <ErrorState message={error || 'Device not found'} onRetry={fetchDevice} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3.5 min-w-0">
      {/* Header */}
      <Header
        breadcrumbCategory="Devices"
        breadcrumbSub={device.id}
        title={`${device.name} (${device.id})`}
        subtitle={`${device.role} • ${device.ipAddress} • ${device.osVersion}`}
        icon="router"
      />

      {/* Back & Status Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/devices')}
            className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors"
            title="Back to Devices Fleet"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                device.status === 'critical'
                  ? 'bg-error text-on-error animate-pulse'
                  : device.status === 'warning'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-tertiary-container/20 text-tertiary'
              }`}
            >
              {device.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-lg text-lg font-bold text-on-surface">{device.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded-full font-label-caps text-[9px] uppercase font-bold ${
                    device.status === 'critical'
                      ? 'bg-error-container text-on-error-container'
                      : device.status === 'warning'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-tertiary-container/20 text-tertiary'
                  }`}
                >
                  {device.status}
                </span>
              </div>
              <span className="font-code-telemetry text-xs text-secondary">{device.location} • Uptime: {device.uptime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {device.status === 'critical' && (
            <button
              onClick={() => navigate('/ai-rca')}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-headline-md text-xs font-semibold shadow-primary-glow hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Open AI / RCA Diagnostics</span>
            </button>
          )}
          <button
            onClick={() => alert(`Diagnostics initiated for ${device.name}. Polling BGP, OSPF, interface carrier stats...`)}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xs font-semibold border border-surface-container-high/60 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">troubleshoot</span>
            <span>Run Diagnostics</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">CPU Utilization</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`font-title-kpi text-2xl font-bold ${device.cpu > 80 ? 'text-error' : 'text-on-surface'}`}>
              {device.cpu}%
            </span>
            <span className="font-code-telemetry text-[11px] text-secondary">Threshold: 80%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${device.cpu > 80 ? 'bg-error' : 'bg-tertiary'}`}
              style={{ width: `${device.cpu}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">Memory Utilization</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-title-kpi text-2xl font-bold text-on-surface">{device.memory}%</span>
            <span className="font-code-telemetry text-[11px] text-secondary">
              {device.memoryUsedGb} / {device.memoryTotalGb} GB
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${device.memory}%` }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">Transit Latency</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`font-title-kpi text-2xl font-bold ${device.latency > 100 ? 'text-error' : 'text-on-surface'}`}>
              {device.latency} ms
            </span>
            <span className="font-code-telemetry text-[11px] text-secondary">Norm: 18ms</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${device.latency > 100 ? 'bg-error' : 'bg-tertiary'}`}
              style={{ width: `${Math.min(device.latency / 2, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">Packet Loss Rate</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`font-title-kpi text-2xl font-bold ${device.packetLoss > 5 ? 'text-error' : 'text-tertiary'}`}>
              {device.packetLoss}%
            </span>
            <span className="font-code-telemetry text-[11px] text-secondary">SLA: 0.05%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${device.packetLoss > 5 ? 'bg-error' : 'bg-tertiary'}`}
              style={{ width: `${Math.min(device.packetLoss * 8, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interface Table & Waveform Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 flex-1 min-w-0">
        {/* Interfaces Table (7 cols) */}
        <div className="xl:col-span-7 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/50">
              <h3 className="font-headline-md text-sm font-bold text-on-surface">Physical &amp; Logical Interfaces</h3>
              <span className="font-code-telemetry text-xs text-secondary">{device.interfaces.length} Interfaces</span>
            </div>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left font-body-sm text-xs">
                <thead>
                  <tr className="text-secondary font-label-caps text-[10px] uppercase border-b border-surface-container-high/40">
                    <th className="py-2">Interface</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">IP Subnet</th>
                    <th className="py-2">Speed</th>
                    <th className="py-2">Tx/Rx Rate</th>
                    <th className="py-2 text-right">Errors/s</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/30 font-code-telemetry text-[11px]">
                  {device.interfaces.map((iface) => (
                    <tr
                      key={iface.name}
                      className={iface.status === 'down' ? 'bg-error-container/20 text-error font-bold' : ''}
                    >
                      <td className="py-2.5 font-bold text-on-surface flex items-center gap-1.5">
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            iface.status === 'down' ? 'text-error animate-pulse' : 'text-tertiary'
                          }`}
                        >
                          {iface.status === 'down' ? 'link_off' : 'link'}
                        </span>
                        <span>{iface.name}</span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            iface.status === 'down'
                              ? 'bg-error text-on-error'
                              : 'bg-tertiary-container/20 text-tertiary'
                          }`}
                        >
                          {iface.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 text-secondary">{iface.ipAddress || '—'}</td>
                      <td className="py-2.5 text-secondary">{iface.speed || '10 Gbps'}</td>
                      <td className="py-2.5 text-secondary">{iface.txRate} / {iface.rxRate}</td>
                      <td className="py-2.5 text-right font-bold">
                        {iface.errorsPerSec ? (
                          <span className="text-error">{iface.errorsPerSec} err/s</span>
                        ) : (
                          <span className="text-tertiary">0/s</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-container-high/40 flex items-center justify-between text-xs text-secondary font-code-telemetry">
            <span>Throughput: {device.throughput}</span>
            <span>Last polled: {device.lastSeen}</span>
          </div>
        </div>

        {/* Waveform & Diagnostics (5 cols) */}
        <div className="xl:col-span-5 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/50">
              <h3 className="font-headline-md text-sm font-bold text-on-surface">Throughput Waveform</h3>
              <span className="font-code-telemetry text-xs text-primary font-bold">Live Stream</span>
            </div>

            <div className="my-3">
              <svg className="w-full h-28" viewBox="0 0 300 80">
                <defs>
                  <linearGradient id="devWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b32100" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#b32100" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,25 Q50,20 100,28 T200,32 L220,70 L300,72 L300,80 L0,80 Z" fill="url(#devWaveGrad)" />
                <path d="M0,25 Q50,20 100,28 T200,32 L220,70 L300,72" fill="none" stroke="#b32100" strokeWidth="2.5" />
              </svg>
            </div>

            {device.status === 'critical' && (
              <div className="p-3 rounded-xl bg-error-container/25 border border-error/30 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-error">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span>Active Carrier Drop Fault</span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  Optical transceiver power drop (-21.4 dBm) on port eth0. Deterministic causal inference detected 94% anomaly score.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-surface-container-high/40 flex items-center justify-between gap-2">
            <button
              onClick={() => alert(`Node ${device.name} isolated. Traffic evacuated to alternate mesh paths.`)}
              className="flex-1 py-2 rounded-xl bg-error text-on-error font-headline-md text-xs font-bold shadow-sm hover:opacity-90 transition-all"
            >
              Isolate {device.id}
            </button>
            <button
              onClick={() => navigate('/topology')}
              className="flex-1 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-md text-xs font-semibold transition-all text-center"
            >
              Locate in Mesh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
