import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { getAlarms, acknowledgeIncident, mitigateIncident } from '../services/api';
import { Alarm } from '../types';

export const AlarmsPage: React.FC = () => {
  const { alarmId } = useParams<{ alarmId?: string }>();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ackState, setAckState] = useState<{ [id: string]: boolean }>({});
  const [mitigating, setMitigating] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchAlarmData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAlarms({
        severity: severityFilter,
        search: searchTerm,
      });
      setAlarms(data);

      if (alarmId) {
        const found = data.find(a => a.id.toLowerCase() === alarmId.toLowerCase());
        setSelectedAlarm(found || null);
      }
    } catch (err) {
      setError('Could not retrieve network alarms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarmData();
  }, [severityFilter]);

  const handleSelectAlarm = (alarm: Alarm) => {
    if (selectedAlarm?.id === alarm.id) {
      setSelectedAlarm(null);
      navigate('/alarms', { replace: true });
    } else {
      setSelectedAlarm(alarm);
      navigate(`/alarms/${alarm.id}`, { replace: true });
    }
  };

  const handleAcknowledge = async (id: string) => {
    await acknowledgeIncident(id);
    setAckState(prev => ({ ...prev, [id]: true }));
  };

  const handleMitigate = async () => {
    if (!selectedAlarm) return;
    setMitigating(true);
    await mitigateIncident(selectedAlarm.incidentId || 'INC-001');
    setTimeout(() => {
      setMitigating(false);
      alert(`Mitigation policy executed for ${selectedAlarm.deviceId}. Traffic shifted to R1/R2 backup trunks.`);
    }, 800);
  };

  const filteredAlarms = alarms.filter(a => {
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.deviceName.toLowerCase().includes(q) ||
        (a.interfaceName && a.interfaceName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col gap-3.5 min-w-0">
      {/* Header */}
      <Header
        breadcrumbCategory="Alarms"
        breadcrumbSub="Active Stream"
        title="Alarms & Incident Console"
        subtitle="Real-time correlated alarm pipeline & urgency triage"
        icon="notifications_active"
        onSearch={(q) => setSearchTerm(q)}
      />

      {/* KPI Metrics Cards Row (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 shrink-0">
        {/* Critical */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-high/60 border-l-4 border-l-error shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-extrabold text-secondary">
              Critical Alarms
            </span>
            <div className="w-6 h-6 rounded-lg bg-error-container text-error flex items-center justify-center font-code-telemetry text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">error</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <div className="text-2xl font-extrabold text-error font-code-telemetry tracking-tight">
              1 <span className="text-xs font-sans text-error font-semibold">P0</span>
            </div>
            <span className="font-code-telemetry text-[10px] font-bold px-2 py-0.5 rounded-full bg-error-container text-on-error-container">
              Immediate Intervene
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-secondary">
            <span className="font-bold text-error">R3::eth0</span>
            <span className="truncate">Optical attenuation loss</span>
          </div>
        </div>

        {/* Major */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-high/60 border-l-4 border-l-primary-container shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-extrabold text-secondary">
              Major Alarms
            </span>
            <div className="w-6 h-6 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[15px]">warning</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <div className="text-2xl font-extrabold text-on-surface font-code-telemetry tracking-tight">
              2 <span className="text-xs font-sans text-primary font-semibold">P1</span>
            </div>
            <span className="font-code-telemetry text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
              Buffer Queue Drop
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-secondary">
            <span className="font-bold text-primary">+1</span>
            <span className="truncate">R2 eth1 &amp; R4 eth0 degraded</span>
          </div>
        </div>

        {/* Minor / Info */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-high/60 border-l-4 border-l-secondary shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-extrabold text-secondary">
              Minor / Info
            </span>
            <div className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[15px]">info</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <div className="text-2xl font-extrabold text-on-surface font-code-telemetry tracking-tight">
              5 <span className="text-xs font-sans text-secondary font-semibold">P2-P3</span>
            </div>
            <span className="font-code-telemetry text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-secondary">
              Telemetry Monitored
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-secondary">
            <span className="truncate">BGP keepalive drift &amp; ACL policy</span>
          </div>
        </div>

        {/* Auto-Resolved */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-high/60 border-l-4 border-l-tertiary shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] uppercase tracking-wider font-extrabold text-secondary">
              Auto-Resolved (24h)
            </span>
            <div className="w-6 h-6 rounded-lg bg-tertiary-container/15 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1.5">
            <div className="text-2xl font-extrabold text-tertiary font-code-telemetry tracking-tight">
              18
            </div>
            <span className="font-code-telemetry text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary">
              100% Heuristic
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-secondary">
            <span className="text-tertiary font-bold">14.2 min</span>
            <span className="truncate">mean autonomous recovery time</span>
          </div>
        </div>
      </div>

      {/* Main Split View: Left Column (Alarms Stream Table) & Right Column (Alarm Details Inspector) */}
      <div className="flex-1 flex flex-col xl:flex-row gap-3.5 min-w-0">
        {/* Left Column: Filter Bar + Alarms Table */}
        <div className="flex-1 min-w-0 flex flex-col gap-3.5">
          {/* Active Alarms Stream Card + Table */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-high/60 shadow-card flex-1 flex flex-col gap-2.5 overflow-hidden">
            {/* Table Header Bar / Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[10px] uppercase tracking-wider font-extrabold text-secondary">
                  Pipeline Queue
                </span>
                <span className="font-headline-md text-xs font-bold text-on-surface">Active Correlated Stream</span>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSeverityFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-code-telemetry text-[10px] font-bold transition-all ${
                    severityFilter === 'all'
                      ? 'bg-on-surface text-surface-bright shadow-sm'
                      : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  All ({alarms.length})
                </button>
                <button
                  onClick={() => setSeverityFilter('P0')}
                  className={`px-2.5 py-1 rounded-lg font-code-telemetry text-[10px] font-bold border transition-all ${
                    severityFilter === 'P0'
                      ? 'bg-error-container text-on-error-container border-error/50 font-extrabold'
                      : 'bg-error-container/40 text-error border-error/20 hover:bg-error-container/60'
                  }`}
                >
                  Critical (1)
                </button>
                <button
                  onClick={() => setSeverityFilter('P1')}
                  className={`px-2.5 py-1 rounded-lg font-code-telemetry text-[10px] font-bold border transition-all ${
                    severityFilter === 'P1'
                      ? 'bg-primary-fixed text-on-primary-fixed border-primary/50'
                      : 'bg-primary-fixed/40 text-primary border-primary/20 hover:bg-primary-fixed/60'
                  }`}
                >
                  Major (2)
                </button>
                <button
                  onClick={() => alert('All active non-critical alerts acknowledged.')}
                  className="px-2.5 py-1 rounded-xl bg-primary text-on-primary text-[11px] font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1 ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">done_all</span>
                  <span>Ack All</span>
                </button>
              </div>
            </div>

            {/* Table Wrapper */}
            {loading ? (
              <LoadingState message="Loading alarm stream..." />
            ) : filteredAlarms.length === 0 ? (
              <EmptyState title="No active alarms matching filter" description="All alarms in this category are normal." />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-surface-container-high/40">
                <table className="w-full text-left font-body-sm text-xs">
                  <thead className="bg-surface-container-low font-code-telemetry text-[10px] text-secondary uppercase tracking-wider border-b border-surface-container-high/40">
                    <tr>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-2">Alarm ID</th>
                      <th className="py-2.5 px-2">Device</th>
                      <th className="py-2.5 px-2">Entity/Interface</th>
                      <th className="py-2.5 px-3">Summary</th>
                      <th className="py-2.5 px-2">Triggered</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/30">
                    {filteredAlarms.map((alarm) => {
                      const isSelected = selectedAlarm?.id === alarm.id;
                      const isAcked = ackState[alarm.id];
                      return (
                        <tr
                          key={alarm.id}
                          onClick={() => handleSelectAlarm(alarm)}
                          className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-primary/5 border-l-4 border-l-primary font-medium'
                              : alarm.severity === 'P0'
                              ? 'bg-error-container/15'
                              : ''
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-code-telemetry text-[10px] font-bold ${
                                alarm.severity === 'P0'
                                    ? 'bg-error-container text-on-error-container'
                                  : alarm.severity === 'P1'
                                  ? 'bg-primary-fixed text-on-primary-fixed'
                                  : 'bg-surface-container text-secondary'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  alarm.severity === 'P0' ? 'bg-error animate-pulse' : 'bg-primary'
                                }`}
                              ></span>
                              {alarm.severity} {alarm.severityLabel}
                            </span>
                          </td>

                          <td className="py-2.5 px-2 font-code-telemetry font-bold text-on-surface">
                            {alarm.id}
                          </td>

                          <td className="py-2.5 px-2 font-bold text-on-surface">
                            {alarm.deviceName}
                          </td>

                          <td className="py-2.5 px-2 font-code-telemetry text-secondary text-[11px]">
                            {alarm.interfaceName || 'System'}
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-bold text-on-surface truncate max-w-[200px]">
                              {alarm.title}
                            </div>
                            {alarm.incidentId && (
                              <div className="font-code-telemetry text-[9.5px] text-error font-semibold">
                                Correlated: {alarm.incidentId} (91% RCA)
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-2 font-code-telemetry text-secondary text-[11px]">
                            {alarm.timeAgo}
                          </td>

                          <td className="py-2.5 px-2">
                            <span
                              className={`font-code-telemetry text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isAcked
                                  ? 'bg-tertiary-container/20 text-tertiary'
                                  : alarm.severity === 'P0'
                                  ? 'bg-error-container text-on-error-container'
                                  : 'bg-surface-container text-secondary'
                              }`}
                            >
                              {isAcked ? 'ACKED' : alarm.status.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSelectAlarm(alarm)}
                              className={`px-2 py-0.5 rounded font-code-telemetry text-[10px] font-bold transition-all ${
                                isSelected
                                  ? 'bg-primary text-on-primary shadow-sm'
                                  : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                              }`}
                            >
                              {isSelected ? 'Inspecting' : 'Inspect'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 mt-auto border-t border-surface-container-high/40 font-code-telemetry text-[11px] text-secondary shrink-0">
              <span>Showing {filteredAlarms.length} of {alarms.length} active alarms (18 auto-resolved)</span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold">1</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-secondary">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alarm Details Inspector (340px width) */}
        {selectedAlarm && (
          <aside className="w-full xl:w-[340px] shrink-0 bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-high/60 shadow-card flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/40">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-code-telemetry text-base font-extrabold text-on-surface tracking-tight">
                      {selectedAlarm.id}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-code-telemetry text-[10px] font-extrabold uppercase">
                      {selectedAlarm.severity} {selectedAlarm.severityLabel}
                    </span>
                  </div>
                  <span className="text-xs text-secondary font-medium mt-0.5 truncate max-w-[200px]">
                    {selectedAlarm.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col items-end">
                    <span className="font-code-telemetry text-[10px] font-bold text-error bg-error-container/60 px-2 py-0.5 rounded">
                      {ackState[selectedAlarm.id] ? 'ACKED' : 'UNACKED'}
                    </span>
                    <span className="font-code-telemetry text-[9px] text-secondary mt-0.5">{selectedAlarm.timeAgo}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAlarm(null);
                      navigate('/alarms', { replace: true });
                    }}
                    className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors ml-1"
                    title="Close Inspector"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              {/* Impacted Node Box */}
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/40 grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-[9.5px] uppercase font-bold text-secondary">Impacted Device</span>
                  <span className="font-bold text-xs text-on-surface mt-0.5 truncate">{selectedAlarm.deviceName}</span>
                  <span className="font-code-telemetry text-[10px] text-secondary">{selectedAlarm.deviceId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9.5px] uppercase font-bold text-secondary">Interface Entity</span>
                  <span className="font-code-telemetry font-bold text-xs text-error mt-0.5">
                    {selectedAlarm.interfaceName || 'eth0'}
                  </span>
                  <span className="font-code-telemetry text-[10px] text-secondary">10G SFP+ Link</span>
                </div>
              </div>

              {/* Attenuation Waveform Sparkline */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-secondary">Metric Telemetry</span>
                  <span className="font-code-telemetry text-[10px] font-bold text-error">-21.4 dBm (Severe)</span>
                </div>
                <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/40 flex flex-col gap-2">
                  <div className="w-full h-8 relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 35">
                      <defs>
                        <linearGradient id="sparkGlow" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#b32100" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#b32100" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="0.8" x1="0" x2="300" y1="12" y2="12" />
                      <path d="M0,8 L40,9 L80,7 L130,11 L180,10 L220,29 L260,32 L300,34 L300,35 L0,35 Z" fill="url(#sparkGlow)" />
                      <path d="M0,8 L40,9 L80,7 L130,11 L180,10 L220,29 L260,32 L300,34" fill="none" stroke="#b32100" strokeWidth="2" />
                      <circle cx="300" cy="34" fill="#b32100" r="3.5" />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-container-high/40 font-code-telemetry text-[11px]">
                    <div>
                      <span className="text-[9px] text-secondary block uppercase">Optical Power</span>
                      <span className="font-bold text-error">-21.4 dBm</span>
                      <span className="text-[9px] text-secondary block font-sans">Baseline: -7.5 dBm</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-secondary block uppercase">VoQ Buffer Status</span>
                      <span className="font-bold text-error">99.8% (Overflow)</span>
                      <span className="text-[9px] text-secondary block font-sans">Loss: 12.4%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Correlation Engine Box */}
              <div className="bg-primary/5 p-2.5 rounded-xl border border-primary/20 flex flex-col gap-1">
                <div className="flex items-center justify-between text-primary">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    <span>AI Correlation Engine</span>
                  </div>
                  <span className="font-code-telemetry text-[10px] font-extrabold bg-primary text-on-primary px-2 py-0.2 rounded-full">
                    91% Confidence
                  </span>
                </div>
                <p className="text-xs text-on-surface leading-snug font-medium">
                  Correlated with Root Incident <strong className="text-primary font-code-telemetry">INC-001</strong>. Transceiver degradation triggered subsequent buffer saturation on downstream peers.
                </p>
              </div>

              {/* Root Cause Note */}
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high/40 flex flex-col gap-1">
                <span className="text-[9.5px] uppercase font-bold text-secondary">Root Cause Diagnostics</span>
                <p className="text-xs text-secondary leading-tight">
                  Optical fiber patch micro-bend or degraded SFP28 laser diode on {selectedAlarm.deviceId} port {selectedAlarm.interfaceName || 'eth0'}. Drain ingress traffic to protect core mesh.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-3 border-t border-surface-container-high/40 shrink-0">
              <button
                onClick={handleMitigate}
                disabled={mitigating}
                className="w-full py-2.5 px-3 rounded-xl bg-primary hover:opacity-90 text-on-primary text-xs font-bold shadow-primary-glow transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>{mitigating ? 'Applying Auto-Evacuation...' : `Auto-Mitigate (Evacuate ${selectedAlarm.deviceId})`}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAcknowledge(selectedAlarm.id)}
                  className="py-2 px-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-surface-container-high shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px] text-secondary">check</span>
                  <span>{ackState[selectedAlarm.id] ? 'Acknowledged' : 'Acknowledge'}</span>
                </button>
                <button
                  onClick={() => navigate('/ai-rca')}
                  className="py-2 px-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-surface-container-high shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  <span>Open RCA</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
