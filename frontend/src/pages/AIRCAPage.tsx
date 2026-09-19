import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { getIncidentById, getIncidents, mitigateIncident, acknowledgeIncident } from '../services/api';
import { AnomalyResult } from '../types';

export const AIRCAPage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId?: string }>();
  const [incident, setIncident] = useState<AnomalyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [mitigationState, setMitigationState] = useState<'idle' | 'in_progress' | 'applied'>('idle');
  const [mitigationText, setMitigationText] = useState<string>('Apply AI Mitigation (Auto-Evacuate R3)');
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchIncident = async () => {
    try {
      setLoading(true);
      setError(null);
      const targetId = incidentId || 'INC-001';
      let data = await getIncidentById(targetId);
      if (!data) {
        const all = await getIncidents();
        data = all[0];
      }
      if (data) {
        setIncident(data);
        if (data.mitigationStatus === 'applied') {
          setMitigationState('applied');
          setMitigationText('Mitigation Applied: R3 Evacuated');
        }
      } else {
        setError('No active AI/RCA incident records found.');
      }
    } catch (err) {
      setError('Could not connect to the Cognitive AI Diagnostics Engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [incidentId]);

  const handleMitigateClick = async () => {
    if (!incident || mitigationState !== 'idle') return;
    setMitigationState('in_progress');
    setMitigationText('Evacuating R3 → Shifting to R1/R2...');

    const res = await mitigateIncident(incident.incidentId);
    setTimeout(() => {
      setMitigationState('applied');
      setMitigationText('Mitigation Applied: R3 Evacuated');
    }, 1200);
  };

  const handleAckClick = async () => {
    if (!incident) return;
    await acknowledgeIncident(incident.incidentId);
    setIsAcknowledged(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <Header
          breadcrumbCategory="AI"
          breadcrumbSub="Incident Diagnosis"
          title="AI / Root Cause Analysis"
          subtitle="Intelligent detection, correlation and diagnosis of network incidents"
          icon="psychology"
        />
        <LoadingState
          message="Running Cognitive AI Inference..."
          subMessage="Evaluating 5-stage causal flow and telemetry anomaly score"
        />
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <Header
          breadcrumbCategory="AI"
          breadcrumbSub="Incident Diagnosis"
          title="AI / Root Cause Analysis"
          subtitle="Intelligent detection, correlation and diagnosis of network incidents"
          icon="psychology"
        />
        <ErrorState message={error || 'Incident not found'} onRetry={fetchIncident} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 min-w-0 max-w-full">
      {/* Header */}
      <Header
        breadcrumbCategory="AI"
        breadcrumbSub="Incident Diagnosis"
        title="AI / Root Cause Analysis"
        subtitle="Intelligent detection, correlation and diagnosis of network incidents"
        icon="psychology"
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-full">
        {/* AI Anomalies */}
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-card border border-surface-container-high/60 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-semibold truncate">
              AI Anomalies
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-kpi text-[24px] font-bold text-on-surface leading-none">3</span>
              <span className="text-tertiary font-code-telemetry text-[11px] flex items-center font-bold">
                <span className="material-symbols-outlined text-[13px]">trending_flat</span> Steady
              </span>
            </div>
            <span className="font-body-sm text-[11px] text-secondary mt-0.5 truncate">
              3 clusters currently mapped
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
        </div>

        {/* Critical Incidents */}
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-card border border-surface-container-high/60 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-semibold truncate">
              Critical Incidents
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-kpi text-[24px] font-bold text-error leading-none">1</span>
              <span className="font-code-telemetry text-[11px] text-error font-bold px-1.5 py-0.2 bg-error-container/60 rounded">
                P0 Active
              </span>
            </div>
            <span className="font-body-sm text-[11px] text-secondary mt-0.5 truncate">
              INC-001 High SLA impact
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-error-container/40 flex items-center justify-center text-error shrink-0">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
        </div>

        {/* Average Confidence */}
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-card border border-surface-container-high/60 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-semibold truncate">
              Average Confidence
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-kpi text-[24px] font-bold text-on-surface leading-none">{incident.confidence}%</span>
              <span className="text-tertiary font-code-telemetry text-[11px] flex items-center font-bold">
                <span className="material-symbols-outlined text-[13px]">arrow_upward</span> +4.2%
              </span>
            </div>
            <span className="font-body-sm text-[11px] text-secondary mt-0.5 truncate">
              High diagnostic accuracy
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-tertiary-container/15 flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>

        {/* Resolved Today */}
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-card border border-surface-container-high/60 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-semibold truncate">
              Resolved Today
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-kpi text-[24px] font-bold text-on-surface leading-none">7</span>
              <span className="font-code-telemetry text-[11px] text-tertiary font-bold">100% Auto</span>
            </div>
            <span className="font-body-sm text-[11px] text-secondary mt-0.5 truncate">
              Autonomous self-healed
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
        </div>
      </div>

      {/* Main 12-Col RCA Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 flex-1 min-w-0 max-w-full">
        {/* Left Column (7 cols): Findings, Causal Pipeline & Live Evidence */}
        <div className="xl:col-span-7 flex flex-col gap-3 min-w-0 max-w-full">
          {/* Incident Header Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border border-surface-container-high/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-caps text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                    Critical
                  </span>
                  <span className="font-code-telemetry text-[12px] font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded">
                    Incident {incident.incidentId}
                  </span>
                  <span className="font-body-sm text-[11px] text-secondary">
                    Triggered {incident.triggeredAgo}
                  </span>
                </div>
                <h2 className="font-headline-lg text-[18px] font-bold text-on-surface tracking-tight mt-1 truncate">
                  {incident.title}
                </h2>
                <span className="font-body-sm text-[12px] text-secondary truncate">
                  Core transit link degraded on backbone trunk ring #3
                </span>
              </div>
            </div>

            {/* Circular Anomaly Surge Score */}
            <div className="flex items-center gap-3 bg-surface-container-low px-3.5 py-1.5 rounded-xl border border-surface-container-high/50 shrink-0">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" fill="transparent" r="19" stroke="#e0e3e6" strokeWidth="4.5" />
                  <circle
                    cx="24"
                    cy="24"
                    fill="transparent"
                    r="19"
                    stroke="#FF4B26"
                    strokeDasharray="119.38"
                    strokeDashoffset="7.16"
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-headline-md text-[13px] font-bold text-primary leading-none">
                    {incident.anomalyScore}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-secondary font-bold">
                  Anomaly Score
                </span>
                <span className="font-body-md text-[12px] font-bold text-error">Extreme Surge</span>
                <span className="font-code-telemetry text-[10px] text-secondary">{incident.engineVersion}</span>
              </div>
            </div>
          </div>

          {/* Probable Root Cause Diagnosis Box */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border-2 border-primary/25 bg-gradient-to-r from-primary/[0.03] to-transparent min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-caps text-[10px] uppercase tracking-wider text-primary font-bold">
                      Probable Root Cause
                    </span>
                    <span className="text-secondary">•</span>
                    <span className="font-code-telemetry text-[11px] text-secondary">
                      Deterministic Causal Inferred
                    </span>
                  </div>
                  <h3 className="font-headline-md text-[16px] font-bold text-on-surface mt-0.5 truncate">
                    {incident.probableRootCause}
                  </h3>
                  <p className="font-body-md text-[12px] text-secondary mt-1 leading-relaxed">
                    {incident.rootCauseDetails}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="px-2.5 py-1 rounded-xl bg-tertiary-container/15 border border-tertiary/20 text-tertiary font-headline-md text-[12px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>{incident.confidence}% AI Confidence</span>
                </div>
                <span className="font-code-telemetry text-[10px] text-secondary mt-1">
                  {incident.similarityMatch}
                </span>
              </div>
            </div>
          </div>

          {/* 5-Stage Causal Telemetry-to-Impact Pipeline */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border border-surface-container-high/60 min-w-0">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-bold">
                Causal Telemetry-to-Impact Pipeline
              </span>
              <span className="font-code-telemetry text-[10px] text-primary font-semibold">
                5-Stage Continuous Flow
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative min-w-0">
              {incident.pipelineStages.map((stage, idx) => {
                const isRoot = stage.status === 'critical' && idx === 3;
                return (
                  <div
                    key={stage.step}
                    className={`rounded-xl p-2.5 flex flex-col justify-between min-w-0 border ${
                      isRoot
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-surface-container-low border-surface-container-high/40'
                    } ${idx === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-label-caps text-[9px] uppercase font-bold truncate ${
                          isRoot ? 'text-primary' : 'text-secondary'
                        }`}
                      >
                        {stage.step}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[15px] ${
                          isRoot ? 'text-primary' : 'text-secondary'
                        }`}
                      >
                        {stage.icon}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div
                        className={`font-body-sm text-[11px] font-bold truncate ${
                          isRoot ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {stage.name}
                      </div>
                      <div
                        className={`font-code-telemetry text-[10px] truncate ${
                          isRoot
                            ? 'text-on-surface font-bold'
                            : stage.status === 'critical'
                            ? 'text-error font-medium'
                            : stage.status === 'warning'
                            ? 'text-primary font-bold'
                            : 'text-secondary font-medium'
                        }`}
                      >
                        {stage.metric}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Evidence Grid */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border border-surface-container-high/60 min-w-0">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-bold">
                AI Evidence Grid
              </span>
              <span className="font-code-telemetry text-[10px] text-tertiary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Live Diagnostic Stream
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 min-w-0">
              {/* CPU */}
              <div className="bg-surface-container-low rounded-xl p-2.5 border border-surface-container-high/40 min-w-0">
                <div className="flex items-center justify-between text-secondary mb-1">
                  <span className="font-body-sm text-[11px] truncate">CPU Utilization</span>
                  <span className="font-code-telemetry text-[11px] text-error font-bold">
                    {incident.evidence.cpu}%
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${incident.evidence.cpu}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-code-telemetry text-secondary mt-1.5">
                  <span>Base: {incident.evidence.cpuBaseline || 38}%</span>
                  <span className="text-error font-bold">+54% Over</span>
                </div>
              </div>

              {/* Packet Loss */}
              <div className="bg-surface-container-low rounded-xl p-2.5 border border-surface-container-high/40 min-w-0">
                <div className="flex items-center justify-between text-secondary mb-1">
                  <span className="font-body-sm text-[11px] truncate">Packet Loss</span>
                  <span className="font-code-telemetry text-[11px] text-error font-bold">
                    {incident.evidence.packetLoss}%
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-code-telemetry text-secondary mt-1.5">
                  <span>SLA: {incident.evidence.packetLossSla || 0.05}%</span>
                  <span className="text-error font-bold">Critical</span>
                </div>
              </div>

              {/* Latency */}
              <div className="bg-surface-container-low rounded-xl p-2.5 border border-surface-container-high/40 min-w-0">
                <div className="flex items-center justify-between text-secondary mb-1">
                  <span className="font-body-sm text-[11px] truncate">Transit Latency</span>
                  <span className="font-code-telemetry text-[11px] text-error font-bold">
                    {incident.evidence.latency} ms
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-code-telemetry text-secondary mt-1.5">
                  <span>Norm: {incident.evidence.latencyNormal || 18}ms</span>
                  <span className="text-error font-bold">10x Drift</span>
                </div>
              </div>

              {/* Interface Errors */}
              <div className="bg-surface-container-low rounded-xl p-2.5 border border-surface-container-high/40 min-w-0">
                <div className="flex items-center justify-between text-secondary mb-1">
                  <span className="font-body-sm text-[11px] truncate">Interface Errors</span>
                  <span className="font-code-telemetry text-[11px] text-primary font-bold">
                    {incident.evidence.interfaceErrors} CRC/s
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-outline h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-code-telemetry text-secondary mt-1.5">
                  <span>Norm: 0/s</span>
                  <span className="text-on-surface font-semibold truncate">Framing Drop</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-surface-container-low rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 border border-surface-container-high/60 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleMitigateClick}
                disabled={mitigationState === 'in_progress'}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-on-primary font-headline-md text-[13px] font-semibold transition-all shadow-primary-glow ${
                  mitigationState === 'applied'
                    ? 'bg-tertiary shadow-none'
                    : mitigationState === 'in_progress'
                    ? 'bg-primary opacity-75 cursor-wait'
                    : 'bg-primary hover:opacity-90 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {mitigationState === 'applied' ? 'check_circle' : 'bolt'}
                </span>
                <span>{mitigationText}</span>
              </button>

              <button
                onClick={handleAckClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface font-headline-md text-[12px] font-semibold hover:bg-surface-container transition-all"
              >
                <span className={`material-symbols-outlined text-[16px] ${isAcknowledged ? 'text-tertiary' : 'text-secondary'}`}>
                  {isAcknowledged ? 'check_circle' : 'check'}
                </span>
                <span className={isAcknowledged ? 'text-tertiary font-bold' : ''}>
                  {isAcknowledged ? 'Acknowledged' : 'Acknowledge Incident'}
                </span>
              </button>

              <button
                onClick={() => alert(`Exporting AI RCA Report for ${incident.incidentId}...`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-surface-container-high text-secondary hover:text-on-surface font-headline-md text-[12px] font-semibold hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export RCA Report</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-secondary font-code-telemetry text-[11px] shrink-0">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span>SecOps Level-2 Signoff Ready</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Timeline, Correlated Alarms & Blast Radius */}
        <div className="xl:col-span-5 flex flex-col gap-3 min-w-0 max-w-full">
          {/* Incident Timeline */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border border-surface-container-high/60 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                <h3 className="font-headline-md text-[14px] font-bold text-on-surface">Incident Timeline</h3>
              </div>
              <span className="font-code-telemetry text-[10px] text-secondary">10:24 UTC → PRESENT</span>
            </div>

            <div className="relative pl-5 flex flex-col gap-2 min-w-0">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-0.5 bg-surface-container-high"></div>

              {incident.timeline.map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-start justify-between text-[11px] min-w-0 gap-2 ${
                    item.severity === 'ai' ? 'bg-primary/5 p-1.5 rounded-lg -ml-1' : ''
                  }`}
                >
                  <span
                    className={`absolute -left-5 top-1 w-2 h-2 rounded-full ${
                      item.severity === 'critical'
                        ? 'bg-error'
                        : item.severity === 'ai'
                        ? 'bg-primary ring-2 ring-primary/20 -left-4 top-2'
                        : item.severity === 'warning'
                        ? 'bg-outline'
                        : 'bg-secondary'
                    }`}
                  ></span>
                  <div className="min-w-0 truncate">
                    <span
                      className={`font-code-telemetry font-bold mr-2 ${
                        item.severity === 'ai' ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      {item.time}
                    </span>
                    <span
                      className={`truncate ${
                        item.severity === 'ai'
                          ? 'text-primary font-bold'
                          : item.severity === 'critical'
                          ? 'text-on-surface font-bold'
                          : 'text-on-surface font-medium'
                      }`}
                    >
                      {item.event}
                    </span>
                  </div>
                  {item.value && (
                    <span
                      className={`font-code-telemetry font-bold shrink-0 ${
                        item.severity === 'ai'
                          ? 'text-tertiary bg-tertiary-container/15 px-1.5 py-0.2 rounded'
                          : item.severity === 'critical' || item.severity === 'warning'
                          ? 'text-error'
                          : 'text-secondary'
                      }`}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correlated Alarms */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border border-surface-container-high/60 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">notifications_paused</span>
                <h3 className="font-headline-md text-[14px] font-bold text-on-surface">Correlated Alarms</h3>
              </div>
              <span className="font-code-telemetry text-[10px] text-tertiary font-bold bg-tertiary-container/10 px-2 py-0.5 rounded-full">
                {incident.relatedAlarms.length} Alarms Grouped
              </span>
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              {incident.relatedAlarms.map((alarm, idx) => (
                <div
                  key={alarm.id}
                  onClick={() => navigate(`/alarms/${alarm.id}`)}
                  className="bg-surface-container-low rounded-xl px-3 py-2 flex items-center justify-between border border-surface-container-high/40 min-w-0 gap-2 cursor-pointer hover:bg-surface-container transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-code-telemetry text-[10px] font-bold shrink-0 ${
                        alarm.severity === 'P0'
                          ? 'bg-error-container text-on-error-container'
                          : alarm.severity === 'P1'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container-highest text-on-surface'
                      }`}
                    >
                      {alarm.severity}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-code-telemetry text-[11px] font-bold text-on-surface shrink-0">
                          {alarm.id}
                        </span>
                        <span className="text-secondary font-body-sm text-[11px] truncate">
                          {alarm.title}
                        </span>
                      </div>
                      <span className="font-code-telemetry text-[10px] text-secondary truncate">
                        {alarm.description}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-code-telemetry text-[10px] font-bold shrink-0 ${
                      idx === 0
                        ? 'bg-error/10 text-error'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {idx === 0 ? 'Root Alarm' : 'Correlated'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Blast Radius / Affected Devices */}
          <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-card border border-surface-container-high/60 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">hub</span>
                <h3 className="font-headline-md text-[14px] font-bold text-on-surface">Affected Devices</h3>
              </div>
              <span className="font-code-telemetry text-[10px] text-secondary">
                Blast Radius: {incident.affectedDevices.length} Nodes
              </span>
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              {incident.affectedDevices.map((dev) => (
                <div
                  key={dev.deviceId}
                  onClick={() => navigate(`/devices/${dev.deviceId}`)}
                  className="bg-surface-container-low rounded-xl px-3 py-2 flex items-center justify-between border border-surface-container-high/40 min-w-0 gap-2 cursor-pointer hover:bg-surface-container transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-code-telemetry text-[11px] font-bold shrink-0 ${
                        dev.severity === 'critical'
                          ? 'bg-error text-on-error'
                          : 'bg-surface-container-highest text-on-surface'
                      }`}
                    >
                      {dev.deviceId === 'SRV-01' ? (
                        <span className="material-symbols-outlined text-[16px]">dns</span>
                      ) : (
                        dev.deviceId
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-md text-[12px] font-bold text-on-surface truncate">
                        {dev.name}
                      </span>
                      <span className="font-code-telemetry text-[10px] text-secondary truncate">
                        {dev.ipAddress} • {dev.role}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-label-caps text-[9px] uppercase font-bold shrink-0 ${
                      dev.impactType === 'Direct Failure'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {dev.impactType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
