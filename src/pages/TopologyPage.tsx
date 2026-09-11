import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { getTopology } from '../services/api';
import { TopologyData, TopologyNode } from '../types';

export const TopologyPage: React.FC = () => {
  const [topology, setTopology] = useState<TopologyData | null>(null);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'core' | 'edge'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const navigate = useNavigate();

  const fetchTopologyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopology();
      setTopology(data);
    } catch (err) {
      setError('Could not render network mesh topology.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopologyData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <Header
          breadcrumbCategory="Topology"
          breadcrumbSub="Core Fabric"
          title="Network Topology"
          subtitle="Visualize network relationships, optical degradation & device health"
          icon="hub"
        />
        <LoadingState message="Rendering Network Fabric Mesh..." subMessage="Calculating active links and telemetry vectors" />
      </div>
    );
  }

  if (error || !topology) {
    return (
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <Header
          breadcrumbCategory="Topology"
          breadcrumbSub="Core Fabric"
          title="Network Topology"
          subtitle="Visualize network relationships, optical degradation & device health"
          icon="hub"
        />
        <ErrorState message={error || 'Failed to load topology'} onRetry={fetchTopologyData} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 min-w-0 max-w-full">
      {/* Header */}
      <Header
        breadcrumbCategory="Topology"
        breadcrumbSub="Core Fabric"
        title="Network Topology"
        subtitle="Visualize network relationships, optical degradation & device health"
        icon="hub"
      />

      {/* Top Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 shrink-0">
        <div className="bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-card flex items-center justify-between border-l-4 border-l-tertiary border border-surface-container-high/60">
          <div>
            <div className="font-label-caps text-secondary uppercase text-[10px] font-semibold">Fabric Health</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-title-kpi text-tertiary font-bold text-2xl">94%</span>
              <span className="font-code-telemetry text-[11px] text-tertiary font-semibold">+1.2% sync</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-tertiary-container/15 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-card flex items-center justify-between border border-surface-container-high/60">
          <div>
            <div className="font-label-caps text-secondary uppercase text-[10px] font-semibold">Total Monitored Nodes</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-title-kpi text-on-surface font-bold text-2xl">6 Nodes</span>
              <span className="font-body-sm text-[11px] text-secondary">(5 Active + 1 Server)</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">dns</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-card flex items-center justify-between border border-surface-container-high/60">
          <div>
            <div className="font-label-caps text-secondary uppercase text-[10px] font-semibold">Active Links</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-title-kpi text-on-surface font-bold text-2xl">8</span>
              <span className="font-body-sm text-[11px] text-tertiary font-medium">7 Operational</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">polyline</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-card flex items-center justify-between border-l-4 border-l-primary border border-surface-container-high/60">
          <div>
            <div className="font-label-caps text-primary uppercase text-[10px] font-bold">Degraded Links</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-title-kpi text-primary font-bold text-2xl">1</span>
              <span className="font-body-sm text-[11px] text-primary font-semibold">Incident #INC-001</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">error</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace: 68% Topology Canvas + 32% Details Inspector */}
      <div className="flex-1 flex flex-col xl:flex-row gap-3.5 min-h-[640px] max-w-full">
        {/* Left/Center Canvas (68%) */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-card p-4 flex flex-col relative overflow-hidden border border-surface-container-high/60 min-h-[580px]">
          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high/40">
                {(['all', 'core', 'edge'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-2.5 py-1 rounded-lg font-body-sm text-[11px] font-semibold transition-all ${
                      filterMode === mode
                        ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="h-4 w-px bg-surface-container-high"></div>
              <div className="flex items-center gap-1.5 text-[11px] font-code-telemetry text-secondary">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span>AS64512 • Mesh Path MP-8942</span>
              </div>
            </div>

            {/* Right Canvas Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-surface-container-low p-1 rounded-xl border border-surface-container-high/40">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-lowest transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.7))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-lowest transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-lowest transition-colors"
                  title="Reset Zoom"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setZoomLevel(1);
                  alert('Auto-layout physics simulated and aligned.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-body-sm text-[12px] font-semibold shadow-primary-glow hover:opacity-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Auto-Layout</span>
              </button>
            </div>
          </div>

          {/* Interactive Topology Drawing Board */}
          <div className="relative flex-1 w-full bg-surface-container-low/60 rounded-xl border border-surface-container-high/60 shadow-inner flex items-center justify-center overflow-hidden min-h-[500px]">
            {/* Background Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full text-surface-container-high">
              <defs>
                <pattern id="gridPattern" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeDasharray="2,3" strokeWidth="0.65" />
                </pattern>
                <filter id="glowPulse" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />
            </svg>

            {/* Connection Links Vector Plane (ViewBox 900 x 680) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
              viewBox="0 0 900 680"
              preserveAspectRatio="none"
            >
              {/* Healthy Link: R1 (450, 95) -> R2 (240, 260) */}
              <line x1="450" y1="95" x2="240" y2="260" stroke="#00855b" strokeWidth="3" strokeLinecap="round" />

              {/* Degraded Link with Packet Drop: R1 (450, 95) -> R3 (660, 260) */}
              <line x1="450" y1="95" x2="660" y2="260" stroke="#ba1a1a" strokeWidth="3.5" strokeDasharray="6,6" className="animate-pulse" filter="url(#glowPulse)" />

              {/* Warning Link: R2 (240, 260) -> R4 (660, 420) */}
              <line x1="240" y1="260" x2="660" y2="420" stroke="#916f68" strokeWidth="2.5" strokeDasharray="5,5" />

              {/* Degraded Link: R3 (660, 260) -> R4 (660, 420) */}
              <line x1="660" y1="260" x2="660" y2="420" stroke="#ba1a1a" strokeWidth="3" strokeDasharray="5,5" />

              {/* Healthy Link: R4 (660, 420) -> DC Server (660, 570) */}
              <line x1="660" y1="420" x2="660" y2="570" stroke="#00855b" strokeWidth="3" strokeLinecap="round" />

              {/* Secondary Core Mesh connection */}
              <line x1="240" y1="260" x2="660" y2="260" stroke="#00855b" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
            </svg>

            {/* Interactive Node Markers */}
            <div
              className="absolute inset-0 pointer-events-none transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {topology.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isCritical = node.status === 'critical';
                const isWarning = node.status === 'warning';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                    style={{ top: `${node.yPercent}%`, left: `${node.xPercent}%` }}
                    className={`absolute -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all hover:scale-105 pointer-events-auto z-20 ${
                      isSelected ? 'z-30' : ''
                    }`}
                  >
                    <div className="relative">
                      {isCritical && (
                        <div className="absolute -inset-3 rounded-3xl bg-primary/25 animate-ping pointer-events-none"></div>
                      )}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-surface-container-lowest flex items-center justify-center p-2.5 transition-all ${
                          isCritical
                            ? 'ring-4 ring-primary shadow-[0_12px_28px_-4px_rgba(179,33,0,0.45)]'
                            : isWarning
                            ? 'border-2 border-outline shadow-[0_8px_20px_-4px_rgba(145,111,104,0.25)]'
                            : 'border-2 border-tertiary shadow-[0_8px_20px_-4px_rgba(0,105,71,0.2)]'
                        } ${isSelected ? 'scale-110' : ''}`}
                      >
                        <span
                          className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ring-4 ring-surface-container-lowest flex items-center justify-center ${
                            isCritical ? 'bg-primary' : isWarning ? 'bg-outline' : 'bg-tertiary'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                        </span>
                        <span
                          className={`material-symbols-outlined text-[28px] ${
                            isCritical ? 'text-primary' : isWarning ? 'text-outline' : 'text-tertiary'
                          }`}
                        >
                          {node.icon}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 flex flex-col items-center text-center pointer-events-none">
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-headline-md text-[13px] font-bold ${
                            isCritical ? 'text-primary' : 'text-on-surface'
                          }`}
                        >
                          {node.name}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-label-caps text-[9px] font-bold uppercase">
                            Selected
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-code-telemetry text-[10px] ${
                          isCritical ? 'text-primary font-bold' : isWarning ? 'text-outline font-semibold' : 'text-tertiary font-semibold'
                        }`}
                      >
                        {node.ip} • {node.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Left Legend */}
            <div className="absolute bottom-3 left-3 z-20 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-surface-container-high/60 flex flex-col gap-1.5">
              <div className="font-label-caps text-[9px] text-secondary uppercase font-bold tracking-wider">
                Topology Legend
              </div>
              <div className="flex items-center gap-3 font-body-sm text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="text-on-surface font-medium">Green: Healthy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                  <span className="text-on-surface font-medium">Amber: Warning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-on-surface font-medium">Red: Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Details Inspector Panel (330px width) */}
        {selectedNode && (
          <aside className="w-full xl:w-[330px] shrink-0 bg-surface-container-lowest rounded-2xl shadow-card p-4 flex flex-col justify-between border border-surface-container-high/60 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex flex-col gap-3 overflow-y-auto">
              {/* Selected Node Header */}
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/40">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      selectedNode.status === 'critical'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{selectedNode.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-headline-md text-[15px] font-bold text-on-surface">
                        {selectedNode.name}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-caps text-[9px] font-bold uppercase tracking-wider ${
                          selectedNode.status === 'critical'
                            ? 'bg-error-container text-on-error-container'
                            : selectedNode.status === 'warning'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-tertiary-container/20 text-tertiary'
                        }`}
                      >
                        {selectedNode.status}
                      </span>
                    </div>
                    <span className="font-code-telemetry text-[11px] text-secondary">
                      JunOS v22.4R1 • AS 64512
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-code-telemetry text-[11px] font-bold text-on-surface block">
                      {selectedNode.ip}
                    </span>
                    <span className="font-label-caps text-[9px] text-secondary uppercase">
                      {selectedNode.type.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    title="Close Details"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              {/* Device Telemetry Stats 4-Grid */}
              <div className="flex flex-col gap-1.5">
                <span className="font-label-caps text-[10px] text-secondary uppercase font-bold tracking-wider">
                  Device Telemetry Stats
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* CPU */}
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-surface-container-high/30">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="font-body-sm text-[11px]">CPU Load</span>
                      <span
                        className={`font-code-telemetry font-bold text-[12px] ${
                          selectedNode.cpu > 80 ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {selectedNode.cpu}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden my-1">
                      <div
                        className={`h-full rounded-full ${
                          selectedNode.cpu > 80 ? 'bg-primary' : 'bg-tertiary'
                        }`}
                        style={{ width: `${selectedNode.cpu}%` }}
                      ></div>
                    </div>
                    <span className="font-code-telemetry text-[9px] text-primary">
                      {selectedNode.cpu > 80 ? 'Breached threshold' : 'Nominal load'}
                    </span>
                  </div>

                  {/* Memory */}
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-surface-container-high/30">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="font-body-sm text-[11px]">Memory</span>
                      <span className="font-code-telemetry text-on-surface font-bold text-[12px]">
                        {selectedNode.memory}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden my-1">
                      <div
                        className="bg-secondary h-full rounded-full"
                        style={{ width: `${selectedNode.memory}%` }}
                      ></div>
                    </div>
                    <span className="font-code-telemetry text-[9px] text-secondary">31.2 GB / 40.0 GB</span>
                  </div>

                  {/* Latency */}
                  <div
                    className={`p-2.5 rounded-xl flex flex-col border ${
                      selectedNode.latency > 100
                        ? 'bg-error-container/25 border-error/20'
                        : 'bg-surface-container-low border-surface-container-high/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[9px] text-secondary uppercase font-bold">Latency</span>
                      <span className="material-symbols-outlined text-primary text-[14px]">speed</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-title-kpi text-[20px] text-primary font-bold">
                        {selectedNode.latency}
                      </span>
                      <span className="font-code-telemetry text-[10px] text-primary font-semibold">ms</span>
                    </div>
                    <span className="font-code-telemetry text-[9px] text-primary mt-0.5">
                      {selectedNode.latency > 100 ? '+162ms spike' : 'Nominal baseline'}
                    </span>
                  </div>

                  {/* Loss */}
                  <div
                    className={`p-2.5 rounded-xl flex flex-col border ${
                      selectedNode.packetLoss > 5
                        ? 'bg-error-container/25 border-error/20'
                        : 'bg-surface-container-low border-surface-container-high/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[9px] text-secondary uppercase font-bold">
                        Packet Loss
                      </span>
                      <span className="material-symbols-outlined text-primary text-[14px]">trending_down</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-title-kpi text-[20px] text-primary font-bold">
                        {selectedNode.packetLoss}%
                      </span>
                      <span className="font-code-telemetry text-[10px] text-primary font-semibold">loss</span>
                    </div>
                    <span className="font-code-telemetry text-[9px] text-primary mt-0.5">
                      {selectedNode.packetLoss > 5 ? 'Buffer overflow' : 'SLA compliant'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Interface Alert */}
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  selectedNode.interfaceStatus === 'down'
                    ? 'bg-error-container/20 border-error/20'
                    : 'bg-surface-container-low border-surface-container-high/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      selectedNode.interfaceStatus === 'down' ? 'text-primary' : 'text-tertiary'
                    }`}
                  >
                    {selectedNode.interfaceStatus === 'down' ? 'link_off' : 'link'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-[11px] font-bold text-on-surface">
                      Active Interface: {selectedNode.activeInterface}
                    </span>
                    <span className="font-code-telemetry text-[9px] text-secondary truncate max-w-[200px]">
                      {selectedNode.faultAlert || 'Operating at full 10Gbps line rate'}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-code-telemetry text-[9px] font-bold uppercase ${
                    selectedNode.interfaceStatus === 'down'
                      ? 'bg-primary text-on-primary'
                      : 'bg-tertiary-container/20 text-tertiary'
                  }`}
                >
                  {selectedNode.interfaceStatus}
                </span>
              </div>

              {/* Throughput Mini-Chart */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] text-secondary uppercase font-bold tracking-wider">
                    Carrier Drop / Throughput Chart
                  </span>
                  <span className="font-code-telemetry text-[10px] text-primary font-bold">
                    {selectedNode.status === 'critical' ? 'Drop: -82%' : 'Active 8.4 Gbps'}
                  </span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-2 flex flex-col border border-surface-container-high/30">
                  <svg className="w-full h-14 overflow-visible" viewBox="0 0 320 60">
                    <defs>
                      <linearGradient id="topoChartGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#b32100" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,18 Q40,15 90,20 T170,18 Q190,22 205,48 T250,52 T320,50 L320,60 L0,60 Z"
                      fill="url(#topoChartGrad)"
                    />
                    <path
                      d="M0,18 Q40,15 90,20 T170,18 Q190,22 205,48 T250,52 T320,50"
                      fill="none"
                      stroke="#b32100"
                      strokeLinecap="round"
                      strokeWidth="2.2"
                    />
                    {selectedNode.status === 'critical' && (
                      <>
                        <circle cx="205" cy="48" fill="#b32100" r="3.5" />
                        <line stroke="#ba1a1a" strokeDasharray="2,2" strokeWidth="1" x1="205" x2="205" y1="5" y2="55" />
                        <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700" x="212" y="14">
                          Carrier Drop Point
                        </text>
                      </>
                    )}
                  </svg>
                  <div className="flex items-center justify-between font-code-telemetry text-[9px] text-secondary mt-0.5">
                    <span>-30m (10.0 Gbps)</span>
                    <span>-12m (Drop)</span>
                    <span>Now: 1.8 Gbps</span>
                  </div>
                </div>
              </div>

              {/* Blast Radius Links */}
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] text-secondary uppercase font-bold tracking-wider">
                    Affected Links &amp; Blast Radius
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-outline-variant/30 text-outline font-code-telemetry text-[9px] font-bold">
                    2 Impacted
                  </span>
                </div>
                <div className="flex items-center gap-2 font-body-sm text-[11px]">
                  <div
                    onClick={() => {
                      const r4 = topology.nodes.find(n => n.id === 'R4');
                      if (r4) setSelectedNode(r4);
                    }}
                    className="flex-1 flex items-center gap-1.5 p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container-high/40 cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline text-[16px]">lan</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-on-surface text-[10px] truncate">Node R4</span>
                      <span className="font-code-telemetry text-[9px] text-outline">Warning Link</span>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      const srv = topology.nodes.find(n => n.id === 'SRV-01');
                      if (srv) setSelectedNode(srv);
                    }}
                    className="flex-1 flex items-center gap-1.5 p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container-high/40 cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline text-[16px]">storage</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-on-surface text-[10px] truncate">DC Server</span>
                      <span className="font-code-telemetry text-[9px] text-outline">Cluster Latency</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container-high/40 shrink-0">
              <button
                onClick={() => {
                  if (selectedNode.status === 'critical') {
                    navigate('/ai-rca');
                  } else {
                    alert(`Isolating node ${selectedNode.name}.`);
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-primary text-on-primary font-body-md text-[12px] font-bold shadow-primary-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {selectedNode.status === 'critical' ? 'psychology' : 'block'}
                </span>
                <span>
                  {selectedNode.status === 'critical'
                    ? `Analyze RCA for ${selectedNode.id}`
                    : `Isolate Node ${selectedNode.id}`}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => alert(`Rerouting traffic around ${selectedNode.id} via R2 mesh bridge.`)}
                  className="py-1.5 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-[11px] font-semibold border border-surface-container-high/40 transition-all flex items-center justify-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">alt_route</span>
                  <span>Reroute via R2</span>
                </button>
                <button
                  onClick={() => navigate(`/devices/${selectedNode.id}`)}
                  className="py-1.5 px-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-[11px] font-semibold border border-surface-container-high/40 transition-all flex items-center justify-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px] text-secondary">troubleshoot</span>
                  <span>Details</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
